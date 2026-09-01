from collections import deque
from typing import Deque, Dict, List

import numpy as np
from sklearn.ensemble import IsolationForest

from app.config import ANOMALY_CONTAMINATION, ANOMALY_HISTORY_WINDOW

FEATURES = [
    "cpu_usage", "memory_usage", "disk_usage",
    "network_latency", "api_response_time", "error_rate", "availability",
]

# Hard thresholds used as a fast-path / fallback so incidents fire even
# before a service has accumulated enough history to train a model.
HARD_THRESHOLDS = {
    "cpu_usage": 85,
    "memory_usage": 90,
    "network_latency": 400,
    "api_response_time": 800,
    "error_rate": 15,
    "availability": 60,  # below this = anomalous (inverted)
}


class PerServiceAnomalyDetector:
    """Maintains a rolling window of telemetry per service and fits a fresh
    Isolation Forest periodically to flag multivariate anomalies, backed by
    hard thresholds for cold-start / obvious failure cases."""

    def __init__(self):
        self.history: Dict[str, Deque[List[float]]] = {}
        self.models: Dict[str, IsolationForest] = {}
        self.fit_counter: Dict[str, int] = {}

    def _vectorize(self, reading: dict) -> List[float]:
        return [reading[f] for f in FEATURES]

    def _hard_threshold_hit(self, reading: dict) -> bool:
        if reading["cpu_usage"] >= HARD_THRESHOLDS["cpu_usage"]:
            return True
        if reading["memory_usage"] >= HARD_THRESHOLDS["memory_usage"]:
            return True
        if reading["network_latency"] >= HARD_THRESHOLDS["network_latency"]:
            return True
        if reading["api_response_time"] >= HARD_THRESHOLDS["api_response_time"]:
            return True
        if reading["error_rate"] >= HARD_THRESHOLDS["error_rate"]:
            return True
        if reading["availability"] <= HARD_THRESHOLDS["availability"]:
            return True
        return False

    def observe(self, service_name: str, reading: dict) -> dict:
        """Feed a new reading in; returns {is_anomaly, anomaly_score}."""
        vec = self._vectorize(reading)
        hist = self.history.setdefault(service_name, deque(maxlen=ANOMALY_HISTORY_WINDOW))
        hist.append(vec)
        self.fit_counter[service_name] = self.fit_counter.get(service_name, 0) + 1

        hard_hit = self._hard_threshold_hit(reading)

        # Need enough history before ML kicks in
        if len(hist) < 25:
            return {"is_anomaly": hard_hit, "anomaly_score": 1.0 if hard_hit else 0.0}

        # Refit periodically (every 10 ticks) rather than every tick, for cost reasons
        if service_name not in self.models or self.fit_counter[service_name] % 10 == 0:
            X = np.array(hist)
            model = IsolationForest(
                n_estimators=100,
                contamination=ANOMALY_CONTAMINATION,
                random_state=42,
            )
            model.fit(X)
            self.models[service_name] = model

        model = self.models[service_name]
        X_latest = np.array([vec])
        pred = model.predict(X_latest)[0]  # -1 anomaly, 1 normal
        raw_score = model.decision_function(X_latest)[0]  # higher = more normal
        # normalize into a 0-1 "anomaly score" (higher = more anomalous)
        anomaly_score = float(np.clip(0.5 - raw_score, 0, 1))

        is_anomaly = (pred == -1) or hard_hit
        if hard_hit:
            anomaly_score = max(anomaly_score, 0.9)

        return {"is_anomaly": bool(is_anomaly), "anomaly_score": round(anomaly_score, 3)}
