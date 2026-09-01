import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from sqlalchemy import text
from app.database import Base, engine
from app.config import MONITOR_INTERVAL_SECONDS, CORS_ALLOW_ORIGINS
from app.engine.orchestrator import orchestrator
from app.api import (
    routes_dashboard,
    routes_incidents,
    routes_simulator,
    routes_auth,
    routes_campusguard,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("campusguard")

app = FastAPI(title="CampusGuard Institutional Continuity Command Center", version="4.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_auth.router)
app.include_router(routes_dashboard.router)
app.include_router(routes_incidents.router)
app.include_router(routes_simulator.router)
app.include_router(routes_campusguard.router)

scheduler = BackgroundScheduler()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    try:
        with engine.connect() as conn:
            for col, col_type in [
                ("population_impact", "FLOAT DEFAULT 0.5"),
                ("time_criticality", "FLOAT DEFAULT 0.5"),
                ("recoverability", "FLOAT DEFAULT 0.5"),
                ("safety_criticality", "FLOAT DEFAULT 0.1"),
                ("mission_utility", "FLOAT DEFAULT 50.0"),
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE mission_activities ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception as col_err:
                    err_msg = str(col_err).lower()
                    if "duplicate column" in err_msg or "already exists" in err_msg or "operationalerror" in err_msg:
                        logger.debug("Column %s migration check: %s", col, col_err)
                    else:
                        logger.warning("Column addition %s failed: %s", col, col_err)
    except Exception as e:
        logger.warning("Database startup migration check failed: %s", e)

    orchestrator.bootstrap_services()
    scheduler.add_job(
        _safe_tick, "interval", seconds=MONITOR_INTERVAL_SECONDS, id="monitor_tick", max_instances=1
    )
    scheduler.start()
    logger.info("CampusGuard Controller started. Monitoring loop every %ss", MONITOR_INTERVAL_SECONDS)


@app.on_event("shutdown")
def on_shutdown():
    scheduler.shutdown(wait=False)


def _safe_tick():
    try:
        orchestrator.tick()
    except Exception:
        logger.exception("Monitoring tick failed")


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "CampusGuard",
        "version": "4.2.0"
    }
