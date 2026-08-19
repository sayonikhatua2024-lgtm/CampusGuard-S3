import { Server, Database, Globe, Wifi, Video, Cpu, Cloud } from "lucide-react";

const STATUS_STYLE = {
  healthy: { dot: "bg-signal-ok", label: "Healthy", text: "text-signal-ok" },
  recovering: { dot: "bg-signal-warn", label: "Recovering", text: "text-signal-warn" },
  degraded: { dot: "bg-signal-warn", label: "Degraded", text: "text-signal-warn" },
  failed: { dot: "bg-signal-crit", label: "Failed", text: "text-signal-crit" },
};

const TYPE_META = {
  server: { label: "Server", icon: Server },
  database: { label: "Database", icon: Database },
  api: { label: "API", icon: Globe },
  network: { label: "Network", icon: Wifi },
  cctv: { label: "CCTV", icon: Video },
  iot: { label: "IoT", icon: Cpu },
  cloud_app: { label: "Cloud App", icon: Cloud },
};

export default function ServiceCard({ service, selected, onClick }) {
  const s = STATUS_STYLE[service.status] || STATUS_STYLE.healthy;
  const meta = TYPE_META[service.type] || { label: service.type, icon: Server };
  const TypeIcon = meta.icon;

  return (
    <button
      onClick={onClick}
      className={`text-left w-full rounded-lg border px-3.5 py-3 transition-all
        ${selected ? "border-signal-info/50 bg-base-850 shadow-glow" : "border-base-700 bg-base-900/60 hover:bg-base-850 hover:border-base-600"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <TypeIcon size={15} className="text-base-500" strokeWidth={2} />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${s.dot} ${
                service.status !== "healthy" ? "pulse-dot" : ""
              }`}
            />
          </div>
          <span className="font-medium text-base-500/90 text-[14px] truncate">{service.name}</span>
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-wide shrink-0 ${s.text}`}>{s.label}</span>
      </div>
      <div className="mt-1.5 pl-[23px] text-xs text-base-600 font-mono flex items-center gap-2">
        <span>{meta.label}</span>
        {service.is_backup_active && (
          <span className="px-1.5 py-0.5 rounded bg-signal-info/10 text-signal-info">on backup</span>
        )}
      </div>
    </button>
  );
}
