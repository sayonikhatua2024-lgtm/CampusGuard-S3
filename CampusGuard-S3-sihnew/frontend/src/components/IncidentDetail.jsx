import { SearchCode, BrainCircuit } from "lucide-react";

export default function IncidentDetail({ incident, serviceName, onOverride }) {
  if (!incident) {
    return (
      <div className="rounded-xl border border-dashed border-base-700 px-4 py-10 flex flex-col items-center gap-2 text-center">
        <SearchCode size={20} className="text-base-600" strokeWidth={1.75} />
        <span className="text-sm text-base-600 max-w-[280px]">
          Select an incident to see the AI's root cause analysis and decision reasoning.
        </span>
      </div>
    );
  }

  const active = ["detected", "diagnosing", "recovering"].includes(incident.status);

  return (
    <div className="rounded-xl border border-base-700 bg-base-900/70 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-base-500/90">{serviceName}</div>
          <div className="text-xs font-mono text-base-600">Incident #{incident.id} · {incident.failure_type}</div>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wide px-2 py-1 rounded bg-base-800 text-base-500">
          {incident.status}
        </span>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-wider text-base-600 mb-1">Root cause</div>
        <p className="text-sm text-base-500/90 leading-relaxed">{incident.root_cause}</p>
      </div>

      <div className="rounded-lg bg-base-850 border border-base-700 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] uppercase tracking-wider text-signal-info flex items-center gap-1.5">
            <BrainCircuit size={12} strokeWidth={2.25} /> AI decision
          </span>
          <span className="text-xs font-mono text-base-600">confidence {Math.round((incident.ai_confidence || 0) * 100)}%</span>
        </div>
        <div className="text-sm font-mono text-signal-info mb-1">{incident.ai_decision}</div>
        <p className="text-sm text-base-500/80 leading-relaxed">{incident.ai_explanation}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs font-mono text-base-600">
        <div>Attempts: <span className="text-base-500">{incident.recovery_attempts}</span></div>
        <div>Result: <span className="text-base-500">{incident.recovery_result || "pending"}</span></div>
        {incident.recovery_time_seconds != null && (
          <div className="col-span-2">
            Recovery time: <span className="text-signal-ok">{incident.recovery_time_seconds.toFixed(1)}s</span>
          </div>
        )}
        {incident.escalation_note && (
          <div className="col-span-2 text-signal-crit">{incident.escalation_note}</div>
        )}
      </div>

      {active && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onOverride(incident.id, "force_resolve")}
            className="flex-1 text-xs font-medium rounded-md border border-signal-ok/40 text-signal-ok py-2 hover:bg-signal-ok/10 transition-colors"
          >
            Mark resolved
          </button>
          <button
            onClick={() => onOverride(incident.id, "retry_recovery")}
            className="flex-1 text-xs font-medium rounded-md border border-signal-info/40 text-signal-info py-2 hover:bg-signal-info/10 transition-colors"
          >
            Retry recovery
          </button>
          <button
            onClick={() => onOverride(incident.id, "force_escalate")}
            className="flex-1 text-xs font-medium rounded-md border border-signal-crit/40 text-signal-crit py-2 hover:bg-signal-crit/10 transition-colors"
          >
            Escalate now
          </button>
        </div>
      )}
    </div>
  );
}
