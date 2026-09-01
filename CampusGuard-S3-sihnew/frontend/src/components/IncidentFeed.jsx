import { ShieldCheck } from "lucide-react";

const SEVERITY_STYLE = {
  low: "text-base-500 border-base-600",
  medium: "text-signal-warn border-signal-warn/40",
  high: "text-signal-warn border-signal-warn/60",
  critical: "text-signal-crit border-signal-crit/60",
};

const STATUS_LABEL = {
  detected: "Detected",
  diagnosing: "Diagnosing",
  recovering: "Recovering",
  resolved: "Resolved",
  escalated: "Escalated",
};

export default function IncidentFeed({ incidents, servicesById, selectedId, onSelect }) {
  if (!incidents.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center border border-dashed border-base-700 rounded-xl">
        <ShieldCheck size={20} className="text-signal-ok/70" strokeWidth={1.75} />
        <span className="text-sm text-base-600">No incidents yet — infrastructure nominal.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {incidents.map((inc) => {
        const svc = servicesById[inc.service_id];
        const sevClass = SEVERITY_STYLE[inc.severity] || SEVERITY_STYLE.low;
        return (
          <button
            key={inc.id}
            onClick={() => onSelect(inc.id)}
            className={`text-left rounded-lg border px-3 py-2.5 bg-base-900/60 hover:bg-base-850 transition-colors
              ${selectedId === inc.id ? "border-signal-info/50" : "border-base-700"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[11px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded border ${sevClass}`}>
                {inc.severity}
              </span>
              <span className="text-[11px] font-mono text-base-600">
                {new Date(inc.detected_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="mt-1 text-sm text-base-500/90 font-medium">
              {svc ? svc.name : `service #${inc.service_id}`}
            </div>
            <div className="text-xs text-base-600 font-mono mt-0.5">
              {inc.failure_type} → {STATUS_LABEL[inc.status] || inc.status}
              {inc.ai_decision ? ` · ${inc.ai_decision}` : ""}
            </div>
          </button>
        );
      })}
    </div>
  );
}
