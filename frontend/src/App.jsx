import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Radio, LogOut, ShieldCheck, Shield } from "lucide-react";
import { api } from "./api";
import { useAuth } from "./auth.jsx";
import { useToast } from "./toast.jsx";
import StatCard from "./components/StatCard";
import ServiceCard from "./components/ServiceCard";
import MetricChart from "./components/MetricChart";
import IncidentFeed from "./components/IncidentFeed";
import IncidentDetail from "./components/IncidentDetail";
import FailureSimulatorPanel from "./components/FailureSimulatorPanel";
import AlertsPanel from "./components/AlertsPanel";
import StatusBanner from "./components/StatusBanner";
import CampusGuardPanel from "./components/CampusGuardPanel";
import Login from "./components/Login";

const POLL_MS = 3000;
const DEGRADED_STATUSES = ["degraded", "recovering"];

export default function App() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Login />;
  return <Dashboard />;
}

function Dashboard() {
  const { username, logout } = useAuth();
  const { push: pushToast } = useToast();
  const [activeTab, setActiveTab] = useState("ops"); // "ops" | "campusguard"
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [simServices, setSimServices] = useState([]);
  const [failureTypes, setFailureTypes] = useState([]);
  const [connError, setConnError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const pollRef = useRef(null);
  const prevStatusRef = useRef({}); // service id -> last known status

  useEffect(() => {
    api.simServices().then(setSimServices).catch(() => {});
    api.failureTypes().then(setFailureTypes).catch(() => {});
  }, []);

  const notifyStatusChanges = (svc) => {
    const prev = prevStatusRef.current;
    for (const s of svc) {
      const prevStatus = prev[s.id];
      if (prevStatus !== undefined && prevStatus !== s.status) {
        if (s.status === "failed") {
          pushToast(
            "critical",
            `${s.name} has FAILED`,
            "Automated recovery could not fix this — escalated to admin. Manual intervention required."
          );
        } else if (DEGRADED_STATUSES.includes(s.status) && prevStatus === "healthy") {
          pushToast(
            "warning",
            `${s.name} is degraded`,
            "An anomaly was detected. The AI decision engine is attempting automated recovery."
          );
        } else if (s.status === "healthy" && DEGRADED_STATUSES.includes(prevStatus)) {
          pushToast(
            "success",
            `${s.name} recovered`,
            "Automated recovery succeeded and the service is healthy again."
          );
        } else if (s.status === "healthy" && prevStatus === "failed") {
          pushToast(
            "success",
            `${s.name} back online`,
            "Service is healthy again after manual or automated recovery."
          );
        }
      }
    }
    prevStatusRef.current = Object.fromEntries(svc.map((s) => [s.id, s.status]));
  };

  const refresh = async () => {
    try {
      const [svc, st, inc, al] = await Promise.all([
        api.services(),
        api.stats(),
        api.incidents(),
        api.alerts(),
      ]);
      notifyStatusChanges(svc);
      setServices(svc);
      setStats(st);
      setIncidents(inc);
      setAlerts(al);
      setConnError(false);
      setLoaded(true);
      if (!selectedServiceId && svc.length) setSelectedServiceId(svc[0].id);
    } catch (e) {
      setConnError(true);
    }
  };

  useEffect(() => {
    refresh();
    pollRef.current = setInterval(refresh, POLL_MS);
    return () => clearInterval(pollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedServiceId) return;
    const load = () => api.serviceMetrics(selectedServiceId, 40).then(setMetrics).catch(() => {});
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [selectedServiceId]);

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services]
  );

  const failedServices = useMemo(
    () => services.filter((s) => s.status === "failed"),
    [services]
  );
  const degradedServices = useMemo(
    () => services.filter((s) => DEGRADED_STATUSES.includes(s.status)),
    [services]
  );

  const selectedIncident = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId) || null,
    [incidents, selectedIncidentId]
  );

  const handleOverride = async (incidentId, action) => {
    await api.override(incidentId, action);
    refresh();
  };

  const handleInject = async (serviceName, failureType) => {
    const res = await api.inject(serviceName, failureType);
    setTimeout(refresh, 500);
    return res;
  };

  const overallHealthPct = stats && stats.total_services
    ? Math.round((stats.healthy_services / stats.total_services) * 100)
    : 100;

  const ringColor =
    overallHealthPct >= 90 ? "#3ddc97" : overallHealthPct >= 60 ? "#f5b942" : "#ff5c5c";
  const circumference = 2 * Math.PI * 15;
  const dashOffset = circumference * (1 - overallHealthPct / 100);

  if (!loaded && !connError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-base-700 border-t-signal-ok animate-spin" />
          <span className="text-xs font-mono text-base-600">connecting to controller…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-base-500 font-sans">
      <header className="border-b border-base-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-base-950/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#232833" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={ringColor} strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
              />
            </svg>
            <ShieldCheck size={14} className="absolute text-base-500" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">SentryCore</h1>
            <p className="text-[11px] text-base-600 font-mono -mt-0.5">campus infra · self-healing controller</p>
          </div>
        </div>

        {/* Center Tab Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-base-900 border border-base-750 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("ops")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "ops"
                ? "bg-base-800 text-white shadow-sm border border-base-700 font-semibold"
                : "text-base-500 hover:text-white"
            }`}
          >
            <LayoutGrid size={13} />
            AIOps Controller
          </button>
          <button
            onClick={() => setActiveTab("campusguard")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "campusguard"
                ? "bg-base-800 text-white shadow-sm border border-base-700 font-semibold"
                : "text-base-500 hover:text-white"
            }`}
          >
            <Shield size={13} className="text-signal-info" />
            CampusGuard Continuity
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          {connError ? (
            <span className="text-signal-crit flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-crit pulse-dot" /> backend unreachable
            </span>
          ) : (
            <span className="text-signal-ok flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-ok pulse-dot" /> live · {overallHealthPct}% healthy
            </span>
          )}
          <span className="hidden sm:inline text-base-600 border-l border-base-700 pl-4">{username}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-base-600 hover:text-signal-crit transition-colors border border-base-700 hover:border-signal-crit/40 rounded-md px-2.5 py-1.5"
          >
            <LogOut size={12} strokeWidth={2.25} /> Log out
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden px-6 pt-4 flex items-center gap-2">
        <button
          onClick={() => setActiveTab("ops")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border ${
            activeTab === "ops"
              ? "bg-base-850 text-white border-base-700"
              : "bg-base-900 text-base-500 border-base-800"
          }`}
        >
          <LayoutGrid size={13} />
          AIOps Controller
        </button>
        <button
          onClick={() => setActiveTab("campusguard")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium border ${
            activeTab === "campusguard"
              ? "bg-base-850 text-white border-base-700"
              : "bg-base-900 text-base-500 border-base-800"
          }`}
        >
          <Shield size={13} className="text-signal-info" />
          CampusGuard
        </button>
      </div>

      <main className="px-6 py-6 max-w-[1400px] mx-auto flex flex-col gap-6 animate-fade-in">
        {activeTab === "campusguard" ? (
          <CampusGuardPanel />
        ) : (
          <>
            <StatusBanner failedServices={failedServices} degradedServices={degradedServices} />

            {/* Stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Healthy" value={stats?.healthy_services ?? "—"} tone="ok" icon="healthy" />
              <StatCard label="Degraded" value={stats?.degraded_services ?? "—"} tone="warn" icon="degraded" />
              <StatCard label="Failed" value={stats?.failed_services ?? "—"} tone="crit" icon="failed" />
              <StatCard label="Active incidents" value={stats?.active_incidents ?? "—"} tone="info" icon="incidents" />
              <StatCard label="Recovery success" value={stats ? `${stats.recovery_success_rate}%` : "—"} tone="ok" icon="success" />
              <StatCard label="Avg recovery time" value={stats ? `${stats.average_recovery_time}s` : "—"} icon="time" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
              {/* Services column */}
              <div className="flex flex-col gap-2">
                <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium mb-1 flex items-center gap-1.5">
                  <LayoutGrid size={12} strokeWidth={2.25} /> Services ({services.length})
                </div>
                {services.map((s) => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    selected={s.id === selectedServiceId}
                    onClick={() => setSelectedServiceId(s.id)}
                  />
                ))}
              </div>

              {/* Center: charts + incident detail */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MetricChart title="CPU usage" data={metrics} dataKey="cpu_usage" unit="%" color="#5aa9ff" />
                  <MetricChart title="Memory usage" data={metrics} dataKey="memory_usage" unit="%" color="#3ddc97" />
                  <MetricChart title="Network latency" data={metrics} dataKey="network_latency" unit="ms" color="#f5b942" />
                  <MetricChart title="API response time" data={metrics} dataKey="api_response_time" unit="ms" color="#ff5c5c" />
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium mb-2">
                    Root cause & AI decision
                  </div>
                  <IncidentDetail
                    incident={selectedIncident}
                    serviceName={selectedIncident ? servicesById[selectedIncident.service_id]?.name : ""}
                    onOverride={handleOverride}
                  />
                </div>
              </div>

              {/* Right: incidents + simulator + alerts */}
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium mb-2 flex items-center gap-1.5">
                    <Radio size={12} strokeWidth={2.25} /> Incident timeline
                  </div>
                  <IncidentFeed
                    incidents={incidents}
                    servicesById={servicesById}
                    selectedId={selectedIncidentId}
                    onSelect={setSelectedIncidentId}
                  />
                </div>

                <FailureSimulatorPanel
                  services={simServices}
                  failureTypes={failureTypes}
                  onInject={handleInject}
                />

                <AlertsPanel alerts={alerts} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

