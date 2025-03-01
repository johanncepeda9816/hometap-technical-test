from rest_framework import serializers

class PropertyDetailsSerializer(serializers.Serializer):
    """
    Serializer for standardized property details from multiple providers.
    Only includes fields that are actually used in the provider configurations.
    """
    # Fields based on provider mapping
    square_footage = serializers.IntegerField(required=False, allow_null=True)
    lot_size_acres = serializers.FloatField(required=False, allow_null=True)
    year_built = serializers.IntegerField(required=False, allow_null=True)
    property_type = serializers.CharField(required=False, allow_null=True)
    bedrooms = serializers.IntegerField(required=False, allow_null=True)
    bathrooms = serializers.FloatField(required=False, allow_null=True)
    room_count = serializers.IntegerField(required=False, allow_null=True)
    septic_system = serializers.CharField(required=False, allow_null=True)
    sale_price = serializers.IntegerField(required=False, allow_null=True)
    sale_price_formatted = serializers.CharField(required=False, allow_null=True, read_only=True)
    
    # Metadata fields
    provider = serializers.CharField(required=True)
    cached = serializers.BooleanField(default=False)
    
    def to_representation(self, instance):
        """
        Custom representation to handle error cases.
        """
        # Handle error case
        if isinstance(instance, dict) and 'error' in instance:
            return {
                'error': instance['error'],
                'provider': instance.get('provider', 'unknown'),
                'cached': instance.get('cached', False)
            }
            
        # Regular processing
        return super().to_representation(instance)