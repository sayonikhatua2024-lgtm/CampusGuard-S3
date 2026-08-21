import React, { useMemo } from "react";
import { TriangleAlert } from "lucide-react";
import StatCards from "../components/StatCards.jsx";
import ServiceHealthTable from "../components/ServiceHealthTable.jsx";
import ActiveIncidentCard from "../components/ActiveIncidentCard.jsx";
import ResourceUtilizationChart from "../components/ResourceUtilizationChart.jsx";
import AIActivityFeed from "../components/AIActivityFeed.jsx";
import SelfHealingStats from "../components/SelfHealingStats.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { api } from "../lib/api.js";

const SEVERITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };
const OPEN_STATUSES = new Set(["detected", "diagnosing", "recovering"]);

export default function Dashboard() {
  const { stats, services, incidents, alerts, resourceHistory, error, loading, refresh } = useDashboardData();

  const activeIncident = useMemo(() => {
    const open = incidents.filter((i) => OPEN_STATUSES.has(i.status));
    if (open.length === 0) return null;
    return [...open].sort((a, b) => {
      const sevDiff = (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9);
      if (sevDiff !== 0) return sevDiff;
      return b.id - a.id;
    })[0];
  }, [incidents]);

  const activeService = useMemo(
    () => services.find((s) => s.id === activeIncident?.service_id),
    [services, activeIncident]
  );

  // Self-healing outcome breakdown, derived from resolved/attempted incidents:
  // successful  -> recovery_result === "success"
  // failed      -> recovery_result === "failed" AND escalated to a human
  // partial     -> recovery_result === "failed" but still auto-retrying (not yet escalated)
  const healingStats = useMemo(() => {
    let successful = 0, partial = 0, failed = 0;
    incidents.forEach((i) => {
      if (i.recovery_result === "success") successful += 1;
      else if (i.recovery_result === "failed") {
        if (i.escalated) failed += 1;
        else partial += 1;
      }
    });
    return { successful, partial, failed };
  }, [incidents]);

  async function handleOverride(incidentId, action) {
    await api.overrideIncident(incidentId, action);
    refresh();
  }

  return (
    <div className="p-6 space-y-5">
      {error && (
        <div className="flex items-center gap-2 text-sm bg-signal-crit/10 border border-signal-crit/25 text-signal-crit rounded-lg px-4 py-2.5">
          <TriangleAlert size={15} />
          {error} — retrying…
        </div>
      )}

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <ServiceHealthTable services={services} />
        <ActiveIncidentCard
          incident={activeIncident}
          serviceName={activeService?.name ?? activeIncident?.service_id ?? ""}
          serviceType={activeService?.type}
          onOverride={handleOverride}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <ResourceUtilizationChart data={resourceHistory} />
        <AIActivityFeed alerts={alerts} />
        <SelfHealingStats {...healingStats} />
      </div>

      {loading && !stats && (
        <p className="text-center text-xs text-slate-600">Loading CampusGuard telemetry…</p>
      )}
    </div>
  );
}
