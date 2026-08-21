import React, { useState } from "react";
import { TriangleAlert, Database, Server, Network, Cpu, ShieldOff } from "lucide-react";

const TYPE_ICON = { database: Database, network: Network, api: Server, server: Server, iot: Cpu };

const SEVERITY_STYLES = {
  critical: "bg-signal-crit/15 text-signal-crit border border-signal-crit/30",
  high: "bg-signal-crit/15 text-signal-crit border border-signal-crit/30",
  medium: "bg-signal-warn/15 text-signal-warn border border-signal-warn/30",
  low: "bg-signal-info/15 text-signal-info border border-signal-info/30",
};

function timeAgo(iso) {
  if (!iso) return "just now";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
}

export default function ActiveIncidentCard({ incident, serviceName, serviceType, onOverride }) {
  const [busy, setBusy] = useState(false);

  if (!incident) {
    return (
      <div className="panel p-5 flex flex-col items-center justify-center text-center gap-2 min-h-[220px]">
        <div className="w-10 h-10 rounded-full grid place-items-center bg-signal-ok/12 text-signal-ok">
          <ShieldOff size={18} />
        </div>
        <p className="text-sm font-medium text-slate-200">No active incidents</p>
        <p className="text-xs text-slate-500">All monitored services are within nominal thresholds.</p>
      </div>
    );
  }

  const Icon = TYPE_ICON[serviceType] || Server;
  const severity = incident.severity || "medium";

  async function handleAction(action) {
    setBusy(true);
    try {
      await onOverride?.(incident.id, action);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-base-700/60">
        <TriangleAlert size={16} className="text-signal-crit" />
        <h2 className="text-sm font-semibold text-slate-100">Active Incident</h2>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="grid place-items-center w-11 h-11 rounded-xl bg-signal-crit/12 text-signal-crit shrink-0">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-slate-100 leading-tight">{serviceName}</p>
              <span className={`text-[10.5px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide ${SEVERITY_STYLES[severity]}`}>
                {severity}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Detected {timeAgo(incident.detected_at)}</p>
          </div>
        </div>

        <div className="text-sm bg-base-800/60 border border-base-700/50 rounded-lg p-3 space-y-1.5">
          <p className="text-slate-300">
            <span className="text-slate-500">Root Cause (AI): </span>
            {incident.root_cause || "Analysis in progress…"}
          </p>
          {incident.ai_confidence != null && (
            <p className="text-slate-500 text-xs">
              Confidence: <span className="text-slate-300">{Math.round(incident.ai_confidence * 100)}%</span>
            </p>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <button
            disabled={busy}
            onClick={() => handleAction("retry_recovery")}
            className="flex-1 rounded-lg bg-signal-info hover:bg-signal-info/90 text-base-950 text-sm font-medium py-2 transition-colors disabled:opacity-50"
          >
            View Details →
          </button>
          <button
            disabled={busy}
            onClick={() => handleAction("force_resolve")}
            className="flex-1 rounded-lg border border-base-700/70 hover:border-slate-500 text-slate-200 text-sm font-medium py-2 transition-colors disabled:opacity-50"
          >
            Take Action
          </button>
        </div>
      </div>
    </div>
  );
}
