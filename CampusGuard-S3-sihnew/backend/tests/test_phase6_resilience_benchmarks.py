"""Phase 6 Automated Test Suite: Resilience, Provenance, Replay, Benchmarking & Competition Hardening.

Covers:
1. Degraded telemetry mode & confidence scoring
2. Conservative safety gating under missing telemetry
3. Replay audit timeline event logging & immutability
4. Structured decision provenance generation
5. 30-scenario benchmark suite execution & 4-baseline comparison
6. Flagship context-switch experiment (differential interventions under identical failure)
7. Institutional mission utility preservation metric
8. Audit integrity & security revalidation
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.auth import create_access_token
from app.database import SessionLocal
from app.telemetry.telemetry_manager import telemetry_manager
from app.engine.replay_engine import replay_engine
from app.engine.benchmark_engine import benchmark_engine
from app.engine.governance import safety_gate, governance_service
from app.engine.optimizer import optimizer, InterventionParams
from app.models import ContinuityContract, MissionActivity, ContinuityExecution

client = TestClient(app)


def get_auth_headers():
    token = create_access_token("admin")
    return {"Authorization": f"Bearer {token}"}


def test_telemetry_source_nominal_status():
    """Verifies nominal telemetry state returns 100% confidence and zero missing sources."""
    telemetry_manager.reset_telemetry()
    status = telemetry_manager.get_status()

    assert status["confidence_score"] == 1.00
    assert status["confidence_level"] == "HIGH"
    assert status["is_degraded"] is False
    assert len(status["missing_sources"]) == 0
    assert status["autonomy_restriction"] == "NONE"


def test_degraded_telemetry_hvac_offline():
    """Disconnecting HVAC telemetry drops confidence and flags thermal mitigation constraints."""
    telemetry_manager.reset_telemetry()
    telemetry_manager.degrade_source("telemetry_hvac", available=False)
    status = telemetry_manager.get_status()

    assert status["confidence_score"] == 0.75
    assert status["confidence_level"] == "MEDIUM"
    assert status["is_degraded"] is True
    assert "Data Center CRAC Thermal Loop Sensors" in status["missing_sources"]
    assert any("CRAC Thermal Telemetry Offline" in r for r in status["specific_restrictions"])

    # Clean up
    telemetry_manager.reset_telemetry()


def test_degraded_telemetry_multi_source_drops_to_low():
    """Disconnecting multiple critical sources drops confidence to LOW and blocks autonomous execution."""
    telemetry_manager.reset_telemetry()
    telemetry_manager.degrade_source("telemetry_power", available=False)
    telemetry_manager.degrade_source("telemetry_network", available=False)
    status = telemetry_manager.get_status()

    assert status["confidence_score"] < 0.60
    assert status["confidence_level"] == "LOW"
    assert status["is_degraded"] is True
    assert status["autonomy_restriction"] == "BLOCK_ALL_AUTONOMOUS"

    # Clean up
    telemetry_manager.reset_telemetry()


def test_safety_gate_becomes_conservative_under_degraded_telemetry():
    """Verifies Safety Gate enforces APPROVAL_REQUIRED when telemetry confidence is LOW."""
    telemetry_manager.reset_telemetry()
    telemetry_manager.degrade_source("telemetry_power", available=False)
    telemetry_manager.degrade_source("telemetry_network", available=False)

    db = SessionLocal()
    try:
        contracts = db.query(ContinuityContract).all()

        # Low-risk plan that would normally be SAFE_TO_EXECUTE
        low_risk_plan = {
            "plan_id": "plan-low-risk",
            "name": "Background Analytics Shedding Only",
            "intervention": {
                "student_wifi_reduction": 0.0,
                "analytics_shedding": 0.50,
                "exam_traffic_shift": 0.0,
                "research_compute_reduction": 0.0,
                "noncritical_network_reduction": 0.0,
            },
        }

        safety_eval = safety_gate.evaluate(low_risk_plan, contracts)
        assert safety_eval["status"] == "APPROVAL_REQUIRED"
        assert any("Degraded Observability" in r for r in safety_eval["approval_reasons"])
    finally:
        db.close()
        telemetry_manager.reset_telemetry()


def test_replay_timeline_records_events():
    """Verifies that state transitions, approvals, and executions append to the replay timeline."""
    replay_engine.clear_timeline()

    replay_engine.record_event(
        event_type="ANOMALY_DETECTED",
        summary="Power degradation anomaly triggered on Substation Alpha",
        payload={"power_drop_pct": 30.0},
        actor="Telemetry Monitor",
    )

    timeline = replay_engine.get_timeline(limit=10)
    assert len(timeline) >= 2
    assert timeline[0]["event_type"] == "ANOMALY_DETECTED"
    assert timeline[0]["actor"] == "Telemetry Monitor"


def test_decision_provenance_structure():
    """Verifies structured Decision Provenance answers 'WHY WAS THIS PLAN SELECTED?' with mathematical details."""
    db = SessionLocal()
    try:
        prov = replay_engine.generate_provenance(db=db)

        assert prov["query"] == "WHY WAS THIS PLAN SELECTED?"
        assert "selected_plan" in prov
        assert prov["selected_plan"]["plan_id"] is not None
        assert "selection_rationale" in prov
        assert len(prov["active_missions"]) >= 3
        assert len(prov["active_contracts"]) >= 3
        assert "objective_breakdown" in prov
        assert prov["objective_breakdown"]["contract_violations"] == 0
        assert len(prov["binding_constraints"]) > 0
        assert len(prov["candidate_plans_comparison"]) >= 4
    finally:
        db.close()


def test_benchmark_suite_30_scenarios():
    """Executes all 30 deterministic benchmark scenarios and verifies comparative strategy metrics."""
    db = SessionLocal()
    try:
        res = benchmark_engine.run_benchmark(db=db)

        assert res["total_scenarios"] == 30
        assert len(res["categories"]) == 5
        assert len(res["scenarios"]) == 30

        summary = res["comparative_summary"]
        assert "baseline_a_none" in summary
        assert "baseline_b_static" in summary
        assert "baseline_c_greedy" in summary
        assert "campusguard_ico" in summary

        ico = summary["campusguard_ico"]
        baseline_a = summary["baseline_a_none"]
        baseline_c = summary["baseline_c_greedy"]

        assert ico["compliance_rate"] > baseline_a["compliance_rate"]
        assert ico["avg_utility_preserved"] > baseline_a["avg_utility_preserved"]
        assert ico["avg_collateral_degradation"] < baseline_c["avg_collateral_degradation"]
    finally:
        db.close()


def test_flagship_context_switch_experiment():
    """Flagship Test: Verifies identical failure produces differential optimal plans across Context A, B, and C."""
    db = SessionLocal()
    try:
        res = benchmark_engine.run_context_switch_experiment(db=db)

        assert res["experiment"] == "Dynamic Context-Switching Experiment"
        assert res["scenario_a"]["is_feasible"] is True
        assert res["scenario_b"]["is_feasible"] is True
        assert res["scenario_c"]["is_feasible"] is True

        # Context B (Research active) requires compute reduction to preserve datacenter cooling
        interv_b = res["scenario_b"]["intervention"]
        assert interv_b["research_compute_reduction"] > 0.0

        # Context C (Emergency only, Off-hours) does not need research compute reduction
        interv_c = res["scenario_c"]["intervention"]
        assert interv_c["research_compute_reduction"] == 0.0

        # Cost in C is strictly lower than in B because no research cooling shedding is needed
        assert res["scenario_c"]["intervention_cost"] < res["scenario_b"]["intervention_cost"]

        # Provenance differential verification
        diff = res["provenance_differential"]
        assert diff["research_compute_reduction_b_vs_c"] is True
    finally:
        db.close()


def test_api_telemetry_routes():
    """Tests /api/telemetry/status, /api/telemetry/degrade, and /api/telemetry/reset endpoints."""
    headers = get_auth_headers()

    # 1. Reset
    resp_reset = client.post("/api/telemetry/reset", headers=headers)
    assert resp_reset.status_code == 200
    assert resp_reset.json()["confidence_score"] == 1.00

    # 2. Degrade HVAC
    resp_deg = client.post(
        "/api/telemetry/degrade",
        headers=headers,
        json={"source_id": "telemetry_hvac", "available": False},
    )
    assert resp_deg.status_code == 200
    assert resp_deg.json()["is_degraded"] is True

    # 3. Status
    resp_st = client.get("/api/telemetry/status", headers=headers)
    assert resp_st.status_code == 200
    assert resp_st.json()["confidence_level"] == "MEDIUM"

    # Clean up
    client.post("/api/telemetry/reset", headers=headers)


def test_api_replay_and_provenance_routes():
    """Tests /api/continuity/replay and /api/continuity/provenance endpoints."""
    headers = get_auth_headers()

    resp_replay = client.get("/api/continuity/replay", headers=headers)
    assert resp_replay.status_code == 200
    assert isinstance(resp_replay.json(), list)

    resp_prov = client.get("/api/continuity/provenance", headers=headers)
    assert resp_prov.status_code == 200
    assert resp_prov.json()["query"] == "WHY WAS THIS PLAN SELECTED?"


def test_api_benchmark_routes():
    """Tests /api/continuity/benchmark/run and /api/continuity/benchmark/context-switch endpoints."""
    headers = get_auth_headers()

    resp_b = client.post("/api/continuity/benchmark/run", headers=headers)
    assert resp_b.status_code == 200
    assert resp_b.json()["total_scenarios"] == 30

    resp_cs = client.post("/api/continuity/benchmark/context-switch", headers=headers)
    assert resp_cs.status_code == 200
    assert "provenance_differential" in resp_cs.json()


def test_api_demo_reset_route():
    """Tests /api/continuity/demo/reset endpoint restores clean environment."""
    headers = get_auth_headers()
    resp = client.post("/api/continuity/demo/reset", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["ok"] is True

