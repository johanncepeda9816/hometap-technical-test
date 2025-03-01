import logging
import importlib

logger = logging.getLogger(__name__)

class DataProcessor:
    """
    Utility class for standardizing and processing property data from different providers.
    """
    
    @staticmethod
    def standardize_data(data, mapping, provider_name):
        """
        Standardize data from a provider based on field mappings.
        
        Args:
            data (dict): Raw data from the provider
            mapping (dict): Field mapping configuration
            provider_name (str): Name of the provider
            
        Returns:
            dict: Standardized property data
        """
        if 'error' in data:
            logger.error(f"Error in data from {provider_name}: {data['error']}")
            return {'error': data['error'], 'provider': provider_name}

        try:
            property_data = data.get('data', {})
            if not property_data:
                logger.warning(f"Empty data received from {provider_name}")
                return {'error': 'No data available', 'provider': provider_name}
                
            standardized = {}

            for target_field, source_field in mapping.items():
                try:
                    # Case 1: Field with transformation function
                    if isinstance(source_field, tuple) and len(source_field) == 2 and callable(source_field[1]):
                        field_name, transform_func = source_field
                        value = property_data.get(field_name)
                        standardized[target_field] = transform_func(value) if value is not None else None
                        
                    # Case 2: Nested field path
                    elif isinstance(source_field, tuple):
                        nested_data = property_data
                        for nested_field in source_field:
                            if isinstance(nested_data, dict):
                                nested_data = nested_data.get(nested_field)
                            else:
                                nested_data = None
                                break
                        standardized[target_field] = nested_data

                    # Case 3: Direct field mapping
                    else:
                        standardized[target_field] = property_data.get(source_field)

                except Exception as e:
                    logger.error(f"Error processing field {target_field} from {provider_name}: {str(e)}")
                    standardized[target_field] = None

            # Post-processing
            DataProcessor._apply_post_processing(standardized)

            # Add provider information
            standardized['provider'] = f"Provider {provider_name[-1]}"
            
            return standardized

        except Exception as e:
            logger.error(f"Error standardizing data from {provider_name}: {str(e)}")
            return {'error': f'Error standardizing data: {str(e)}', 'provider': provider_name}
    
    @staticmethod
    def _apply_post_processing(data):
        """
        Apply post-processing transformations to standardized data.
        
        Args:
            data (dict): Standardized data to process
        """
        
        # Format sale price
        if 'sale_price' in data and data['sale_price']:
            try:
                price = int(data['sale_price'])
                data['sale_price_formatted'] = f"${price:,}"
            except (ValueError, TypeError):
                data['sale_price_formatted'] = data['sale_price']

        # Format boolean fields
        if 'septic_system' in data:
            data['septic_system'] = "Yes" if data['septic_system'] else "No"
    
    @staticmethod
    def load_service_class(service_class_path):
        """
        Dynamically load a service class from a string path.
        
        Args:
            service_class_path (str): Import path for the service class
            
        Returns:
            class: The service class
        """
        try:
            module_path, class_name = service_class_path.rsplit('.', 1)
            module = importlib.import_module(module_path)
            return getattr(module, class_name)
        except (ImportError, AttributeError) as e:
            logger.error(f"Error loading service class {service_class_path}: {str(e)}")
            raise ImportError(f"Could not import {service_class_path}")