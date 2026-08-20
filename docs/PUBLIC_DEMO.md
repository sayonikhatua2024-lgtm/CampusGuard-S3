# CAMPUSGUARD — PUBLIC DEMO DEPLOYMENT

## Overview
CampusGuard is architected for a standard split deployment. The React frontend interacts with the FastAPI backend engine strictly via RESTful interfaces, with the backend orchestrating data states within a managed MySQL/SQLite boundary.

**Public Frontend URL:** [PENDING DEPLOYMENT]
**Public Backend URL:** [PENDING DEPLOYMENT]

## Recommended Deployment Model (Railway / Vercel)
The root repository is structured safely for monolithic routing to separate managed paths.

### 1. Backend Service
- **Root Directory:** `/backend`
- **Build Provider:** Nixpacks or Docker
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Required Env Variables:**
    - `CORS_ALLOW_ORIGINS` (Target to deployed frontend URL e.g., `https://campusguard.vercel.app`)
    - `DATABASE_URL` or `MYSQL_HOST/MYSQL_USER...` (Target to managed DB. Note: Can use `sqlite:///:memory:` for ephemeral demo instances)
    - `JWT_SECRET_KEY`

### 2. Frontend Service
- **Root Directory:** `/frontend`
- **Build Provider:** Node / Vite
- **Build Command:** `npm run build`
- **Required Env Variables:**
    - `VITE_API_BASE_URL` (Target to the deployed Backend URL)

### 3. Database
Use a managed MySQL integration binding the credentials dynamically to the Backend environment constraints.

## Demo Credentials
To access the platform upon load:
- **Username:** `admin`
- **Password:** `admin123`
*(Ensure these match your `.env` constraints).*

## Demo State Reset
To revert all optimizations and simulated telemetry damage back to pristine conditions for judging, navigate to `Degraded Telemetry` and select **Restore All Telemetry**, then use `api.demoReset()` internally if bound to reset the forensic ledger.

The demo scenarios rely strictly on context switching parameters explicitly controlled by the frontend interactions mirroring backend states.
