import React from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Server,
  AlertTriangle,
  Sparkles,
  HeartPulse,
  History,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "services", label: "Services", icon: Server },
  { key: "incidents", label: "Incidents", icon: AlertTriangle },
  { key: "ai-insights", label: "AI Insights", icon: Sparkles },
  { key: "self-healing", label: "Self-Healing", icon: HeartPulse },
  { key: "action-history", label: "Action History", icon: History },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="w-60 shrink-0 bg-base-900 border-r border-base-700/60 flex flex-col">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-base-700/60">
        <div className="grid place-items-center w-9 h-9 rounded-lg bg-signal-info/15 text-signal-info">
          <ShieldCheck size={20} strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-slate-100 text-[15px]">CampusGuard</p>
          <p className="text-[11px] text-slate-500">Self-Healing Controller</p>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={[
                "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-signal-info/12 text-signal-info font-medium border border-signal-info/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-base-800/70 border border-transparent",
              ].join(" ")}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-base-700/60">
        <p className="text-[11px] text-slate-600 px-2 py-1">v1.0.0 · Prototype build</p>
      </div>
    </aside>
  );
}
