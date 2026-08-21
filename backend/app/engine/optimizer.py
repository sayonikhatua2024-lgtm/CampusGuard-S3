"""CampusGuard Institutional Continuity Optimizer (ICO) & Counterfactual Evaluator.

Provides pure-functional forward state projection, constraint satisfaction,
multi-plan tournament evaluation, and contract conflict detection without mutating live state.
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Any, Optional, Tuple
import copy
from sqlalchemy.orm import Session

from app.models import ContinuityContract, MissionActivity, Asset, Service, Dependency


@dataclass
class InterventionParams:
    """Intervention decision variables for load shedding and traffic prioritization."""
    student_wifi_reduction: float = 0.0          # in [0.0, 0.80]
    analytics_shedding: float = 0.0              # in [0.0, 1.00]
    exam_traffic_shift: float = 0.0              # in [0.0, 1.00]
    research_compute_reduction: float = 0.0      # in [0.0, 0.30]
    noncritical_network_reduction: float = 0.0   # in [0.0, 0.50]

    def clamp(self):
        """Ensures all intervention variables remain within physical validity bounds."""
        self.student_wifi_reduction = max(0.0, min(0.80, round(self.student_wifi_reduction, 2)))
        self.analytics_shedding = max(0.0, min(1.00, round(self.analytics_shedding, 2)))
        self.exam_traffic_shift = max(0.0, min(1.00, round(self.exam_traffic_shift, 2)))
        self.research_compute_reduction = max(0.0, min(0.30, round(self.research_compute_reduction, 2)))
        self.noncritical_network_reduction = max(0.0, min(0.50, round(self.noncritical_network_reduction, 2)))
        return self


class CounterfactualEvaluator:
    """Pure functional forward-state projection engine. Does NOT mutate live state."""

    @staticmethod
    def evaluate(
        infra_state: Any,
        contracts: List[ContinuityContract],
        intervention: InterventionParams,
    ) -> Dict[str, Any]:
        """Projects forward infrastructure, service, and contract states under proposed interventions."""
        interv = copy.deepcopy(intervention).clamp()

        # 1. Base infrastructure capacities under current physical failure
        p_base = getattr(infra_state, "power_capacity", 1.00)
        net_base = getattr(infra_state, "network_capacity", 1.00)
        hvac_base = getattr(infra_state, "hvac_capacity", 1.00)

        # 2. Physics & load-shedding response modeling:
        # - Shedding Wi-Fi, non-critical IoT, and analytics recovers network switch queue capacity
        delta_net = (
            0.15 * interv.student_wifi_reduction
            + 0.10 * interv.noncritical_network_reduction
            + 0.08 * interv.analytics_shedding
        )
        p_net = round(min(1.00, net_base + delta_net), 2)

        # - Throttling research compute & analytics reduces heat load, recovering HVAC cooling margin
        delta_hvac = (
            0.90 * interv.research_compute_reduction
            + 0.05 * interv.analytics_shedding
        )
        p_hvac = round(min(1.00, hvac_base + delta_hvac), 2)

        # - Compute rack power headroom
        p_power = p_base
        p_compute_rack = round(min(1.00, p_base + 0.05 * interv.research_compute_reduction), 2)

        projected_infra = {
            "power_capacity": p_power,
            "network_capacity": p_net,
            "hvac_capacity": p_hvac,
            "active_power_drop_pct": getattr(infra_state, "active_power_drop_pct", 0.0),
            "status": "nominal" if p_power >= 0.99 and p_net >= 0.99 and p_hvac >= 0.99 else "degraded",
        }

        # 3. Projected Service Capacities
        auth_boost = 0.15 * interv.exam_traffic_shift
        api_boost = 0.12 * interv.exam_traffic_shift

        projected_services = {
            "core-network-switch": p_net,
            "auth-server": round(min(1.00, p_net + auth_boost), 2),
            "campus-api-gateway": round(min(1.00, p_net + api_boost), 2),
            "lms-cloud-app": p_compute_rack,
            "student-portal-db": round(min(1.00, p_compute_rack * 1.05 if p_compute_rack < 1.0 else 1.0), 2),
            "library-cctv-service": round(max(0.20, (1.00 - 0.50 * interv.noncritical_network_reduction) * p_power), 2),
            "dorm-iot-hub": round(max(0.10, (1.00 - interv.noncritical_network_reduction) * p_power), 2),
            "student_wifi": round(1.00 - interv.student_wifi_reduction, 2),
            "background_analytics": round(1.00 - interv.analytics_shedding, 2),
            "email-api": round(min(1.00, p_net + 0.20 * interv.noncritical_network_reduction), 2),
            # Virtual / abstract metrics
            "environmental_control": p_hvac,
            "compute": p_compute_rack,
            "availability": p_net,
        }

        # 4. Evaluate Active Contracts
        contract_evaluations = []
        violated_contracts = 0
        at_risk_contracts = 0
        safe_contracts = 0
        min_overall_margin = 1.00
        hard_constraint_breached = False
        blocked_constraints = []

        for c in contracts:
            mission_name = c.mission_activity.name if c.mission_activity else "Unknown"
            thresholds = c.minimum_thresholds or {}
            margins = {}
            current_vals = {}
            violations = []
            at_risk_items = []

            for key, req_val in thresholds.items():
                curr = projected_services.get(key, 1.00)
                margin = round(curr - req_val, 2)
                current_vals[key] = curr
                margins[key] = margin

                if margin < 0.00:
                    violations.append(f"'{key}' at {curr*100:.0f}% < required {req_val*100:.0f}% (margin: {margin:+.2f})")
                elif margin < 0.05 and curr < 1.00:
                    at_risk_items.append(f"'{key}' at {curr*100:.0f}% ≈ required {req_val*100:.0f}% (margin: {margin:+.2f})")

            c_min_margin = min(margins.values()) if margins else 0.00
            min_overall_margin = min(min_overall_margin, c_min_margin)

            # Check Hard Constraint for Emergency Communication:
            # Emergency Communication availability and network must be >= 1.00 (hard constraint)
            if mission_name == "Emergency Communication":
                if c_min_margin < 0.00 or projected_services.get("core-network-switch", 0.0) < 1.00:
                    hard_constraint_breached = True
                    blocked_constraints.append("Emergency Communication Hard Availability SLA (< 100%)")

            # Status categorization
            if violations:
                c_status = "VIOLATED"
                violated_contracts += 1
                evidence = f"VIOLATED: {', '.join(violations)}."
            elif at_risk_items:
                c_status = "AT_RISK"
                at_risk_contracts += 1
                evidence = f"AT_RISK: Operating near operational threshold: {', '.join(at_risk_items)}."
            else:
                c_status = "SAFE"
                safe_contracts += 1
                evidence = f"SAFE: Meets operational continuity standard with ≥ {max(0.0, c_min_margin)*100:.0f}% headroom."

            contract_evaluations.append({
                "contract_id": c.contract_id,
                "mission_name": mission_name,
                "status": c_status,
                "min_margin": c_min_margin,
                "current_values": current_vals,
                "required_values": thresholds,
                "margins": margins,
                "evidence": evidence,
            })

        # 5. Calculate Cost and Risk Metrics
        # Intervention Cost (operational friction)
        intervention_cost = round(
            0.25 * interv.student_wifi_reduction
            + 0.15 * interv.analytics_shedding
            + 0.20 * interv.exam_traffic_shift
            + 0.40 * interv.research_compute_reduction
            + 0.20 * interv.noncritical_network_reduction,
            3,
        )

        # Collateral Degradation (impact on campus experience)
        collateral_degradation = round(
            0.30 * interv.student_wifi_reduction
            + 0.20 * interv.analytics_shedding
            + 0.50 * interv.research_compute_reduction
            + 0.20 * interv.noncritical_network_reduction,
            3,
        )

        # Irrecoverable Mission Loss vs Recoverable Inconvenience Modeling:
        irrecoverable_loss_penalty = 0.0
        for c in contracts:
            m = c.mission_activity
            if m:
                pop = getattr(m, "population_impact", 0.5)
                crit = getattr(m, "time_criticality", 0.5)
                rec = getattr(m, "recoverability", 0.5)
                c_eval = next((e for e in contract_evaluations if e["contract_id"] == c.contract_id), None)
                if c_eval and c_eval["min_margin"] < 0.05:
                    deficit = max(0.0, 0.05 - c_eval["min_margin"])
                    loss_weight = (1.0 - rec) * crit * pop
                    irrecoverable_loss_penalty += loss_weight * deficit * 100.0

        irrecoverable_loss_score = round(irrecoverable_loss_penalty, 2)

        # Risk Score
        violation_penalty = 100.0 * violated_contracts
        margin_penalty = sum(max(0.0, 0.05 - e["min_margin"]) * 20.0 for e in contract_evaluations)
        hard_constraint_penalty = 500.0 if hard_constraint_breached else 0.0
        risk_score = round(violation_penalty + margin_penalty + hard_constraint_penalty + irrecoverable_loss_score, 2)

        # Feasibility check: Feasible if 0 contract violations and 0 hard constraint breaches
        is_feasible = (violated_contracts == 0 and not hard_constraint_breached)

        # Collateral Services List
        sacrificed_services = []
        if interv.student_wifi_reduction > 0:
            sacrificed_services.append(f"Student Wi-Fi reduced by {interv.student_wifi_reduction*100:.0f}%")
        if interv.analytics_shedding > 0:
            sacrificed_services.append(f"Background analytics shed by {interv.analytics_shedding*100:.0f}%")
        if interv.research_compute_reduction > 0:
            sacrificed_services.append(f"Research compute throttled by {interv.research_compute_reduction*100:.0f}%")
        if interv.noncritical_network_reduction > 0:
            sacrificed_services.append(f"Non-critical IoT / CCTV traffic restricted by {interv.noncritical_network_reduction*100:.0f}%")
        if interv.exam_traffic_shift > 0:
            sacrificed_services.append(f"QoS priority shifted to exam traffic ({interv.exam_traffic_shift*100:.0f}%)")

        requires_approval = interv.research_compute_reduction > 0 or interv.student_wifi_reduction > 0.50

        return {
            "intervention": asdict(interv),
            "projected_infra": projected_infra,
            "projected_services": projected_services,
            "contracts": contract_evaluations,
            "overall_status": "SAFE" if is_feasible else "VIOLATED",
            "is_feasible": is_feasible,
            "min_overall_margin": round(min_overall_margin, 2),
            "safe_contracts": safe_contracts,
            "at_risk_contracts": at_risk_contracts,
            "violated_contracts": violated_contracts,
            "intervention_cost": intervention_cost,
            "collateral_degradation": collateral_degradation,
            "irrecoverable_loss_score": irrecoverable_loss_score,
            "risk_score": risk_score,
            "sacrificed_services": sacrificed_services,
            "requires_approval": requires_approval,
            "blocked_constraints": blocked_constraints,
        }


class ContinuityOptimizer:
    """Deterministic Multi-Plan Tournament & Constrained Optimization Engine (ICO)."""

    @staticmethod
    def generate_candidate_plans(
        infra_state: Any, contracts: List[ContinuityContract]
    ) -> List[Dict[str, Any]]:
        """Generates standard candidate strategy plans and evaluates them through the counterfactual engine."""
        strategies = [
            {
                "plan_id": "plan-a-baseline",
                "name": "Plan A: Baseline (No Intervention)",
                "description": "Maintain current status quo without load shedding or traffic prioritization.",
                "intervention": InterventionParams(
                    student_wifi_reduction=0.0,
                    analytics_shedding=0.0,
                    exam_traffic_shift=0.0,
                    research_compute_reduction=0.0,
                    noncritical_network_reduction=0.0,
                ),
            },
            {
                "plan_id": "plan-b-selective",
                "name": "Plan B: Selective Non-Critical Degradation",
                "description": "Shed non-essential background analytics and restrict non-critical student Wi-Fi.",
                "intervention": InterventionParams(
                    student_wifi_reduction=0.50,
                    analytics_shedding=0.80,
                    exam_traffic_shift=0.0,
                    research_compute_reduction=0.0,
                    noncritical_network_reduction=0.30,
                ),
            },
            {
                "plan_id": "plan-c-balanced",
                "name": "Plan C: Balanced Mission Protection",
                "description": "Shed Wi-Fi & analytics, apply exam QoS shift, and throttle research compute to recover HVAC thermal margin.",
                "intervention": InterventionParams(
                    student_wifi_reduction=0.60,
                    analytics_shedding=0.90,
                    exam_traffic_shift=0.80,
                    research_compute_reduction=0.28,
                    noncritical_network_reduction=0.40,
                ),
            },
            {
                "plan_id": "plan-d-aggressive",
                "name": "Plan D: Aggressive Continuity Envelope",
                "description": "Maximum shedding across all degradable assets to maximize headroom for high-priority contracts.",
                "intervention": InterventionParams(
                    student_wifi_reduction=0.80,
                    analytics_shedding=1.00,
                    exam_traffic_shift=1.00,
                    research_compute_reduction=0.30,
                    noncritical_network_reduction=0.50,
                ),
            },
        ]

        evaluated_plans = []
        for s in strategies:
            eval_res = CounterfactualEvaluator.evaluate(infra_state, contracts, s["intervention"])
            evaluated_plans.append({
                "plan_id": s["plan_id"],
                "name": s["name"],
                "description": s["description"],
                "is_feasible": eval_res["is_feasible"],
                "overall_status": eval_res["overall_status"],
                "min_overall_margin": eval_res["min_overall_margin"],
                "violated_contracts": eval_res["violated_contracts"],
                "risk_score": eval_res["risk_score"],
                "intervention_cost": eval_res["intervention_cost"],
                "collateral_degradation": eval_res["collateral_degradation"],
                "requires_approval": eval_res["requires_approval"],
                "sacrificed_services": eval_res["sacrificed_services"],
                "blocked_constraints": eval_res["blocked_constraints"],
                "evaluation": eval_res,
            })

        return evaluated_plans

    @staticmethod
    def optimize(
        infra_state: Any, contracts: List[ContinuityContract]
    ) -> Dict[str, Any]:
        """Performs deterministic constraint search across intervention parameter space to find the optimal plan."""
        # 1. Evaluate candidate tournament plans first
        candidate_plans = ContinuityOptimizer.generate_candidate_plans(infra_state, contracts)

        # 2. Check active contract demand
        active_mission_names = {c.mission_activity.name for c in contracts if c.mission_activity}

        # 3. Fine-grained deterministic search over valid intervention grid
        best_feasible_eval = None
        best_feasible_cost = float("inf")
        best_feasible_interv = None

        best_infeasible_eval = None
        best_infeasible_score = float("inf")
        best_infeasible_interv = None

        # Search grid
        # Wi-Fi in [0, 0.8], Analytics in [0, 1.0], Exam shift in [0, 1.0], Research in [0, 0.3], Noncritical in [0, 0.5]
        wifi_steps = [0.0, 0.30, 0.50, 0.60, 0.70, 0.80]
        analytics_steps = [0.0, 0.50, 0.80, 1.00]
        exam_steps = [0.0, 0.50, 0.80, 1.00] if "Online Examination" in active_mission_names else [0.0]
        research_steps = [0.0, 0.15, 0.25, 0.28, 0.30] if "Research Laboratory" in active_mission_names else [0.0]
        noncrit_steps = [0.0, 0.25, 0.30, 0.40, 0.50]

        for w in wifi_steps:
            for a in analytics_steps:
                for e in exam_steps:
                    for r in research_steps:
                        for n in noncrit_steps:
                            interv = InterventionParams(w, a, e, r, n)
                            res = CounterfactualEvaluator.evaluate(infra_state, contracts, interv)

                            if res["is_feasible"]:
                                # Objective: minimize intervention cost + collateral degradation
                                total_cost = res["intervention_cost"] + res["collateral_degradation"]
                                if total_cost < best_feasible_cost:
                                    best_feasible_cost = total_cost
                                    best_feasible_eval = res
                                    best_feasible_interv = interv
                            else:
                                score = res["risk_score"] + res["intervention_cost"]
                                if score < best_infeasible_score:
                                    best_infeasible_score = score
                                    best_infeasible_eval = res
                                    best_infeasible_interv = interv

        # 4. Conflict & Feasibility determination
        if best_feasible_eval is not None:
            status = "FEASIBLE_OPTIMUM_FOUND"
            winner_eval = best_feasible_eval
            winner_interv = best_feasible_interv
            explanation = (
                f"Selected as the lowest-cost feasible intervention (Cost: {winner_eval['intervention_cost']:.2f}, "
                f"Collateral: {winner_eval['collateral_degradation']:.2f}) that satisfies all active Continuity Contracts."
            )
            binding_constraints = [
                f"Min margin: {winner_eval['min_overall_margin']:+.2f}",
                "Emergency Communication SLA = 100%",
                "0 forbidden action breaches",
            ]
        else:
            status = "NO_FULLY_FEASIBLE_PLAN"
            winner_eval = best_infeasible_eval
            winner_interv = best_infeasible_interv
            explanation = (
                "Infeasible: No intervention can simultaneously satisfy all active continuity contracts "
                "under the current infrastructure deficit. Showing best-effort trade-off plan."
            )
            binding_constraints = winner_eval.get("blocked_constraints", []) or ["Severe physical infrastructure deficit"]

        # Formulate ICO Winner Plan object
        ico_plan = {
            "plan_id": "plan-ico-optimal",
            "name": "Plan ICO: Optimizer Recommended Strategy",
            "description": "Mathematically optimized parameter set minimizing collateral shedding and operational friction.",
            "is_feasible": winner_eval["is_feasible"],
            "overall_status": winner_eval["overall_status"],
            "min_overall_margin": winner_eval["min_overall_margin"],
            "violated_contracts": winner_eval["violated_contracts"],
            "risk_score": winner_eval["risk_score"],
            "intervention_cost": winner_eval["intervention_cost"],
            "collateral_degradation": winner_eval["collateral_degradation"],
            "requires_approval": winner_eval["requires_approval"],
            "sacrificed_services": winner_eval["sacrificed_services"],
            "blocked_constraints": winner_eval["blocked_constraints"],
            "evaluation": winner_eval,
        }

        # Check for Resource Conflicts
        conflicts = ContinuityOptimizer.detect_conflicts(infra_state, contracts)

        return {
            "status": status,
            "selected_plan": ico_plan,
            "explanation": explanation,
            "binding_constraints": binding_constraints,
            "candidate_plans": [ico_plan] + candidate_plans,
            "conflicts": conflicts,
        }

    @staticmethod
    def detect_conflicts(
        infra_state: Any, contracts: List[ContinuityContract]
    ) -> Dict[str, Any]:
        """Detects resource competition where simultaneous contract demands exceed capacity envelope."""
        p_cap = getattr(infra_state, "power_capacity", 1.00)
        net_cap = getattr(infra_state, "network_capacity", 1.00)
        hvac_cap = getattr(infra_state, "hvac_capacity", 1.00)

        active_missions = [c.mission_activity.name for c in contracts if c.mission_activity]

        conflicts = []
        has_conflict = False

        # 1. Network Bandwidth Competition: Exam + Emergency
        if "Online Examination" in active_missions and "Emergency Communication" in active_missions:
            if net_cap < 0.90:
                has_conflict = True
                conflicts.append({
                    "conflict_type": "RESOURCE_CONFLICT",
                    "resource": "Core Switch Network Bandwidth",
                    "conflicting_contracts": ["contract-exam-2026", "contract-emergency-comm-2026"],
                    "current_capacity": net_cap,
                    "required_capacity": 1.00,
                    "deficit": round(1.00 - net_cap, 2),
                    "description": "Both Online Examination (99% auth verification) and Emergency Communication (100% SLA) compete for degraded network switch bandwidth.",
                    "trade_offs": [
                        "Shed student Wi-Fi by >= 50% and background analytics to recover +15% switch queue headroom",
                        "Prioritize life-safety emergency broadcast packets over student portal web requests",
                    ],
                })

        # 2. Thermal & Compute Cooling Competition: Research Lab + Datacenter Power
        if "Research Laboratory" in active_missions:
            if hvac_cap < 0.90:
                has_conflict = True
                conflicts.append({
                    "conflict_type": "RESOURCE_CONFLICT",
                    "resource": "Data Center HVAC Thermal Envelope",
                    "conflicting_contracts": ["contract-research-lab-2026"],
                    "current_capacity": hvac_cap,
                    "required_capacity": 0.90,
                    "deficit": round(0.90 - hvac_cap, 2),
                    "description": "Grid power curtailment reduced HVAC cooling to 65%, breaching research laboratory environmental tolerance (90%).",
                    "trade_offs": [
                        "Throttle non-essential research compute by 25% to reduce heat dissipation in server racks",
                        "Power down secondary research compute blades while preserving cold storage",
                    ],
                })

        return {
            "has_conflict": has_conflict,
            "conflict_count": len(conflicts),
            "conflicts": conflicts,
        }

    @staticmethod
    def derive_degradation_ladder(contracts: List[ContinuityContract]) -> List[Dict[str, Any]]:
        """Dynamically derives the graceful degradation hierarchy from active contract constraints."""
        active_mission_names = {c.mission_activity.name for c in contracts if c.mission_activity}

        ladder = [
            {
                "tier": 1,
                "service": "Background Analytics & Logging",
                "action": "analytics_shedding",
                "impact_level": "NEGLIGIBLE",
                "rationale": "Non-mission critical background telemetry; shedding immediately frees CPU & network without user disruption.",
            },
            {
                "tier": 2,
                "service": "Student Campus Wi-Fi",
                "action": "student_wifi_reduction",
                "impact_level": "MODERATE",
                "rationale": "General campus amenity; load-shedding permitted during institutional continuity emergencies.",
            },
            {
                "tier": 3,
                "service": "Dorm IoT Hub & Campus CCTV Polling",
                "action": "noncritical_network_reduction",
                "impact_level": "MODERATE",
                "rationale": "Rate-limits low-priority sensor traffic to protect high-priority exam & auth switch queues.",
            },
        ]

        if "Research Laboratory" in active_mission_names:
            ladder.append({
                "tier": 4,
                "service": "Research HPC Compute Envelopes",
                "action": "research_compute_reduction",
                "impact_level": "HIGH (Requires Approval)",
                "rationale": "High-impact thermal shed: throttles compute by 20-30% to prevent thermal shutdown of datacenter cooling loops.",
            })

        if "Online Examination" in active_mission_names:
            ladder.append({
                "tier": 5,
                "service": "Online Exam & Auth Portals",
                "action": "MUST PROTECT",
                "impact_level": "PROTECTED",
                "rationale": "Active Examination Continuity Policy prohibits degradation of auth-server and campus-api-gateway.",
            })

        ladder.append({
            "tier": 6,
            "service": "Emergency Communication Channels",
            "action": "STRICTLY FORBIDDEN TO DEGRADE",
            "impact_level": "LIFE SAFETY",
            "rationale": "Hard continuity constraint: 100% availability SLA must be preserved under all operational envelopes.",
        })

        return ladder


optimizer = ContinuityOptimizer()
counterfactual_evaluator = CounterfactualEvaluator()
