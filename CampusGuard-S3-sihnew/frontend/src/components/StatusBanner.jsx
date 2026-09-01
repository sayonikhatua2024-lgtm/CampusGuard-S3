import { AlertOctagon, AlertTriangle } from "lucide-react";

export default function StatusBanner({ failedServices, degradedServices }) {
  if (failedServices.length === 0 && degradedServices.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {failedServices.length > 0 && (
        <div className="rounded-lg border border-signal-crit/40 bg-signal-crit/10 px-4 py-3 flex items-center gap-3">
          <AlertOctagon size={18} className="text-signal-crit shrink-0" strokeWidth={2.25} />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-signal-crit">
              {failedServices.length === 1
                ? `${failedServices[0].name} has failed`
                : `${failedServices.length} services have failed`}
            </span>
            <span className="text-xs text-base-500/80 ml-2 font-mono">
              {failedServices.map((s) => s.name).join(", ")} — automated recovery could not fix this. Manual intervention required.
            </span>
          </div>
        </div>
      )}
      {degradedServices.length > 0 && (
        <div className="rounded-lg border border-signal-warn/40 bg-signal-warn/10 px-4 py-3 flex items-center gap-3">
          <AlertTriangle size={18} className="text-signal-warn shrink-0" strokeWidth={2.25} />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-signal-warn">
              {degradedServices.length === 1
                ? `${degradedServices[0].name} is degraded`
                : `${degradedServices.length} services are degraded`}
            </span>
            <span className="text-xs text-base-500/80 ml-2 font-mono">
              {degradedServices.map((s) => s.name).join(", ")} — AI is attempting automated recovery.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
