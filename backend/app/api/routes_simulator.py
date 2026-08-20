from fastapi import APIRouter, Depends, HTTPException

from app.engine.orchestrator import orchestrator
from app.schemas import SimulateFailureRequest
from app.telemetry.simulator import ServiceState  # noqa: F401 (type reference)
from app.auth import get_current_user

router = APIRouter(
    prefix="/api/simulator", tags=["simulator"], dependencies=[Depends(get_current_user)]
)

VALID_FAILURES = {
    "cpu_spike", "memory_exhaustion", "api_failure", "db_connection_failure",
    "network_latency", "service_crash", "high_error_rate", "container_failure",
}


@router.get("/failure-types")
def failure_types():
    return sorted(VALID_FAILURES)


@router.get("/services")
def services():
    return list(orchestrator.simulator.services.keys())


@router.post("/inject")
def inject_failure(req: SimulateFailureRequest):
    if req.failure_type not in VALID_FAILURES:
        raise HTTPException(400, f"Unknown failure_type '{req.failure_type}'")
    if req.service_name not in orchestrator.simulator.services:
        raise HTTPException(404, f"Unknown service '{req.service_name}'")
    orchestrator.inject_failure(req.service_name, req.failure_type)
    return {"ok": True, "message": f"Injected '{req.failure_type}' into '{req.service_name}'."}
