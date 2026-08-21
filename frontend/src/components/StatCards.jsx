import React from "react";
import { Boxes, CircleCheck, TriangleAlert, CircleAlert } from "lucide-react";

function pct(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function StatCard({ icon: Icon, tone, label, value, sublabel }) {
  const tones = {
    info: { bg: "bg-signal-info/12", text: "text-signal-info" },
    ok: { bg: "bg-signal-ok/12", text: "text-signal-ok" },
    warn: { bg: "bg-signal-warn/12", text: "text-signal-warn" },
    crit: { bg: "bg-signal-crit/12", text: "text-signal-crit" },
  }[tone];

  return (
    <div className="panel p-4 flex items-center gap-3.5">
      <div className={`grid place-items-center w-11 h-11 rounded-xl ${tones.bg} ${tones.text}`}>
        <Icon size={20} strokeWidth={2.25} />
      </div>
      <div>
        <p className="text-[13px] text-slate-400">{label}</p>
        <p className="text-2xl font-semibold text-slate-100 leading-tight">{value}</p>
        <p className="text-[11px] text-slate-500">{sublabel}</p>
      </div>
    </div>
  );
}

export default function StatCards({ stats }) {
  const total = stats?.total_services ?? 0;
  const healthy = stats?.healthy_services ?? 0;
  const degraded = stats?.degraded_services ?? 0;
  const failed = stats?.failed_services ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard icon={Boxes} tone="info" label="Total Services" value={total} sublabel="Across campus infrastructure" />
      <StatCard icon={CircleCheck} tone="ok" label="Healthy" value={healthy} sublabel={`${pct(healthy, total)} of total`} />
      <StatCard icon={TriangleAlert} tone="warn" label="Degraded" value={degraded} sublabel={`${pct(degraded, total)} of total`} />
      <StatCard icon={CircleAlert} tone="crit" label="Critical" value={failed} sublabel={`${pct(failed, total)} of total`} />
    </div>
  );
}
