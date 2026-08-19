import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.auth import create_access_token
from app.engine.orchestrator import orchestrator


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


def test_infrastructure_state_nominal():
    headers = get_auth_headers()
    res = client.get("/api/continuity/state", headers=headers)
    assert res.status_code == 200
    state = res.json()
    assert state["power_capacity"] == 1.00
    assert state["network_capacity"] == 1.00
    assert state["hvac_capacity"] == 1.00
    assert state["active_power_drop_pct"] == 0.0
    assert state["status"] == "nominal"


def test_power_failure_injection_and_deterministic_effects():
    headers = get_auth_headers()
    # Inject 30% power failure
    res = client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert data["power_capacity"] == 0.70
    assert data["network_capacity"] == 0.85
    assert data["hvac_capacity"] == 0.65
    assert data["active_power_drop_pct"] == 30.0

    # Verify GET /api/continuity/state matches
    state_res = client.get("/api/continuity/state", headers=headers)
    assert state_res.status_code == 200
    state = state_res.json()
    assert state["power_capacity"] == 0.70
    assert state["network_capacity"] == 0.85
    assert state["hvac_capacity"] == 0.65
    assert state["status"] == "degraded"


def test_dependency_propagation_and_affected_entities():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    impact_res = client.get("/api/continuity/impact", headers=headers)
    assert impact_res.status_code == 200
    impact = impact_res.json()

    # 1. Affected Assets
    assets = {a["name"]: a for a in impact["affected_assets"]}
    assert assets["main-grid-power"]["current_capacity"] == 0.70
    assert assets["main-grid-power"]["status"] == "degraded"
    assert assets["core-switch-alpha"]["current_capacity"] == 0.85
    assert assets["datacenter-hvac-1"]["current_capacity"] == 0.65
    assert assets["backup-diesel-generator"]["current_capacity"] == 1.00

    # 2. Affected Services
    services = {s["name"]: s for s in impact["affected_services"]}
    assert services["core-network-switch"]["estimated_capacity"] == 0.85
    assert services["auth-server"]["estimated_capacity"] == 0.85
    assert services["campus-api-gateway"]["estimated_capacity"] == 0.85
    assert services["lms-cloud-app"]["estimated_capacity"] == 0.70

    # 3. Affected Missions
    missions = {m["name"]: m for m in impact["affected_missions"]}
    assert missions["Online Examination"]["status"] == "impacted"
    assert missions["Research Laboratory"]["status"] == "impacted"
    assert missions["Emergency Communication"]["status"] == "nominal"

    # 4. Propagation paths
    assert len(impact["propagation_paths"]) >= 3


def test_contracts_status_and_margins_under_power_failure():
    headers = get_auth_headers()
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})

    res = client.get("/api/continuity/contracts/status", headers=headers)
    assert res.status_code == 200
    contracts = {c["contract_id"]: c for c in res.json()}

    # 1. Online Examination: auth-server at 0.85 < 0.99 threshold -> VIOLATED (min margin -0.14)
    exam_c = contracts["contract-exam-2026"]
    assert exam_c["status"] == "VIOLATED"
    assert exam_c["margins"]["auth-server"] == -0.14
    assert exam_c["margins"]["campus-api-gateway"] == -0.05
    assert exam_c["min_margin"] == -0.14
    assert "VIOLATED" in exam_c["evidence"]

    # 2. Research Laboratory: HVAC at 0.65 < 0.90 threshold -> VIOLATED (min margin -0.25)
    research_c = contracts["contract-research-lab-2026"]
    assert research_c["status"] == "VIOLATED"
    assert research_c["margins"]["environmental_control"] == -0.25
    assert research_c["min_margin"] == -0.25

    # 3. Emergency Communication: protected at 1.00 on priority circuit -> AT_RISK or SAFE (0.00 margin)
    emergency_c = contracts["contract-emergency-comm-2026"]
    assert emergency_c["status"] in ("AT_RISK", "SAFE")
    assert emergency_c["margins"]["core-network-switch"] >= 0.00
    assert emergency_c["margins"]["email-api"] >= 0.00


def test_continuity_margin_summary_endpoint():
    headers = get_auth_headers()
    # Baseline nominal
    nom_res = client.get("/api/continuity/margin", headers=headers)
    assert nom_res.status_code == 200
    nom_data = nom_res.json()
    assert nom_data["overall_status"] == "SAFE"
    assert nom_data["safe_contracts"] >= 3
    assert nom_data["violated_contracts"] == 0

    # Under 30% power failure
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})
    deg_res = client.get("/api/continuity/margin", headers=headers)
    assert deg_res.status_code == 200
    deg_data = deg_res.json()
    assert deg_data["overall_status"] == "VIOLATED"
    assert deg_data["violated_contracts"] >= 2
    assert deg_data["min_overall_margin"] < 0.0


def test_system_reset_restoration():
    headers = get_auth_headers()
    # 1. Inject failure
    client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})
    deg_state = client.get("/api/continuity/state", headers=headers).json()
    assert deg_state["power_capacity"] == 0.70

    # 2. Reset system
    reset_res = client.post("/api/simulator/reset", headers=headers)
    assert reset_res.status_code == 200
    reset_data = reset_res.json()
    assert reset_data["ok"] is True
    assert reset_data["power_capacity"] == 1.00

    # 3. Verify state and contracts restored
    state_res = client.get("/api/continuity/state", headers=headers).json()
    assert state_res["power_capacity"] == 1.00
    assert state_res["network_capacity"] == 1.00
    assert state_res["hvac_capacity"] == 1.00
    assert state_res["status"] == "nominal"

    contracts_res = client.get("/api/continuity/contracts/status", headers=headers).json()
    for c in contracts_res:
        assert c["status"] == "SAFE"
        assert c["min_margin"] >= 0.00


def test_idempotent_repeated_simulation():
    headers = get_auth_headers()
    # Run the exact same failure scenario 3 times and verify identical results
    for _ in range(3):
        client.post("/api/simulator/power-failure", headers=headers, json={"drop_percent": 30.0})
        impact1 = client.get("/api/continuity/impact", headers=headers).json()
        contracts1 = client.get("/api/continuity/contracts/status", headers=headers).json()

        assert impact1["infrastructure_state"]["power_capacity"] == 0.70
        assert impact1["infrastructure_state"]["network_capacity"] == 0.85
        assert impact1["infrastructure_state"]["hvac_capacity"] == 0.65

        c_map = {c["contract_id"]: c for c in contracts1}
        assert c_map["contract-exam-2026"]["min_margin"] == -0.14
        assert c_map["contract-research-lab-2026"]["min_margin"] == -0.25

        client.post("/api/simulator/reset", headers=headers)
