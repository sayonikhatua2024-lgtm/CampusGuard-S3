from app.ml.anomaly_detector import HARD_THRESHOLDS


def verify(reading: dict) -> bool:
    """Returns True if the latest reading looks healthy again."""
    if reading["availability"] < 85:
        return False
    if reading["cpu_usage"] >= HARD_THRESHOLDS["cpu_usage"]:
        return False
    if reading["memory_usage"] >= HARD_THRESHOLDS["memory_usage"]:
        return False
    if reading["network_latency"] >= HARD_THRESHOLDS["network_latency"]:
        return False
    if reading["api_response_time"] >= HARD_THRESHOLDS["api_response_time"]:
        return False
    if reading["error_rate"] >= HARD_THRESHOLDS["error_rate"]:
        return False
    return True
