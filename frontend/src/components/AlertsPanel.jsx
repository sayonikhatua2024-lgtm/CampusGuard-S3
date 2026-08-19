import { Bell, BellOff } from "lucide-react";

const LEVEL_STYLE = {
  info: "text-signal-info",
  warning: "text-signal-warn",
  critical: "text-signal-crit",
};

export default function AlertsPanel({ alerts }) {
  return (
    <div className="rounded-xl border border-base-700 bg-base-900/70 p-4">
      <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium mb-3 flex items-center gap-1.5">
        <Bell size={12} strokeWidth={2.25} /> Live alert stream
      </div>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {alerts.length === 0 && (
          <div className="flex flex-col items-center gap-1.5 py-6 text-center">
            <BellOff size={16} className="text-base-600" strokeWidth={1.75} />
            <span className="text-xs text-base-600">No alerts.</span>
          </div>
        )}
        {alerts.map((a) => (
          <div key={a.id} className="flex gap-2 text-xs font-mono leading-relaxed">
            <span className="text-base-600 shrink-0">{new Date(a.created_at).toLocaleTimeString()}</span>
            <span className={LEVEL_STYLE[a.level] || "text-base-500"}>{a.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
