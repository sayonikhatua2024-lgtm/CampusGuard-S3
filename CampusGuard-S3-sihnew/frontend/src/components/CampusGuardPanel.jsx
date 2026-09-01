import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Server,
  Activity,
  AlertTriangle,
  RotateCcw,
  Gauge,
  Sliders,
  Trophy,
  SlidersHorizontal,
  Workflow,
  Sparkles,
  Scale,
  Cpu,
  Radio,
  Check,
  X,
  Clock,
  Info,
  Play,
  Eye,
  CheckCheck,
  ShieldX,
  History,
  Undo2,
  BookOpen,
  BarChart3,
  Flame,
  RadioTower,
  Network,
  ChevronRight,
  GitBranch,
} from "lucide-react";
import { api } from "../api";

export default function CampusGuardPanel() {
  // Navigation
  const [activeTab, setActiveTab] = useState("operations"); // operations | provenance | replay | benchmark | demo

  // Data states
  const [missions, setMissions] = useState([]);
  const [contractsStatus, setContractsStatus] = useState([]);
  const [marginSummary, setMarginSummary] = useState(null);
  const [infraState, setInfraState] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterMission, setFilterMission] = useState("all");

  // Phase 4: Optimizer & Candidate Plans
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [conflictsData, setConflictsData] = useState(null);
  const [degradationLadder, setDegradationLadder] = useState([]);
  const [candidatePlans, setCandidatePlans] = useState([]);

  // Counterfactual Playground
  const [intervParams, setIntervParams] = useState({
    student_wifi_reduction: 0.60,
    analytics_shedding: 0.90,
    exam_traffic_shift: 0.80,
    research_compute_reduction: 0.28,
    noncritical_network_reduction: 0.40,
  });
  const [counterfactualResult, setCounterfactualResult] = useState(null);
  const [evaluatingCf, setEvaluatingCf] = useState(false);

  // Phase 5: Governance & Execution
  const [safetyCheck, setSafetyCheck] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [approvalReason, setApprovalReason] = useState("Authorized by campus operations supervisor");
  const [approverName, setApproverName] = useState("admin");
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  // Phase 6: Telemetry, Replay, Provenance, Benchmark, Demo
  const [telemetryStatus, setTelemetryStatus] = useState(null);
  const [replayTimeline, setReplayTimeline] = useState([]);
  const [provenanceData, setProvenanceData] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [contextSwitchData, setContextSwitchData] = useState(null);
  const [runningBenchmark, setRunningBenchmark] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [demoStep, setDemoStep] = useState(0);

  const loadData = async () => {
    try {
      const [
        mList,
        cStatus,
        mSummary,
        iState,
        iImpact,
        optRes,
        confRes,
        ladderRes,
        sCheck,
        latestExec,
        tStatus,
        rEvents,
      ] = await Promise.all([
        api.missions(),
        api.continuityContractsStatus(),
        api.continuityMargin(),
        api.continuityState(),
        api.continuityImpact(),
        api.optimizeContinuity(),
        api.continuityConflicts(),
        api.degradationLadder(),
        api.safetyCheck(),
        api.latestExecution(),
        api.telemetryStatus(),
        api.continuityReplay(50),
      ]);
      setMissions(mList);
      setContractsStatus(cStatus);
      setMarginSummary(mSummary);
      setInfraState(iState);
      setImpactData(iImpact);
      setOptimizationResult(optRes);
      setCandidatePlans(optRes?.candidate_plans || []);
      setConflictsData(confRes);
      setDegradationLadder(ladderRes);
      setSafetyCheck(sCheck);
      if (latestExec) setExecutionResult(latestExec);
      setTelemetryStatus(tStatus);
      setReplayTimeline(rEvents || []);
    } catch (err) {
      console.error("Failed to load CampusGuard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadProvenance = async () => {
    try {
      const prov = await api.decisionProvenance();
      setProvenanceData(prov);
    } catch (err) {
      console.error("Failed to load provenance", err);
    }
  };

  const handleRunBenchmark = async () => {
    try {
      setRunningBenchmark(true);
      const [bRes, csRes] = await Promise.all([
        api.runBenchmark(),
        api.runContextSwitch(),
      ]);
      setBenchmarkData(bRes);
      setContextSwitchData(csRes);
    } catch (err) {
      console.error("Benchmark failed", err);
    } finally {
      setRunningBenchmark(false);
    }
  };

  const handleInjectPower = async (pct = 30) => {
    try {
      setActionLoading(true);
      await api.injectPowerFailure(pct);
      await loadData();
      setApprovalStatus("PENDING");
    } catch (err) {
      console.error("Power failure injection failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setActionLoading(true);
      await api.resetInfra();
      await api.telemetryReset();
      await loadData();
      setCounterfactualResult(null);
      setExecutionResult(null);
      setApprovalStatus("PENDING");
      setDemoStep(0);
    } catch (err) {
      console.error("Reset failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTelemetry = async (source_id, currentAvailable) => {
    try {
      await api.telemetryDegrade(source_id, !currentAvailable);
      await loadData();
    } catch (err) {
      console.error("Telemetry toggle failed", err);
    }
  };

  const handleRunCounterfactual = async () => {
    try {
      setEvaluatingCf(true);
      const res = await api.evaluateCounterfactual(intervParams);
      setCounterfactualResult(res);
      const sc = await api.safetyCheck(intervParams, "plan-custom-override");
      setSafetyCheck(sc);
      setApprovalStatus("PENDING");
    } catch (err) {
      console.error("Counterfactual evaluation failed", err);
    } finally {
      setEvaluatingCf(false);
    }
  };

  const handleApprove = async () => {
    try {
      const planId = optimizationResult?.selected_plan?.plan_id || "plan-ico-optimal";
      await api.approvePlan(planId, approverName, approvalReason);
      setApprovalStatus("APPROVED");
      await loadData();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async () => {
    try {
      const planId = optimizationResult?.selected_plan?.plan_id || "plan-ico-optimal";
      await api.rejectPlan(planId, approverName, "Plan rejected by operator");
      setApprovalStatus("REJECTED");
      await loadData();
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleExecute = async (mode = "live") => {
    try {
      setExecuting(true);
      const planId = optimizationResult?.selected_plan?.plan_id || "plan-ico-optimal";
      const res = await api.executePlan(
        {
          plan_id: planId,
          approver: approverName,
          reason: approvalReason,
          override_params: counterfactualResult ? intervParams : null,
        },
        mode
      );
      setExecutionResult(res);
      await loadData();
    } catch (err) {
      console.error("Execution failed", err);
      alert(err.message || "Execution blocked by Safety Gate.");
    } finally {
      setExecuting(false);
    }
  };

  const activeMissions = missions.filter((m) => m.active);
  const isPowerDegraded = (infraState?.active_power_drop_pct || 0) > 0;
  const selectedPlan = optimizationResult?.selected_plan;
  const isApproved = approvalStatus === "APPROVED";
  const isBlocked = safetyCheck?.status === "BLOCKED";
  const requiresApproval = safetyCheck?.status === "APPROVAL_REQUIRED";
  const canExecute = (safetyCheck?.status === "SAFE_TO_EXECUTE" || isApproved) && !isBlocked;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top Banner: Navigation & Infrastructure Controls */}
      <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`h-11 w-11 rounded-lg border flex items-center justify-center shrink-0 ${
                isPowerDegraded
                  ? "bg-signal-crit/15 border-signal-crit/40 text-signal-crit"
                  : "bg-signal-info/15 border-signal-info/40 text-signal-info"
              }`}
            >
              {isPowerDegraded ? <Zap size={24} className="animate-pulse" /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  CampusGuard Institutional Continuity Optimizer (ICO)
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                    marginSummary?.overall_status === "VIOLATED"
                      ? "bg-signal-crit/15 text-signal-crit border-signal-crit/30"
                      : marginSummary?.overall_status === "AT_RISK"
                      ? "bg-signal-warn/15 text-signal-warn border-signal-warn/30"
                      : "bg-signal-ok/15 text-signal-ok border-signal-ok/30"
                  }`}
                >
                  Continuity: {marginSummary?.overall_status || "SAFE"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                    telemetryStatus?.is_degraded
                      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  Observability: {telemetryStatus?.confidence_level || "HIGH"} ({(telemetryStatus?.confidence_score * 100 || 100).toFixed(0)}%)
                </span>
              </div>
              <p className="text-xs text-base-500 mt-0.5 font-mono">
                Institutional Continuity Assurance · Risk-Weighted Governance · Benchmark Provenance
              </p>
            </div>
          </div>

          {/* Action Simulation Buttons */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            <button
              onClick={() => handleInjectPower(30)}
              disabled={actionLoading}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                isPowerDegraded
                  ? "bg-signal-crit/20 border-signal-crit text-signal-crit shadow-sm"
                  : "bg-signal-crit/10 border-signal-crit/40 hover:bg-signal-crit/20 text-signal-crit hover:border-signal-crit"
              }`}
            >
              <Zap size={13} />
              Inject Power Failure (-30%)
            </button>
            <button
              onClick={handleReset}
              disabled={actionLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-base-700 bg-base-850 hover:bg-base-800 text-xs font-mono text-base-500 hover:text-white transition-colors"
            >
              <RotateCcw size={13} className={actionLoading ? "animate-spin" : ""} />
              Reset System
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-lg border border-base-700 bg-base-850 hover:bg-base-800 text-base-500 hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-3 border-t border-base-800 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab("operations")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "operations"
                ? "bg-signal-info/20 text-signal-info border border-signal-info/40"
                : "bg-base-850 text-base-400 hover:text-white border border-base-800"
            }`}
          >
            <ShieldAlert size={14} /> Operations & Safety Gate
          </button>
          <button
            onClick={() => {
              setActiveTab("provenance");
              loadProvenance();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "provenance"
                ? "bg-signal-info/20 text-signal-info border border-signal-info/40"
                : "bg-base-850 text-base-400 hover:text-white border border-base-800"
            }`}
          >
            <BookOpen size={14} /> Decision Provenance
          </button>
          <button
            onClick={() => setActiveTab("replay")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "replay"
                ? "bg-signal-info/20 text-signal-info border border-signal-info/40"
                : "bg-base-850 text-base-400 hover:text-white border border-base-800"
            }`}
          >
            <History size={14} /> Audit & Replay Timeline ({replayTimeline.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("benchmark");
              if (!benchmarkData) handleRunBenchmark();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "benchmark"
                ? "bg-signal-info/20 text-signal-info border border-signal-info/40"
                : "bg-base-850 text-base-400 hover:text-white border border-base-800"
            }`}
          >
            <BarChart3 size={14} /> 30-Scenario Benchmark Suite
          </button>
        </div>
      </div>

      {/* Degraded Telemetry Alert Banner */}
      {telemetryStatus?.is_degraded && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-950/20 p-4 animate-fade-in shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <RadioTower className="text-amber-400 shrink-0 mt-0.5 animate-pulse" size={20} />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    TELEMETRY DEGRADED — Observability Deficit Detected ({telemetryStatus.confidence_level} Confidence: {(telemetryStatus.confidence_score * 100).toFixed(0)}%)
                  </h3>
                </div>
                <p className="text-xs text-amber-200/80 mt-1 font-mono">{telemetryStatus.reason}</p>
                {telemetryStatus.specific_restrictions?.length > 0 && (
                  <ul className="mt-2 text-xs font-mono text-amber-300 space-y-1">
                    {telemetryStatus.specific_restrictions.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Lock size={12} className="shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              onClick={() => api.telemetryReset().then(loadData)}
              className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold shrink-0"
            >
              Restore All Feeds
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OPERATIONS & SAFETY GATE                                           */}
      {/* ========================================================================= */}
      {activeTab === "operations" && (
        <>
          {/* Live Infrastructure Capacities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-base-900/90 border border-base-800 shadow">
              <div className="flex items-center gap-2.5">
                <Zap size={16} className={isPowerDegraded ? "text-signal-crit" : "text-signal-ok"} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-base-500 uppercase">Power Capacity</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {infraState ? `${(infraState.power_capacity * 100).toFixed(0)}%` : "100%"}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  isPowerDegraded
                    ? "bg-signal-crit/15 text-signal-crit border border-signal-crit/30"
                    : "bg-signal-ok/15 text-signal-ok border border-signal-ok/30"
                }`}
              >
                {isPowerDegraded ? `-30% Curtailment` : `Nominal`}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-base-900/90 border border-base-800 shadow">
              <div className="flex items-center gap-2.5">
                <Layers size={16} className={isPowerDegraded ? "text-signal-warn" : "text-signal-ok"} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-base-500 uppercase">Network Switch Fabric</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {infraState ? `${(infraState.network_capacity * 100).toFixed(0)}%` : "100%"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-base-600">Switch Alpha Hardware</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-base-900/90 border border-base-800 shadow">
              <div className="flex items-center gap-2.5">
                <Gauge size={16} className={isPowerDegraded ? "text-signal-crit" : "text-signal-ok"} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-base-500 uppercase">Data Center HVAC</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {infraState ? `${(infraState.hvac_capacity * 100).toFixed(0)}%` : "100%"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-base-600">CRAC Thermal Loop</span>
            </div>
          </div>

          {/* Contract Resource Conflict Warning Banner */}
          {conflictsData?.has_conflict && (
            <div className="rounded-xl border border-signal-crit/50 bg-signal-crit/10 p-4 animate-fade-in shadow-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-signal-crit shrink-0 mt-0.5" size={20} />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      RESOURCE CONFLICT DETECTED — Simultaneous Contract Demands Exceed Capacity Envelope
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-signal-crit/20 text-signal-crit border border-signal-crit/40">
                      {conflictsData.conflict_count} Conflicts
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    {conflictsData.conflicts.map((c, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-base-900/90 border border-signal-crit/30 text-xs font-mono">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-signal-crit">{c.resource}</span>
                          <span className="text-base-500">
                            Current: <strong className="text-white">{(c.current_capacity * 100).toFixed(0)}%</strong> vs Required: <strong className="text-signal-crit">{(c.required_capacity * 100).toFixed(0)}%</strong> (Deficit: -{(c.deficit * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <p className="text-base-400 mb-2">{c.description}</p>
                        <div className="text-[11px] text-base-500">
                          <span className="text-signal-warn font-semibold">Candidate Trade-Offs:</span>
                          <ul className="list-disc list-inside mt-0.5 text-base-400 space-y-0.5">
                            {c.trade_offs.map((to, tIdx) => (
                              <li key={tIdx}>{to}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Gate & Governance Console */}
          <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-base-800">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${
                    isBlocked
                      ? "bg-signal-crit/20 border-signal-crit/50 text-signal-crit"
                      : requiresApproval
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                      : "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                  }`}
                >
                  {isBlocked ? <ShieldX size={22} /> : requiresApproval ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Safety Gate & Human Governance Console
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                        isBlocked
                          ? "bg-signal-crit/20 text-signal-crit border-signal-crit/40"
                          : requiresApproval
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      Status: {safetyCheck?.status || "SAFE_TO_EXECUTE"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-base-800 text-base-300 border border-base-700">
                      Risk: {safetyCheck?.risk_class || "LOW"}
                    </span>
                  </div>
                  <p className="text-xs text-base-500 font-mono mt-0.5">
                    Deterministic Backend Authoritative Safety Validation · Policy Gate
                  </p>
                </div>
              </div>

              {/* Action Approval Status Badge */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-base-500">Approval State</span>
                  <span
                    className={`font-bold ${
                      approvalStatus === "APPROVED"
                        ? "text-emerald-400"
                        : approvalStatus === "REJECTED"
                        ? "text-signal-crit"
                        : "text-amber-400"
                    }`}
                  >
                    {approvalStatus === "APPROVED" ? "✓ AUTHORIZED" : approvalStatus === "REJECTED" ? "✕ REJECTED" : "⏱ PENDING REVIEW"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Risk & Reversibility Breakdown Table */}
            <div className="mb-5">
              <span className="text-[11px] uppercase tracking-wider text-base-500 font-medium block mb-2">
                Action Risk & Rollback Policy Breakdown ({safetyCheck?.actions_count || 0} Atomic Actions)
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-base-800 rounded-lg overflow-hidden">
                  <thead className="bg-base-850 text-base-400 text-[11px] uppercase border-b border-base-800">
                    <tr>
                      <th className="py-2.5 px-3">Proposed Action</th>
                      <th className="py-2.5 px-3">Parameter / Scope</th>
                      <th className="py-2.5 px-3">Risk Level</th>
                      <th className="py-2.5 px-3">Reversibility</th>
                      <th className="py-2.5 px-3">Rollback Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-800 bg-base-900/60">
                    {safetyCheck?.actions_breakdown?.map((act, idx) => (
                      <tr key={idx} className="hover:bg-base-850/50">
                        <td className="py-2.5 px-3 text-white font-semibold">{act.name}</td>
                        <td className="py-2.5 px-3 text-signal-info font-bold">{act.parameter}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              act.risk === "CRITICAL"
                                ? "bg-signal-crit/20 text-signal-crit border-signal-crit/40"
                                : act.risk === "HIGH"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : act.risk === "MEDIUM"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {act.risk}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Undo2 size={12} /> Reversible
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-base-500 text-[11px]">{act.rollback_action || "None"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Human Authorization & Governance Action Box */}
            <div className="p-4 rounded-xl bg-base-850/90 border border-base-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1 space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base-400">Approver Identity:</span>
                  <strong className="text-white bg-base-800 px-2 py-0.5 rounded border border-base-700">{approverName}</strong>
                  <span className="text-base-600 text-[11px]">(Operations Supervisor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base-400">Justification:</span>
                  <input
                    type="text"
                    value={approvalReason}
                    onChange={(e) => setApprovalReason(e.target.value)}
                    className="bg-base-900 border border-base-700 text-xs text-base-300 rounded px-2.5 py-1 w-full max-w-md focus:outline-none focus:border-signal-info"
                  />
                </div>
              </div>

              {/* Authorization Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleApprove}
                  disabled={isBlocked || isApproved}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                    isApproved
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500 cursor-default"
                      : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:border-emerald-500"
                  }`}
                >
                  <Check size={13} />
                  {isApproved ? "Plan Authorized" : "Authorize & Approve Plan"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isBlocked}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold border border-signal-crit/40 bg-signal-crit/10 hover:bg-signal-crit/20 text-signal-crit transition-all"
                >
                  <X size={13} />
                  Reject Plan
                </button>
                <button
                  onClick={() => handleExecute("dry_run")}
                  disabled={executing}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition-all"
                >
                  <Eye size={13} />
                  Dry-Run Preview
                </button>
                <button
                  onClick={() => handleExecute("live")}
                  disabled={!canExecute || executing}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all shadow-md ${
                    canExecute
                      ? "bg-emerald-500 text-base-950 hover:bg-emerald-400 cursor-pointer"
                      : "bg-base-800 text-base-600 border border-base-700 cursor-not-allowed"
                  }`}
                >
                  <Play size={13} className={executing ? "animate-spin" : ""} />
                  Execute Governed Recovery
                </button>
              </div>
            </div>
          </div>

          {/* Post-Action Technical & Contract Verification Panel */}
          {executionResult && (
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-base-900/90 p-5 shadow-lg animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-base-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCheck size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        Post-Action Technical & Contract Verification
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                          executionResult.verification_status === "CONTRACT_SATISFIED"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        }`}
                      >
                        {executionResult.verification_status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-base-800 text-base-400 border border-base-700">
                        Mode: {executionResult.mode.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-base-400 mt-0.5 font-mono">
                      Execution ID: {executionResult.execution_id} · Timestamp: {new Date(executionResult.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-base-500 text-[11px]">Approver: <strong className="text-white">{executionResult.approver}</strong></span>
                </div>
              </div>

              {/* Complete Metric Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-left font-mono text-xs border border-base-800 rounded-lg overflow-hidden">
                  <thead className="bg-base-850 text-base-400 text-[11px] uppercase border-b border-base-800">
                    <tr>
                      <th className="py-2.5 px-3">Service / Metric</th>
                      <th className="py-2.5 px-3 text-center">Required SLA</th>
                      <th className="py-2.5 px-3 text-center">Before Execution</th>
                      <th className="py-2.5 px-3 text-center">Predicted Outcome</th>
                      <th className="py-2.5 px-3 text-center">After Execution</th>
                      <th className="py-2.5 px-3 text-center">Final Margin</th>
                      <th className="py-2.5 px-3 text-center">SLA Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-800 bg-base-900/70">
                    {executionResult.verification_comparison?.map((row, idx) => (
                      <tr key={idx} className="hover:bg-base-850/50">
                        <td className="py-2.5 px-3 text-white font-semibold">{row.service}</td>
                        <td className="py-2.5 px-3 text-center text-base-400 font-bold">≥ {(row.required_threshold * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-3 text-center text-signal-crit font-bold">{(row.before * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-3 text-center text-signal-info font-bold">{(row.predicted * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">{(row.after * 100).toFixed(0)}%</td>
                        <td className="py-2.5 px-3 text-center text-emerald-400 font-bold">
                          {row.margin >= 0 ? "+" : ""}{(row.margin * 100).toFixed(0)}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              row.meets_sla
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : "bg-signal-crit/15 text-signal-crit border-signal-crit/30"
                            }`}
                          >
                            {row.meets_sla ? "✓ PASSED" : "✕ FAILED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: Selected Optimizer Recommendation Banner */}
          {selectedPlan && (
            <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-base-900/90 to-base-900/90 p-5 shadow-lg">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        ICO Decision Engine: Recommended Recovery Plan
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {selectedPlan.name}
                      </span>
                    </div>
                    <p className="text-xs text-base-400 mt-0.5 font-mono">
                      {optimizationResult.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex flex-col items-end">
                    <span className="text-base-500 text-[10px]">Intervention Cost</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedPlan.intervention_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-base-500 text-[10px]">Collateral Impact</span>
                    <span className="text-sm font-bold text-amber-400">{selectedPlan.collateral_degradation.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-base-500 text-[10px]">Min Margin</span>
                    <span className="text-sm font-bold text-emerald-400">+{selectedPlan.min_overall_margin.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Plan Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-base-800 text-xs font-mono">
                <div className="p-3 rounded-lg bg-base-850/80 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 font-semibold block mb-1">
                    Optimized Interventions
                  </span>
                  <ul className="space-y-1 text-base-300">
                    {selectedPlan.sacrificed_services?.map((svc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check size={12} className="text-emerald-400 shrink-0" /> {svc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-base-850/80 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 font-semibold block mb-1">
                    Binding Constraints & Guarantees
                  </span>
                  <ul className="space-y-1 text-base-300">
                    {optimizationResult.binding_constraints?.map((bc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Lock size={11} className="text-blue-400 shrink-0" /> {bc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-base-850/80 border border-base-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-base-500 font-semibold block mb-1">
                      Observability Telemetry State
                    </span>
                    <div className="space-y-1 mt-1 text-[11px]">
                      {telemetryStatus?.sources?.map((s) => (
                        <div key={s.source_id} className="flex items-center justify-between">
                          <span className="text-base-400 truncate max-w-[150px]">{s.name}</span>
                          <button
                            onClick={() => handleToggleTelemetry(s.source_id, s.available)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              s.available
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-signal-crit/20 hover:text-signal-crit"
                                : "bg-signal-crit/15 text-signal-crit border-signal-crit/30 hover:bg-emerald-500/20 hover:text-emerald-400"
                            }`}
                          >
                            {s.available ? "ONLINE" : "OFFLINE"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recovery Plan Tournament */}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Trophy size={13} className="text-amber-400" /> Recovery Plan Tournament ({candidatePlans.length} Candidate Strategies)
              </span>
              <span className="text-[10px] font-mono text-base-600">Objective: Min Cost Feasible Solution</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {candidatePlans.map((plan) => {
                const isWinner = plan.plan_id === selectedPlan?.plan_id;
                const isFeasible = plan.is_feasible;

                return (
                  <div
                    key={plan.plan_id}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all relative ${
                      isWinner
                        ? "border-emerald-500/60 bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/40"
                        : isFeasible
                        ? "border-base-700 bg-base-900/90 hover:border-base-600"
                        : "border-signal-crit/30 bg-base-900/60 opacity-80"
                    }`}
                  >
                    {isWinner && (
                      <div className="absolute -top-2.5 right-3 bg-emerald-500 text-base-950 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                        <Sparkles size={10} /> ICO Winner
                      </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-xs leading-snug">{plan.name}</h4>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase shrink-0 border ${
                            isFeasible
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-signal-crit/15 text-signal-crit border-signal-crit/30"
                          }`}
                        >
                          {isFeasible ? "FEASIBLE" : "INFEASIBLE"}
                        </span>
                      </div>
                      <p className="text-[11px] text-base-500 mb-3 font-mono leading-relaxed">{plan.description}</p>

                      <div className="space-y-1.5 mb-3 text-[11px] font-mono bg-base-850/70 p-2.5 rounded border border-base-800">
                        <div className="flex items-center justify-between">
                          <span className="text-base-500">Min Margin:</span>
                          <strong className={plan.min_overall_margin >= 0 ? "text-emerald-400" : "text-signal-crit"}>
                            {plan.min_overall_margin >= 0 ? "+" : ""}{plan.min_overall_margin.toFixed(2)}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base-500">Intervention Cost:</span>
                          <strong className="text-white">{plan.intervention_cost.toFixed(2)}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base-500">Collateral Impact:</span>
                          <strong className="text-amber-400">{plan.collateral_degradation.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-base-800 text-[10px] font-mono text-base-500 flex items-center justify-between">
                      <span>Approval: {plan.requires_approval ? "Required" : "Automated"}</span>
                      <span className={isFeasible ? "text-emerald-400 font-semibold" : "text-signal-crit"}>
                        {isFeasible ? "All SLAs Met" : "SLAs Breached"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Counterfactual Playground & Dynamic Graceful Degradation Ladder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Counterfactual Playground */}
            <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium flex items-center gap-1.5">
                    <SlidersHorizontal size={13} className="text-signal-info" /> Counterfactual Playground (Forward Projection)
                  </div>
                  <span className="text-[10px] font-mono text-base-600">Pure Functional · No State Mutation</span>
                </div>

                <div className="space-y-3.5 mb-5 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-base-400 mb-1">
                      <span>Student Wi-Fi Reduction (w):</span>
                      <strong className="text-white">{(intervParams.student_wifi_reduction * 100).toFixed(0)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.80"
                      step="0.05"
                      value={intervParams.student_wifi_reduction}
                      onChange={(e) =>
                        setIntervParams({ ...intervParams, student_wifi_reduction: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-signal-info"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-base-400 mb-1">
                      <span>Background Analytics Shedding (a):</span>
                      <strong className="text-white">{(intervParams.analytics_shedding * 100).toFixed(0)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.00"
                      step="0.10"
                      value={intervParams.analytics_shedding}
                      onChange={(e) =>
                        setIntervParams({ ...intervParams, analytics_shedding: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-signal-info"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-base-400 mb-1">
                      <span>Exam Traffic QoS Priority Shift (e):</span>
                      <strong className="text-white">{(intervParams.exam_traffic_shift * 100).toFixed(0)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.00"
                      step="0.10"
                      value={intervParams.exam_traffic_shift}
                      onChange={(e) =>
                        setIntervParams({ ...intervParams, exam_traffic_shift: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-signal-info"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-base-400 mb-1">
                      <span>Research HPC Compute Throttling (r):</span>
                      <strong className="text-amber-400">{(intervParams.research_compute_reduction * 100).toFixed(0)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.30"
                      step="0.05"
                      value={intervParams.research_compute_reduction}
                      onChange={(e) =>
                        setIntervParams({ ...intervParams, research_compute_reduction: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-base-400 mb-1">
                      <span>Non-Critical IoT / CCTV Rate-Limiting (n):</span>
                      <strong className="text-white">{(intervParams.noncritical_network_reduction * 100).toFixed(0)}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="0.50"
                      step="0.05"
                      value={intervParams.noncritical_network_reduction}
                      onChange={(e) =>
                        setIntervParams({ ...intervParams, noncritical_network_reduction: parseFloat(e.target.value) })
                      }
                      className="w-full h-1.5 bg-base-800 rounded-lg appearance-none cursor-pointer accent-signal-info"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunCounterfactual}
                  disabled={evaluatingCf}
                  className="w-full py-2.5 rounded-lg bg-signal-info/20 border border-signal-info/50 text-signal-info hover:bg-signal-info/30 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Workflow size={14} className={evaluatingCf ? "animate-spin" : ""} />
                  Evaluate Counterfactual Projection
                </button>
              </div>

              {counterfactualResult && (
                <div className="mt-4 p-3.5 rounded-lg bg-base-850/90 border border-base-800 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between border-b border-base-800 pb-2">
                    <span className="font-bold text-white">Projected Outcome:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        counterfactualResult.is_feasible
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : "bg-signal-crit/20 text-signal-crit border-signal-crit/40"
                      }`}
                    >
                      {counterfactualResult.is_feasible ? "FEASIBLE PLAN" : "INFEASIBLE PLAN"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-base-500 block">Proj. Network</span>
                      <strong className="text-white">
                        {(counterfactualResult.projected_infra.network_capacity * 100).toFixed(0)}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-base-500 block">Proj. HVAC</span>
                      <strong className="text-white">
                        {(counterfactualResult.projected_infra.hvac_capacity * 100).toFixed(0)}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-base-500 block">Min Margin</span>
                      <strong className={counterfactualResult.min_overall_margin >= 0 ? "text-emerald-400" : "text-signal-crit"}>
                        {counterfactualResult.min_overall_margin >= 0 ? "+" : ""}
                        {counterfactualResult.min_overall_margin.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Graceful Degradation Ladder */}
            <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium flex items-center gap-1.5">
                  <Scale size={13} className="text-signal-warn" /> Dynamic Graceful Degradation Ladder
                </div>
                <span className="text-[10px] font-mono text-base-600">Contract-Derived Sacrifice Hierarchy</span>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {degradationLadder.map((tier) => (
                  <div
                    key={tier.tier}
                    className="p-3 rounded-lg bg-base-850/80 border border-base-800 hover:border-base-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-base-800 border border-base-700 text-[11px] font-mono font-bold text-white flex items-center justify-center">
                          {tier.tier}
                        </span>
                        <span className="font-mono text-white font-bold text-xs">{tier.service}</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${
                          tier.impact_level.includes("LIFE")
                            ? "bg-signal-crit/20 text-signal-crit border-signal-crit/40"
                            : tier.impact_level.includes("PROTECTED")
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                            : tier.impact_level.includes("HIGH")
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {tier.impact_level}
                      </span>
                    </div>
                    <p className="text-[11px] text-base-500 font-mono pl-7">{tier.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DECISION PROVENANCE (WHY WAS THIS PLAN SELECTED?)                  */}
      {/* ========================================================================= */}
      {activeTab === "provenance" && (
        <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-base-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                <BookOpen size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Institutional Decision Provenance & Explainability
                </h3>
                <p className="text-xs text-base-500 font-mono mt-0.5">
                  Complete mathematical justification, binding constraints, and objective decomposition
                </p>
              </div>
            </div>
            <button
              onClick={loadProvenance}
              className="px-3 py-1.5 rounded-lg border border-base-700 bg-base-850 hover:bg-base-800 text-xs font-mono text-base-400 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw size={12} /> Refresh Provenance
            </button>
          </div>

          {provenanceData ? (
            <div className="space-y-5 font-mono text-xs">
              {/* Provenance Banner */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30">
                <span className="text-[11px] font-bold uppercase text-blue-400 block mb-1">
                  Query: {provenanceData.query}
                </span>
                <p className="text-base-300 leading-relaxed">{provenanceData.selection_rationale}</p>
              </div>

              {/* Multi-Objective Optimization Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-base-850 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 block mb-1">Intervention Friction Cost</span>
                  <strong className="text-base font-bold text-emerald-400">
                    {provenanceData.objective_breakdown.intervention_cost.toFixed(2)}
                  </strong>
                  <span className="text-[10px] text-base-600 block mt-0.5">Operational load shed weight</span>
                </div>

                <div className="p-3.5 rounded-lg bg-base-850 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 block mb-1">Collateral Impact Score</span>
                  <strong className="text-base font-bold text-amber-400">
                    {provenanceData.objective_breakdown.collateral_degradation.toFixed(2)}
                  </strong>
                  <span className="text-[10px] text-base-600 block mt-0.5">Recreational campus amenity impact</span>
                </div>

                <div className="p-3.5 rounded-lg bg-base-850 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 block mb-1">Irrecoverable Mission Loss</span>
                  <strong className="text-base font-bold text-emerald-400">
                    {provenanceData.objective_breakdown.irrecoverable_loss_penalty.toFixed(2)}
                  </strong>
                  <span className="text-[10px] text-base-600 block mt-0.5">High time-criticality mission penalty</span>
                </div>

                <div className="p-3.5 rounded-lg bg-base-850 border border-base-800">
                  <span className="text-[10px] uppercase text-base-500 block mb-1">Contract Violations</span>
                  <strong className="text-base font-bold text-emerald-400">
                    {provenanceData.objective_breakdown.contract_violations} Breaches
                  </strong>
                  <span className="text-[10px] text-base-600 block mt-0.5">0 life-safety hard violations</span>
                </div>
              </div>

              {/* Binding Constraints */}
              <div className="p-4 rounded-xl bg-base-850/80 border border-base-800">
                <span className="text-[11px] uppercase tracking-wider text-base-400 font-bold block mb-2">
                  Binding Mathematical Constraints Satisfied:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {provenanceData.binding_constraints?.map((bc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-base-900/60 border border-base-800 text-base-300">
                      <Lock size={13} className="text-emerald-400 shrink-0" />
                      <span>{bc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Contracts and Recoverability Matrix */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-base-400 font-bold block mb-2">
                  Active Mission Activities & Institutional Utility:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {provenanceData.active_missions?.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-base-850 border border-base-800">
                      <div className="flex items-center justify-between mb-1.5">
                        <strong className="text-white">{m.name}</strong>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-base-800 text-signal-info border border-base-700">
                          Utility: {m.mission_utility}
                        </span>
                      </div>
                      <div className="text-[11px] text-base-500 space-y-0.5">
                        <div>Time Criticality: <strong className="text-base-300">{(m.time_criticality * 100).toFixed(0)}%</strong></div>
                        <div>Recoverability: <strong className="text-base-300">{(m.recoverability * 100).toFixed(0)}%</strong></div>
                        <div>Population Impact: <strong className="text-base-300">{(m.population_impact * 100).toFixed(0)}%</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-base-500 font-mono text-xs">
              Loading structured decision provenance...
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: AUDIT & REPLAY TIMELINE                                           */}
      {/* ========================================================================= */}
      {activeTab === "replay" && (
        <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-base-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <History size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Continuity Replay & Immutable Audit Timeline
                </h3>
                <p className="text-xs text-base-500 font-mono mt-0.5">
                  Chronological event trail tracking state transitions, RCA anomalies, approvals, executions, and verification
                </p>
              </div>
            </div>
            <button
              onClick={() => api.clearReplay().then(loadData)}
              className="px-3 py-1.5 rounded-lg border border-base-700 bg-base-850 hover:bg-base-800 text-xs font-mono text-base-400 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Clear Timeline
            </button>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 font-mono text-xs">
            {replayTimeline.map((evt) => {
              const isExpanded = expandedEventId === evt.event_id;
              const isGovernance = evt.category === "governance";
              const isSafety = evt.category === "safety";
              const isExecution = evt.category === "execution";

              return (
                <div
                  key={evt.event_id}
                  onClick={() => setExpandedEventId(isExpanded ? null : evt.event_id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isExpanded
                      ? "bg-base-850 border-signal-info/60 shadow-md"
                      : "bg-base-850/70 border-base-800 hover:border-base-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          isExecution
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : isGovernance
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : isSafety
                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                            : "bg-base-800 text-base-400 border-base-700"
                        }`}
                      >
                        {evt.event_type}
                      </span>
                      <span className="font-bold text-white">{evt.summary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-base-500 shrink-0">
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      <ChevronRight size={13} className={isExpanded ? "rotate-90 text-signal-info" : ""} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-base-500 pt-1">
                    <span>Actor: <strong className="text-base-300">{evt.actor}</strong></span>
                    <span>Event ID: <code className="text-base-400">{evt.event_id}</code></span>
                  </div>

                  {isExpanded && evt.payload && (
                    <div className="mt-3 pt-3 border-t border-base-800 bg-base-900/90 p-3 rounded text-[11px] overflow-x-auto text-base-300">
                      <span className="text-base-500 block mb-1 font-bold">Structured Evidence Payload:</span>
                      <pre className="text-[10px] text-signal-info">{JSON.stringify(evt.payload, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: BENCHMARK SUITE & CONTEXT-SWITCHING EXPERIMENT                     */}
      {/* ========================================================================= */}
      {activeTab === "benchmark" && (
        <div className="rounded-xl border border-base-700 bg-base-900/90 p-5 shadow-lg space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-base-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Institutional Continuity Benchmark (30 Deterministic Scenarios)
                </h3>
                <p className="text-xs text-base-500 font-mono mt-0.5">
                  Comparative validation: CampusGuard ICO vs. Baseline A (Do Nothing), Baseline B (Static Priority), and Baseline C (Greedy Shedding)
                </p>
              </div>
            </div>
            <button
              onClick={handleRunBenchmark}
              disabled={runningBenchmark}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-base-950 hover:bg-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Play size={13} className={runningBenchmark ? "animate-spin" : ""} />
              {runningBenchmark ? "Running 30 Scenarios..." : "Re-run Benchmark Suite"}
            </button>
          </div>

          {benchmarkData && (
            <div className="space-y-6 font-mono text-xs">
              {/* Benchmark Summary Table */}
              <div>
                <span className="text-[11px] uppercase tracking-wider text-base-400 font-bold block mb-2">
                  Comparative Benchmark Performance ({benchmarkData.total_scenarios} Scenarios Across 5 Categories):
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-base-800 rounded-lg overflow-hidden">
                    <thead className="bg-base-850 text-base-400 text-[11px] uppercase border-b border-base-800">
                      <tr>
                        <th className="py-2.5 px-3">Strategy</th>
                        <th className="py-2.5 px-3 text-center">Compliance Rate</th>
                        <th className="py-2.5 px-3 text-center">Mission Utility Preserved</th>
                        <th className="py-2.5 px-3 text-center">Intervention Cost</th>
                        <th className="py-2.5 px-3 text-center">Collateral Degradation</th>
                        <th className="py-2.5 px-3 text-center">Hard Breaches</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-800 bg-base-900/60">
                      {Object.entries(benchmarkData.comparative_summary).map(([k, s]) => {
                        const isICO = k === "campusguard_ico";
                        return (
                          <tr key={k} className={isICO ? "bg-emerald-950/20 font-bold" : "hover:bg-base-850/50"}>
                            <td className="py-2.5 px-3">
                              <span className={isICO ? "text-emerald-400 flex items-center gap-1.5" : "text-white"}>
                                {isICO && <Sparkles size={12} />} {s.name}
                              </span>
                            </td>
                            <td className={`py-2.5 px-3 text-center ${isICO ? "text-emerald-400" : s.compliance_rate < 50 ? "text-signal-crit" : "text-amber-400"}`}>
                              {s.compliance_rate}%
                            </td>
                            <td className={`py-2.5 px-3 text-center font-bold ${isICO ? "text-emerald-400" : "text-base-300"}`}>
                              {s.avg_utility_preserved}%
                            </td>
                            <td className="py-2.5 px-3 text-center text-base-400">{s.avg_intervention_cost.toFixed(2)}</td>
                            <td className="py-2.5 px-3 text-center text-base-400">{s.avg_collateral_degradation.toFixed(2)}</td>
                            <td className={`py-2.5 px-3 text-center ${s.hard_violations > 0 ? "text-signal-crit" : "text-emerald-400"}`}>
                              {s.hard_violations}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flagship Context-Switch Experiment */}
              {contextSwitchData && (
                <div className="p-4 rounded-xl bg-base-850/80 border border-base-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-signal-info font-bold flex items-center gap-1.5">
                      <GitBranch size={14} /> Flagship Context-Switching Experiment (Same Failure, Varying Contracts)
                    </span>
                    <span className="text-[10px] text-base-500">{contextSwitchData.fixed_failure}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-base-900 border border-base-800 space-y-1.5">
                      <strong className="text-white block">{contextSwitchData.scenario_a.name}</strong>
                      <div className="text-[11px] text-base-400">
                        Selected Plan: <strong className="text-emerald-400">{contextSwitchData.scenario_a.selected_plan}</strong>
                      </div>
                      <div className="text-[11px] text-base-500">
                        Cost: <strong className="text-white">{contextSwitchData.scenario_a.intervention_cost.toFixed(2)}</strong> · Margin: +{contextSwitchData.scenario_a.min_overall_margin.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-signal-info pt-1">
                        Exam Shift: {(contextSwitchData.scenario_a.intervention.exam_traffic_shift * 100).toFixed(0)}% · Research Throttle: {(contextSwitchData.scenario_a.intervention.research_compute_reduction * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-base-900 border border-base-800 space-y-1.5">
                      <strong className="text-white block">{contextSwitchData.scenario_b.name}</strong>
                      <div className="text-[11px] text-base-400">
                        Selected Plan: <strong className="text-emerald-400">{contextSwitchData.scenario_b.selected_plan}</strong>
                      </div>
                      <div className="text-[11px] text-base-500">
                        Cost: <strong className="text-white">{contextSwitchData.scenario_b.intervention_cost.toFixed(2)}</strong> · Margin: +{contextSwitchData.scenario_b.min_overall_margin.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-signal-info pt-1">
                        Exam Shift: 0% (Inactive) · Research Throttle: {(contextSwitchData.scenario_b.intervention.research_compute_reduction * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-base-900 border border-base-800 space-y-1.5">
                      <strong className="text-white block">{contextSwitchData.scenario_c.name}</strong>
                      <div className="text-[11px] text-base-400">
                        Selected Plan: <strong className="text-emerald-400">{contextSwitchData.scenario_c.selected_plan}</strong>
                      </div>
                      <div className="text-[11px] text-base-500">
                        Cost: <strong className="text-white">{contextSwitchData.scenario_c.intervention_cost.toFixed(2)}</strong> · Margin: +{contextSwitchData.scenario_c.min_overall_margin.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-signal-info pt-1">
                        Exam Shift: 0% · Research Throttle: 0% (Lowest Cost)
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-base-400 pt-1">
                    Differential Verification: <strong className="text-emerald-400">{contextSwitchData.provenance_differential.cost_progression}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
