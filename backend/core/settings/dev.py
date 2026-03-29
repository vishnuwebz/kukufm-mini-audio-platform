from .base import *

# Development-specific overrides

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Dev email backend: prints emails to console instead oof sending
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

