import enum
from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum, Boolean, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


class ServiceType(str, enum.Enum):
    SERVER = "server"
    DATABASE = "database"
    API = "api"
    NETWORK = "network"
    CCTV = "cctv"
    IOT = "iot"
    CLOUD_APP = "cloud_app"


class ServiceStatus(str, enum.Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    FAILED = "failed"
    RECOVERING = "recovering"


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    type = Column(Enum(ServiceType), nullable=False)
    status = Column(Enum(ServiceStatus), default=ServiceStatus.HEALTHY, nullable=False)
    is_backup_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    metrics = relationship("Metric", back_populates="service", cascade="all,delete")
    incidents = relationship("Incident", back_populates="service", cascade="all,delete")


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    cpu_usage = Column(Float)          # %
    memory_usage = Column(Float)       # %
    disk_usage = Column(Float)         # %
    network_latency = Column(Float)    # ms
    api_response_time = Column(Float)  # ms
    error_rate = Column(Float)         # %
    availability = Column(Float)       # % (100 = fully up)

    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, default=0.0)

    service = relationship("Service", back_populates="metrics")


class IncidentSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IncidentStatus(str, enum.Enum):
    DETECTED = "detected"
    DIAGNOSING = "diagnosing"
    RECOVERING = "recovering"
    RESOLVED = "resolved"
    ESCALATED = "escalated"


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)

    detected_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    failure_type = Column(String(80))          # e.g. cpu_spike, api_failure
    root_cause = Column(Text)
    severity = Column(Enum(IncidentSeverity), default=IncidentSeverity.MEDIUM)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.DETECTED)

    ai_decision = Column(String(120))          # chosen recovery action
    ai_explanation = Column(Text)               # reasoning text
    ai_confidence = Column(Float, default=0.0)

    recovery_action = Column(String(120), nullable=True)
    recovery_attempts = Column(Integer, default=0)
    recovery_result = Column(String(40), nullable=True)  # success / failed
    recovery_time_seconds = Column(Float, nullable=True)

    escalated = Column(Boolean, default=False)
    escalation_note = Column(Text, nullable=True)

    service = relationship("Service", back_populates="incidents")


class AlertLevel(str, enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    level = Column(Enum(AlertLevel), default=AlertLevel.INFO)
    message = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    acknowledged = Column(Boolean, default=False)


# =============================================================================
# CampusGuard Institutional Continuity Layer Models
# =============================================================================


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    asset_type = Column(String(80), nullable=False)  # power, hvac, network_switch, server
    status = Column(String(50), default="operational", nullable=False)  # operational, degraded, offline
    capacity = Column(String(80), nullable=True)
    location = Column(String(120), nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class MissionActivity(Base):
    __tablename__ = "mission_activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    priority = Column(String(50), default="high", nullable=False)  # critical, high, medium
    
    # Phase 5: Mission utility & recoverability metadata
    population_impact = Column(Float, default=0.5, nullable=False)
    time_criticality = Column(Float, default=0.5, nullable=False)
    recoverability = Column(Float, default=0.5, nullable=False)
    safety_criticality = Column(Float, default=0.1, nullable=False)
    mission_utility = Column(Float, default=50.0, nullable=False)

    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contracts = relationship("ContinuityContract", back_populates="mission_activity", cascade="all,delete")


class ContinuityContract(Base):
    __tablename__ = "continuity_contracts"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String(100), unique=True, nullable=False, index=True)
    mission_activity_id = Column(Integer, ForeignKey("mission_activities.id"), nullable=False)
    active = Column(Boolean, default=True, nullable=False)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)

    must_protect = Column(JSON, nullable=False)           # list of required services
    minimum_thresholds = Column(JSON, nullable=False)     # service_name -> min threshold
    degradable_services = Column(JSON, nullable=False)    # list of services allowed to shed
    forbidden_actions = Column(JSON, nullable=False)      # list of forbidden mitigation actions
    high_impact_requires_approval = Column(Boolean, default=True, nullable=False)
    provenance = Column(String(255), nullable=True)       # e.g. "Academic Senate Policy 2026-A"

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    mission_activity = relationship("MissionActivity", back_populates="contracts")


class Dependency(Base):
    __tablename__ = "dependencies"

    id = Column(Integer, primary_key=True, index=True)
    source_type = Column(String(50), nullable=False)  # asset | service | mission_activity
    source_id = Column(Integer, nullable=True)
    source_name = Column(String(120), nullable=False)
    target_type = Column(String(50), nullable=False)  # asset | service | mission_activity
    target_id = Column(Integer, nullable=True)
    target_name = Column(String(120), nullable=False)
    dependency_type = Column(String(50), default="requires", nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContinuityExecution(Base):
    __tablename__ = "continuity_executions"

    id = Column(Integer, primary_key=True, index=True)
    execution_id = Column(String(100), unique=True, nullable=False, index=True)
    plan_id = Column(String(100), nullable=False)
    mode = Column(String(50), default="live", nullable=False)  # dry_run | live
    approval_status = Column(String(50), default="PENDING", nullable=False)  # PENDING | APPROVED | REJECTED | NOT_REQUIRED
    approver = Column(String(100), nullable=True)
    approval_reason = Column(Text, nullable=True)
    safety_status = Column(String(50), nullable=False)  # SAFE_TO_EXECUTE | APPROVAL_REQUIRED | BLOCKED
    executed = Column(Boolean, default=False, nullable=False)
    actions_executed = Column(JSON, nullable=False)
    state_before = Column(JSON, nullable=False)
    state_predicted = Column(JSON, nullable=False)
    state_after = Column(JSON, nullable=False)
    verification_status = Column(String(50), nullable=False)  # CONTRACT_SATISFIED | CONTRACT_STILL_AT_RISK | CONTRACT_VIOLATED
    verification_details = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


