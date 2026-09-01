import os

# MySQL connection settings (overridable via environment variables / docker-compose)
MYSQL_USER = os.getenv("MYSQL_USER", "healer")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "healerpass")
MYSQL_HOST = os.getenv("MYSQL_HOST", "mysql")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")
MYSQL_DB = os.getenv("MYSQL_DB", "self_healing_ops")

DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    "?charset=utf8mb4"
)

# Monitoring loop interval (seconds)
MONITOR_INTERVAL_SECONDS = float(os.getenv("MONITOR_INTERVAL_SECONDS", "3"))

# Anomaly detection
ANOMALY_CONTAMINATION = float(os.getenv("ANOMALY_CONTAMINATION", "0.08"))
ANOMALY_HISTORY_WINDOW = int(os.getenv("ANOMALY_HISTORY_WINDOW", "200"))

# Recovery
MAX_RECOVERY_ATTEMPTS = int(os.getenv("MAX_RECOVERY_ATTEMPTS", "2"))

# CORS Deployment Control
CORS_ALLOW_ORIGINS = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173,http://localhost:4173").split(",")
