from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import (
    Asset,
    MissionActivity,
    ContinuityContract,
    Dependency,
)
from app.schemas import (
    AssetCreate,
    AssetOut,
    MissionActivityCreate,
    MissionActivityOut,
    ContinuityContractCreate,
    ContinuityContractOut,
    DependencyCreate,
    DependencyOut,
    PowerFailureRequest,
    InfraStateOut,
    ContractFeasibilityOut,
    ContinuityMarginSummaryOut,
    InterventionParamsSchema,
    CounterfactualEvaluationOut,
    RecoveryPlanOut,
    OptimizationResultOut,
    ConflictAnalysisOut,
    DegradationLadderItemOut,
    PlanSafetyCheckOut,
    PlanApprovalRequest,
    PlanApprovalOut,
    ExecutionRequest,
    ExecutionResultOut,
    TelemetryDegradeRequest,
    TelemetryStatusOut,
    ReplayEventOut,
    DecisionProvenanceOut,
    BenchmarkResultsOut,
    ContextSwitchExperimentOut,
)
from app.auth import get_current_user
from app.engine.orchestrator import orchestrator
from app.engine.impact_engine import impact_engine
from app.engine.optimizer import optimizer, counterfactual_evaluator, InterventionParams
from app.engine.governance import safety_gate, governance_service
from app.telemetry.telemetry_manager import telemetry_manager
from app.engine.replay_engine import replay_engine
from app.engine.benchmark_engine import benchmark_engine

router = APIRouter(prefix="/api", tags=["campusguard"], dependencies=[Depends(get_current_user)])


# -----------------------------------------------------------------------------
# Missions
# -----------------------------------------------------------------------------


@router.get("/missions", response_model=List[MissionActivityOut])
def list_missions(active_only: bool = False, db: Session = Depends(get_db)):
    q = db.query(MissionActivity)
    if active_only:
        q = q.filter(MissionActivity.active.is_(True))
    return q.order_by(MissionActivity.name).all()


@router.post("/missions", response_model=MissionActivityOut)
def create_mission(req: MissionActivityCreate, db: Session = Depends(get_db)):
    existing = db.query(MissionActivity).filter(MissionActivity.name == req.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"MissionActivity with name '{req.name}' already exists.")
    mission = MissionActivity(**req.dict())
    db.add(mission)
    db.commit()
    db.refresh(mission)
    return mission


# -----------------------------------------------------------------------------
# Assets
# -----------------------------------------------------------------------------


@router.get("/assets", response_model=List[AssetOut])
def list_assets(db: Session = Depends(get_db)):
    return db.query(Asset).order_by(Asset.name).all()


@router.post("/assets", response_model=AssetOut)
def create_asset(req: AssetCreate, db: Session = Depends(get_db)):
    existing = db.query(Asset).filter(Asset.name == req.name).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset with name '{req.name}' already exists.")
    asset = Asset(**req.dict())
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


# -----------------------------------------------------------------------------
# Dependencies
# -----------------------------------------------------------------------------


@router.get("/dependencies", response_model=List[DependencyOut])
def list_dependencies(db: Session = Depends(get_db)):
    return db.query(Dependency).order_by(Dependency.id).all()


@router.post("/dependencies", response_model=DependencyOut)
def create_dependency(req: DependencyCreate, db: Session = Depends(get_db)):
    dep = Dependency(**req.dict())
    db.add(dep)
    db.commit()
    db.refresh(dep)
    return dep


# -----------------------------------------------------------------------------
# Continuity Contracts
# -----------------------------------------------------------------------------


def _format_contract_out(contract: ContinuityContract) -> ContinuityContractOut:
    mission_name = contract.mission_activity.name if contract.mission_activity else None
    return ContinuityContractOut(
        id=contract.id,
        contract_id=contract.contract_id,
        mission_activity_id=contract.mission_activity_id,
        mission_activity_name=mission_name,
        active=contract.active,
        start_time=contract.start_time,
        end_time=contract.end_time,
        must_protect=contract.must_protect or [],
        minimum_thresholds=contract.minimum_thresholds or {},
        degradable_services=contract.degradable_services or [],
        forbidden_actions=contract.forbidden_actions or [],
        high_impact_requires_approval=contract.high_impact_requires_approval,
        provenance=contract.provenance,
        created_at=contract.created_at,
        updated_at=contract.updated_at,
    )


@router.get("/contracts/active", response_model=List[ContinuityContractOut])
def list_active_contracts(db: Session = Depends(get_db)):
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .order_by(ContinuityContract.id)
        .all()
    )
    return [_format_contract_out(c) for c in contracts]


@router.get("/contracts", response_model=List[ContinuityContractOut])
def list_contracts(active: Optional[bool] = None, db: Session = Depends(get_db)):
    q = db.query(ContinuityContract)
    if active is not None:
        q = q.filter(ContinuityContract.active == active)
    contracts = q.order_by(ContinuityContract.id).all()
    return [_format_contract_out(c) for c in contracts]


@router.get("/contracts/{contract_identifier}", response_model=ContinuityContractOut)
def get_contract(contract_identifier: str, db: Session = Depends(get_db)):
    # Support lookup by integer ID or string contract_id
    contract = None
    if contract_identifier.isdigit():
        contract = db.query(ContinuityContract).get(int(contract_identifier))
    if not contract:
        contract = (
            db.query(ContinuityContract)
            .filter(ContinuityContract.contract_id == contract_identifier)
            .first()
        )
    if not contract:
        raise HTTPException(status_code=404, detail="ContinuityContract not found")
    return _format_contract_out(contract)


@router.post("/contracts", response_model=ContinuityContractOut)
def create_contract(req: ContinuityContractCreate, db: Session = Depends(get_db)):
    existing = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.contract_id == req.contract_id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400, detail=f"ContinuityContract with contract_id '{req.contract_id}' already exists."
        )

    mission = db.query(MissionActivity).get(req.mission_activity_id)
    if not mission:
        raise HTTPException(
            status_code=400, detail=f"MissionActivity with id {req.mission_activity_id} does not exist."
        )

    contract = ContinuityContract(
        contract_id=req.contract_id,
        mission_activity_id=req.mission_activity_id,
        active=req.active,
        start_time=req.start_time,
        end_time=req.end_time,
        must_protect=req.must_protect,
        minimum_thresholds=req.minimum_thresholds,
        degradable_services=req.degradable_services,
        forbidden_actions=req.forbidden_actions,
        high_impact_requires_approval=req.high_impact_requires_approval,
        provenance=req.provenance,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return _format_contract_out(contract)


# =============================================================================
# Phase 3: Infrastructure Power Simulation & Continuity Impact Assessment
# =============================================================================


@router.post("/simulator/power-failure")
def inject_power_failure(req: PowerFailureRequest):
    orchestrator.inject_power_failure(req.drop_percent)
    state = orchestrator.simulator.infra_state
    return {
        "ok": True,
        "message": f"Injected {req.drop_percent:.0f}% power curtailment.",
        "power_capacity": state.power_capacity,
        "network_capacity": state.network_capacity,
        "hvac_capacity": state.hvac_capacity,
        "active_power_drop_pct": state.active_power_drop_pct,
    }


@router.post("/simulator/reset")
def reset_system():
    orchestrator.reset_system()
    state = orchestrator.simulator.infra_state
    return {
        "ok": True,
        "message": "System and infrastructure reset to nominal baseline.",
        "power_capacity": state.power_capacity,
        "network_capacity": state.network_capacity,
        "hvac_capacity": state.hvac_capacity,
        "active_power_drop_pct": state.active_power_drop_pct,
    }


@router.get("/continuity/state", response_model=InfraStateOut)
def get_continuity_state():
    state = orchestrator.simulator.infra_state
    return InfraStateOut(
        power_capacity=state.power_capacity,
        network_capacity=state.network_capacity,
        hvac_capacity=state.hvac_capacity,
        active_power_drop_pct=state.active_power_drop_pct,
        status=state.status,
    )


@router.get("/continuity/impact")
def get_continuity_impact(db: Session = Depends(get_db)):
    state = orchestrator.simulator.infra_state
    return impact_engine.assess_impact(db, state)


@router.get("/continuity/contracts/status", response_model=List[ContractFeasibilityOut])
def get_contracts_status(db: Session = Depends(get_db)):
    state = orchestrator.simulator.infra_state
    evaluations = impact_engine.evaluate_contracts(db, state)
    return [
        ContractFeasibilityOut(
            contract_id=e["contract_id"],
            mission_activity_id=e["mission_activity_id"],
            mission_activity_name=e["mission_activity_name"],
            status=e["status"],
            min_margin=e["min_margin"],
            current_values=e["current_values"],
            required_values=e["required_values"],
            margins=e["margins"],
            must_protect=e["must_protect"],
            degradable_services=e["degradable_services"],
            forbidden_actions=e["forbidden_actions"],
            high_impact_requires_approval=e["high_impact_requires_approval"],
            provenance=e["provenance"],
            affected_dependencies=e["affected_dependencies"],
            evidence=e["evidence"],
        )
        for e in evaluations
    ]


@router.get("/continuity/margin", response_model=ContinuityMarginSummaryOut)
def get_continuity_margin(db: Session = Depends(get_db)):
    state = orchestrator.simulator.infra_state
    evaluations = impact_engine.evaluate_contracts(db, state)

    safe_cnt = sum(1 for e in evaluations if e["status"] == "SAFE")
    at_risk_cnt = sum(1 for e in evaluations if e["status"] == "AT_RISK")
    violated_cnt = sum(1 for e in evaluations if e["status"] == "VIOLATED")

    min_overall_margin = min((e["min_margin"] for e in evaluations), default=1.00)

    if violated_cnt > 0:
        overall_status = "VIOLATED"
    elif at_risk_cnt > 0:
        overall_status = "AT_RISK"
    else:
        overall_status = "SAFE"

    return ContinuityMarginSummaryOut(
        overall_status=overall_status,
        min_overall_margin=min_overall_margin,
        total_active_contracts=len(evaluations),
        safe_contracts=safe_cnt,
        at_risk_contracts=at_risk_cnt,
        violated_contracts=violated_cnt,
        contract_margins=[
            {
                "contract_id": e["contract_id"],
                "mission_activity_name": e["mission_activity_name"],
                "status": e["status"],
                "min_margin": e["min_margin"],
                "margins": e["margins"],
            }
            for e in evaluations
        ],
    )


# =============================================================================
# Phase 4: Institutional Continuity Optimizer (ICO) & Counterfactual Routes
# =============================================================================


@router.post("/continuity/counterfactual", response_model=CounterfactualEvaluationOut)
def post_counterfactual_evaluation(
    req: InterventionParamsSchema, db: Session = Depends(get_db)
):
    """Pure-functional forward state projection. Does NOT mutate live state."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    interv = InterventionParams(
        student_wifi_reduction=req.student_wifi_reduction,
        analytics_shedding=req.analytics_shedding,
        exam_traffic_shift=req.exam_traffic_shift,
        research_compute_reduction=req.research_compute_reduction,
        noncritical_network_reduction=req.noncritical_network_reduction,
    )
    return counterfactual_evaluator.evaluate(state, contracts, interv)


@router.post("/continuity/plans/generate", response_model=List[RecoveryPlanOut])
def post_generate_plans(db: Session = Depends(get_db)):
    """Generates standard candidate strategy plans and evaluates them."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    return optimizer.generate_candidate_plans(state, contracts)


@router.get("/continuity/plans", response_model=List[RecoveryPlanOut])
def get_plans(db: Session = Depends(get_db)):
    """Returns candidate recovery tournament plans for current state."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    return optimizer.generate_candidate_plans(state, contracts)


@router.post("/continuity/optimize", response_model=OptimizationResultOut)
def post_optimize_continuity(db: Session = Depends(get_db)):
    """Performs deterministic constraint search and selects the optimal recovery plan."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    return optimizer.optimize(state, contracts)


@router.get("/continuity/conflicts", response_model=ConflictAnalysisOut)
def get_continuity_conflicts(db: Session = Depends(get_db)):
    """Analyzes resource competition and returns detected contract conflicts."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    return optimizer.detect_conflicts(state, contracts)


@router.get("/continuity/degradation-ladder", response_model=List[DegradationLadderItemOut])
def get_degradation_ladder(db: Session = Depends(get_db)):
    """Dynamically derives the graceful degradation ladder from active contracts."""
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )
    return optimizer.derive_degradation_ladder(contracts)


# =============================================================================
# Phase 5: Safety Gate, Governance Authorization, Execution & Verification Routes
# =============================================================================


@router.post("/continuity/safety-check", response_model=PlanSafetyCheckOut)
def post_safety_check(
    req: Optional[InterventionParamsSchema] = None,
    plan_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Evaluates candidate plan against backend authoritative safety rules."""
    state = orchestrator.simulator.infra_state
    contracts = (
        db.query(ContinuityContract)
        .filter(ContinuityContract.active.is_(True))
        .all()
    )

    if req is not None:
        interv = InterventionParams(
            student_wifi_reduction=req.student_wifi_reduction,
            analytics_shedding=req.analytics_shedding,
            exam_traffic_shift=req.exam_traffic_shift,
            research_compute_reduction=req.research_compute_reduction,
            noncritical_network_reduction=req.noncritical_network_reduction,
        )
        eval_res = counterfactual_evaluator.evaluate(state, contracts, interv)
        plan = {
            "plan_id": plan_id or "plan-custom",
            "name": "Custom Intervention Plan",
            "requires_approval": eval_res["requires_approval"],
            "evaluation": eval_res,
        }
    else:
        opt_res = optimizer.optimize(state, contracts)
        plan = opt_res["selected_plan"]
        raw_interv = plan["evaluation"]["intervention"]
        interv = InterventionParams(**raw_interv)

    return safety_gate.evaluate(plan, contracts, interv)


@router.post("/continuity/approve", response_model=PlanApprovalOut)
def post_approve_plan(req: PlanApprovalRequest):
    """Records an explicit human approval for a candidate recovery plan."""
    return governance_service.approve_plan(
        plan_id=req.plan_id,
        approver=req.approver,
        reason=req.reason or "Authorized by campus operations supervisor",
        parameters=req.parameters,
    )


@router.post("/continuity/reject", response_model=PlanApprovalOut)
def post_reject_plan(req: PlanApprovalRequest):
    """Records an explicit human rejection for a candidate recovery plan."""
    return governance_service.reject_plan(
        plan_id=req.plan_id,
        approver=req.approver,
        reason=req.reason or "Rejected by operator",
    )


@router.post("/continuity/execute", response_model=ExecutionResultOut)
def post_execute_plan(
    req: Optional[ExecutionRequest] = None,
    mode: str = "live",  # dry_run | live
    db: Session = Depends(get_db),
):
    """Executes a governed recovery plan in live or dry-run mode with safety checks."""
    plan_id = req.plan_id if req else "plan-ico-optimal"
    approver = req.approver if req else "admin"
    reason = req.reason if req else None
    override_params = None
    if req and req.override_params:
        override_params = InterventionParams(
            student_wifi_reduction=req.override_params.student_wifi_reduction,
            analytics_shedding=req.override_params.analytics_shedding,
            exam_traffic_shift=req.override_params.exam_traffic_shift,
            research_compute_reduction=req.override_params.research_compute_reduction,
            noncritical_network_reduction=req.override_params.noncritical_network_reduction,
        )

    return governance_service.execute_plan(
        db=db,
        plan_id=plan_id,
        mode=mode,
        approver=approver,
        reason=reason,
        override_params=override_params,
    )


@router.get("/continuity/execution/latest", response_model=Optional[ExecutionResultOut])
def get_latest_execution(db: Session = Depends(get_db)):
    """Returns the most recent continuity execution record."""
    from app.models import ContinuityExecution
    exec_row = (
        db.query(ContinuityExecution)
        .order_by(desc(ContinuityExecution.id))
        .first()
    )
    if not exec_row:
        return None

    state_before_infra = exec_row.state_before.get("infra", exec_row.state_before)
    state_predicted_infra = exec_row.state_predicted.get("infra", exec_row.state_predicted)
    state_after_infra = exec_row.state_after.get("infra", exec_row.state_after)

    return ExecutionResultOut(
        execution_id=exec_row.execution_id,
        plan_id=exec_row.plan_id,
        mode=exec_row.mode,
        executed=exec_row.executed,
        safety_check=PlanSafetyCheckOut(
            status=exec_row.safety_status,
            risk_class="HIGH" if exec_row.safety_status == "APPROVAL_REQUIRED" else "LOW",
            can_execute_directly=(exec_row.safety_status == "SAFE_TO_EXECUTE"),
            requires_approval=(exec_row.safety_status == "APPROVAL_REQUIRED"),
            is_blocked=(exec_row.safety_status == "BLOCKED"),
            blocked_reasons=[],
            approval_reasons=[],
            actions_breakdown=exec_row.actions_executed or [],
            actions_count=len(exec_row.actions_executed or []),
        ),
        approval_status=exec_row.approval_status,
        approver=exec_row.approver,
        intervention={},
        state_before=state_before_infra,
        state_predicted=state_predicted_infra,
        state_after=state_after_infra,
        verification_status=exec_row.verification_status,
        verification_comparison=exec_row.verification_details.get("comparison", []),
        contracts_verification=exec_row.verification_details.get("contracts", []),
        timestamp=exec_row.created_at.isoformat(),
    )


@router.get("/continuity/execution/{execution_id}", response_model=ExecutionResultOut)
def get_execution(execution_id: str, db: Session = Depends(get_db)):
    """Returns execution and verification details by execution ID."""
    from app.models import ContinuityExecution
    exec_row = (
        db.query(ContinuityExecution)
        .filter(ContinuityExecution.execution_id == execution_id)
        .first()
    )
    if not exec_row:
        raise HTTPException(status_code=404, detail=f"Execution '{execution_id}' not found.")

    state_before_infra = exec_row.state_before.get("infra", exec_row.state_before)
    state_predicted_infra = exec_row.state_predicted.get("infra", exec_row.state_predicted)
    state_after_infra = exec_row.state_after.get("infra", exec_row.state_after)

    return ExecutionResultOut(
        execution_id=exec_row.execution_id,
        plan_id=exec_row.plan_id,
        mode=exec_row.mode,
        executed=exec_row.executed,
        safety_check=PlanSafetyCheckOut(
            status=exec_row.safety_status,
            risk_class="HIGH" if exec_row.safety_status == "APPROVAL_REQUIRED" else "LOW",
            can_execute_directly=(exec_row.safety_status == "SAFE_TO_EXECUTE"),
            requires_approval=(exec_row.safety_status == "APPROVAL_REQUIRED"),
            is_blocked=(exec_row.safety_status == "BLOCKED"),
            blocked_reasons=[],
            approval_reasons=[],
            actions_breakdown=exec_row.actions_executed or [],
            actions_count=len(exec_row.actions_executed or []),
        ),
        approval_status=exec_row.approval_status,
        approver=exec_row.approver,
        intervention={},
        state_before=state_before_infra,
        state_predicted=state_predicted_infra,
        state_after=state_after_infra,
        verification_status=exec_row.verification_status,
        verification_comparison=exec_row.verification_details.get("comparison", []),
        contracts_verification=exec_row.verification_details.get("contracts", []),
        timestamp=exec_row.created_at.isoformat(),
    )


# =============================================================================
# Phase 6: Telemetry Observability, Replay, Provenance, Benchmark & Demo Routes
# =============================================================================


@router.get("/telemetry/status", response_model=TelemetryStatusOut)
def get_telemetry_status():
    """Returns real-time telemetry health, confidence score, and observability status."""
    return telemetry_manager.get_status()


@router.post("/telemetry/degrade", response_model=TelemetryStatusOut)
def post_telemetry_degrade(req: TelemetryDegradeRequest):
    """Simulates degraded observability by disconnecting or degrading a specific telemetry feed."""
    telemetry_manager.degrade_source(
        source_id=req.source_id,
        available=req.available,
        quality=req.quality,
        stale=req.stale,
    )
    replay_engine.record_event(
        event_type="TELEMETRY_DEGRADED",
        summary=f"Telemetry feed '{req.source_id}' modified (Available: {req.available}, Quality: {req.quality})",
        payload=req.dict(),
        actor="Fault Injection Operator",
        category="telemetry",
    )
    return telemetry_manager.get_status()


@router.post("/telemetry/reset", response_model=TelemetryStatusOut)
def post_telemetry_reset():
    """Restores all telemetry sources to nominal streaming state."""
    telemetry_manager.reset_telemetry()
    replay_engine.record_event(
        event_type="TELEMETRY_RESTORED",
        summary="All telemetry sources restored to 100% nominal streaming state.",
        payload={},
        actor="Operations Supervisor",
        category="telemetry",
    )
    return telemetry_manager.get_status()


@router.get("/continuity/replay", response_model=List[ReplayEventOut])
def get_replay_timeline(limit: int = 100):
    """Returns the immutable chronological audit timeline of institutional events."""
    return replay_engine.get_timeline(limit=limit)


@router.post("/continuity/replay/clear")
def post_clear_replay():
    """Clears the replay event timeline."""
    replay_engine.clear_timeline()
    return {"ok": True, "message": "Replay timeline cleared."}


@router.get("/continuity/provenance", response_model=DecisionProvenanceOut)
def get_decision_provenance(plan_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Generates structured decision provenance explaining why the recommended recovery plan was selected."""
    return replay_engine.generate_provenance(db=db, plan_id=plan_id)


@router.post("/continuity/benchmark/run", response_model=BenchmarkResultsOut)
def post_run_benchmark(db: Session = Depends(get_db)):
    """Executes the full 30-scenario benchmark suite comparing CampusGuard ICO vs 3 baselines."""
    return benchmark_engine.run_benchmark(db=db)


@router.post("/continuity/benchmark/context-switch", response_model=ContextSwitchExperimentOut)
def post_run_context_switch_experiment(db: Session = Depends(get_db)):
    """Runs the flagship dynamic context-switching experiment under fixed power failure (-30%)."""
    return benchmark_engine.run_context_switch_experiment(db=db)


@router.post("/continuity/demo/reset")
def post_demo_reset(db: Session = Depends(get_db)):
    """Resets simulator, telemetry, and approvals for a clean Competition Demo presentation."""
    orchestrator.simulator.reset_system()
    telemetry_manager.reset_telemetry()
    replay_engine.clear_timeline()
    replay_engine.record_event(
        event_type="DEMO_RESET",
        summary="Competition Demo environment initialized with nominal baseline state.",
        payload={},
        actor="Competition Demo Runner",
        category="demo",
    )
    return {"ok": True, "message": "Competition Demo environment reset successfully."}




