"""CampusGuard Safety Gate, Governance Authorization, Controlled Execution & Verification Engine.

Enforces deterministic backend-authoritative safety checks, human approval gating,
dry-run preview, controlled simulated execution, and post-action contract verification.
"""

import uuid
from datetime import datetime
from dataclasses import asdict
from typing import Dict, List, Any, Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models import ContinuityContract, MissionActivity, ContinuityExecution, Service, Asset
from app.engine.optimizer import (
    optimizer,
    counterfactual_evaluator,
    InterventionParams,
)
from app.engine.orchestrator import orchestrator
from app.telemetry.telemetry_manager import telemetry_manager
from app.engine.replay_engine import replay_engine


ACTION_RISK_REGISTRY = {
    "analytics_shedding": {
        "name": "Suspend Background Analytics & Telemetry",
        "risk": "LOW",
        "reversible": True,
        "rollback_action": "resume_background_analytics",
        "description": "Suspends non-critical telemetry pipelines to free switch buffers and CPU.",
    },
    "student_wifi_reduction": {
        "name": "Rate-Limit Student Campus Wi-Fi",
        "risk": "MEDIUM",
        "reversible": True,
        "rollback_action": "restore_student_wifi_bandwidth",
        "description": "Throttles recreational campus Wi-Fi bandwidth. Recoverable student inconvenience.",
    },
    "noncritical_network_reduction": {
        "name": "Rate-Limit Dorm IoT & Campus CCTV Telemetry",
        "risk": "MEDIUM",
        "reversible": True,
        "rollback_action": "restore_dorm_iot_telemetry",
        "description": "Restricts low-priority sensor traffic to protect high-priority switch queues.",
    },
    "exam_traffic_shift": {
        "name": "Apply QoS Route Priority for Online Examination Portals",
        "risk": "HIGH",
        "reversible": True,
        "rollback_action": "reset_network_switch_qos",
        "description": "Modifies core switch hardware queues to prioritize auth & exam API traffic.",
    },
    "research_compute_reduction": {
        "name": "Throttle High-Performance Research Compute Cluster",
        "risk": "HIGH",
        "reversible": True,
        "rollback_action": "restore_research_hpc_compute_allocation",
        "description": "Thermal relief shed: throttles research compute by 20-30% to restore datacenter HVAC cooling margin.",
    },
    "disable_emergency_communication": {
        "name": "Disable Emergency Dispatch & Broadcast Channel",
        "risk": "CRITICAL",
        "reversible": False,
        "rollback_action": None,
        "description": "FORBIDDEN: Life safety emergency channels cannot be disabled.",
    },
    "isolate_auth_network": {
        "name": "Isolate Authentication Network VLAN",
        "risk": "CRITICAL",
        "reversible": False,
        "rollback_action": None,
        "description": "FORBIDDEN: Policy prohibits network isolation during active examination periods.",
    },
}


class SafetyGate:
    """Authoritative backend safety validation engine."""

    @staticmethod
    def evaluate(
        plan: Dict[str, Any],
        contracts: List[ContinuityContract],
        interv: Optional[InterventionParams] = None,
    ) -> Dict[str, Any]:
        """Evaluates proposed plan against contract forbidden actions and risk policy."""
        if interv is None:
            raw_interv = plan.get("evaluation", {}).get("intervention", {})
            interv = InterventionParams(
                student_wifi_reduction=raw_interv.get("student_wifi_reduction", 0.0),
                analytics_shedding=raw_interv.get("analytics_shedding", 0.0),
                exam_traffic_shift=raw_interv.get("exam_traffic_shift", 0.0),
                research_compute_reduction=raw_interv.get("research_compute_reduction", 0.0),
                noncritical_network_reduction=raw_interv.get("noncritical_network_reduction", 0.0),
            )

        # Collect all active forbidden actions
        all_forbidden_actions = set()
        for c in contracts:
            for fa in c.forbidden_actions or []:
                all_forbidden_actions.add(fa.lower())

        blocked_reasons = []
        approval_reasons = []
        actions_breakdown = []
        highest_risk = "LOW"

        # 1. Evaluate individual actions
        if interv.analytics_shedding > 0:
            reg = ACTION_RISK_REGISTRY["analytics_shedding"]
            actions_breakdown.append({
                "action_key": "analytics_shedding",
                "name": reg["name"],
                "parameter": f"{interv.analytics_shedding*100:.0f}% shedding",
                "risk": reg["risk"],
                "reversible": reg["reversible"],
                "rollback_action": reg["rollback_action"],
                "description": reg["description"],
            })

        if interv.student_wifi_reduction > 0:
            reg = ACTION_RISK_REGISTRY["student_wifi_reduction"]
            risk = "HIGH" if interv.student_wifi_reduction > 0.50 else "MEDIUM"
            if risk == "HIGH":
                highest_risk = "HIGH"
                approval_reasons.append(f"Student Wi-Fi reduction exceeds 50% ({interv.student_wifi_reduction*100:.0f}%)")
            elif highest_risk != "HIGH":
                highest_risk = "MEDIUM"

            actions_breakdown.append({
                "action_key": "student_wifi_reduction",
                "name": reg["name"],
                "parameter": f"{interv.student_wifi_reduction*100:.0f}% reduction",
                "risk": risk,
                "reversible": reg["reversible"],
                "rollback_action": reg["rollback_action"],
                "description": reg["description"],
            })

        if interv.noncritical_network_reduction > 0:
            reg = ACTION_RISK_REGISTRY["noncritical_network_reduction"]
            if highest_risk == "LOW":
                highest_risk = "MEDIUM"
            actions_breakdown.append({
                "action_key": "noncritical_network_reduction",
                "name": reg["name"],
                "parameter": f"{interv.noncritical_network_reduction*100:.0f}% reduction",
                "risk": reg["risk"],
                "reversible": reg["reversible"],
                "rollback_action": reg["rollback_action"],
                "description": reg["description"],
            })

        if interv.exam_traffic_shift > 0:
            reg = ACTION_RISK_REGISTRY["exam_traffic_shift"]
            highest_risk = "HIGH"
            approval_reasons.append(f"Modifies core switch hardware QoS queue allocation ({interv.exam_traffic_shift*100:.0f}%)")
            actions_breakdown.append({
                "action_key": "exam_traffic_shift",
                "name": reg["name"],
                "parameter": f"{interv.exam_traffic_shift*100:.0f}% QoS shift",
                "risk": reg["risk"],
                "reversible": reg["reversible"],
                "rollback_action": reg["rollback_action"],
                "description": reg["description"],
            })

        if interv.research_compute_reduction > 0:
            reg = ACTION_RISK_REGISTRY["research_compute_reduction"]
            highest_risk = "HIGH"
            approval_reasons.append(f"Throttles active academic research compute workloads by {interv.research_compute_reduction*100:.0f}%")
            actions_breakdown.append({
                "action_key": "research_compute_reduction",
                "name": reg["name"],
                "parameter": f"{interv.research_compute_reduction*100:.0f}% throttling",
                "risk": reg["risk"],
                "reversible": reg["reversible"],
                "rollback_action": reg["rollback_action"],
                "description": reg["description"],
            })

        # 2. Check for explicit forbidden actions
        plan_str = (plan.get("name", "") + " " + plan.get("plan_id", "")).lower()
        if (
            "disable_emergency" in plan_str
            or "disable emergency" in plan_str
            or "kill_emergency" in plan_str
            or "kill-emergency" in plan_str
            or "isolate_auth" in plan_str
            or "isolate auth" in plan_str
        ):
            highest_risk = "CRITICAL"
            blocked_reasons.append("Plan attempts forbidden life-safety or authentication isolation action.")

        # 3. Check Observability & Degraded Telemetry Constraints
        telemetry_status = telemetry_manager.get_status()
        if telemetry_status["is_degraded"]:
            if telemetry_status["confidence_level"] == "LOW":
                if highest_risk == "LOW":
                    highest_risk = "MEDIUM"
                approval_reasons.append("Degraded Observability (LOW Confidence): Operating with missing telemetry. All autonomous actions restricted.")
            elif telemetry_status["confidence_level"] == "MEDIUM":
                if interv.research_compute_reduction > 0 and not telemetry_manager.sources["telemetry_hvac"].available:
                    approval_reasons.append("CRAC Thermal Telemetry Offline: HVAC thermal mitigation requires supervisor sign-off.")

        # Determine Safety Status
        if blocked_reasons:
            status = "BLOCKED"
        elif highest_risk in ("HIGH", "CRITICAL") or approval_reasons or plan.get("requires_approval", False):
            status = "APPROVAL_REQUIRED"
        else:
            status = "SAFE_TO_EXECUTE"

        # Log safety evaluation event into Replay Timeline
        replay_engine.record_event(
            event_type="SAFETY_GATE_EVALUATED",
            summary=f"Safety Gate evaluated plan '{plan.get('name', 'Plan')}': {status} (Risk: {highest_risk})",
            payload={
                "plan_id": plan.get("plan_id"),
                "status": status,
                "risk_class": highest_risk,
                "approval_reasons": approval_reasons,
                "blocked_reasons": blocked_reasons,
                "telemetry_confidence": telemetry_status["confidence_score"],
            },
            actor="Safety Gate Validator",
            category="safety",
        )

        return {
            "status": status,  # SAFE_TO_EXECUTE | APPROVAL_REQUIRED | BLOCKED
            "risk_class": highest_risk,
            "can_execute_directly": (status == "SAFE_TO_EXECUTE"),
            "requires_approval": (status == "APPROVAL_REQUIRED"),
            "is_blocked": (status == "BLOCKED"),
            "blocked_reasons": blocked_reasons,
            "approval_reasons": approval_reasons,
            "actions_breakdown": actions_breakdown,
            "actions_count": len(actions_breakdown),
            "telemetry_confidence": telemetry_status["confidence_score"],
        }


# In-memory governance approval store for active session decisions
_APPROVAL_STORE: Dict[str, Dict[str, Any]] = {}


class GovernanceService:
    """Manages approvals, dry-run previews, live controlled simulated execution, and verification."""

    @staticmethod
    def approve_plan(
        plan_id: str,
        approver: str = "admin",
        reason: str = "Authorized by campus operations supervisor",
        parameters: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """Records an explicit human approval for a candidate recovery plan."""
        record = {
            "plan_id": plan_id,
            "decision": "APPROVED",
            "approver": approver,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
            "parameters": parameters,
        }
        _APPROVAL_STORE[plan_id] = record

        replay_engine.record_event(
            event_type="APPROVAL_GRANTED",
            summary=f"Plan '{plan_id}' APPROVED by {approver}: {reason}",
            payload=record,
            actor=approver,
            category="governance",
        )
        return record

    @staticmethod
    def reject_plan(
        plan_id: str,
        approver: str = "admin",
        reason: str = "Rejected by operator",
    ) -> Dict[str, Any]:
        """Records an explicit human rejection for a candidate recovery plan."""
        record = {
            "plan_id": plan_id,
            "decision": "REJECTED",
            "approver": approver,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
        }
        _APPROVAL_STORE[plan_id] = record

        replay_engine.record_event(
            event_type="APPROVAL_REJECTED",
            summary=f"Plan '{plan_id}' REJECTED by {approver}: {reason}",
            payload=record,
            actor=approver,
            category="governance",
        )
        return record

    @staticmethod
    def get_approval(plan_id: str) -> Optional[Dict[str, Any]]:
        return _APPROVAL_STORE.get(plan_id)

    @staticmethod
    def execute_plan(
        db: Session,
        plan_id: str,
        mode: str = "live",  # dry_run | live
        approver: str = "admin",
        reason: Optional[str] = None,
        override_params: Optional[InterventionParams] = None,
    ) -> Dict[str, Any]:
        """Executes a governed recovery plan with pre-validation and post-action verification."""
        state = orchestrator.simulator.infra_state
        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()

        # 1. Resolve Plan and Parameters
        if override_params is not None:
            interv = override_params.clamp()
            eval_res = counterfactual_evaluator.evaluate(state, contracts, interv)
            plan = {
                "plan_id": plan_id or "plan-custom-override",
                "name": "Custom Human Override Plan",
                "description": "Operator adjusted intervention parameters.",
                "requires_approval": eval_res["requires_approval"],
                "evaluation": eval_res,
            }
        else:
            opt_res = optimizer.optimize(state, contracts)
            candidate_plans = opt_res["candidate_plans"]
            matched = next((p for p in candidate_plans if p["plan_id"] == plan_id), None)
            if matched:
                plan = matched
                raw_interv = plan["evaluation"]["intervention"]
                interv = InterventionParams(**raw_interv).clamp()
            elif plan_id in (None, "plan-ico-optimal", "optimal"):
                plan = opt_res["selected_plan"]
                raw_interv = plan["evaluation"]["intervention"]
                interv = InterventionParams(**raw_interv).clamp()
            else:
                plan = {
                    "plan_id": plan_id,
                    "name": plan_id.replace("-", " ").title(),
                    "requires_approval": True,
                }
                interv = InterventionParams(0, 0, 0, 0, 0)

        # 2. Safety Gate Check
        safety_check = SafetyGate.evaluate(plan, contracts, interv)

        if safety_check["is_blocked"]:
            raise HTTPException(
                status_code=403,
                detail=f"Execution BLOCKED by Safety Gate: {', '.join(safety_check['blocked_reasons'])}",
            )

        # 3. Approval Check
        approval_status = "NOT_REQUIRED"
        if safety_check["requires_approval"]:
            stored_approval = GovernanceService.get_approval(plan["plan_id"])
            if stored_approval and stored_approval.get("decision") == "APPROVED":
                approval_status = "APPROVED"
            elif mode == "live":
                raise HTTPException(
                    status_code=403,
                    detail=f"Human authorization required prior to live execution. Reasons: {', '.join(safety_check['approval_reasons'])}",
                )
            else:
                approval_status = "PENDING_DRY_RUN"

        # 4. Snapshot BEFORE state
        before_infra = {
            "power_capacity": state.power_capacity,
            "network_capacity": state.network_capacity,
            "hvac_capacity": state.hvac_capacity,
            "status": state.status,
        }
        before_eval = counterfactual_evaluator.evaluate(state, contracts, InterventionParams(0, 0, 0, 0, 0))
        before_services = before_eval["projected_services"]

        # 5. Snapshot PREDICTED state
        pred_eval = counterfactual_evaluator.evaluate(state, contracts, interv)
        pred_infra = pred_eval["projected_infra"]
        pred_services = pred_eval["projected_services"]

        # 6. Apply Execution (Live vs Dry Run)
        executed = False
        if mode == "live":
            # Apply to simulator
            # Recover network capacity on switch fabric
            delta_net = (
                0.15 * interv.student_wifi_reduction
                + 0.10 * interv.noncritical_network_reduction
                + 0.08 * interv.analytics_shedding
            )
            state.network_capacity = round(min(1.00, state.network_capacity + delta_net), 2)

            # Recover HVAC cooling margin
            delta_hvac = (
                0.90 * interv.research_compute_reduction
                + 0.05 * interv.analytics_shedding
            )
            state.hvac_capacity = round(min(1.00, state.hvac_capacity + delta_hvac), 2)

            if state.power_capacity >= 0.99 and state.network_capacity >= 0.99 and state.hvac_capacity >= 0.99:
                state.status = "nominal"
            else:
                state.status = "degraded"

            executed = True

        # 7. Snapshot AFTER state
        if mode == "live":
            after_infra = {
                "power_capacity": state.power_capacity,
                "network_capacity": state.network_capacity,
                "hvac_capacity": state.hvac_capacity,
                "status": state.status,
            }
            after_eval = counterfactual_evaluator.evaluate(state, contracts, interv)
            after_services = after_eval["projected_services"]
            after_contracts = after_eval["contracts"]
            min_overall_margin = after_eval["min_overall_margin"]
            verification_status = "CONTRACT_SATISFIED" if after_eval["is_feasible"] else "CONTRACT_STILL_AT_RISK"
        else:
            # Dry run: after state equals predicted projection without mutating live state
            after_eval = pred_eval
            after_infra = pred_infra
            after_services = pred_services
            after_contracts = pred_eval["contracts"]
            min_overall_margin = pred_eval["min_overall_margin"]
            verification_status = "CONTRACT_SATISFIED" if pred_eval["is_feasible"] else "CONTRACT_STILL_AT_RISK"

        # 8. Compile Detailed Verification Metrics for ALL required contract thresholds
        all_required_keys = set()
        contract_threshold_map = {}
        for c in contracts:
            for k, val in (c.minimum_thresholds or {}).items():
                all_required_keys.add(k)
                contract_threshold_map[k] = max(contract_threshold_map.get(k, 0.0), val)

        ordered_keys = [
            "auth-server",
            "campus-api-gateway",
            "lms-cloud-app",
            "compute",
            "environmental_control",
            "student-portal-db",
            "core-network-switch",
            "email-api",
            "availability",
        ]
        for k in all_required_keys:
            if k not in ordered_keys:
                ordered_keys.append(k)

        verification_comparison = []
        for k in ordered_keys:
            if k in all_required_keys or k in before_services:
                b_val = before_services.get(k, 1.0)
                p_val = pred_services.get(k, 1.0)
                a_val = after_services.get(k, 1.0)
                req_val = contract_threshold_map.get(k, 0.70)
                meets_sla = (a_val >= req_val)
                verification_comparison.append({
                    "service": k,
                    "required_threshold": req_val,
                    "before": round(b_val, 2),
                    "predicted": round(p_val, 2),
                    "after": round(a_val, 2),
                    "margin": round(a_val - req_val, 2),
                    "recovered_margin": round(a_val - b_val, 2),
                    "meets_sla": meets_sla,
                })

        execution_id = f"exec-{uuid.uuid4().hex[:8]}"

        # 9. Persist Execution Record in DB
        db_exec = ContinuityExecution(
            execution_id=execution_id,
            plan_id=plan.get("plan_id", "plan-custom"),
            mode=mode,
            approval_status=approval_status,
            approver=approver,
            approval_reason=reason,
            safety_status=safety_check["status"],
            executed=executed,
            actions_executed=safety_check["actions_breakdown"],
            state_before={"infra": before_infra, "services": before_services},
            state_predicted={"infra": pred_infra, "services": pred_services},
            state_after={"infra": after_infra, "services": after_services},
            verification_status=verification_status,
            verification_details={
                "comparison": verification_comparison,
                "contracts": after_contracts,
                "min_overall_margin": min_overall_margin,
            },
        )
        db.add(db_exec)
        db.commit()
        db.refresh(db_exec)

        replay_engine.record_event(
            event_type="EXECUTION_COMPLETED" if mode == "live" else "DRY_RUN_COMPLETED",
            summary=f"Plan '{plan.get('name', plan_id)}' executed in {mode.upper()} mode: {verification_status}",
            payload={
                "execution_id": execution_id,
                "plan_id": plan.get("plan_id"),
                "mode": mode,
                "verification_status": verification_status,
                "approver": approver,
                "state_after": after_infra,
            },
            actor=f"CampusGuard Executor ({approver})",
            category="execution",
        )

        return {
            "execution_id": execution_id,
            "plan_id": plan.get("plan_id", "plan-custom"),
            "mode": mode,
            "executed": executed,
            "safety_check": safety_check,
            "approval_status": approval_status,
            "approver": approver,
            "intervention": asdict(interv),
            "state_before": before_infra,
            "state_predicted": pred_infra,
            "state_after": after_infra,
            "verification_status": verification_status,
            "verification_comparison": verification_comparison,
            "contracts_verification": after_contracts,
            "timestamp": datetime.utcnow().isoformat(),
        }


safety_gate = SafetyGate()
governance_service = GovernanceService()
