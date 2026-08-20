import { getStoredToken, clearStoredToken } from "./auth.jsx";

const BASE = import.meta.env.VITE_API_BASE_URL || "";

class UnauthorizedError extends Error {}

async function j(url, opts = {}) {
  const token = getStoredToken();
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${url}`, { ...opts, headers });

  if (res.status === 401) {
    clearStoredToken();
    // full reload so the app re-renders into the login screen with clean state
    window.location.reload();
    throw new UnauthorizedError("Session expired");
  }
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

export const api = {
  login: (username, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Invalid username or password");
      return res.json();
    }),

  services: () => j("/api/dashboard/services"),
  serviceMetrics: (id, limit = 40) => j(`/api/dashboard/services/${id}/metrics?limit=${limit}`),
  stats: () => j("/api/dashboard/stats"),
  incidents: (status) => j(`/api/incidents${status ? `?status=${status}` : ""}`),
  alerts: () => j("/api/alerts"),
  ackAlert: (id) => j(`/api/alerts/${id}/ack`, { method: "POST" }),
  override: (incident_id, action) =>
    j("/api/incidents/override", {
      method: "POST",
      body: JSON.stringify({ incident_id, action }),
    }),
  failureTypes: () => j("/api/simulator/failure-types"),
  simServices: () => j("/api/simulator/services"),
  inject: (service_name, failure_type) =>
    j("/api/simulator/inject", {
      method: "POST",
      body: JSON.stringify({ service_name, failure_type }),
    }),

  // CampusGuard Institutional Continuity
  missions: () => j("/api/missions"),
  assets: () => j("/api/assets"),
  contracts: () => j("/api/contracts"),
  activeContracts: () => j("/api/contracts/active"),
  dependencies: () => j("/api/dependencies"),

  // Phase 3: Power Simulation, Impact Assessment & Continuity Margin
  injectPowerFailure: (drop_percent = 30) =>
    j("/api/simulator/power-failure", {
      method: "POST",
      body: JSON.stringify({ drop_percent }),
    }),
  resetInfra: () => j("/api/simulator/reset", { method: "POST" }),
  continuityState: () => j("/api/continuity/state"),
  continuityImpact: () => j("/api/continuity/impact"),
  continuityContractsStatus: () => j("/api/continuity/contracts/status"),
  continuityMargin: () => j("/api/continuity/margin"),

  // Phase 4: ICO Optimizer, Counterfactuals & Recovery Tournament
  evaluateCounterfactual: (params) =>
    j("/api/continuity/counterfactual", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  optimizeContinuity: () => j("/api/continuity/optimize", { method: "POST" }),
  continuityPlans: () => j("/api/continuity/plans"),
  continuityConflicts: () => j("/api/continuity/conflicts"),
  degradationLadder: () => j("/api/continuity/degradation-ladder"),

  // Phase 5: Safety Gate, Governance Authorization, Execution & Verification
  safetyCheck: (params = null, plan_id = null) =>
    j(`/api/continuity/safety-check${plan_id ? `?plan_id=${plan_id}` : ""}`, {
      method: "POST",
      body: params ? JSON.stringify(params) : undefined,
    }),
  approvePlan: (plan_id, approver = "admin", reason = "Authorized by campus operations supervisor", parameters = null) =>
    j("/api/continuity/approve", {
      method: "POST",
      body: JSON.stringify({ plan_id, approver, reason, parameters }),
    }),
  rejectPlan: (plan_id, approver = "admin", reason = "Rejected by operator") =>
    j("/api/continuity/reject", {
      method: "POST",
      body: JSON.stringify({ plan_id, approver, reason }),
    }),
  executePlan: (req = {}, mode = "live") =>
    j(`/api/continuity/execute?mode=${mode}`, {
      method: "POST",
      body: JSON.stringify(req),
    }),
  latestExecution: () => j("/api/continuity/execution/latest"),
  getExecution: (id) => j(`/api/continuity/execution/${id}`),

  // Phase 6: Telemetry Health, Replay, Provenance, Benchmark & Competition Demo
  telemetryStatus: () => j("/api/telemetry/status"),
  telemetryDegrade: (source_id, available = false, quality = 1.0, stale = false) =>
    j("/api/telemetry/degrade", {
      method: "POST",
      body: JSON.stringify({ source_id, available, quality, stale }),
    }),
  telemetryReset: () => j("/api/telemetry/reset", { method: "POST" }),
  continuityReplay: (limit = 100) => j(`/api/continuity/replay?limit=${limit}`),
  clearReplay: () => j("/api/continuity/replay/clear", { method: "POST" }),
  decisionProvenance: (plan_id = null) =>
    j(`/api/continuity/provenance${plan_id ? `?plan_id=${plan_id}` : ""}`),
  runBenchmark: () => j("/api/continuity/benchmark/run", { method: "POST" }),
  runContextSwitch: () => j("/api/continuity/benchmark/context-switch", { method: "POST" }),
  demoReset: () => j("/api/continuity/demo/reset", { method: "POST" }),
};


