# CAMPUSGUARD — JUDGE FAQ

**Why not standard AIOps?**
Traditional AIOps solutions are strictly focused on maintaining infrastructure uptime. CampusGuard is designed for institutional continuity. Rather than asking "What service is down?", CampusGuard asks "What institutional obligation is at risk, what can be safely sacrificed, what must never be sacrificed, and what is the safest recovery path?"

**Why is this an AI/optimization problem?**
Complex campus environments (hospitals, research labs, high-density exam networks) have intersecting and dynamically shifting dependencies. Manually evaluating safe load-shedding configurations against strict SLAs during a catastrophic event requires processing thousands of multi-variate permutations rapidly. Deterministic optimization ensures non-negotiable boundaries aren't accidentally violated under pressure.

**Why not a simple priority system?**
A static priority system fails because institutional context changes. The same power grid failure occurring during an active online finals period demands a radically different shedding response than during an off-hours break.

**How is ICO different from greedy?**
A Greedy Shedding algorithm will simply kill the largest capacity consumers sequentially until stable, frequently violating mission-critical SLAs inadvertently. CampusGuard ICO uses a bounded search space explicitly protecting defined Continuity Contracts as mathematical hard constraints, guaranteeing feasibility and minimizing collateral degradation safely.

**What prevents unsafe execution?**
Execution boundaries enforce state-fingerprinting. An execution payload is strictly tied cryptographically to the exact telemetry reading, context setting, and evaluated contract constraints at the time of approval. If any variable drifts prior to dispatch, the execution is blocked autonomously.

**What happens if telemetry disappears?**
CampusGuard relies on the principle of "LESS EVIDENCE → LESS AUTONOMY". If a sensor drops off or an anomaly flag questions data integrity, the observability confidence score lowers, actively blocking high-risk interventions to protect the institution.

**What happens if infrastructure state changes after approval?**
The approval fingerprint becomes stale. The Safety Gate will throw a "STATE DRIFT DETECTED" error, explicitly blocking execution until the operator re-evaluates the pipeline.

**How is success verified?**
Success is evaluated completely decoupled from the execution dispatch logic. The Recovery Verification ledger compares predicted outcome matrices against actual post-action metrics, enforcing that execution success does not equal recovery success until confirmed.

**How was the benchmark designed?**
The benchmark engine was structured as a fair determinism suite running 30 exact standardized scenarios (varying from single failures to catastrophic stress thresholds) identically across competing strategy paths to transparently analyze collateral damage profiles without fabrication.

**Is this live campus infrastructure?**
No. This is a competition prototype utilizing a controlled simulated engine representing campus boundaries perfectly mirroring live architectures for safely demonstrating algorithm paths.

**How would this become production software?**
CampusGuard's headless backend API would wire its ingestion engines strictly to physical actuator SCADA interfaces (HVAC systems, smart grid controllers, SDN network configs) alongside production ITSM inputs (ServiceNow, Jira) relying on identical bounded constraint logic.
