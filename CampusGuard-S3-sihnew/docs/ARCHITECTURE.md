# CampusGuard — System Architecture

```mermaid
flowchart TD
    subgraph SENSE ["1. SENSE: Observability & Telemetry Ingestion"]
        T1["Power Grid Telemetry"] --> TM["Telemetry Manager / Health Evaluator"]
        T2["Core Network Flow"] --> TM
        T3["Cooling & HVAC Sensor Data"] --> TM
        TM -->|Confidence Score & Anomaly Check| EV["Evidence Assessment"]
    end

    subgraph UNDERSTAND ["2. UNDERSTAND: Incident & Dependency Propagation"]
        EV --> RCA["IsolationForest Anomaly Detector & Root Cause Engine"]
        RCA --> DEP["Cascading Dependency Graph (NetworkX/Matrix)"]
        DEP --> IMP["Mission Impact Engine (Degradation Propagation)"]
    end

    subgraph ASSESS ["3. ASSESS: Continuity Contracts & SLA Margin"]
        IMP --> CM["Continuity Margin Evaluator"]
        CC["Institutional Continuity Contracts"] --> CM
        CM -->|"Capacity < Protected Demand"| CONF["Continuity Conflict Detector"]
    end

    subgraph EXPLORE ["4. EXPLORE: Safe Counterfactual Projection"]
        CONF --> CF["Counterfactual Projection Engine"]
        CF -.->|"What-If Parameter Adjustments (No Live Mutation)"| PROJ["Predicted Margin Outcome"]
    end

    subgraph OPTIMIZE ["5. OPTIMIZE: Institutional Continuity Optimizer (ICO)"]
        CONF --> ICO["Institutional Continuity Optimizer (ICO)"]
        ICO -->|"Deterministic Bounded Search"| DL["Multi-Stage Degradation Ladder"]
        DL --> TOURN["Recovery Plan Tournament"]
        TOURN -->|"Greedy vs ICO vs Do-Nothing Evaluation"| CAND["Ranked Candidate Recovery Plans"]
    end

    subgraph GOVERN ["6. GOVERN: State-Bound Safety Gate"]
        CAND --> SG["Safety Gate Policy Engine"]
        SG -->|"Less Evidence -> Less Autonomy"| CONF_GATE["Telemetry Confidence Gate"]
        SG -->|"State-Bound Fingerprint Binding"| FINGERPRINT["Cryptographic State Token"]
        CONF_GATE --> APPR["Human-in-the-Loop Operator Authorization"]
        FINGERPRINT --> APPR
    end

    subgraph ACT ["7. ACT: Two-Phase Controlled Execution"]
        APPR -->|"State Drift Check"| DRIFT{"State Changed?"}
        DRIFT -->|"Yes"| INV["APPROVAL INVALIDATED (Re-evaluation Required)"]
        DRIFT -->|"No"| DRY["Phase 1: Dry-Run Sandbox Simulation"]
        DRY --> DISPATCH["Phase 2: Live Intervention Payload Dispatch"]
        DISPATCH -->|"Deterministic Rollback Available"| RB["Rollback Plan"]
    end

    subgraph VERIFY ["8. VERIFY & AUDIT: Explicit Verification & Provenance"]
        DISPATCH --> VER["Post-Action Contract-Level Verification"]
        VER -->|"Predicted vs Actual Margin Matrix"| V_LEDGER["Verification Ledger"]
        DISPATCH --> AUD["Forensic Replay & Provenance Ledger"]
        AUD --> BM["Continuous Resilience Benchmark Evaluator"]
    end
```

---

## 1. Architectural Philosophy

### Uptime vs. Institutional Continuity
Traditional AIOps platforms optimize exclusively for **infrastructure uptime** (e.g. *Which VM crashed? Is ping responding?*). 

In mission-critical, cyber-physical campus environments (academic medical centers, high-performance research clusters, life-safety operations, synchronous examination centers), 100% capacity is not always preservable during severe physical disturbances.

**CampusGuard optimizes institutional continuity:**
- Identifies which institutional obligations are threatened.
- Evaluates what non-critical demand can be safely shed.
- Enforces non-negotiable SLA contracts as strict mathematical boundary constraints.
- Employs deterministic bounded search to construct minimal-collateral-damage recovery strategies.

---

## 2. Core Subsystems

### A. Telemetry & Evidence Confidence
- **Telemetry Manager** calculates an aggregate **Observability Confidence Score** (0–100) across physical power, network, and environmental sensors.
- **"Less Evidence → Less Autonomy" Invariant**: When sensor confidence degrades or goes stale, high-risk automated intervention scopes are blocked.

### B. Mission & Dependency Graph
- **Missions**: Critical organizational workflows (e.g., `life_safety`, `exam_delivery`, `research_hpc`, `student_wifi`).
- **Continuity Contracts**: Define priority levels, minimum capacity thresholds, maximum allowed downtime, and collateral penalty weights.
- **Impact Propagation**: Computes second- and third-order cascading impacts across interconnected systems when root infrastructure fails.

### C. Institutional Continuity Optimizer (ICO)
- Evaluates candidate load-shedding permutations against hard contract bounds.
- Generates a **Degradation Ladder** prioritizing high-elasticity, low-criticality services (e.g., streaming Wi-Fi, background analytics) while protecting zero-tolerance contracts.
- **Recovery Tournament**: Fairly pits ICO against standard heuristics (Greedy capacity shedding, Static priority, Do-nothing) to prove mathematical optimality and SLA preservation.

### D. State-Bound Governance & Safety Gate
- Approvals are cryptographically bound to an exact **State Fingerprint** (`telemetry_hash + context_id + contract_state`).
- **State Drift Detection**: If infrastructure telemetry or institutional context changes between approval and execution, the approval is invalidated.

### E. Two-Phase Execution & Verification
- **Phase 1 (Dry Run)**: Validates safety invariants without altering live state.
- **Phase 2 (Dispatch)**: Applies simulated actuator commands with rollback checkpoints.
- **Verification Engine**: Decoupled from execution; tests actual post-action metrics against predicted outcomes to independently certify SLA recovery.

### F. Forensic Decision Replay & Provenance
- Immutable event stream recording every transition (`FAILURE_DETECTED`, `CONFLICT_ANALYZED`, `PLAN_OPTIMIZED`, `SAFETY_EVALUATED`, `OPERATOR_APPROVED`, `INTERVENTION_EXECUTED`, `CONTRACTS_VERIFIED`).
