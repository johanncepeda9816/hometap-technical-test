import json
import logging
import redis
from django.conf import settings
import hashlib

logger = logging.getLogger(__name__)

class CacheService:
    """
    Service for caching property data using Redis.
    """
    
    def __init__(self):
        """Initialize Redis connection using settings."""
        try:
            self.redis = redis.Redis(
                host=getattr(settings, 'REDIS_HOST', 'localhost'),
                port=getattr(settings, 'REDIS_PORT', 6379),
                db=getattr(settings, 'REDIS_DB', 0),
                password=getattr(settings, 'REDIS_PASSWORD', None),
                socket_timeout=getattr(settings, 'REDIS_TIMEOUT', 5)
            )
            self.default_ttl = getattr(settings, 'PROPERTY_CACHE_TTL', 60 * 60 * 24)  # 24 hours
            self.enabled = getattr(settings, 'CACHE_ENABLED', True)
        except Exception as e:
            logger.error(f"Failed to initialize Redis: {str(e)}")
            self.enabled = False
    
    def get_cache_key(self, address, provider=None):
        """
        Generate a cache key for a property address and optional provider.
        
        Args:
            address (str): Property address
            provider (str, optional): Provider name
            
        Returns:
            str: Cache key
        """
        # Normalize address by removing extra spaces and converting to lowercase
        normalized_address = ' '.join(address.lower().split())
        
        # Create hash of address to avoid special characters in Redis keys
        address_hash = hashlib.md5(normalized_address.encode()).hexdigest()
        
        if provider:
            return f"property:{address_hash}:{provider}"
        return f"property:{address_hash}"
    
    def get(self, address, provider=None):
        """
        Get cached property data.
        
        Args:
            address (str): Property address
            provider (str, optional): Provider name
            
        Returns:
            dict: Cached property data or None if not found
        """
        if not self.enabled:
            return None
            
        try:
            cache_key = self.get_cache_key(address, provider)
            cached_data = self.redis.get(cache_key)
            
            if cached_data:
                logger.debug(f"Cache hit for {cache_key}")
                return json.loads(cached_data)
            
            logger.debug(f"Cache miss for {cache_key}")
            return None
        except Exception as e:
            logger.error(f"Error retrieving from cache: {str(e)}")
            return None
    
    def set(self, address, data, provider=None, ttl=None):
        """
        Cache property data.
        
        Args:
            address (str): Property address
            data (dict): Property data to cache
            provider (str, optional): Provider name
            ttl (int, optional): Time to live in seconds
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.enabled:
            return False
            
        try:
            cache_key = self.get_cache_key(address, provider)
            ttl = ttl or self.default_ttl
            
            self.redis.setex(
                cache_key,
                ttl,
                json.dumps(data)
            )
            logger.debug(f"Cached data for {cache_key} with TTL {ttl}s")
            return True
        except Exception as e:
            logger.error(f"Error caching data: {str(e)}")
            return False
    
    def delete(self, address, provider=None):
        """
        Delete cached property data.
        
        Args:
            address (str): Property address
            provider (str, optional): Provider name
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.enabled:
            return False
            
        try:
            cache_key = self.get_cache_key(address, provider)
            self.redis.delete(cache_key)
            logger.debug(f"Deleted cache for {cache_key}")
            return True
        except Exception as e:
            logger.error(f"Error deleting cache: {str(e)}")
            return False