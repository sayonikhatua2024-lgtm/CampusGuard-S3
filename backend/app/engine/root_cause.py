"""Rule-based root cause analysis.

Looks at which telemetry dimensions are most abnormal for a reading and maps
that signature to a probable failure type + human-readable root cause text.
This mirrors what a real RCA layer would do before an LLM reasoning step:
narrow down the *shape* of the anomaly so the decision engine has a concrete
hypothesis to reason about, rather than a raw anomaly score.
"""

from app.ml.anomaly_detector import HARD_THRESHOLDS


def analyze(service_name: str, service_type: str, reading: dict) -> dict:
    cpu = reading["cpu_usage"]
    mem = reading["memory_usage"]
    latency = reading["network_latency"]
    resp = reading["api_response_time"]
    err = reading["error_rate"]
    avail = reading["availability"]

    # Ordered checks: most specific / severe signatures first
    if avail <= 5 and cpu <= 5:
        return _result(
            "service_crash",
            f"'{service_name}' stopped responding entirely (availability {avail}%, "
            f"CPU {cpu}% — process appears to have crashed or the container exited).",
        )

    if avail <= HARD_THRESHOLDS["availability"] and err >= 40 and service_type == "database":
        return _result(
            "db_connection_failure",
            f"'{service_name}' is rejecting connections (availability {avail}%, "
            f"error rate {err}%) — likely a dropped DB connection pool or exhausted connections.",
        )

    if avail <= HARD_THRESHOLDS["availability"] and err >= 30 and service_type in ("api", "cloud_app"):
        return _result(
            "api_failure",
            f"'{service_name}' API is failing requests (availability {avail}%, "
            f"error rate {err}%, response time {resp}ms) — endpoint or upstream dependency down.",
        )

    if mem >= HARD_THRESHOLDS["memory_usage"]:
        return _result(
            "memory_exhaustion",
            f"'{service_name}' memory usage at {mem}% — likely a memory leak or unbounded cache growth.",
        )

    if cpu >= HARD_THRESHOLDS["cpu_usage"]:
        return _result(
            "cpu_spike",
            f"'{service_name}' CPU usage at {cpu}% with response time {resp}ms — "
            f"runaway process, inefficient query, or traffic spike.",
        )

    if latency >= HARD_THRESHOLDS["network_latency"]:
        return _result(
            "network_latency",
            f"'{service_name}' network latency at {latency}ms — congestion, routing issue, "
            f"or degraded upstream link.",
        )

    if err >= HARD_THRESHOLDS["error_rate"]:
        return _result(
            "high_error_rate",
            f"'{service_name}' error rate at {err}% — recent deploy regression or bad "
            f"downstream dependency responses.",
        )

    if resp >= HARD_THRESHOLDS["api_response_time"]:
        return _result(
            "container_failure",
            f"'{service_name}' response time at {resp}ms with degraded availability — "
            f"container may be unhealthy or restarting under load.",
        )

    return _result(
        "unknown_anomaly",
        f"'{service_name}' shows a statistical anomaly (ML model) without a clear "
        f"single-metric signature — flagged for investigation.",
    )


def _result(failure_type: str, root_cause: str) -> dict:
    return {"failure_type": failure_type, "root_cause": root_cause}
