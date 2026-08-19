# SentryCore — Self-Healing AI Operations Controller

A **software-only** AI-powered self-healing controller for a simulated college
campus's digital infrastructure (servers, databases, APIs, network, CCTV, IoT,
cloud apps). It continuously monitors software-generated telemetry, detects
anomalies with machine learning, diagnoses probable root causes, decides on
and executes a recovery action, verifies the outcome, and escalates to a
human administrator when automated recovery fails — all visible on a live
React dashboard.

No physical infrastructure is touched. Every "server" and "failure" is
simulated in-process; recovery actions manipulate that simulation exactly the
way a real action (`docker restart`, connection-pool reset, failover) would
affect real infrastructure.

## Architecture

```
Telemetry Simulator  →  Anomaly Detection (Isolation Forest)  →  Root Cause Analysis
        │                                                              │
        │                                                              ▼
        │                                                    AI Decision Engine
        │                                                              │
        │                                                              ▼
        └──────────────────────────────────────────────────  Recovery Executor
                                                                        │
                                                                        ▼
                                                              Verification
                                                               │        │
                                                        healthy│        │still failing
                                                               ▼        ▼
                                                          Resolved   Retry → Escalate
```

All of this runs inside `app/engine/orchestrator.py`, ticking every
`MONITOR_INTERVAL_SECONDS` (default 3s) via APScheduler, and every step is
persisted to MySQL (`services`, `metrics`, `incidents`, `alerts` tables) so
the dashboard can show live state and full incident history.

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, MySQL 8, APScheduler
- **AI/ML:** scikit-learn (Isolation Forest) for anomaly detection, a rule-based
  policy table for recovery decisions (deterministic and auditable — safety
  property: the recovery *action* is never chosen by an LLM, only optionally
  explained by one)
- **Frontend:** React (Vite), Tailwind CSS, Recharts
- **Infra simulation:** an in-process Python telemetry generator with 8
  injectable failure types
- **Deployment:** Docker + Docker Compose

## Quick start (Docker Compose)

```bash
docker compose up --build
```

- Backend API: http://localhost:8000 (docs at `/docs`)
- Frontend dashboard: http://localhost:5173
- MySQL: localhost:3307 (user `healer` / password `healerpass`, db `self_healing_ops`)

The backend auto-creates its tables and seeds 8 demo services on startup —
no manual migration step needed for this prototype.

### Login

The dashboard is behind a login screen. Default demo credentials:

```
username: admin
password: admin123
```

Change these via the `ADMIN_USERNAME` / `ADMIN_PASSWORD` environment
variables in `docker-compose.yml` (or `backend/.env`), and set a real
`JWT_SECRET_KEY` before deploying anywhere beyond your own machine.
Authentication is a single seeded admin account issuing a JWT (8-hour expiry
by default) — every `/api/dashboard`, `/api/incidents`, `/api/alerts`, and
`/api/simulator` route requires a valid token; only `/api/auth/login` and
`/api/health` are public.

## Running locally without Docker

**Backend** (needs a running MySQL instance — update `backend/.env` or export
the `MYSQL_*` vars to point at it):

```bash
cd backend
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Using the failure simulator

From the dashboard's "Failure simulator" panel (or `POST /api/simulator/inject`
with `{"service_name": "...", "failure_type": "..."}`), inject one of:

`cpu_spike`, `memory_exhaustion`, `api_failure`, `db_connection_failure`,
`network_latency`, `service_crash`, `high_error_rate`, `container_failure`

Within a couple of monitor ticks you'll see: an anomaly flagged on the
service's metrics → an incident opened with a root cause and AI-chosen
recovery action → the action executed → verification → either **Resolved**
(with a recorded recovery time) or, after `MAX_RECOVERY_ATTEMPTS` failed
attempts, **Escalated** to the admin dashboard with a critical alert.

## Manual override

Any active incident can be manually resolved, retried, or escalated from the
dashboard's incident detail panel (`POST /api/incidents/override`), matching
the brief's requirement for administrator override controls.

## Key API endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/login` | Log in with username/password, returns a JWT |
| `GET /api/dashboard/services` | Current status of every service (auth required) |
| `GET /api/dashboard/services/{id}/metrics` | Recent telemetry for charts |
| `GET /api/dashboard/stats` | Health %, recovery success rate, avg recovery time |
| `GET /api/incidents` | Incident history (filterable by `status`) |
| `GET /api/alerts` | Live alert/notification stream |
| `POST /api/incidents/override` | Manual override (resolve/retry/escalate) |
| `POST /api/simulator/inject` | Inject a synthetic failure |

## Notes on the AI decision engine

The decision engine uses a deterministic, auditable rule table mapping each
diagnosed failure type to a safe recovery action and a confidence score, with
an escalating fallback strategy (switch to backup) if the first attempt
fails. This is deliberate: automated infrastructure recovery should be
reproducible and explainable, not a black box. If `ANTHROPIC_API_KEY` is set
in the backend environment, the engine additionally asks Claude to phrase the
operator-facing explanation shown on the incident card — purely a
presentation layer over a decision that was already made deterministically.

## Project structure

```
self-healing-controller/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + scheduler wiring
│   │   ├── config.py            # env-driven settings (MySQL, tuning)
│   │   ├── database.py          # SQLAlchemy engine/session
│   │   ├── models.py            # Service, Metric, Incident, Alert
│   │   ├── schemas.py           # Pydantic response models
│   │   ├── auth_config.py       # JWT secret, admin credentials
│   │   ├── auth.py              # password check, JWT issue/verify
│   │   ├── telemetry/simulator.py
│   │   ├── ml/anomaly_detector.py
│   │   ├── engine/
│   │   │   ├── root_cause.py
│   │   │   ├── decision_engine.py
│   │   │   ├── recovery_actions.py
│   │   │   ├── verifier.py
│   │   │   └── orchestrator.py
│   │   └── api/routes_auth.py, routes_dashboard.py, routes_incidents.py, routes_simulator.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── auth.jsx             # login state, JWT storage
│   │   └── components/          # includes Login.jsx
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
```
