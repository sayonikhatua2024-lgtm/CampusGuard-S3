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
from app.models import ContinuityContract, MissionActivity
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


def test_counterfactual_does_not_mutate_real_state():
    headers = get_auth_headers()
    # Inject 30% power failure
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Read current real state
    real_state_before = client.get("/api/continuity/state", headers=headers).json()
    assert real_state_before["power_capacity"] == 0.70
    assert real_state_before["network_capacity"] == 0.85
    assert real_state_before["hvac_capacity"] == 0.65

    # Run counterfactual with aggressive interventions
    cf_res = client.post(
        "/api/continuity/counterfactual",
        headers=headers,
        json={
            "student_wifi_reduction": 0.80,
            "analytics_shedding": 1.00,
            "exam_traffic_shift": 1.00,
            "research_compute_reduction": 0.30,
            "noncritical_network_reduction": 0.50,
        },
    )
    assert cf_res.status_code == 200
    cf_data = cf_res.json()
    assert cf_data["projected_infra"]["network_capacity"] == 1.00
    assert cf_data["projected_infra"]["hvac_capacity"] == 0.97
    assert cf_data["is_feasible"] is True

    # Verify real state remains strictly unchanged
    real_state_after = client.get("/api/continuity/state", headers=headers).json()
    assert real_state_after["power_capacity"] == 0.70
    assert real_state_after["network_capacity"] == 0.85
    assert real_state_after["hvac_capacity"] == 0.65


def test_no_intervention_baseline_evaluation():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    # Counterfactual with 0 interventions
    cf_res = client.post(
        "/api/continuity/counterfactual",
        headers=headers,
        json={
            "student_wifi_reduction": 0.0,
            "analytics_shedding": 0.0,
            "exam_traffic_shift": 0.0,
            "research_compute_reduction": 0.0,
            "noncritical_network_reduction": 0.0,
        },
    )
    assert cf_res.status_code == 200
    data = cf_res.json()
    assert data["is_feasible"] is False
    assert data["violated_contracts"] >= 2
    assert data["intervention_cost"] == 0.0
    assert data["collateral_degradation"] == 0.0


def test_selective_degradation_evaluation():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    cf_res = client.post(
        "/api/continuity/counterfactual",
        headers=headers,
        json={
            "student_wifi_reduction": 0.60,
            "analytics_shedding": 0.90,
            "exam_traffic_shift": 0.80,
            "research_compute_reduction": 0.28,
            "noncritical_network_reduction": 0.40,
        },
    )
    assert cf_res.status_code == 200
    data = cf_res.json()
    assert data["is_feasible"] is True
    assert data["min_overall_margin"] >= 0.00
    assert len(data["sacrificed_services"]) >= 3


def test_candidate_plan_generation():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    res = client.get("/api/continuity/plans", headers=headers)
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) >= 4

    plan_ids = {p["plan_id"] for p in plans}
    assert "plan-a-baseline" in plan_ids
    assert "plan-b-selective" in plan_ids
    assert "plan-c-balanced" in plan_ids
    assert "plan-d-aggressive" in plan_ids

    # Baseline plan is infeasible under 30% drop
    baseline = next(p for p in plans if p["plan_id"] == "plan-a-baseline")
    assert baseline["is_feasible"] is False

    # Balanced or aggressive plan is feasible
    aggressive = next(p for p in plans if p["plan_id"] == "plan-d-aggressive")
    assert aggressive["is_feasible"] is True


def test_optimizer_chooses_lowest_cost_feasible_plan():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    res = client.post("/api/continuity/optimize", headers=headers)
    assert res.status_code == 200
    opt_data = res.json()

    assert opt_data["status"] == "FEASIBLE_OPTIMUM_FOUND"
    winner = opt_data["selected_plan"]
    assert winner["is_feasible"] is True
    assert winner["min_overall_margin"] >= 0.00
    assert winner["intervention_cost"] > 0.0
    # Winner must have lower or equal cost compared to aggressive plan
    aggressive_cost = 0.25 * 0.80 + 0.15 * 1.00 + 0.20 * 1.00 + 0.40 * 0.30 + 0.20 * 0.50
    assert winner["intervention_cost"] <= aggressive_cost
    assert len(opt_data["binding_constraints"]) >= 1


def test_contract_conflict_detection():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    res = client.get("/api/continuity/conflicts", headers=headers)
    assert res.status_code == 200
    conf_data = res.json()

    assert conf_data["has_conflict"] is True
    assert conf_data["conflict_count"] >= 1

    conflict_resources = {c["resource"] for c in conf_data["conflicts"]}
    assert any("Network" in r or "Thermal" in r or "HVAC" in r for r in conflict_resources)


def test_dynamic_degradation_ladder():
    headers = get_auth_headers()
    res = client.get("/api/continuity/degradation-ladder", headers=headers)
    assert res.status_code == 200
    ladder = res.json()

    assert len(ladder) >= 4
    # Tier 1 should be low impact (analytics)
    assert ladder[0]["tier"] == 1
    assert "analytics" in ladder[0]["action"]
    # Last tier should be Emergency Communication
    last_tier = ladder[-1]
    assert "Emergency" in last_tier["service"]
    assert last_tier["impact_level"] == "LIFE SAFETY"


def test_multi_scenario_contract_context_differentiation():
    """Critical Test: Verifies that optimizer recommendation changes when active contract set changes."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    db = SessionLocal()
    try:
        # Scenario A: All 3 contracts active (Exam + Research + Emergency)
        res_a = client.post("/api/continuity/optimize", headers=headers).json()
        winner_a = res_a["selected_plan"]
        interv_a = winner_a["evaluation"]["intervention"]

        # Deactivate Exam contract for Scenario B
        exam_c = db.query(ContinuityContract).filter(ContinuityContract.contract_id == "contract-exam-2026").first()
        if exam_c:
            exam_c.active = False
            db.commit()

        # Scenario B: Research + Emergency active (Exam deactivated)
        res_b = client.post("/api/continuity/optimize", headers=headers).json()
        winner_b = res_b["selected_plan"]
        interv_b = winner_b["evaluation"]["intervention"]

        # In Scenario B, exam traffic shift is 0.0 because Exam is inactive
        assert interv_b["exam_traffic_shift"] == 0.0
        # Intervention cost for B should be <= Scenario A because less shedding is required
        assert winner_b["intervention_cost"] <= winner_a["intervention_cost"]

    finally:
        # Restore exam contract
        exam_c = db.query(ContinuityContract).filter(ContinuityContract.contract_id == "contract-exam-2026").first()
        if exam_c:
            exam_c.active = True
            db.commit()
        db.close()


def test_infeasibility_detection_under_extreme_failure():
    """Verifies that severe infrastructure curtailment produces explicit NO_FULLY_FEASIBLE_PLAN."""
    headers = get_auth_headers()
    # Inject 90% power loss (10% capacity remaining)
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 90.0})

    db = SessionLocal()
    try:
        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        state = orchestrator.simulator.infra_state
        res = optimizer.optimize(state, contracts)

        assert res["status"] == "NO_FULLY_FEASIBLE_PLAN"
        assert res["selected_plan"]["is_feasible"] is False
        assert "Infeasible" in res["explanation"]
    finally:
        db.close()


def test_optimizer_determinism():
    """Verifies that running the same scenario multiple times produces exact identical outputs."""
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    results = []
    for _ in range(3):
        res = client.post("/api/continuity/optimize", headers=headers).json()
        results.append((
            res["selected_plan"]["intervention_cost"],
            res["selected_plan"]["collateral_degradation"],
            res["selected_plan"]["min_overall_margin"],
            res["selected_plan"]["evaluation"]["intervention"],
        ))

    # Verify all 3 runs produced identical output
    assert results[0] == results[1] == results[2]
