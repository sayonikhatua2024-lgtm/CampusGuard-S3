import random
from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass
class InfrastructureState:
    power_capacity: float = 1.00       # 1.00 = 100% nominal
    network_capacity: float = 1.00     # 1.00 = 100% nominal
    hvac_capacity: float = 1.00        # 1.00 = 100% nominal
    active_power_drop_pct: float = 0.0 # e.g. 30.0 for 30% drop
    status: str = "nominal"            # nominal | degraded | outage


@dataclass
class ActiveFailure:
    failure_type: str
    ticks_remaining: int
    severity_multiplier: float = 1.0


@dataclass
class ServiceState:
    name: str
    baseline_cpu: float = 20.0
    baseline_memory: float = 35.0
    baseline_disk: float = 40.0
    baseline_latency: float = 40.0
    baseline_response: float = 120.0
    baseline_error_rate: float = 0.5
    baseline_availability: float = 100.0
    active_failure: Optional[ActiveFailure] = None
    recovering: bool = False


class TelemetrySimulator:
    """Generates per-tick telemetry for every registered service and supports
    injecting/clearing synthetic failures used to exercise the healing pipeline."""

    def __init__(self):
        self.services: Dict[str, ServiceState] = {}
        self.infra_state = InfrastructureState()

    def inject_power_failure(self, drop_pct: float = 30.0):
        """Prototype simulation parameter: deterministic power drop and downstream effects."""
        drop_pct = float(drop_pct)
        power_cap = max(0.0, (100.0 - drop_pct) / 100.0)
        net_cap = round(max(0.20, 1.00 - (drop_pct / 100.0) * 0.50), 2)
        hvac_cap = round(max(0.10, 1.00 - (drop_pct / 100.0) * (35.0 / 30.0)), 2)

        self.infra_state.power_capacity = round(power_cap, 2)
        self.infra_state.network_capacity = net_cap
        self.infra_state.hvac_capacity = hvac_cap
        self.infra_state.active_power_drop_pct = drop_pct
        self.infra_state.status = "degraded" if drop_pct > 0 else "nominal"

    def reset_system(self):
        """Resets all infrastructure and service simulator states to nominal baseline."""
        self.infra_state = InfrastructureState()
        for s in self.services.values():
            s.active_failure = None
            s.recovering = False

    def register_service(self, name: str, **baseline_overrides):
        self.services[name] = ServiceState(name=name, **baseline_overrides)

    def inject_failure(self, service_name: str, failure_type: str, duration_ticks: int = 12):
        if service_name not in self.services:
            raise ValueError(f"Unknown service: {service_name}")
        self.services[service_name].active_failure = ActiveFailure(
            failure_type=failure_type, ticks_remaining=duration_ticks
        )
        self.services[service_name].recovering = False

    def clear_failure(self, service_name: str):
        if service_name in self.services:
            self.services[service_name].active_failure = None
            self.services[service_name].recovering = False

    def mark_recovering(self, service_name: str):
        # recovery in progress: metrics trend back toward baseline
        if service_name in self.services:
            self.services[service_name].recovering = True

    def tick(self) -> Dict[str, dict]:
        readings = {}
        for name, s in self.services.items():
            readings[name] = self._generate_reading(s)
            if s.active_failure:
                s.active_failure.ticks_remaining -= 1
                if s.active_failure.ticks_remaining <= 0:
                    # failure would persist forever unless controller recovers it;
                    # here we let untreated failures linger by re-arming a shorter window
                    s.active_failure.ticks_remaining = 6
        return readings

    def _noise(self, base, spread):
        return max(0.0, base + random.uniform(-spread, spread))

    def _generate_reading(self, s: ServiceState) -> dict:
        cpu = self._noise(s.baseline_cpu, 5)
        memory = self._noise(s.baseline_memory, 5)
        disk = self._noise(s.baseline_disk, 2)
        latency = self._noise(s.baseline_latency, 8)
        response = self._noise(s.baseline_response, 15)
        error_rate = self._noise(s.baseline_error_rate, 0.3)
        availability = 100.0

        f = s.active_failure
        if f and not s.recovering:
            ft = f.failure_type
            if ft == "cpu_spike":
                cpu = self._noise(93, 4)
                response = self._noise(600, 100)
            elif ft == "memory_exhaustion":
                memory = self._noise(95, 3)
                cpu = self._noise(60, 10)
            elif ft == "api_failure":
                availability = self._noise(20, 10)
                error_rate = self._noise(45, 10)
                response = self._noise(2500, 300)
            elif ft == "db_connection_failure":
                availability = self._noise(10, 5)
                error_rate = self._noise(60, 10)
                response = self._noise(3000, 200)
            elif ft == "network_latency":
                latency = self._noise(850, 100)
                response = self._noise(1200, 200)
            elif ft == "service_crash":
                availability = 0.0
                error_rate = 100.0
                cpu = 0.0
                response = 0.0
            elif ft == "high_error_rate":
                error_rate = self._noise(55, 8)
                response = self._noise(400, 80)
            elif ft == "container_failure":
                availability = self._noise(5, 5)
                cpu = 0.0
                memory = self._noise(90, 5)
        elif s.recovering:
            # trend back toward baseline
            cpu = self._noise(s.baseline_cpu * 1.1, 6)
            response = self._noise(s.baseline_response * 1.2, 20)
            availability = self._noise(97, 3)

        return {
            "cpu_usage": round(min(cpu, 100), 2),
            "memory_usage": round(min(memory, 100), 2),
            "disk_usage": round(min(disk, 100), 2),
            "network_latency": round(latency, 2),
            "api_response_time": round(response, 2),
            "error_rate": round(min(error_rate, 100), 2),
            "availability": round(min(max(availability, 0), 100), 2),
        }
