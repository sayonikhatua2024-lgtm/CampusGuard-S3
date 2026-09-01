import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.auth import create_access_token
from app.engine.orchestrator import orchestrator
from app.engine.optimizer import (
    optimizer,
    counterfactual_evaluator,
    InterventionParams,
)
from app.engine.governance import (
    safety_gate,
    governance_service,
    SafetyGate,
    GovernanceService,
    ACTION_RISK_REGISTRY,
)
from app.models import ContinuityContract, MissionActivity, ContinuityExecution
from app.database import SessionLocal


client = TestClient(app)


def get_auth_headers():
    token = create_access_token("admin")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(autouse=True)
def ensure_reset():
    """Ensure baseline system state before and after each test."""
    headers = get_auth_headers()
    client.post("/api/simulator/reset", headers=headers)
    yield
    client.post("/api/simulator/reset", headers=headers)


def test_low_risk_action_passes_as_safe_to_execute():
    """Verifies that purely low-risk actions pass without requiring supervisor approval."""
    headers = get_auth_headers()
    res = client.post(
        "/api/continuity/safety-check",
        headers=headers,
        json={
            "student_wifi_reduction": 0.0,
            "analytics_shedding": 0.50,  # LOW risk
            "exam_traffic_shift": 0.0,
            "research_compute_reduction": 0.0,
            "noncritical_network_reduction": 0.0,
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SAFE_TO_EXECUTE"
    assert data["risk_class"] == "LOW"
    assert data["can_execute_directly"] is True
    assert data["requires_approval"] is False
    assert data["is_blocked"] is False


def test_high_risk_action_requires_approval():
    """Verifies that high-risk actions (e.g. research compute throttling) trigger APPROVAL_REQUIRED."""
    headers = get_auth_headers()
    res = client.post(
        "/api/continuity/safety-check",
        headers=headers,
        json={
            "student_wifi_reduction": 0.60,
            "analytics_shedding": 0.90,
            "exam_traffic_shift": 0.80,
            "research_compute_reduction": 0.28,  # HIGH risk
            "noncritical_network_reduction": 0.40,
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "APPROVAL_REQUIRED"
    assert data["risk_class"] == "HIGH"
    assert data["requires_approval"] is True
    assert data["can_execute_directly"] is False
    assert any("research compute" in r.lower() for r in data["approval_reasons"])


def test_forbidden_action_is_blocked():
    """Verifies that plans attempting forbidden actions are strictly BLOCKED."""
    db = SessionLocal()
    try:
        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        plan = {
            "plan_id": "plan-forbidden",
            "name": "Disable Emergency Communication Channel",
            "requires_approval": True,
        }
        res = safety_gate.evaluate(plan, contracts, InterventionParams(0, 0, 0, 0, 0))
        assert res["status"] == "BLOCKED"
        assert res["is_blocked"] is True
        assert res["can_execute_directly"] is False
        assert any("forbidden" in r.lower() for r in res["blocked_reasons"])
    finally:
        db.close()


def test_approval_and_rejection_lifecycle():
    """Verifies that human approval and rejection records persist in governance service."""
    headers = get_auth_headers()

    # 1. Approve
    app_res = client.post(
        "/api/continuity/approve",
        headers=headers,
        json={
            "plan_id": "plan-ico-optimal",
            "approver": "admin",
            "reason": "Authorized by Operations Supervisor for Exam Continuity",
        },
    )
    assert app_res.status_code == 200
    app_data = app_res.json()
    assert app_data["decision"] == "APPROVED"
    assert app_data["approver"] == "admin"

    # Verify retrieval
    stored = governance_service.get_approval("plan-ico-optimal")
    assert stored["decision"] == "APPROVED"

    # 2. Reject
    rej_res = client.post(
        "/api/continuity/reject",
        headers=headers,
        json={
            "plan_id": "plan-ico-optimal",
            "approver": "admin",
            "reason": "Rejected due to upcoming lab session",
        },
    )
    assert rej_res.status_code == 200
    rej_data = rej_res.json()
    assert rej_data["decision"] == "REJECTED"


def test_dry_run_does_not_mutate_simulator_state():
    """Verifies that dry-run execution produces preview metrics without modifying live simulator."""
    headers = get_auth_headers()
    # Inject 30% power drop
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    real_before = client.get("/api/continuity/state", headers=headers).json()
    assert real_before["network_capacity"] == 0.85
    assert real_before["hvac_capacity"] == 0.65

    # Run dry run
    exec_res = client.post(
        "/api/continuity/execute?mode=dry_run",
        headers=headers,
        json={
            "plan_id": "plan-ico-optimal",
            "approver": "admin",
        },
    )
    assert exec_res.status_code == 200
    exec_data = exec_res.json()
    assert exec_data["mode"] == "dry_run"
    assert exec_data["executed"] is False
    assert exec_data["verification_status"] == "CONTRACT_SATISFIED"

    # Verify live state remains unchanged
    real_after = client.get("/api/continuity/state", headers=headers).json()
    assert real_after["network_capacity"] == 0.85
    assert real_after["hvac_capacity"] == 0.65


def test_unapproved_high_risk_live_execution_is_denied():
    """Verifies that executing a high-risk plan in live mode without prior approval returns HTTP 403."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Clear approval
    governance_service.reject_plan("plan-ico-optimal", "admin", "Reset for test")

    # Attempt live execution without approval
    exec_res = client.post(
        "/api/continuity/execute?mode=live",
        headers=headers,
        json={
            "plan_id": "plan-ico-optimal",
            "approver": "admin",
        },
    )
    assert exec_res.status_code == 403
    assert "Human authorization required" in exec_res.json()["detail"]


def test_approved_live_execution_and_verification():
    """Verifies that an approved plan executes, modifies simulator, and produces verified metrics."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # 1. Authorize
    client.post(
        "/api/continuity/approve",
        headers=headers,
        json={"plan_id": "plan-ico-optimal", "approver": "admin", "reason": "Approved"},
    )

    # 2. Execute Live
    exec_res = client.post(
        "/api/continuity/execute?mode=live",
        headers=headers,
        json={"plan_id": "plan-ico-optimal", "approver": "admin"},
    )
    assert exec_res.status_code == 200
    data = exec_res.json()

    assert data["executed"] is True
    assert data["verification_status"] == "CONTRACT_SATISFIED"
    assert data["state_after"]["network_capacity"] >= 0.99
    assert data["state_after"]["hvac_capacity"] >= 0.90

    # 3. Check verification comparison table
    comp = data["verification_comparison"]
    assert len(comp) >= 5
    auth_row = next(r for r in comp if r["service"] == "auth-server")
    assert auth_row["before"] == 0.85
    assert auth_row["after"] >= 0.99
    assert auth_row["meets_sla"] is True


def test_human_override_parameter_customization():
    """Verifies that operator customization triggers full re-evaluation through Safety Gate."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Custom override
    override_params = {
        "student_wifi_reduction": 0.40,
        "analytics_shedding": 0.50,
        "exam_traffic_shift": 0.50,
        "research_compute_reduction": 0.28,
        "noncritical_network_reduction": 0.25,
    }

    # Safety check on override
    sc_res = client.post(
        "/api/continuity/safety-check?plan_id=plan-custom",
        headers=headers,
        json=override_params,
    )
    assert sc_res.status_code == 200
    sc_data = sc_res.json()
    assert sc_data["status"] == "APPROVAL_REQUIRED"

    # Approve custom plan
    client.post(
        "/api/continuity/approve",
        headers=headers,
        json={"plan_id": "plan-custom", "approver": "admin", "reason": "Custom override approved"},
    )

    # Execute override
    exec_res = client.post(
        "/api/continuity/execute?mode=live",
        headers=headers,
        json={
            "plan_id": "plan-custom",
            "approver": "admin",
            "override_params": override_params,
        },
    )
    assert exec_res.status_code == 200
    assert exec_res.json()["executed"] is True


def test_action_risk_registry_has_rollback_metadata():
    """Verifies that all registered mitigation actions declare explicit reversibility and rollback actions."""
    for key, act in ACTION_RISK_REGISTRY.items():
        assert "risk" in act
        assert "reversible" in act
        if act["reversible"]:
            assert act["rollback_action"] is not None
            assert len(act["rollback_action"]) > 0


def test_irrecoverable_mission_loss_weighting():
    """Verifies that irrecoverable loss weighting increases risk score for low-recoverability missions."""
    db = SessionLocal()
    try:
        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        state = orchestrator.simulator.infra_state
        state.power_capacity = 0.70
        state.network_capacity = 0.85
        state.hvac_capacity = 0.65

        # Baseline evaluation (0 intervention)
        eval_res = counterfactual_evaluator.evaluate(state, contracts, InterventionParams(0, 0, 0, 0, 0))
        assert eval_res["irrecoverable_loss_score"] > 0.0
        assert eval_res["risk_score"] >= eval_res["irrecoverable_loss_score"]
    finally:
        db.close()


def test_critical_end_to_end_governance_pipeline():
    """CRITICAL REQUIREMENT: Complete End-to-End Governance Pipeline:
    Power Failure (-30%) -> Impact -> ICO -> Safety Gate -> Approval -> Dry-Run -> Live Execution -> Verification
    """
    headers = get_auth_headers()

    # Step 1: Inject Power Failure (-30%)
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Step 2: State & Impact Assessment
    state = client.get("/api/continuity/state", headers=headers).json()
    assert state["power_capacity"] == 0.70
    assert state["network_capacity"] == 0.85
    assert state["hvac_capacity"] == 0.65

    impact = client.get("/api/continuity/impact", headers=headers).json()
    assert len(impact["affected_services"]) >= 3

    # Step 3: Run ICO Optimization
    opt = client.post("/api/continuity/optimize", headers=headers).json()
    assert opt["status"] == "FEASIBLE_OPTIMUM_FOUND"
    plan_id = opt["selected_plan"]["plan_id"]

    # Step 4: Safety Gate Evaluation
    safety = client.post("/api/continuity/safety-check", headers=headers).json()
    assert safety["status"] == "APPROVAL_REQUIRED"

    # Step 5: Authorize / Approve
    app = client.post(
        "/api/continuity/approve",
        headers=headers,
        json={"plan_id": plan_id, "approver": "supervisor_admin", "reason": "Exam window continuity authorized"},
    ).json()
    assert app["decision"] == "APPROVED"

    # Step 6: Dry Run Preview
    dry_run = client.post(f"/api/continuity/execute?mode=dry_run", headers=headers, json={"plan_id": plan_id}).json()
    assert dry_run["mode"] == "dry_run"
    assert dry_run["executed"] is False
    assert dry_run["verification_status"] == "CONTRACT_SATISFIED"

    # Step 7: Live Governed Execution
    live_exec = client.post(f"/api/continuity/execute?mode=live", headers=headers, json={"plan_id": plan_id}).json()
    assert live_exec["executed"] is True
    assert live_exec["verification_status"] == "CONTRACT_SATISFIED"

    # Step 8: Post-Action Contract & Technical Verification
    assert live_exec["state_after"]["network_capacity"] >= 0.99
    assert live_exec["state_after"]["hvac_capacity"] >= 0.90
    for c in live_exec["contracts_verification"]:
        assert c["status"] in ("SAFE", "AT_RISK")
        assert c["min_margin"] >= 0.00

    # Step 9: Verify Latest Execution API
    latest = client.get("/api/continuity/execution/latest", headers=headers).json()
    assert latest["execution_id"] == live_exec["execution_id"]
    assert latest["verification_status"] == "CONTRACT_SATISFIED"


def test_rejection_pipeline_blocks_execution():
    """CRITICAL REQUIREMENT: Reject flow strictly prevents simulated execution."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Reject plan
    client.post(
        "/api/continuity/reject",
        headers=headers,
        json={"plan_id": "plan-ico-optimal", "approver": "admin", "reason": "Denied by operator"},
    )

    # Attempt live execution -> must fail with 403
    exec_res = client.post(
        "/api/continuity/execute?mode=live",
        headers=headers,
        json={"plan_id": "plan-ico-optimal", "approver": "admin"},
    )
    assert exec_res.status_code == 403


def test_force_forbidden_action_blocked_before_execution():
    """CRITICAL REQUIREMENT: Forcing a forbidden action is strictly BLOCKED prior to execution."""
    db = SessionLocal()
    try:
        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        forbidden_plan = {
            "plan_id": "plan-forbidden-kill-emergency",
            "name": "Disable Emergency Communication Switch",
            "requires_approval": True,
        }
        res = safety_gate.evaluate(forbidden_plan, contracts, InterventionParams(0, 0, 0, 0, 0))
        assert res["status"] == "BLOCKED"
        assert res["is_blocked"] is True

        with pytest.raises(Exception):
            governance_service.execute_plan(db, "plan-forbidden-kill-emergency", mode="live")
    finally:
        db.close()
