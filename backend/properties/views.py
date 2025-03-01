import logging
import concurrent.futures
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from properties.utils.data_procesor import DataProcessor
from properties.services.cache_service import CacheService
from properties.config.providers import PROVIDER_CONFIGS
from properties.serializers.properties_serializer import PropertyDetailsSerializer

logger = logging.getLogger(__name__)


class PropertyDetailsView(APIView):
    """
    API view for retrieving property details from multiple providers.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache_service = CacheService()
        self.data_processor = DataProcessor()

    def get(self, request):
        """
        GET method to retrieve property details.

        Args:
            request: HTTP request object

        Returns:
            Response: REST framework response with property data
        """
        # Validate address parameter
        address = request.query_params.get("address")
        if not address or len(address.strip()) == 0:
            return Response(
                {"error": "Missing or empty address parameter"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"Processing request for address: {address}")

        # Check cache first (-> Reminder: Only 24h cache)
        cached_results = self.cache_service.get(address)
        if cached_results:
            logger.info(f"Returning cached results for address: {address}")
            logger.debug(f"Cached data content: {json.dumps(cached_results, indent=2)}")

            # Mark data as coming from the cache
            for result in cached_results:
                if isinstance(result, dict):
                    result["cached"] = True
                    # Log provider name for each cached result
                    provider = result.get("provider", "unknown")
                    logger.info(f"Cached result from provider: {provider}")

            # Serialize cache data
            serializer = PropertyDetailsSerializer(cached_results, many=True)
            return Response(serializer.data)

        # Fetch data from providers
        logger.info(f"No cache found for {address}. Fetching from providers...")
        results = self._fetch_provider_data(address)

        # Log raw results from each provider
        for provider_name, result in results.items():
            logger.debug(
                f"Raw result from {provider_name}: {json.dumps(result, indent=2)}"
            )

        # Process results
        standardized_data = []
        for provider_name, result in results.items():
            logger.info(f"Processing data from provider: {provider_name}")

            # Skip processing if there was an error
            if "error" in result:
                logger.warning(
                    f"Error from provider {provider_name}: {result['error']}"
                )
                standardized_data.append(
                    {
                        "provider": provider_name,
                        "error": result["error"],
                        "cached": False,
                    }
                )
                continue

            if provider_name in PROVIDER_CONFIGS:
                mapping = PROVIDER_CONFIGS[provider_name]["mapping"]
                logger.debug(f"Using mapping for {provider_name}: {mapping}")

                standardized = DataProcessor.standardize_data(
                    result, mapping, provider_name
                )
                logger.debug(
                    f"Standardized data for {provider_name}: {json.dumps(standardized, indent=2)}"
                )

                # Mark as not coming from the cache
                standardized["cached"] = False

                # Validate data using the serializer
                serializer = PropertyDetailsSerializer(data=standardized)
                if serializer.is_valid():
                    # Use validated data
                    validated_data = serializer.validated_data
                    logger.info(f"Data from {provider_name} successfully validated")
                    standardized_data.append(validated_data)

                    # Cache individual provider results
                    self.cache_service.set(address, validated_data, provider_name)
                else:
                    logger.warning(
                        f"Validation failed for data from {provider_name}: {serializer.errors}"
                    )
                    # Include data with errors to avoid losing information
                    standardized["validation_errors"] = serializer.errors
                    standardized_data.append(standardized)

        # Log final standardized data
        logger.info(f"Total providers processed: {len(standardized_data)}")
        for item in standardized_data:
            provider = item.get("provider", "unknown")
            logger.info(
                f"Final data from provider {provider}: {json.dumps(item, indent=2)}"
            )

        # Cache combined results
        self.cache_service.set(address, standardized_data)

        # Serialize the final response
        response_serializer = PropertyDetailsSerializer(standardized_data, many=True)
        return Response(response_serializer.data)

    def _fetch_provider_data(self, address):
        """
        Fetch property data from all providers concurrently.

        Args:
            address (str): Property address

        Returns:
            dict: Results from all providers
        """
        results = {}
        logger.info(
            f"Starting data fetch from {len(PROVIDER_CONFIGS)} providers for address: {address}"
        )

        with concurrent.futures.ThreadPoolExecutor(
            max_workers=len(PROVIDER_CONFIGS)
        ) as executor:
            futures = {}

            # Submit requests to all providers
            for provider_name, config in PROVIDER_CONFIGS.items():
                logger.info(f"Processing provider: {provider_name}")

                # Check provider-specific cache
                cached_data = self.cache_service.get(address, provider_name)
                if cached_data:
                    logger.info(f"Using cached data for provider: {provider_name}")
                    cached_data["cached"] = True  # Mark as coming from the cache
                    results[provider_name] = cached_data
                    continue

                # Load service class dynamically
                try:
                    logger.debug(
                        f"Initializing service class for {provider_name}: {config['service_class']}"
                    )
                    service_class = DataProcessor.load_service_class(
                        config["service_class"]
                    )
                    service = service_class()

                    # Submit to thread pool
                    logger.info(f"Submitting request to {provider_name}")
                    futures[provider_name] = executor.submit(
                        service.get_property_details, address
                    )
                except Exception as e:
                    logger.error(
                        f"Error initializing service for {provider_name}: {str(e)}"
                    )
                    results[provider_name] = {
                        "error": f"Service initialization error: {str(e)}"
                    }

            # Collect results with timeout
            for provider_name, future in futures.items():
                timeout = PROVIDER_CONFIGS[provider_name].get("timeout", 30)
                logger.info(
                    f"Waiting for response from {provider_name} (timeout: {timeout}s)"
                )

                try:
                    provider_result = future.result(timeout=timeout)
                    logger.info(f"Received response from {provider_name}")
                    logger.debug(
                        f"Raw response from {provider_name}: {json.dumps(provider_result, indent=2)}"
                    )
                    results[provider_name] = provider_result
                except concurrent.futures.TimeoutError:
                    logger.warning(f"Timeout while fetching data from {provider_name}")
                    results[provider_name] = {
                        "error": f"Timeout fetching data from {provider_name}"
                    }
                except Exception as e:
                    logger.error(f"Error fetching data from {provider_name}: {str(e)}")
                    results[provider_name] = {
                        "error": f"Error fetching data from {provider_name}: {str(e)}"
                    }

        logger.info(f"Completed data fetch from all providers for address: {address}")
        return results
