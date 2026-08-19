"""Executes recovery actions against the simulated infrastructure layer.

Every action here is software-only: it manipulates the TelemetrySimulator's
in-memory state (clearing the injected failure / trending metrics back to
baseline) rather than touching any real infrastructure, per the project
brief. In a production version each of these would shell out to Docker,
a cloud API, or an orchestrator instead.
"""

from app.telemetry.simulator import TelemetrySimulator

ACTIONS = {
    "restart_service",
    "clear_temp_resources",
    "reconnect_database",
    "restart_api_container",
    "restart_container",
    "switch_to_backup_service",
}


def execute(simulator: TelemetrySimulator, service_name: str, action: str) -> dict:
    if action not in ACTIONS:
        return {"executed": False, "detail": f"Unknown action '{action}'"}

    if action == "switch_to_backup_service":
        if service_name in simulator.services:
            simulator.services[service_name].is_backup_active = True if hasattr(
                simulator.services[service_name], "is_backup_active"
            ) else None
        simulator.clear_failure(service_name)
        simulator.mark_recovering(service_name)
        return {"executed": True, "detail": f"Traffic for '{service_name}' failed over to backup instance."}

    # restart_service / clear_temp_resources / reconnect_database /
    # restart_api_container / restart_container all resolve to: clear the
    # injected failure and let metrics trend back to baseline over the next
    # few ticks (simulating warm-up time), matching real restart behaviour.
    simulator.clear_failure(service_name)
    simulator.mark_recovering(service_name)
    return {"executed": True, "detail": f"Executed '{action}' on '{service_name}'."}
