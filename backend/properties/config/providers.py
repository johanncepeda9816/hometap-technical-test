from properties.utils.conversion import convert_sqft_to_acres

PROVIDER_CONFIGS = {
    'provider1': {
        'service_class': 'properties.services.provider1.Provider1Service',
        'timeout': 30,  # seconds
        'mapping': {
            'square_footage': 'squareFootage',
            'lot_size_acres': ('lotSizeSqFt', convert_sqft_to_acres),
            'year_built': 'yearBuilt',
            'property_type': 'propertyType',
            'bedrooms': 'bedrooms',
            'bathrooms': 'bathrooms',
            'room_count': ('features', 'roomCount'),
            'septic_system': ('features', 'septicSystem'),
            'sale_price': 'lastSalePrice',
        }
    },
    'provider2': {
        'service_class': 'properties.services.provider2.Provider2Service',
        'timeout': 30,  # seconds
        'mapping': {
            'square_footage': 'SquareFootage',
            'lot_size_acres': 'LotSizeAcres',
            'year_built': 'YearConstructed',
            'property_type': 'PropertyType',
            'bedrooms': 'Bedrooms',
            'bathrooms': 'Bathrooms',
            'room_count': 'RoomCount',
            'septic_system': 'SepticSystem',
            'sale_price': 'SalePrice',
        }
    }
}