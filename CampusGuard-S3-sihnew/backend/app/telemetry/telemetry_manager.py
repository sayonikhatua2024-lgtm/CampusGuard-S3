"""CampusGuard Telemetry Manager & Observability Health Engine.

Manages telemetry source availability, deterministic confidence scoring,
and degraded observability constraints.
"""

from datetime import datetime
from typing import Dict, List, Any, Optional


class TelemetrySource:
    def __init__(
        self,
        source_id: str,
        name: str,
        category: str,
        weight: float = 0.25,
        available: bool = True,
        quality: float = 1.0,
        stale: bool = False,
    ):
        self.source_id = source_id
        self.name = name
        self.category = category
        self.weight = weight
        self.available = available
        self.quality = quality
        self.stale = stale
        self.last_seen = datetime.utcnow().isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source_id": self.source_id,
            "name": self.name,
            "category": self.category,
            "weight": self.weight,
            "available": self.available,
            "quality": self.quality,
            "stale": self.stale,
            "last_seen": self.last_seen,
        }


class TelemetryManager:
    """Deterministic telemetry health and observability confidence manager."""

    def __init__(self):
        self.sources: Dict[str, TelemetrySource] = {}
        self._init_sources()

    def _init_sources(self):
        self.sources = {
            "telemetry_power": TelemetrySource(
                source_id="telemetry_power",
                name="Main Grid & UPS Substation Telemetry",
                category="power",
                weight=0.30,
            ),
            "telemetry_network": TelemetrySource(
                source_id="telemetry_network",
                name="Core Switch Alpha NetFlow & Hardware Queues",
                category="network",
                weight=0.30,
            ),
            "telemetry_hvac": TelemetrySource(
                source_id="telemetry_hvac",
                name="Data Center CRAC Thermal Loop Sensors",
                category="hvac",
                weight=0.25,
            ),
            "telemetry_services": TelemetrySource(
                source_id="telemetry_services",
                name="Application Gateway & Auth Server Latency Pings",
                category="services",
                weight=0.15,
            ),
        }

    def reset_telemetry(self):
        """Restores all telemetry feeds to nominal online state."""
        self._init_sources()

    def degrade_source(
        self,
        source_id: str,
        available: bool = False,
        quality: float = 1.0,
        stale: bool = False,
    ) -> Dict[str, Any]:
        """Degrades or disconnects a specific telemetry source."""
        if source_id not in self.sources:
            raise KeyError(f"Unknown telemetry source '{source_id}'")
        s = self.sources[source_id]
        s.available = available
        s.quality = quality if available else 0.0
        s.stale = stale
        s.last_seen = datetime.utcnow().isoformat()
        return s.to_dict()

    def get_status(self) -> Dict[str, Any]:
        """Calculates deterministic telemetry confidence and autonomy constraints."""
        total_weight = sum(s.weight for s in self.sources.values())
        effective_weight = sum(
            (s.weight * s.quality * (0.5 if s.stale else 1.0))
            for s in self.sources.values()
            if s.available
        )
        confidence_score = round(effective_weight / total_weight, 2) if total_weight > 0 else 0.0

        missing_sources = [s.name for s in self.sources.values() if not s.available]
        stale_sources = [s.name for s in self.sources.values() if s.available and s.stale]

        if confidence_score >= 0.85:
            confidence_level = "HIGH"
            reason = "All critical telemetry feeds nominal with active real-time data streaming."
            autonomy_restriction = "NONE"
            is_degraded = False
        elif confidence_score >= 0.60:
            confidence_level = "MEDIUM"
            reason = f"Degraded observability: {len(missing_sources)} feeds offline ({', '.join(missing_sources)})."
            autonomy_restriction = "RESTRICT_HIGH_RISK"
            is_degraded = True
        else:
            confidence_level = "LOW"
            reason = f"Critical telemetry deficit: Multiple feeds offline. Operating under conservative fallback."
            autonomy_restriction = "BLOCK_ALL_AUTONOMOUS"
            is_degraded = True

        # Specific domain constraints
        specific_restrictions = []
        if not self.sources["telemetry_hvac"].available:
            specific_restrictions.append("CRAC Thermal Telemetry Offline: Automatic HVAC shedding requires manual supervisor sign-off.")
        if not self.sources["telemetry_network"].available:
            specific_restrictions.append("Core Switch NetFlow Offline: QoS priority shifts require empirical buffer verification.")

        return {
            "confidence_score": confidence_score,
            "confidence_level": confidence_level,
            "is_degraded": is_degraded,
            "sources": [s.to_dict() for s in self.sources.values()],
            "missing_sources": missing_sources,
            "stale_sources": stale_sources,
            "autonomy_restriction": autonomy_restriction,
            "specific_restrictions": specific_restrictions,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
        }


telemetry_manager = TelemetryManager()
