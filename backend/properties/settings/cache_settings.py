# Redis Configuration
REDIS_HOST = 'localhost' # Important JC -> Only for development (I don't have production settings)
REDIS_PORT = 6379
REDIS_DB = 0
REDIS_PASSWORD = None 
REDIS_TIMEOUT = 5  # seconds

# Cache settings
CACHE_ENABLED = True
PROPERTY_CACHE_TTL = 86400  # 24 hours because providers data changes daily