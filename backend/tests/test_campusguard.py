import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.auth import create_access_token
from app.models import Asset, MissionActivity, ContinuityContract, Dependency, Service, ServiceStatus
from app.engine.orchestrator import orchestrator


client = TestClient(app)


def get_auth_headers():
    token = create_access_token("admin")
    return {"Authorization": f"Bearer {token}"}


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_auth_protection():
    # Unauthenticated requests to protected endpoints must return 401
    assert client.get("/api/contracts").status_code == 401
    assert client.get("/api/contracts/active").status_code == 401
    assert client.get("/api/missions").status_code == 401
    assert client.get("/api/assets").status_code == 401
    assert client.get("/api/dependencies").status_code == 401
    assert client.get("/api/dashboard/services").status_code == 401


def test_get_missions():
    headers = get_auth_headers()
    response = client.get("/api/missions", headers=headers)
    assert response.status_code == 200
    missions = response.json()
    assert len(missions) >= 3
    mission_names = {m["name"] for m in missions}
    assert "Online Examination" in mission_names
    assert "Research Laboratory" in mission_names
    assert "Emergency Communication" in mission_names


def test_get_assets():
    headers = get_auth_headers()
    response = client.get("/api/assets", headers=headers)
    assert response.status_code == 200
    assets = response.json()
    assert len(assets) >= 5
    asset_names = {a["name"] for a in assets}
    assert "main-grid-power" in asset_names
    assert "core-switch-alpha" in asset_names
    assert "datacenter-hvac-1" in asset_names


def test_get_dependencies():
    headers = get_auth_headers()
    response = client.get("/api/dependencies", headers=headers)
    assert response.status_code == 200
    deps = response.json()
    assert len(deps) >= 10
    # Check that Power -> Core Switch and Core Switch -> Service exist
    sources = {d["source_name"] for d in deps}
    assert "main-grid-power" in sources
    assert "core-switch-alpha" in sources


def test_get_contracts_and_active():
    headers = get_auth_headers()
    # List all contracts
    response = client.get("/api/contracts", headers=headers)
    assert response.status_code == 200
    contracts = response.json()
    assert len(contracts) >= 3

    contract_ids = {c["contract_id"] for c in contracts}
    assert "contract-exam-2026" in contract_ids
    assert "contract-research-lab-2026" in contract_ids
    assert "contract-emergency-comm-2026" in contract_ids

    # List active contracts
    active_resp = client.get("/api/contracts/active", headers=headers)
    assert active_resp.status_code == 200
    active_contracts = active_resp.json()
    assert len(active_contracts) >= 3
    for c in active_contracts:
        assert c["active"] is True
        assert len(c["must_protect"]) > 0
        assert isinstance(c["minimum_thresholds"], dict)


def test_get_single_contract():
    headers = get_auth_headers()
    # Test lookup by string contract_id
    response = client.get("/api/contracts/contract-exam-2026", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["contract_id"] == "contract-exam-2026"
    assert data["mission_activity_name"] == "Online Examination"
    assert "auth-server" in data["must_protect"]
    assert data["minimum_thresholds"]["auth-server"] >= 0.99
    assert "disable_emergency_communication" in data["forbidden_actions"]

    # Test lookup by integer id
    int_id = data["id"]
    response2 = client.get(f"/api/contracts/{int_id}", headers=headers)
    assert response2.status_code == 200
    assert response2.json()["contract_id"] == "contract-exam-2026"


def test_create_and_validate_custom_contract():
    import time
    unique_suffix = int(time.time() * 1000)
    m_name = f"Convocation Ceremony {unique_suffix}"
    c_id = f"contract-convocation-{unique_suffix}"

    headers = get_auth_headers()
    # 1. Create a mission
    m_resp = client.post(
        "/api/missions",
        headers=headers,
        json={
            "name": m_name,
            "description": "Annual university graduation livestream and event security.",
            "active": True,
            "priority": "high",
        },
    )
    assert m_resp.status_code == 200
    mission_id = m_resp.json()["id"]

    # 2. Create a contract for this mission
    c_resp = client.post(
        "/api/contracts",
        headers=headers,
        json={
            "contract_id": c_id,
            "mission_activity_id": mission_id,
            "active": True,
            "must_protect": ["campus-api-gateway", "email-api"],
            "minimum_thresholds": {"campus-api-gateway": 0.95, "email-api": 0.99},
            "degradable_services": ["dorm-iot-hub"],
            "forbidden_actions": ["shutdown_livestream_encoder"],
            "high_impact_requires_approval": True,
            "provenance": "Commencement Committee Directive 2026",
        },
    )
    assert c_resp.status_code == 200
    c_data = c_resp.json()
    assert c_data["contract_id"] == c_id
    assert c_data["mission_activity_name"] == m_name
    assert c_data["high_impact_requires_approval"] is True


def test_idempotent_seeding():
    headers = get_auth_headers()
    # Count before
    c_before = len(client.get("/api/contracts", headers=headers).json())
    m_before = len(client.get("/api/missions", headers=headers).json())
    a_before = len(client.get("/api/assets", headers=headers).json())
    d_before = len(client.get("/api/dependencies", headers=headers).json())

    # Trigger bootstrap again
    orchestrator.bootstrap_services()

    # Count after must remain identical
    c_after = len(client.get("/api/contracts", headers=headers).json())
    m_after = len(client.get("/api/missions", headers=headers).json())
    a_after = len(client.get("/api/assets", headers=headers).json())
    d_after = len(client.get("/api/dependencies", headers=headers).json())

    assert c_after == c_before
    assert m_after == m_before
    assert a_after == a_before
    assert d_after == d_before


def test_existing_sentrycore_endpoints():
    headers = get_auth_headers()
    # Dashboard services
    svc_resp = client.get("/api/dashboard/services", headers=headers)
    assert svc_resp.status_code == 200
    services = svc_resp.json()
    assert len(services) >= 8

    # Dashboard stats
    stats_resp = client.get("/api/dashboard/stats", headers=headers)
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "healthy_services" in stats
    assert "total_services" in stats

    # Simulator services & failure types
    sim_svc = client.get("/api/simulator/services", headers=headers)
    assert sim_svc.status_code == 200
    assert len(sim_svc.json()) >= 8

    ft_resp = client.get("/api/simulator/failure-types", headers=headers)
    assert ft_resp.status_code == 200
    assert "cpu_spike" in ft_resp.json()
