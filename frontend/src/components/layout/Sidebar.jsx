import React from "react";
import {
  Shield,
  LayoutDashboard,
  Server,
  AlertTriangle,
  Brain,
  Wrench,
  Radio,
  Camera,
  FileText,
  BookOpen,
  Settings,
  GitBranch,
  LogOut,
  Activity
} from "lucide-react";
import { theme } from "../../theme";

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "infrastructure", label: "Infrastructure", icon: Server },
  { id: "incidents", label: "Incidents", icon: AlertTriangle, badge: "3" },
  { id: "ai-diagnosis", label: "AI Diagnosis", icon: Brain },
  { id: "remediation", label: "Remediation", icon: Wrench },
  { id: "iot", label: "IoT Monitoring", icon: Radio },
  { id: "cctv", label: "CCTV Security", icon: Camera },
  { id: "reports", label: "Reports & Logs", icon: FileText },
  { id: "playbook", label: "Playbooks", icon: BookOpen },
  { id: "predictive-risk", label: "Predictive Risk", icon: GitBranch },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ active = "dashboard", onNav }) {
  return (
    <aside
      className="w-64 flex flex-col flex-shrink-0 border-r border-slate-800/80 select-none z-20"
      style={{ background: theme.sidebar }}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))",
            border: "1px solid rgba(0,212,255,0.4)"
          }}
        >
          <Shield size={20} className="text-cyan-400" />
          <div className="absolute inset-0 bg-cyan-400/10 blur-sm" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-wider font-mono text-white flex items-center gap-1.5">
            CAMPUSGUARD
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            CONTINUITY S3
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold font-mono tracking-widest text-slate-500 uppercase">
          OPERATIONAL VIEWS
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-all group relative ${
                isActive
                  ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Icon
                size={16}
                className={`transition-colors ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                  style={{
                    background: "rgba(255,77,109,0.2)",
                    color: theme.red,
                    border: "1px solid rgba(255,77,109,0.4)"
                  }}
                >
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute right-0 w-1 h-5 rounded-l-full bg-cyan-400 shadow-[0_0_8px_#00d4ff]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Activity size={12} className="text-emerald-400" /> System Health
          </span>
          <span className="text-emerald-400 font-bold">98.4%</span>
        </div>
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full"
            style={{
              width: "98.4%",
              background: "linear-gradient(90deg, #00ff88, #00d4ff)"
            }}
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-[11px] font-mono text-slate-400">
          <span>v3.4.1-prod</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
          </span>
        </div>
      </div>
    </aside>
  );
}
