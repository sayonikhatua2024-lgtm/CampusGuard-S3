import { Activity, AlertTriangle, XCircle, Radio, TrendingUp, Timer } from "lucide-react";

const TONE = {
  ok: { text: "text-signal-ok", ring: "ring-signal-ok/15", bg: "bg-signal-ok/10" },
  warn: { text: "text-signal-warn", ring: "ring-signal-warn/15", bg: "bg-signal-warn/10" },
  crit: { text: "text-signal-crit", ring: "ring-signal-crit/15", bg: "bg-signal-crit/10" },
  info: { text: "text-signal-info", ring: "ring-signal-info/15", bg: "bg-signal-info/10" },
  idle: { text: "text-base-500", ring: "ring-base-700", bg: "bg-base-800" },
};

const ICONS = {
  healthy: Activity,
  degraded: AlertTriangle,
  failed: XCircle,
  incidents: Radio,
  success: TrendingUp,
  time: Timer,
};

export default function StatCard({ label, value, sub, tone = "idle", icon }) {
  const t = TONE[tone];
  const Icon = ICONS[icon];
  return (
    <div className="rounded-xl border border-base-700 bg-base-900/70 shadow-glow px-5 py-4 flex items-center gap-3.5 min-w-[150px] transition-transform hover:-translate-y-0.5 hover:border-base-600">
      {Icon && (
        <div className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${t.bg}`}>
          <Icon size={17} className={t.text} strokeWidth={2.25} />
        </div>
      )}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] uppercase tracking-wider text-base-500 font-medium">{label}</span>
        <span className={`font-mono text-2xl font-semibold leading-none ${t.text}`}>{value}</span>
        {sub && <span className="text-xs text-base-600">{sub}</span>}
      </div>
    </div>
  );
}

