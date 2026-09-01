import os
import logging

logger = logging.getLogger("campusguard.auth")

# JWT settings
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-secret-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "480"))  # 8 hours

# Seeded administrator account (single-admin demo auth).
# In production deployment, provide strong credentials via environment variables.
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

if JWT_SECRET_KEY == "change-this-secret-in-production":
    logger.warning("SECURITY WARNING: Default development JWT_SECRET_KEY in use. Set a secure JWT_SECRET_KEY in production.")

