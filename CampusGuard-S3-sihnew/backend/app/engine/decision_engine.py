"""AI Decision Engine.

Chooses the safest recovery action for a diagnosed failure. The core policy
is a scored rule table (deterministic, auditable, safe-by-default) which is
what actually drives automated action. If ANTHROPIC_API_KEY is configured,
the engine additionally asks Claude to produce a plain-English explanation
of *why* that action is reasonable, which is what an ops team would want to
read on an incident page. The API is never allowed to choose the action
itself in this build -- keeping recovery deterministic and reproducible is a
deliberate safety property, and the LLM is used purely as an explanation
layer over the decision that was already made.
"""

import os
from typing import Optional

# failure_type -> (recovery_action, base_confidence, default_explanation)
POLICY_TABLE = {
    "cpu_spike": (
        "restart_service",
        0.88,
        "CPU spikes are most often resolved by restarting the offending process, "
        "which clears runaway threads/queries without needing a full container rebuild.",
    ),
    "memory_exhaustion": (
        "clear_temp_resources",
        0.82,
        "Memory exhaustion is typically caused by leaked allocations or unbounded caches; "
        "clearing temp/cache resources and reclaiming memory usually restores headroom.",
    ),
    "api_failure": (
        "restart_api_container",
        0.85,
        "API failures with high error rate and low availability usually indicate a stuck "
        "worker or bad deploy state; restarting the API container clears in-memory state.",
    ),
    "db_connection_failure": (
        "reconnect_database",
        0.9,
        "Dropped or exhausted DB connections are resolved by tearing down and "
        "re-establishing the connection pool rather than restarting the whole database.",
    ),
    "network_latency": (
        "switch_to_backup_service",
        0.7,
        "Persistent network latency suggests a degraded path to this instance; "
        "failing over to the backup/standby service avoids waiting on the network to heal.",
    ),
    "service_crash": (
        "restart_service",
        0.93,
        "A crashed process with zero availability needs a clean restart to come back online.",
    ),
    "high_error_rate": (
        "restart_api_container",
        0.75,
        "Elevated error rates without a full outage usually clear after restarting the "
        "serving container to shed bad in-memory state.",
    ),
    "container_failure": (
        "restart_container",
        0.8,
        "Degraded response time with an unhealthy container is best resolved with a "
        "container restart to get a clean runtime state.",
    ),
    "unknown_anomaly": (
        "restart_service",
        0.5,
        "No specific failure signature was matched; a conservative service restart is "
        "attempted first since it's low-risk and resolves the majority of transient issues.",
    ),
}

FALLBACK_ACTION = "switch_to_backup_service"

_anthropic_available = bool(os.getenv("ANTHROPIC_API_KEY"))


def decide(service_name: str, failure_type: str, root_cause: str, attempt: int = 1) -> dict:
    action, confidence, explanation = POLICY_TABLE.get(
        failure_type, POLICY_TABLE["unknown_anomaly"]
    )

    # Escalate strategy on repeated failure of the same incident: try backup
    # service on a second attempt instead of repeating the same action.
    if attempt >= 2:
        action = FALLBACK_ACTION
        confidence = max(confidence - 0.15, 0.4)
        explanation = (
            f"Primary recovery action failed on attempt {attempt - 1}, so the engine "
            f"escalates to switching '{service_name}' over to its backup/standby path "
            f"rather than repeating an action that already failed."
        )

    llm_explanation = _maybe_llm_explanation(service_name, failure_type, root_cause, action)

    return {
        "action": action,
        "confidence": round(confidence, 2),
        "explanation": llm_explanation or explanation,
    }


def _maybe_llm_explanation(
    service_name: str, failure_type: str, root_cause: str, action: str
) -> Optional[str]:
    """Optional: use Claude to phrase the operator-facing explanation.
    Falls back silently to the deterministic explanation if no API key is
    configured or the call fails, so the pipeline never blocks on this."""
    if not _anthropic_available:
        return None
    try:
        import requests  # local import so requests isn't a hard dependency

        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": os.environ["ANTHROPIC_API_KEY"],
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-6",
                "max_tokens": 150,
                "messages": [{
                    "role": "user",
                    "content": (
                        f"Service '{service_name}' failed with type '{failure_type}'. "
                        f"Root cause: {root_cause}. Chosen recovery action: '{action}'. "
                        f"In 2 short sentences, explain to an ops engineer why this action "
                        f"is a reasonable, safe recovery step."
                    ),
                }],
            },
            timeout=5,
        )
        if resp.ok:
            data = resp.json()
            text = "".join(b.get("text", "") for b in data.get("content", []))
            return text.strip() or None
    except Exception:
        pass
    return None
