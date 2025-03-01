import logging
import concurrent.futures
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from properties.utils.data_procesor import DataProcessor
from properties.services.cache_service import CacheService
from properties.config.providers import PROVIDER_CONFIGS
from properties.serializers.properties_serializer import PropertyDetailsSerializer;

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
        address = request.query_params.get('address')
        if not address or len(address.strip()) == 0:
            return Response(
                {'error': 'Missing or empty address parameter'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check cache first (-> Reminder: Only 24h cache)
        cached_results = self.cache_service.get(address)
        if cached_results:
            logger.info(f"Returning cached results for address: {address}")
            
            # Mark data as coming from the cache
            for result in cached_results:
                if isinstance(result, dict):
                    result['cached'] = True
            
            # Serialize cache data
            serializer = PropertyDetailsSerializer(cached_results, many=True)
            return Response(serializer.data)
        
        # Fetch data from providers
        results = self._fetch_provider_data(address)
        
        # Process results
        standardized_data = []
        for provider_name, result in results.items():
            if provider_name in PROVIDER_CONFIGS:
                mapping = PROVIDER_CONFIGS[provider_name]['mapping']
                standardized = DataProcessor.standardize_data(result, mapping, provider_name)
                
                # Mark as not coming from the cache
                standardized['cached'] = False
                
                # Validate data using the serializer
                serializer = PropertyDetailsSerializer(data=standardized)
                if serializer.is_valid():
                    # Use validated data
                    validated_data = serializer.validated_data
                    standardized_data.append(validated_data)
                    
                    # Cache individual provider results
                    self.cache_service.set(address, validated_data, provider_name)
                else:
                    logger.warning(f"Validation failed for data from {provider_name}: {serializer.errors}")
                    # Include data with errors to avoid losing information
                    standardized['validation_errors'] = serializer.errors
                    standardized_data.append(standardized)
        
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
        with concurrent.futures.ThreadPoolExecutor(max_workers=len(PROVIDER_CONFIGS)) as executor:
            futures = {}
            
            # Submit requests to all providers
            for provider_name, config in PROVIDER_CONFIGS.items():
                # Check provider-specific cache
                cached_data = self.cache_service.get(address, provider_name)
                if cached_data:
                    cached_data['cached'] = True  # Mark as coming from the cache
                    results[provider_name] = cached_data
                    continue
                
                # Load service class dynamically
                try:
                    service_class = DataProcessor.load_service_class(config['service_class'])
                    service = service_class()
                    
                    # Submit to thread pool
                    futures[provider_name] = executor.submit(
                        service.get_property_details,
                        address
                    )
                except Exception as e:
                    logger.error(f"Error initializing service for {provider_name}: {str(e)}")
                    results[provider_name] = {'error': f"Service initialization error: {str(e)}"}
            
            # Collect results with timeout
            for provider_name, future in futures.items():
                timeout = PROVIDER_CONFIGS[provider_name].get('timeout', 30)
                try:
                    results[provider_name] = future.result(timeout=timeout)
                except concurrent.futures.TimeoutError:
                    logger.warning(f"Timeout while fetching data from {provider_name}")
                    results[provider_name] = {'error': f'Timeout fetching data from {provider_name}'}
                except Exception as e:
                    logger.error(f"Error fetching data from {provider_name}: {str(e)}")
                    results[provider_name] = {'error': f'Error fetching data from {provider_name}: {str(e)}'}
        
        return results