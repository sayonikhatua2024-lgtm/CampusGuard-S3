from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models import Incident, Alert, Service, IncidentStatus, ServiceStatus
from app.schemas import IncidentOut, AlertOut, OverrideRequest
from app.auth import get_current_user

router = APIRouter(prefix="/api", tags=["incidents"], dependencies=[Depends(get_current_user)])


@router.get("/incidents", response_model=List[IncidentOut])
def list_incidents(status: Optional[str] = None, limit: int = 100, db: Session = Depends(get_db)):
    q = db.query(Incident)
    if status:
        q = q.filter(Incident.status == status)
    return q.order_by(desc(Incident.id)).limit(limit).all()


@router.get("/incidents/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    inc = db.query(Incident).get(incident_id)
    if not inc:
        raise HTTPException(404, "Incident not found")
    return inc


@router.get("/alerts", response_model=List[AlertOut])
def list_alerts(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Alert).order_by(desc(Alert.id)).limit(limit).all()


@router.post("/alerts/{alert_id}/ack")
def ack_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).get(alert_id)
    if not alert:
        raise HTTPException(404, "Alert not found")
    alert.acknowledged = True
    db.commit()
    return {"ok": True}


@router.post("/incidents/override")
def manual_override(req: OverrideRequest, db: Session = Depends(get_db)):
    inc = db.query(Incident).get(req.incident_id)
    if not inc:
        raise HTTPException(404, "Incident not found")
    service = db.query(Service).get(inc.service_id)

    if req.action == "force_resolve":
        inc.status = IncidentStatus.RESOLVED
        inc.recovery_result = "success"
        inc.escalation_note = (inc.escalation_note or "") + " [Manually resolved by administrator]"
        if service:
            service.status = ServiceStatus.HEALTHY
    elif req.action == "force_escalate":
        inc.status = IncidentStatus.ESCALATED
        inc.escalated = True
        inc.escalation_note = (inc.escalation_note or "") + " [Manually escalated by administrator]"
        if service:
            service.status = ServiceStatus.FAILED
    elif req.action == "retry_recovery":
        inc.status = IncidentStatus.RECOVERING
        inc.escalated = False
        if service:
            service.status = ServiceStatus.RECOVERING
    else:
        raise HTTPException(400, f"Unknown override action '{req.action}'")

    db.commit()
    return {"ok": True, "incident_id": inc.id, "new_status": inc.status.value}
