from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Service, Metric, Incident, IncidentStatus, ServiceStatus
from app.schemas import ServiceOut, MetricOut, DashboardStats
from app.auth import get_current_user

router = APIRouter(
    prefix="/api/dashboard", tags=["dashboard"], dependencies=[Depends(get_current_user)]
)


@router.get("/services", response_model=List[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).order_by(Service.name).all()


@router.get("/services/{service_id}/metrics", response_model=List[MetricOut])
def service_metrics(service_id: int, limit: int = 60, db: Session = Depends(get_db)):
    rows = (
        db.query(Metric)
        .filter(Metric.service_id == service_id)
        .order_by(Metric.id.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(rows))


@router.get("/stats", response_model=DashboardStats)
def stats(db: Session = Depends(get_db)):
    total_services = db.query(Service).count()
    healthy = db.query(Service).filter(Service.status == ServiceStatus.HEALTHY).count()
    degraded = db.query(Service).filter(Service.status == ServiceStatus.RECOVERING).count()
    failed = db.query(Service).filter(Service.status == ServiceStatus.FAILED).count()

    active_incidents = (
        db.query(Incident)
        .filter(Incident.status.in_([
            IncidentStatus.DETECTED, IncidentStatus.DIAGNOSING, IncidentStatus.RECOVERING
        ]))
        .count()
    )
    total_incidents = db.query(Incident).count()

    resolved = db.query(Incident).filter(Incident.recovery_result == "success").count()
    failed_recoveries = db.query(Incident).filter(Incident.recovery_result == "failed").count()
    attempted = resolved + failed_recoveries
    success_rate = (resolved / attempted * 100) if attempted else 100.0

    avg_recovery_time = (
        db.query(func.avg(Incident.recovery_time_seconds))
        .filter(Incident.recovery_result == "success")
        .scalar()
    ) or 0.0

    ai_actions = db.query(Incident).filter(Incident.ai_decision.isnot(None)).count()

    return DashboardStats(
        total_services=total_services,
        healthy_services=healthy,
        degraded_services=degraded,
        failed_services=failed,
        active_incidents=active_incidents,
        total_incidents=total_incidents,
        recovery_success_rate=round(success_rate, 1),
        average_recovery_time=round(avg_recovery_time, 1),
        ai_recovery_actions_taken=ai_actions,
    )
