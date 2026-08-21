# CAMPUSGUARD — DEPLOYMENT & DEMO GUIDE
## Institutional Continuity Command Center

---

## 1. Canonical Public Deployment Architecture

CampusGuard is architected for a standard split cloud deployment with a clear security boundary:

```
PUBLIC FRONTEND (Vite / Static Web Service)
        ↓ HTTPS (REST API)
PUBLIC BACKEND (FastAPI / Uvicorn API Service)
        ↓ TCP (SQLAlchemy 2.0)
MANAGED MYSQL 8.0 (Relational Data & State Store)
```

```
+-------------------------------------------------------------+
|                      DEPLOYMENT TARGETS                     |
|                                                             |
|  Frontend: Public Web Service (Vercel / Netlify / Railway)  |
|  Backend:  Public API Service (Railway / Render / AWS ECS)  |
|  Database: Managed MySQL 8.0 Instance (Railway / PlanetScale|
|            / AWS RDS / Cloud SQL)                           |
+-------------------------------------------------------------+
```

### Production Deployment Specifications

#### A. Backend API Service
- **Root Directory:** `/backend`
- **Build / Runtime:** Python 3.11 (`pip install -r requirements.txt`)
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}`
- **Health Check Endpoint:** `GET /api/health` (Returns `{"status": "ok", "service": "CampusGuard", "version": "4.2.0"}`)
- **Required Environment Variables:**
  | Variable | Description | Example / Requirement |
  | :--- | :--- | :--- |
  | `DATABASE_URL` | MySQL Connection URI | `mysql+pymysql://<user>:<pwd>@<host>:<port>/<db>?charset=utf8mb4` |
  | `MYSQL_HOST` | Database Host (if using individual vars) | `mysql.internal` |
  | `MYSQL_USER` | Database Username | Provided by managed MySQL |
  | `MYSQL_PASSWORD` | Database Password | **Required** (Do NOT use dev defaults) |
  | `MYSQL_DB` | Database Schema Name | `campusguard_ops` |
  | `MYSQL_PORT` | Database Port | `3306` |
  | `JWT_SECRET_KEY` | Secret for signing auth tokens | **Required** (Random 64-char hex string) |
  | `ADMIN_USERNAME` | Production Admin Username | `admin` |
  | `ADMIN_PASSWORD` | Production Admin Password | **Required** (Strong unique password) |
  | `CORS_ALLOW_ORIGINS`| Allowed Frontend URL | `https://your-frontend-domain.com` |
  | `MONITOR_INTERVAL_SECONDS` | Telemetry loop cadence | `3` |

#### B. Frontend Web Service
- **Root Directory:** `/frontend`
- **Build / Runtime:** Node.js 20 (`npm ci`)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Required Environment Variables:**
  | Variable | Description | Example |
  | :--- | :--- | :--- |
  | `VITE_API_BASE_URL` | Deployed backend API URL | `https://your-backend-api.com` |

#### C. Database Service
- **Engine:** MySQL 8.0+
- **Configuration:** Tables and initial data seeding are bootstrapped automatically by the backend on first startup via `Base.metadata.create_all` and `orchestrator.bootstrap_services()`.

---

## 2. Public vs. Local Environment Separation

> [!WARNING]
> **Production Security Mandate:** Development defaults (`admin123`, `healerpass`, `rootpass`, `change-this-secret-in-production`) are strictly for local offline exploration. They MUST NOT be used in public deployments.

| Property | Local Development / Demo | Public Cloud Deployment |
| :--- | :--- | :--- |
| **Backend Engine** | `127.0.0.1:8000` via Uvicorn | Managed container on cloud provider |
| **Frontend Web** | `localhost:5173` via Vite Dev Server | Built static SPA on edge CDN / Nginx |
| **Database** | Docker MySQL (`localhost:3307`) or SQLite test | Managed MySQL 8.0 (e.g. AWS RDS, Railway MySQL) |
| **Credentials** | Documented convenient defaults | Secure environment-provided secrets |
| **JWT Secret** | Development default allowed locally | Cryptographically secure random secret |
| **Public Status** | Local host | **[PENDING USER CLOUD PROVISIONING]** |

---

## 3. Local Demo Run Instructions

### Step 1: Start Database & Backend
```powershell
# Option A: Full Docker Compose
docker compose up --build -d

# Option B: Native Python Backend
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Set development environment
$env:MYSQL_HOST="localhost"
$env:MYSQL_PORT="3307"
$env:MYSQL_USER="healer"
$env:MYSQL_PASSWORD="healerpass"
$env:MYSQL_DB="self_healing_ops"
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Step 2: Start Frontend
```powershell
cd frontend
npm ci
npm run dev
```

### Step 3: Access Application
- **URL:** `http://localhost:5173`
- **Demo Username:** `admin`
- **Demo Password:** `admin123`

---

## 4. Judging & Demo Walkthrough

1. **Observe Baseline:** Open `Command Center` (`/`) to review infrastructure capacity, mission margins, and active contracts.
2. **Inject Stress:** Use the failure simulator or backend power drop endpoint to simulate a -30% power grid loss.
3. **Inspect Continuity Conflict:** View the capacity shortfall and switch institutional contexts (Exam vs Research vs Emergency) to demonstrate *Same Failure ≠ Same Optimal Response*.
4. **Evaluate Strategies:** Open `Recovery Tournament` to inspect the candidate plan ranking (Do Nothing vs Greedy vs ICO).
5. **State-Bound Authorization:** In `Safety Gate`, sign off with human rationale. If state drifts before execution, witness automatic invalidation.
6. **Simulated Execution & Verification:** Execute the plan in `Controlled Execution` (dry-run then live dispatch) and verify post-action contract margins in `Recovery Verification`.
7. **Telemetry Degradation:** In `Degraded Telemetry`, simulate sensor failure to verify the *"Less Evidence → Less Autonomy"* constraint.
8. **Forensic Replay:** Inspect the immutable provenance chain in `Decision Replay`.
9. **Benchmark Analysis:** Review the deterministic 30-scenario stress evaluation in `Optimization Benchmark`.

### Demo State Reset
To revert all optimizations and simulated telemetry damage back to pristine baseline for judging:
1. Navigate to **Degraded Telemetry** and click **Restore All Telemetry**.
2. Click the simulation reset button or call `POST /api/simulator/reset`.
