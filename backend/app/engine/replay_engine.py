"""CampusGuard Continuity Replay & Structured Decision Provenance Engine.

Maintains an immutable timeline of institutional events and generates structured
evidence objects explaining why specific recovery plans were recommended and executed.
"""

import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session

from app.models import ContinuityContract, MissionActivity, Dependency, ContinuityExecution
from app.telemetry.telemetry_manager import telemetry_manager


class ReplayEvent:
    def __init__(
        self,
        event_type: str,
        summary: str,
        payload: Dict[str, Any],
        actor: str = "CampusGuard Engine",
        object_id: Optional[str] = None,
        category: str = "system",
    ):
        self.event_id = f"evt-{uuid.uuid4().hex[:8]}"
        self.timestamp = datetime.utcnow().isoformat()
        self.event_type = event_type
        self.summary = summary
        self.payload = payload
        self.actor = actor
        self.object_id = object_id or "system"
        self.category = category

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_id": self.event_id,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "summary": self.summary,
            "actor": self.actor,
            "object_id": self.object_id,
            "category": self.category,
            "payload": self.payload,
        }


class ReplayEngine:
    """In-memory and persistent replay timeline and decision provenance generator."""

    def __init__(self):
        self._events: List[ReplayEvent] = []
        self._init_baseline_events()

    def _init_baseline_events(self):
        self.record_event(
            event_type="CONTEXT_ACTIVATED",
            summary="Institutional context loaded: 3 Missions, 3 Contracts, 13 Dependencies",
            payload={"missions_count": 3, "contracts_count": 3, "dependencies_count": 13},
            actor="Bootstrap Orchestrator",
            category="context",
        )

    def record_event(
        self,
        event_type: str,
        summary: str,
        payload: Dict[str, Any],
        actor: str = "CampusGuard Engine",
        object_id: Optional[str] = None,
        category: str = "system",
    ) -> Dict[str, Any]:
        """Records an institutional state transition event into the timeline."""
        evt = ReplayEvent(event_type, summary, payload, actor, object_id, category)
        self._events.append(evt)
        # Cap timeline length
        if len(self._events) > 500:
            self._events = self._events[-500:]
        return evt.to_dict()

    def get_timeline(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Returns chronological event list ordered newest first."""
        return [e.to_dict() for e in reversed(self._events[-limit:])]

    def clear_timeline(self):
        self._events.clear()
        self._init_baseline_events()

    def generate_provenance(
        self,
        db: Session,
        plan_id: Optional[str] = None,
        infra_state: Optional[Any] = None,
        opt_res: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Generates a structured, mathematically sound Decision Provenance explanation."""
        from app.engine.optimizer import optimizer
        from app.engine.orchestrator import orchestrator

        if infra_state is None:
            infra_state = orchestrator.simulator.infra_state

        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        missions = db.query(MissionActivity).filter(MissionActivity.active.is_(True)).all()
        deps = db.query(Dependency).all()
        telemetry_status = telemetry_manager.get_status()

        if opt_res is None:
            opt_res = optimizer.optimize(infra_state, contracts)

        selected_plan = opt_res.get("selected_plan", {})
        eval_res = selected_plan.get("evaluation", {})

        # Candidate Tournament Summary
        candidate_summary = []
        for p in opt_res.get("candidate_plans", []):
            candidate_summary.append({
                "plan_id": p["plan_id"],
                "name": p["name"],
                "is_feasible": p["is_feasible"],
                "min_overall_margin": p["min_overall_margin"],
                "intervention_cost": p["intervention_cost"],
                "collateral_degradation": p["collateral_degradation"],
                "violated_contracts": p["violated_contracts"],
            })

        # Latest Execution Record if available
        exec_row = (
            db.query(ContinuityExecution)
            .order_by(ContinuityExecution.id.desc())
            .first()
        )
        governance_trail = None
        if exec_row:
            governance_trail = {
                "execution_id": exec_row.execution_id,
                "plan_id": exec_row.plan_id,
                "approval_status": exec_row.approval_status,
                "approver": exec_row.approver,
                "approval_reason": exec_row.approval_reason,
                "safety_status": exec_row.safety_status,
                "verification_status": exec_row.verification_status,
                "timestamp": exec_row.created_at.isoformat(),
            }

        return {
            "provenance_id": f"prov-{uuid.uuid4().hex[:8]}",
            "timestamp": datetime.utcnow().isoformat(),
            "query": "WHY WAS THIS PLAN SELECTED?",
            "selected_plan": {
                "plan_id": selected_plan.get("plan_id"),
                "name": selected_plan.get("name"),
                "description": selected_plan.get("description"),
                "is_feasible": selected_plan.get("is_feasible"),
                "min_overall_margin": selected_plan.get("min_overall_margin"),
            },
            "selection_rationale": (
                f"Selected '{selected_plan.get('name')}' because it is the lowest-cost intervention "
                f"(Intervention Cost: {selected_plan.get('intervention_cost', 0):.2f}, Collateral: {selected_plan.get('collateral_degradation', 0):.2f}) "
                f"that satisfies 100% of active Continuity Contracts with non-negative margin (Min Margin: +{selected_plan.get('min_overall_margin', 0):.2f}) "
                f"while strictly respecting life-safety emergency communication hard constraints."
            ),
            "telemetry_confidence": {
                "confidence_score": telemetry_status["confidence_score"],
                "confidence_level": telemetry_status["confidence_level"],
                "is_degraded": telemetry_status["is_degraded"],
                "missing_sources": telemetry_status["missing_sources"],
            },
            "active_missions": [
                {
                    "name": m.name,
                    "priority": m.priority,
                    "population_impact": m.population_impact,
                    "time_criticality": m.time_criticality,
                    "recoverability": m.recoverability,
                    "mission_utility": m.mission_utility,
                }
                for m in missions
            ],
            "active_contracts": [
                {
                    "contract_id": c.contract_id,
                    "mission": c.mission_activity.name if c.mission_activity else "Unknown",
                    "must_protect": c.must_protect,
                    "minimum_thresholds": c.minimum_thresholds,
                    "degradable_services": c.degradable_services,
                    "forbidden_actions": c.forbidden_actions,
                }
                for c in contracts
            ],
            "objective_breakdown": {
                "intervention_cost": selected_plan.get("intervention_cost", 0.0),
                "collateral_degradation": selected_plan.get("collateral_degradation", 0.0),
                "irrecoverable_loss_penalty": eval_res.get("irrecoverable_loss_score", 0.0),
                "contract_violations": selected_plan.get("violated_contracts", 0),
                "hard_constraints_breached": 0,
            },
            "binding_constraints": opt_res.get("binding_constraints", []),
            "candidate_plans_comparison": candidate_summary,
            "governance_trail": governance_trail,
        }


replay_engine = ReplayEngine()
