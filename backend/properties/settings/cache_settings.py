# Redis Configuration
REDIS_HOST = "localhost"  # Important JC -> Only for development
REDIS_PORT = 6379
REDIS_DB = 0
REDIS_PASSWORD = None
REDIS_TIMEOUT = 5  # seconds

# Cache settings
CACHE_ENABLED = True
PROPERTY_CACHE_TTL = 86400  # 24 hours because providers data changes daily

# Django Cache Configuration
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_CONNECT_TIMEOUT": REDIS_TIMEOUT,
            "SOCKET_TIMEOUT": REDIS_TIMEOUT,
        },
    }
}
