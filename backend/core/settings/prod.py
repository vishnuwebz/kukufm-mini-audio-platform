from .base import *

# Production-specific overrides

DEBUG = False

# In real deployment will set domain(s) here
ALLOWED_HOSTS = ["*"]

# SECURITY SETTINGS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

SESSION_COOKIE_SECURE = True
csrf_cookie_secure = True