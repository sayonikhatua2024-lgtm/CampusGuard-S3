from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ServiceOut(BaseModel):
    id: int
    name: str
    type: str
    status: str
    is_backup_active: bool

    class Config:
        from_attributes = True


class MetricOut(BaseModel):
    timestamp: datetime
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_latency: float
    api_response_time: float
    error_rate: float
    availability: float
    is_anomaly: bool
    anomaly_score: float

    class Config:
        from_attributes = True


class IncidentOut(BaseModel):
    id: int
    service_id: int
    detected_at: datetime
    resolved_at: Optional[datetime]
    failure_type: Optional[str]
    root_cause: Optional[str]
    severity: str
    status: str
    ai_decision: Optional[str]
    ai_explanation: Optional[str]
    ai_confidence: float
    recovery_action: Optional[str]
    recovery_attempts: int
    recovery_result: Optional[str]
    recovery_time_seconds: Optional[float]
    escalated: bool
    escalation_note: Optional[str]

    class Config:
        from_attributes = True


class AlertOut(BaseModel):
    id: int
    incident_id: Optional[int]
    level: str
    message: str
    created_at: datetime
    acknowledged: bool

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_services: int
    healthy_services: int
    degraded_services: int
    failed_services: int
    active_incidents: int
    total_incidents: int
    recovery_success_rate: float
    average_recovery_time: float
    ai_recovery_actions_taken: int


class SimulateFailureRequest(BaseModel):
    service_name: str
    failure_type: str  # cpu_spike | memory_exhaustion | api_failure | db_connection_failure
                        # | network_latency | service_crash | high_error_rate | container_failure


class OverrideRequest(BaseModel):
    incident_id: int
    action: str  # e.g. "force_resolve", "force_escalate", "retry_recovery"


# =============================================================================
# CampusGuard Schemas
# =============================================================================


class AssetCreate(BaseModel):
    name: str
    asset_type: str
    status: Optional[str] = "operational"
    capacity: Optional[str] = None
    location: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None


class AssetOut(BaseModel):
    id: int
    name: str
    asset_type: str
    status: str
    capacity: Optional[str] = None
    location: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MissionActivityCreate(BaseModel):
    name: str
    description: Optional[str] = None
    active: bool = True
    priority: str = "high"
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None


class MissionActivityOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    active: bool
    priority: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ContinuityContractCreate(BaseModel):
    contract_id: str
    mission_activity_id: int
    active: bool = True
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    must_protect: List[str]
    minimum_thresholds: Dict[str, float]
    degradable_services: List[str] = []
    forbidden_actions: List[str] = []
    high_impact_requires_approval: bool = True
    provenance: Optional[str] = None


class ContinuityContractOut(BaseModel):
    id: int
    contract_id: str
    mission_activity_id: int
    mission_activity_name: Optional[str] = None
    active: bool
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    must_protect: List[str]
    minimum_thresholds: Dict[str, float]
    degradable_services: List[str]
    forbidden_actions: List[str]
    high_impact_requires_approval: bool
    provenance: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DependencyCreate(BaseModel):
    source_type: str
    source_id: Optional[int] = None
    source_name: str
    target_type: str
    target_id: Optional[int] = None
    target_name: str
    dependency_type: str = "requires"
    description: Optional[str] = None


class DependencyOut(BaseModel):
    id: int
    source_type: str
    source_id: Optional[int] = None
    source_name: str
    target_type: str
    target_id: Optional[int] = None
    target_name: str
    dependency_type: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# =============================================================================
# Phase 3: Continuity Impact Assessment & Margin Schemas
# =============================================================================


class PowerFailureRequest(BaseModel):
    drop_percent: float = 30.0


class InfraStateOut(BaseModel):
    power_capacity: float
    network_capacity: float
    hvac_capacity: float
    active_power_drop_pct: float
    status: str


class ContractFeasibilityOut(BaseModel):
    contract_id: str
    mission_activity_id: int
    mission_activity_name: str
    status: str  # SAFE | AT_RISK | VIOLATED
    min_margin: float
    current_values: Dict[str, float]
    required_values: Dict[str, float]
    margins: Dict[str, float]
    must_protect: List[str]
    degradable_services: List[str]
    forbidden_actions: List[str]
    high_impact_requires_approval: bool
    provenance: Optional[str] = None
    affected_dependencies: List[str]
    evidence: str


class ContinuityMarginSummaryOut(BaseModel):
    overall_status: str  # SAFE | AT_RISK | VIOLATED
    min_overall_margin: float
    total_active_contracts: int
    safe_contracts: int
    at_risk_contracts: int
    violated_contracts: int
    contract_margins: List[Dict[str, Any]]


# =============================================================================
# Phase 4: Institutional Continuity Optimizer (ICO) & Counterfactual Schemas
# =============================================================================


class InterventionParamsSchema(BaseModel):
    student_wifi_reduction: float = 0.0          # [0.0, 0.80]
    analytics_shedding: float = 0.0              # [0.0, 1.00]
    exam_traffic_shift: float = 0.0              # [0.0, 1.00]
    research_compute_reduction: float = 0.0      # [0.0, 0.30]
    noncritical_network_reduction: float = 0.0   # [0.0, 0.50]


class CounterfactualEvaluationOut(BaseModel):
    intervention: Dict[str, float]
    projected_infra: Dict[str, Any]
    projected_services: Dict[str, float]
    contracts: List[Dict[str, Any]]
    overall_status: str
    is_feasible: bool
    min_overall_margin: float
    safe_contracts: int
    at_risk_contracts: int
    violated_contracts: int
    intervention_cost: float
    collateral_degradation: float
    risk_score: float
    sacrificed_services: List[str]
    requires_approval: bool
    blocked_constraints: List[str]


class RecoveryPlanOut(BaseModel):
    plan_id: str
    name: str
    description: str
    is_feasible: bool
    overall_status: str
    min_overall_margin: float
    violated_contracts: int
    risk_score: float
    intervention_cost: float
    collateral_degradation: float
    requires_approval: bool
    sacrificed_services: List[str]
    blocked_constraints: List[str]
    evaluation: CounterfactualEvaluationOut


class OptimizationResultOut(BaseModel):
    status: str  # FEASIBLE_OPTIMUM_FOUND | NO_FULLY_FEASIBLE_PLAN
    selected_plan: RecoveryPlanOut
    explanation: str
    binding_constraints: List[str]
    candidate_plans: List[RecoveryPlanOut]
    conflicts: Dict[str, Any]


class ConflictAnalysisOut(BaseModel):
    has_conflict: bool
    conflict_count: int
    conflicts: List[Dict[str, Any]]


class DegradationLadderItemOut(BaseModel):
    tier: int
    service: str
    action: str
    impact_level: str
    rationale: str


# =============================================================================
# Phase 5: Safety Gate, Governance, Execution & Verification Schemas
# =============================================================================


class PlanSafetyCheckOut(BaseModel):
    status: str  # SAFE_TO_EXECUTE | APPROVAL_REQUIRED | BLOCKED
    risk_class: str  # LOW | MEDIUM | HIGH | CRITICAL
    can_execute_directly: bool
    requires_approval: bool
    is_blocked: bool
    blocked_reasons: List[str]
    approval_reasons: List[str]
    actions_breakdown: List[Dict[str, Any]]
    actions_count: int


class PlanApprovalRequest(BaseModel):
    plan_id: str
    approver: str = "admin"
    reason: Optional[str] = "Authorized by campus operations supervisor"
    parameters: Optional[Dict[str, float]] = None


class PlanApprovalOut(BaseModel):
    plan_id: str
    decision: str  # APPROVED | REJECTED
    approver: str
    reason: str
    timestamp: str
    parameters: Optional[Dict[str, float]] = None


class ExecutionRequest(BaseModel):
    plan_id: Optional[str] = None
    approver: str = "admin"
    reason: Optional[str] = None
    override_params: Optional[InterventionParamsSchema] = None


class ExecutionResultOut(BaseModel):
    execution_id: str
    plan_id: str
    mode: str  # dry_run | live
    executed: bool
    safety_check: PlanSafetyCheckOut
    approval_status: str
    approver: Optional[str] = None
    intervention: Dict[str, float]
    state_before: Dict[str, Any]
    state_predicted: Dict[str, Any]
    state_after: Dict[str, Any]
    verification_status: str  # CONTRACT_SATISFIED | CONTRACT_STILL_AT_RISK | CONTRACT_VIOLATED
    verification_comparison: List[Dict[str, Any]]
    contracts_verification: List[Dict[str, Any]]
    timestamp: str


# =============================================================================
# Phase 6: Telemetry Health, Replay, Provenance & Benchmark Schemas
# =============================================================================


class TelemetryDegradeRequest(BaseModel):
    source_id: str
    available: bool = False
    quality: float = 1.0
    stale: bool = False


class TelemetryStatusOut(BaseModel):
    confidence_score: float
    confidence_level: str  # HIGH | MEDIUM | LOW
    is_degraded: bool
    sources: List[Dict[str, Any]]
    missing_sources: List[str]
    stale_sources: List[str]
    autonomy_restriction: str
    specific_restrictions: List[str]
    reason: str
    timestamp: str


class ReplayEventOut(BaseModel):
    event_id: str
    timestamp: str
    event_type: str
    summary: str
    actor: str
    object_id: str
    category: str
    payload: Dict[str, Any]


class DecisionProvenanceOut(BaseModel):
    provenance_id: str
    timestamp: str
    query: str
    selected_plan: Dict[str, Any]
    selection_rationale: str
    telemetry_confidence: Dict[str, Any]
    active_missions: List[Dict[str, Any]]
    active_contracts: List[Dict[str, Any]]
    objective_breakdown: Dict[str, Any]
    binding_constraints: List[str]
    candidate_plans_comparison: List[Dict[str, Any]]
    governance_trail: Optional[Dict[str, Any]] = None


class BenchmarkResultsOut(BaseModel):
    total_scenarios: int
    categories: List[str]
    comparative_summary: Dict[str, Any]
    scenarios: List[Dict[str, Any]]


class ContextSwitchExperimentOut(BaseModel):
    experiment: str
    fixed_failure: str
    scenario_a: Dict[str, Any]
    scenario_b: Dict[str, Any]
    scenario_c: Dict[str, Any]
    provenance_differential: Dict[str, Any]





