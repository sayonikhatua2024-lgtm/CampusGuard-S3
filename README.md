# CAMPUSGUARD
## Institutional Continuity Command Center

CampusGuard does not optimize uptime alone. It optimizes institutional continuity when everything cannot be preserved.

**LIVE DEMO:** [PENDING DEPLOYMENT]
**SOURCE:** [sayonikhatua2024-lgtm/CampusGuard-S3](https://github.com/sayonikhatua2024-lgtm/CampusGuard-S3)

---

## 1. Problem
Modern campus cyber-physical infrastructure assumes 100% availability. But when catastrophic power grid failure, coordinated network attacks, or extreme HVAC collapse occurs, standard systems fail blindly—shutting down mission-critical research and active online examinations alongside non-essential background tasks indiscriminately.

## 2. Why Existing AIOps Is Insufficient
Traditional AIOps asks: *"What service is down?"*
**CampusGuard asks:** *"What institutional obligation is at risk, what can be sacrificed, what must never be sacrificed, and what is the safest feasible recovery?"*

## 3. Solution
CampusGuard is a Self-Healing AI Operations Controller designed specifically for institutional and mission-critical environments. It acts as an autonomous deterministic governor that shifts power, computation, and network constraints selectively to protect defined continuity contracts.

## 4. Core Innovation
CampusGuard utilizes bounded deterministic search to construct intervention profiles dynamically mapped to institutional continuity contracts. Rather than raw failovers, CampusGuard guarantees SLA bounds via constrained mathematical optimization, maintaining safe operational telemetry restrictions.

## 5. Same Failure ≠ Same Optimal Response
CampusGuard's signature philosophy: Infrastructure states do not define the response. **Context defines the response.** A 30% power drop during an active online exam yields a radically different optimization plan than the exact same failure occurring during an empty campus emergency.

## 6. Architecture
- **SENSE:** Active telemetry ingestion tracking infrastructure bounds.
- **UNDERSTAND:** RCA and propagation analysis mapped to dependent missions.
- **ASSESS:** Institutional Continuity Contracts evaluated for SLA margin risk.
- **COUNTERFACT:** Safe forward projections evaluating hypothetical interventions without mutation.
- **OPTIMIZE:** Bounded determinism (Institutional Continuity Optimizer) fetching the lowest collateral cost intervention.
- **GOVERN:** State-bound human approval enforcement.
- **ACT:** Controlled isolated intervention simulation payload dispatch.
- **VERIFY:** Explicit post-action validation of predicted margins.
- **REPLAY:** Forensic provenance event reconstruction.

## 7. Signature Differentiators
1. Same Failure ≠ Same Optimal Response
2. Continuity Contracts
3. Institutional Continuity Optimizer (ICO)
4. State-Bound Approval
5. Less Evidence → Less Autonomy
6. Contract-Level Verification
7. Decision Replay / Provenance
8. Contract-Aware Greedy Baseline
9. Context-Switch Benchmark
10. Controlled Simulated Execution

## 8. Screen Gallery
The prototype commands 10 fully implemented functional screens:
1. **Command Center:** Real-time SLA analysis and telemetry tracking.
2. **Continuity Conflict:** Capacity modeling vs contract demands.
3. **Counterfactual Playground:** Non-mutating forward projection simulation.
4. **Recovery Tournament:** Fair algorithmic benchmarking and sacrifice comparison.
5. **Safety Gate:** State-bound human governance authorization.
6. **Controlled Execution:** Interventions and deterministic rollback validation.
7. **Recovery Verification:** Explicit post-action matrix validation.
8. **Degraded Telemetry:** Observability boundaries locking autonomous scope.
9. **Decision Replay:** Forensic provenance logging.
10. **Optimization Benchmark:** Methodological engine evaluation.

## 9. Technology Stack
- **Backend:** Python, FastAPI, SQLAlchemy, APScheduler
- **Algorithm:** Deterministic Search, IsolationForest (scikit-learn)
- **Frontend:** React, TailwindCSS, Vite
- **Infrastructure:** Docker, MySQL

## 10. Repository Structure
- `/backend`: Headless FastAPI engine, models, optimization bounds, and endpoints.
- `/frontend`: Monolithic React interface mapped cleanly via internal routing loops.
- `/docs`: Technical ideathon submissions and UI specifications.
- `/tests`: Isolated Pytest integrations natively ensuring schema boundaries without dependencies.

## 11. Local Setup
See docs/PUBLIC_DEMO.md for manual backend execution commands.
Create a `.env` file from the supplied `.env.example` templates prior to starting components.

## 12. Docker Setup
Run `docker compose up --build -d`
*(Note: Current development verification tests via Docker are limited natively by local OS kernel overlayfs issues. Code structure operates efficiently standalone and in properly hosted Docker daemons.)*

## 13. Public Deployment
Reference `docs/PUBLIC_DEMO.md` for Railway platform deployment parameters bridging the GitHub repo configuration dynamically.

## 14. Testing
Run the isolated automated test suite natively protecting schema bounds:
Run `PYTHONPATH=./backend python -m pytest backend/tests/ -v`

## 15. Security Note & Limitations
This is a competition prototype using controlled simulated campus infrastructure. Do not connect the public demo to real campus actuators. Execution is strictly bound inside simulated parameters to preserve environment boundaries. Benchmark results are deterministic prototype scenarios.

## 16. Future Roadmap
- **FUTURE / POST-SUBMISSION:**
  - Continuity Constitution / Policy Compiler
  - Confidence-Aware Optimization
  - Alternate-Path Replay
  - Formal Verification
  - Institutional Trade-off Ledger
  - Recovery Budget
  - Game Days
