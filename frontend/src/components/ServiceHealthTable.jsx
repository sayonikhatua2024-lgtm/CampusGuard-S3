import React from "react";
import { HeartPulse } from "lucide-react";

const STATUS_STYLES = {
  healthy: { dot: "bg-signal-ok", text: "text-signal-ok", label: "Healthy" },
  degraded: { dot: "bg-signal-warn", text: "text-signal-warn", label: "Degraded" },
  failed: { dot: "bg-signal-crit", text: "text-signal-crit", label: "Critical" },
  recovering: { dot: "bg-signal-info", text: "text-signal-info", label: "Recovering" },
};

const TYPE_LABELS = {
  server: "Server",
  database: "Database",
  api: "API",
  network: "Network",
  cctv: "CCTV",
  iot: "IoT",
  cloud_app: "Cloud App",
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12.5px] font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function metricCell(value, unit, warnAt) {
  if (value === undefined || value === null) return <span className="text-slate-600">—</span>;
  const isWarn = warnAt && value >= warnAt;
  return <span className={isWarn ? "text-signal-warn" : "text-slate-300"}>{Math.round(value)}{unit}</span>;
}

export default function ServiceHealthTable({ services }) {
  return (
    <div className="panel flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-base-700/60">
        <HeartPulse size={16} className="text-signal-info" />
        <h2 className="text-sm font-semibold text-slate-100">Service Health</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-slate-500 border-b border-base-700/40">
              <th className="font-medium px-5 py-2.5">Service Name</th>
              <th className="font-medium px-3 py-2.5">Type</th>
              <th className="font-medium px-3 py-2.5">Status</th>
              <th className="font-medium px-3 py-2.5">CPU</th>
              <th className="font-medium px-3 py-2.5">Memory</th>
              <th className="font-medium px-3 py-2.5 pr-5">Latency</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500 text-sm">
                  Waiting for telemetry…
                </td>
              </tr>
            )}
            {services.map((svc) => {
              const m = svc.latest_metric;
              return (
                <tr key={svc.id} className="border-b border-base-700/30 last:border-0 hover:bg-base-800/40 transition-colors">
                  <td className="px-5 py-3 text-slate-200 font-medium">{svc.name}</td>
                  <td className="px-3 py-3 text-slate-400">{TYPE_LABELS[svc.type] || svc.type}</td>
                  <td className="px-3 py-3">
                    <StatusPill status={svc.status} />
                  </td>
                  <td className="px-3 py-3">{metricCell(m?.cpu_usage, "%", 85)}</td>
                  <td className="px-3 py-3">{metricCell(m?.memory_usage, "%", 90)}</td>
                  <td className="px-3 py-3 pr-5">{metricCell(m?.network_latency, "ms", 400)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
