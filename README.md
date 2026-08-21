# CampusGuard — Self-Healing Controller

Full stack: FastAPI + MySQL backend, React/Vite/Tailwind frontend, containerized with Docker Compose.

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env   # edit JWT_SECRET_KEY / ADMIN_PASSWORD for anything beyond local demo use
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8000  (docs at /docs)
- MySQL: localhost:3306

Default login: `admin` / `admin123` (from `backend/.env.example` — change before any real deployment).

Deploying frontend + backend on different hosts? Set `FRONTEND_API_BASE_URL` before `docker compose build`
so the browser bundle points at the right backend (Vite bakes this in at build time, not runtime).

## Local dev (without Docker)

**Backend**
```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# needs a running MySQL matching backend/.env, or point MYSQL_* at one you have
export $(cat .env.example | grep -v '^#' | xargs)   # or use python-dotenv / your own env loading
uvicorn app.main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## What was added on top of your uploads

Your uploads had the full application code but were missing everything needed to actually
install and run it. Added:

- `backend/requirements.txt` — wasn't present at all. Pinned versions were installed and the
  whole app was smoke-tested (import → bootstrap DB → login → hit dashboard/incidents endpoints
  → run one orchestrator tick) against SQLite to confirm nothing is missing or broken.
- `backend/Dockerfile` — only a frontend Dockerfile existed; there was no way to containerize the API.
- `docker-compose.yml` — nothing tied MySQL + backend + frontend together.
- `backend/.env.example` — matches the env vars actually read by `config.py` / `auth_config.py`.
- Proper `app/` package layout (`app/api`, `app/engine`, `app/ml`, `app/telemetry`) assembled from
  your flat file uploads, matching the import paths already used inside the code.

## Bug found and fixed

`passlib[bcrypt]` breaks at import time with `bcrypt>=4.1` (removed `__about__` attribute that
passlib's version probing relies on) — the app would crash immediately on the first login attempt.
Pinned `bcrypt==4.0.1` in `requirements.txt` to fix it. Verified with a real login round-trip.

## Minor note (not a bug)

The dashboard screenshot mock showed **7 services**; `orchestrator.py`'s `DEFAULT_SERVICES` seeds
**8**. Not an error — just flagging the discrepancy in case the mock was meant to match exactly.

## Frontend env var naming

Reconciled a mismatch: the dashboard code I wrote earlier used `VITE_API_URL`, but your existing
`_env.example` used `VITE_API_BASE_URL`. Standardized on your existing name everywhere.
