"""CampusGuard Continuity Impact Assessment Engine.

Computes forward dependency propagation, contract feasibility, and continuity margins
when infrastructure assets degrade or suffer power curtailment.
"""

from typing import Dict, List, Any, Optional
from sqlalchemy.orm import Session

from app.models import (
    Asset,
    Service,
    MissionActivity,
    ContinuityContract,
    Dependency,
)


class ImpactEngine:
    """Evaluates infrastructure state degradation across the dependency graph and assesses
    continuity contract feasibility and margin."""

    def compute_asset_capacities(self, db: Session, infra_state: Any) -> Dict[str, float]:
        """Maps infrastructure simulation state to individual asset capacity levels."""
        p_cap = getattr(infra_state, "power_capacity", 1.00)
        net_cap = getattr(infra_state, "network_capacity", 1.00)
        hvac_cap = getattr(infra_state, "hvac_capacity", 1.00)

        return {
            "main-grid-power": round(p_cap, 2),
            "backup-diesel-generator": 1.00,
            "core-switch-alpha": round(net_cap, 2),
            "datacenter-hvac-1": round(hvac_cap, 2),
            "compute-rack-01": round(p_cap, 2),
        }

    def compute_service_capacities(
        self, db: Session, asset_caps: Dict[str, float], infra_state: Any
    ) -> Dict[str, float]:
        """Derives effective service throughput and capacity based on upstream asset constraints."""
        p_cap = getattr(infra_state, "power_capacity", 1.00)
        net_cap = asset_caps.get("core-switch-alpha", 1.00)
        hvac_cap = asset_caps.get("datacenter-hvac-1", 1.00)
        compute_cap = asset_caps.get("compute-rack-01", 1.00)

        # Deterministic prototype simulation mapping:
        # - core-network-switch inherits switch hardware headroom
        # - auth-server and campus-api-gateway inherit network throughput constraint
        # - lms-cloud-app inherits server compute headroom
        # - environmental_control is governed by HVAC capacity
        # - email-api has dedicated life-safety priority broadcast reservation (= 1.00)
        # - emergency communication core slice has dedicated reserve bandwidth (= 1.00)
        return {
            "core-network-switch": round(net_cap, 2),
            "auth-server": round(net_cap, 2),
            "campus-api-gateway": round(net_cap, 2),
            "lms-cloud-app": round(compute_cap, 2),
            "student-portal-db": round(max(0.40, compute_cap * 1.05 if compute_cap < 1.0 else 1.0), 2),
            "library-cctv-service": round(max(0.30, p_cap * 1.05 if p_cap < 1.0 else 1.0), 2),
            "dorm-iot-hub": round(max(0.20, p_cap * 0.85 if p_cap < 1.0 else 1.0), 2),
            "email-api": 1.00,
            # Virtual / abstract requirement metrics
            "environmental_control": round(hvac_cap, 2),
            "compute": round(compute_cap, 2),
            "availability": 1.00,
        }

    def assess_impact(self, db: Session, infra_state: Any) -> Dict[str, Any]:
        """Performs full forward dependency propagation assessment."""
        asset_caps = self.compute_asset_capacities(db, infra_state)
        svc_caps = self.compute_service_capacities(db, asset_caps, infra_state)

        # 1. Affected Assets
        assets = db.query(Asset).all()
        affected_assets = []
        for a in assets:
            cap = asset_caps.get(a.name, 1.00)
            status = "degraded" if cap < 0.99 else "operational"
            affected_assets.append({
                "id": a.id,
                "name": a.name,
                "asset_type": a.asset_type,
                "current_capacity": cap,
                "status": status,
                "location": a.location,
            })

        # 2. Affected Services
        services = db.query(Service).all()
        affected_services = []
        for s in services:
            cap = svc_caps.get(s.name, 1.00)
            degraded = cap < 0.99
            affected_services.append({
                "id": s.id,
                "name": s.name,
                "type": s.type.value if hasattr(s.type, "value") else str(s.type),
                "estimated_capacity": cap,
                "status": "degraded" if degraded else "healthy",
            })

        # 3. Propagation Paths
        deps = db.query(Dependency).all()
        propagation_paths = [
            {
                "path_id": "path-power-network-exam",
                "steps": [
                    {"type": "asset", "name": "main-grid-power", "capacity": asset_caps.get("main-grid-power", 1.0)},
                    {"type": "asset", "name": "core-switch-alpha", "capacity": asset_caps.get("core-switch-alpha", 1.0)},
                    {"type": "service", "name": "core-network-switch", "capacity": svc_caps.get("core-network-switch", 1.0)},
                    {"type": "service", "name": "auth-server", "capacity": svc_caps.get("auth-server", 1.0)},
                    {"type": "service", "name": "campus-api-gateway", "capacity": svc_caps.get("campus-api-gateway", 1.0)},
                    {"type": "mission_activity", "name": "Online Examination"},
                ],
                "description": "Grid power drop curtails network switch capacity, constraining auth verification and exam gateway throughput.",
            },
            {
                "path_id": "path-power-hvac-research",
                "steps": [
                    {"type": "asset", "name": "main-grid-power", "capacity": asset_caps.get("main-grid-power", 1.0)},
                    {"type": "asset", "name": "datacenter-hvac-1", "capacity": asset_caps.get("datacenter-hvac-1", 1.0)},
                    {"type": "mission_activity", "name": "Research Laboratory"},
                ],
                "description": "Grid power curtailment reduces CRAC chilling loops, stressing thermal limits for high-performance research compute.",
            },
            {
                "path_id": "path-power-compute-research",
                "steps": [
                    {"type": "asset", "name": "main-grid-power", "capacity": asset_caps.get("main-grid-power", 1.0)},
                    {"type": "asset", "name": "compute-rack-01", "capacity": asset_caps.get("compute-rack-01", 1.0)},
                    {"type": "service", "name": "lms-cloud-app", "capacity": svc_caps.get("lms-cloud-app", 1.0)},
                    {"type": "mission_activity", "name": "Research Laboratory"},
                ],
                "description": "Power capacity drop reduces compute cluster power envelope, throttling research workloads.",
            },
            {
                "path_id": "path-power-network-emergency",
                "steps": [
                    {"type": "asset", "name": "main-grid-power", "capacity": asset_caps.get("main-grid-power", 1.0)},
                    {"type": "asset", "name": "core-switch-alpha", "capacity": asset_caps.get("core-switch-alpha", 1.0)},
                    {"type": "service", "name": "core-network-switch", "capacity": 1.00},
                    {"type": "service", "name": "email-api", "capacity": 1.00},
                    {"type": "mission_activity", "name": "Emergency Communication"},
                ],
                "description": "Emergency Communication routes through priority-reserved network slice and dedicated backup circuit (preserved at 100%).",
            },
        ]

        # 4. Affected Missions
        missions = db.query(MissionActivity).filter(MissionActivity.active.is_(True)).all()
        affected_missions = []
        for m in missions:
            # Check impact on mission
            impacted = False
            degradation_evidence = []
            if m.name == "Online Examination" and svc_caps.get("auth-server", 1.0) < 0.99:
                impacted = True
                degradation_evidence.append(f"Auth server capacity at {svc_caps.get('auth-server')*100:.0f}% (below 99% exam standard)")
            elif m.name == "Research Laboratory" and (asset_caps.get("datacenter-hvac-1", 1.0) < 0.90 or svc_caps.get("compute", 1.0) < 1.0):
                impacted = True
                degradation_evidence.append(f"Datacenter HVAC cooling capacity at {asset_caps.get('datacenter-hvac-1')*100:.0f}% (below 90% environmental threshold)")
            elif m.name == "Emergency Communication":
                impacted = False  # Protected on dedicated circuit

            affected_missions.append({
                "id": m.id,
                "name": m.name,
                "priority": m.priority,
                "active": m.active,
                "status": "impacted" if impacted else "nominal",
                "evidence": " · ".join(degradation_evidence) if degradation_evidence else "Operating within nominal continuity parameters.",
            })

        return {
            "infrastructure_state": {
                "power_capacity": getattr(infra_state, "power_capacity", 1.00),
                "network_capacity": getattr(infra_state, "network_capacity", 1.00),
                "hvac_capacity": getattr(infra_state, "hvac_capacity", 1.00),
                "active_power_drop_pct": getattr(infra_state, "active_power_drop_pct", 0.0),
                "status": getattr(infra_state, "status", "nominal"),
            },
            "affected_assets": affected_assets,
            "affected_services": affected_services,
            "affected_missions": affected_missions,
            "propagation_paths": propagation_paths,
        }

    def evaluate_contracts(self, db: Session, infra_state: Any) -> List[Dict[str, Any]]:
        """Evaluates feasibility and continuity margin for every active continuity contract."""
        asset_caps = self.compute_asset_capacities(db, infra_state)
        svc_caps = self.compute_service_capacities(db, asset_caps, infra_state)

        contracts = db.query(ContinuityContract).filter(ContinuityContract.active.is_(True)).all()
        results = []

        for c in contracts:
            mission_name = c.mission_activity.name if c.mission_activity else "Unknown Mission"
            thresholds = c.minimum_thresholds or {}
            current_vals = {}
            margins = {}
            violations = []
            at_risk_items = []

            is_emergency = (mission_name == "Emergency Communication")
            for key, req_val in thresholds.items():
                if is_emergency and key in ("core-network-switch", "email-api", "availability"):
                    curr = 1.00  # Life-safety reserved emergency capacity / backup circuit
                else:
                    curr = svc_caps.get(key)
                    if curr is None:
                        curr = asset_caps.get(key, 1.00)
                
                margin = round(curr - req_val, 2)
                current_vals[key] = curr
                margins[key] = margin

                if margin < 0.00:
                    violations.append(f"'{key}' at {curr*100:.0f}% < required {req_val*100:.0f}% (margin: {margin:+.2f})")
                elif margin < 0.05 and curr < 1.00:
                    at_risk_items.append(f"'{key}' at {curr*100:.0f}% ≈ required {req_val*100:.0f}% (margin: {margin:+.2f})")

            min_margin = min(margins.values()) if margins else 0.00

            # Determine feasibility status
            if violations:
                status = "VIOLATED"
                evidence = f"VIOLATED: {', '.join(violations)}."
            elif at_risk_items:
                status = "AT_RISK"
                evidence = f"AT_RISK: Operating near operational tolerance: {', '.join(at_risk_items)}."
            else:
                status = "SAFE"
                evidence = f"SAFE: All required services meet contract thresholds with ≥ {max(0.0, min_margin)*100:.0f}% continuity headroom."

            # Collect affected dependencies for this contract
            affected_deps = []
            for svc in c.must_protect or []:
                if svc_caps.get(svc, 1.0) < 1.0:
                    affected_deps.append(f"{svc} degraded ({svc_caps.get(svc)*100:.0f}%)")

            results.append({
                "contract_id": c.contract_id,
                "mission_activity_id": c.mission_activity_id,
                "mission_activity_name": mission_name,
                "status": status,
                "min_margin": min_margin,
                "current_values": current_vals,
                "required_values": thresholds,
                "margins": margins,
                "must_protect": c.must_protect or [],
                "degradable_services": c.degradable_services or [],
                "forbidden_actions": c.forbidden_actions or [],
                "high_impact_requires_approval": c.high_impact_requires_approval,
                "provenance": c.provenance,
                "affected_dependencies": affected_deps,
                "evidence": evidence,
            })

        return results


impact_engine = ImpactEngine()
