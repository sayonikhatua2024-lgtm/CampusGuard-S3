import time
from datetime import datetime

from sqlalchemy.orm import Session

from app.config import MAX_RECOVERY_ATTEMPTS
from app.database import SessionLocal
from app.models import (
    Service, Metric, Incident, Alert,
    ServiceStatus, IncidentStatus, IncidentSeverity, AlertLevel,
    Asset, MissionActivity, ContinuityContract, Dependency,
)
from app.telemetry.simulator import TelemetrySimulator
from app.ml.anomaly_detector import PerServiceAnomalyDetector
from app.engine import root_cause, decision_engine, recovery_actions, verifier

SEVERITY_BY_FAILURE = {
    "service_crash": IncidentSeverity.CRITICAL,
    "db_connection_failure": IncidentSeverity.CRITICAL,
    "api_failure": IncidentSeverity.HIGH,
    "container_failure": IncidentSeverity.HIGH,
    "memory_exhaustion": IncidentSeverity.HIGH,
    "cpu_spike": IncidentSeverity.MEDIUM,
    "network_latency": IncidentSeverity.MEDIUM,
    "high_error_rate": IncidentSeverity.MEDIUM,
    "unknown_anomaly": IncidentSeverity.LOW,
}

DEFAULT_SERVICES = [
    ("campus-api-gateway", "api"),
    ("student-portal-db", "database"),
    ("lms-cloud-app", "cloud_app"),
    ("core-network-switch", "network"),
    ("library-cctv-service", "cctv"),
    ("dorm-iot-hub", "iot"),
    ("auth-server", "server"),
    ("email-api", "api"),
]

DEFAULT_ASSETS = [
    {
        "name": "main-grid-power",
        "asset_type": "power",
        "status": "operational",
        "capacity": "1000 kVA",
        "location": "Substation Alpha",
        "metadata_json": {"grid_feed": "Feed-A", "redundancy": "N+1"},
    },
    {
        "name": "backup-diesel-generator",
        "asset_type": "power",
        "status": "operational",
        "capacity": "500 kVA",
        "location": "Substation Generator Yard",
        "metadata_json": {"fuel_pct": 98.5, "autostart": True},
    },
    {
        "name": "datacenter-hvac-1",
        "asset_type": "hvac",
        "status": "operational",
        "capacity": "50 Tons CRAC",
        "location": "Data Center North Hall",
        "metadata_json": {"temp_celsius": 19.5, "humidity_pct": 45},
    },
    {
        "name": "core-switch-alpha",
        "asset_type": "network_switch",
        "status": "operational",
        "capacity": "100 Gbps Fabric",
        "location": "Core NOC Rack 4",
        "metadata_json": {"mgmt_ip": "10.0.0.1", "ports_total": 48},
    },
    {
        "name": "compute-rack-01",
        "asset_type": "server",
        "status": "operational",
        "capacity": "64 Nodes / 1024 Cores",
        "location": "Data Center Pod 1",
        "metadata_json": {"ram_total_gb": 4096, "storage_tb": 250},
    },
]

DEFAULT_MISSIONS = [
    {
        "name": "Online Examination",
        "description": "University-wide high-stakes digital examinations, student verification, and testing portals.",
        "active": True,
        "priority": "critical",
        "population_impact": 0.85,
        "time_criticality": 0.95,
        "recoverability": 0.30,
        "safety_criticality": 0.10,
        "mission_utility": 85.0,
    },
    {
        "name": "Research Laboratory",
        "description": "High-performance computational experiments, environmental monitoring chambers, and cryogenic storage.",
        "active": True,
        "priority": "high",
        "population_impact": 0.40,
        "time_criticality": 0.70,
        "recoverability": 0.10,
        "safety_criticality": 0.30,
        "mission_utility": 90.0,
    },
    {
        "name": "Emergency Communication",
        "description": "Campus safety dispatch, 911 relay, emergency broadcasts, sirens, and campus alerts.",
        "active": True,
        "priority": "critical",
        "population_impact": 1.00,
        "time_criticality": 1.00,
        "recoverability": 0.05,
        "safety_criticality": 1.00,
        "mission_utility": 100.0,
    },
]

DEFAULT_DEPENDENCIES = [
    # Asset -> Asset
    {
        "source_type": "asset", "source_name": "main-grid-power",
        "target_type": "asset", "target_name": "core-switch-alpha",
        "dependency_type": "powers", "description": "Main Grid Power energizes Core Switch Alpha",
    },
    {
        "source_type": "asset", "source_name": "main-grid-power",
        "target_type": "asset", "target_name": "datacenter-hvac-1",
        "dependency_type": "powers", "description": "Main Grid Power energizes Data Center HVAC",
    },
    {
        "source_type": "asset", "source_name": "main-grid-power",
        "target_type": "asset", "target_name": "compute-rack-01",
        "dependency_type": "powers", "description": "Main Grid Power energizes Compute Rack 01",
    },
    # Asset -> Service
    {
        "source_type": "asset", "source_name": "core-switch-alpha",
        "target_type": "service", "target_name": "core-network-switch",
        "dependency_type": "hosts", "description": "Core Switch Alpha hardware hosts Core Network Switch service",
    },
    {
        "source_type": "asset", "source_name": "compute-rack-01",
        "target_type": "service", "target_name": "lms-cloud-app",
        "dependency_type": "hosts", "description": "Compute Rack 01 hosts LMS Cloud App containers",
    },
    # Service -> Service
    {
        "source_type": "service", "source_name": "core-network-switch",
        "target_type": "service", "target_name": "auth-server",
        "dependency_type": "routes", "description": "Core Network Switch routes auth traffic to Auth Server",
    },
    {
        "source_type": "service", "source_name": "auth-server",
        "target_type": "service", "target_name": "campus-api-gateway",
        "dependency_type": "authenticates", "description": "Auth Server validates tokens for Campus API Gateway",
    },
    {
        "source_type": "service", "source_name": "core-network-switch",
        "target_type": "service", "target_name": "email-api",
        "dependency_type": "routes", "description": "Core Network Switch routes outbound notification packets",
    },
    # Service / Asset -> MissionActivity
    {
        "source_type": "service", "source_name": "campus-api-gateway",
        "target_type": "mission_activity", "target_name": "Online Examination",
        "dependency_type": "delivers", "description": "API Gateway delivers exam submissions & validation",
    },
    {
        "source_type": "asset", "source_name": "datacenter-hvac-1",
        "target_type": "mission_activity", "target_name": "Research Laboratory",
        "dependency_type": "regulates", "description": "HVAC regulates temperature for research lab servers",
    },
    {
        "source_type": "service", "source_name": "lms-cloud-app",
        "target_type": "mission_activity", "target_name": "Research Laboratory",
        "dependency_type": "executes", "description": "LMS & Cloud App executes scientific workflows",
    },
    {
        "source_type": "service", "source_name": "core-network-switch",
        "target_type": "mission_activity", "target_name": "Emergency Communication",
        "dependency_type": "transmits", "description": "Network transmits life-safety emergency alerts",
    },
    {
        "source_type": "service", "source_name": "email-api",
        "target_type": "mission_activity", "target_name": "Emergency Communication",
        "dependency_type": "broadcasts", "description": "Email API broadcasts urgent campus safety notices",
    },
]

DEFAULT_CONTRACTS = [
    {
        "contract_id": "contract-exam-2026",
        "mission_name": "Online Examination",
        "active": True,
        "must_protect": ["auth-server", "campus-api-gateway", "core-network-switch", "email-api"],
        "minimum_thresholds": {
            "auth-server": 0.99,
            "campus-api-gateway": 0.90,
            "core-network-switch": 0.80,
            "email-api": 1.00,
        },
        "degradable_services": ["student_wifi", "background_analytics", "dorm-iot-hub"],
        "forbidden_actions": ["disable_emergency_communication", "isolate_auth_network"],
        "high_impact_requires_approval": True,
        "provenance": "Academic Senate Examination Continuity Policy 2026-A",
    },
    {
        "contract_id": "contract-research-lab-2026",
        "mission_name": "Research Laboratory",
        "active": True,
        "must_protect": ["student-portal-db", "lms-cloud-app", "datacenter-hvac-1"],
        "minimum_thresholds": {
            "compute": 0.70,
            "environmental_control": 0.90,
            "student-portal-db": 0.70,
        },
        "degradable_services": ["library-cctv-service", "dorm-iot-hub"],
        "forbidden_actions": ["power_cycle_cryo_storage", "disable_datacenter_cooling"],
        "high_impact_requires_approval": True,
        "provenance": "Campus Research Facilities Continuity Protocol 2026",
    },
    {
        "contract_id": "contract-emergency-comm-2026",
        "mission_name": "Emergency Communication",
        "active": True,
        "must_protect": ["core-network-switch", "email-api", "auth-server"],
        "minimum_thresholds": {
            "availability": 1.00,
            "core-network-switch": 1.00,
            "email-api": 1.00,
        },
        "degradable_services": [],
        "forbidden_actions": ["disable", "isolate", "disable_emergency_communication", "power_down_switch"],
        "high_impact_requires_approval": True,
        "provenance": "Campus Safety & Emergency Operations Directive",
    },
]


class Orchestrator:
    def __init__(self):
        self.simulator = TelemetrySimulator()
        self.detector = PerServiceAnomalyDetector()

    def bootstrap_services(self):
        db = SessionLocal()
        try:
            # 1. Services
            for name, stype in DEFAULT_SERVICES:
                self.simulator.register_service(name)
                existing = db.query(Service).filter(Service.name == name).first()
                if not existing:
                    db.add(Service(name=name, type=stype, status=ServiceStatus.HEALTHY))
            db.commit()

            # 2. Assets
            for asset_data in DEFAULT_ASSETS:
                existing = db.query(Asset).filter(Asset.name == asset_data["name"]).first()
                if not existing:
                    db.add(Asset(**asset_data))
            db.commit()

            # 3. Mission Activities
            mission_map = {}
            for mission_data in DEFAULT_MISSIONS:
                existing = db.query(MissionActivity).filter(MissionActivity.name == mission_data["name"]).first()
                if not existing:
                    m = MissionActivity(**mission_data)
                    db.add(m)
                    db.flush()
                    mission_map[m.name] = m.id
                else:
                    mission_map[existing.name] = existing.id
            db.commit()

            # 4. Continuity Contracts
            for contract_data in DEFAULT_CONTRACTS:
                existing = (
                    db.query(ContinuityContract)
                    .filter(ContinuityContract.contract_id == contract_data["contract_id"])
                    .first()
                )
                if not existing:
                    m_id = mission_map.get(contract_data["mission_name"])
                    if m_id:
                        db.add(
                            ContinuityContract(
                                contract_id=contract_data["contract_id"],
                                mission_activity_id=m_id,
                                active=contract_data["active"],
                                must_protect=contract_data["must_protect"],
                                minimum_thresholds=contract_data["minimum_thresholds"],
                                degradable_services=contract_data["degradable_services"],
                                forbidden_actions=contract_data["forbidden_actions"],
                                high_impact_requires_approval=contract_data["high_impact_requires_approval"],
                                provenance=contract_data["provenance"],
                            )
                        )
            db.commit()

            # 5. Dependencies
            for dep_data in DEFAULT_DEPENDENCIES:
                existing = (
                    db.query(Dependency)
                    .filter(
                        Dependency.source_name == dep_data["source_name"],
                        Dependency.target_name == dep_data["target_name"],
                    )
                    .first()
                )
                if not existing:
                    db.add(Dependency(**dep_data))
            db.commit()

        finally:
            db.close()

    # ---------------------------------------------------------------- public API
    def inject_failure(self, service_name: str, failure_type: str):
        self.simulator.inject_failure(service_name, failure_type)

    def inject_power_failure(self, drop_pct: float = 30.0):
        self.simulator.inject_power_failure(drop_pct)

    def reset_system(self):
        self.simulator.reset_system()

    def tick(self):
        db = SessionLocal()
        try:
            readings = self.simulator.tick()
            for service_name, reading in readings.items():
                self._process_service(db, service_name, reading)
            db.commit()
        finally:
            db.close()

    # ------------------------------------------------------------- core pipeline
    def _process_service(self, db: Session, service_name: str, reading: dict):
        service = db.query(Service).filter(Service.name == service_name).first()
        if not service:
            return

        detection = self.detector.observe(service_name, reading)

        metric = Metric(
            service_id=service.id,
            timestamp=datetime.utcnow(),
            is_anomaly=detection["is_anomaly"],
            anomaly_score=detection["anomaly_score"],
            **reading,
        )
        db.add(metric)

        open_incident = (
            db.query(Incident)
            .filter(
                Incident.service_id == service.id,
                Incident.status.in_([
                    IncidentStatus.DETECTED, IncidentStatus.DIAGNOSING, IncidentStatus.RECOVERING
                ]),
            )
            .order_by(Incident.id.desc())
            .first()
        )

        if open_incident:
            self._handle_open_incident(db, service, open_incident, reading, detection)
        elif detection["is_anomaly"]:
            self._open_new_incident(db, service, reading)
        else:
            service.status = ServiceStatus.HEALTHY

    def _open_new_incident(self, db: Session, service: Service, reading: dict):
        rca = root_cause.analyze(service.name, service.type.value, reading)
        decision = decision_engine.decide(service.name, rca["failure_type"], rca["root_cause"], attempt=1)

        severity = SEVERITY_BY_FAILURE.get(rca["failure_type"], IncidentSeverity.MEDIUM)

        incident = Incident(
            service_id=service.id,
            detected_at=datetime.utcnow(),
            failure_type=rca["failure_type"],
            root_cause=rca["root_cause"],
            severity=severity,
            status=IncidentStatus.RECOVERING,
            ai_decision=decision["action"],
            ai_explanation=decision["explanation"],
            ai_confidence=decision["confidence"],
            recovery_action=decision["action"],
            recovery_attempts=1,
        )
        db.add(incident)
        db.flush()  # get incident.id

        result = recovery_actions.execute(self.simulator, service.name, decision["action"])

        service.status = ServiceStatus.RECOVERING

        db.add(Alert(
            incident_id=incident.id,
            level=AlertLevel.CRITICAL if severity in (IncidentSeverity.HIGH, IncidentSeverity.CRITICAL) else AlertLevel.WARNING,
            message=f"[{severity.value.upper()}] {service.name}: {rca['failure_type']} detected. "
                    f"AI chose '{decision['action']}' (confidence {decision['confidence']}).",
        ))

    def _handle_open_incident(
        self, db: Session, service: Service, incident: Incident, reading: dict, detection: dict
    ):
        healthy = verifier.verify(reading)

        if healthy:
            incident.status = IncidentStatus.RESOLVED
            incident.resolved_at = datetime.utcnow()
            incident.recovery_result = "success"
            incident.recovery_time_seconds = (
                incident.resolved_at - incident.detected_at
            ).total_seconds()
            service.status = ServiceStatus.HEALTHY
            db.add(Alert(
                incident_id=incident.id,
                level=AlertLevel.INFO,
                message=f"RESOLVED: {service.name} recovered via '{incident.recovery_action}' "
                        f"in {incident.recovery_time_seconds:.1f}s.",
            ))
            return

        # still unhealthy -- if failure is still actively injected/detected, consider retry/escalate
        if not detection["is_anomaly"]:
            # transient dip while trending back to baseline; keep waiting
            return

        if incident.recovery_attempts >= MAX_RECOVERY_ATTEMPTS:
            incident.status = IncidentStatus.ESCALATED
            incident.escalated = True
            incident.recovery_result = "failed"
            incident.escalation_note = (
                f"Automated recovery failed after {incident.recovery_attempts} attempt(s) "
                f"using action(s) up to '{incident.recovery_action}'. Escalated to campus "
                f"administrator for manual intervention."
            )
            service.status = ServiceStatus.FAILED
            db.add(Alert(
                incident_id=incident.id,
                level=AlertLevel.CRITICAL,
                message=f"ESCALATED: {service.name} could not self-heal after "
                        f"{incident.recovery_attempts} attempts. Manual intervention required.",
            ))
            return

        # retry with next attempt
        incident.recovery_attempts += 1
        decision = decision_engine.decide(
            service.name, incident.failure_type, incident.root_cause, attempt=incident.recovery_attempts
        )
        incident.ai_decision = decision["action"]
        incident.ai_explanation = decision["explanation"]
        incident.ai_confidence = decision["confidence"]
        incident.recovery_action = decision["action"]

        recovery_actions.execute(self.simulator, service.name, decision["action"])
        db.add(Alert(
            incident_id=incident.id,
            level=AlertLevel.WARNING,
            message=f"RETRY: {service.name} recovery attempt {incident.recovery_attempts} "
                    f"using '{decision['action']}'.",
        ))


orchestrator = Orchestrator()
