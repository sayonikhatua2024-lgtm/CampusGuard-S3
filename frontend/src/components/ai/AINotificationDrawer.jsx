import React from "react";
import {
  Brain,
  Bell,
  Camera,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  X,
  ArrowRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { theme } from "../../theme";
import { SeverityBadge } from "../ui/Badges";

export default function AINotificationDrawer({
  open,
  onClose,
  activeAlerts,
  resolvedAlerts,
  onSelectAlert,
  onTriggerSimulation,
  onClearResolved
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in font-mono select-none">
      <div
        className="w-full max-w-md h-full bg-[#060f20] border-l border-slate-800 p-6 flex flex-col shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: "-10px 0 40px rgba(0, 212, 255, 0.15)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Brain size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Diagnostics & Alert Center</h3>
              <p className="text-[10px] text-slate-400">Real-time Failure & Block Detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Interactive Simulator Section */}
        <div className="py-4 border-b border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-cyan-400" /> Test AI Block Simulation
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onTriggerSimulation("CCTV_BLOCK")}
              className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold text-left transition-all flex items-center gap-2 group"
            >
              <Camera size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
              <span>CCTV Block</span>
            </button>
            <button
              onClick={() => onTriggerSimulation("API_BLOCK")}
              className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 text-[11px] font-bold text-left transition-all flex items-center gap-2 group"
            >
              <Server size={14} className="text-purple-400 group-hover:scale-110 transition-transform" />
              <span>API Block (503)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Alerts List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Active Alerts */}
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">
              <span>Active AI Alerts ({activeAlerts.length})</span>
              {activeAlerts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>

            {activeAlerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500">
                ✓ All systems operating normally. Zero active blocks.
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeAlerts.map((alert) => {
                  const isCCTV = alert.type === "CCTV_BLOCK";
                  const Icon = isCCTV ? Camera : Server;
                  const color = isCCTV ? theme.orange : theme.purple;
                  return (
                    <div
                      key={alert.id}
                      onClick={() => onSelectAlert(alert)}
                      className="p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] group relative overflow-hidden"
                      style={{
                        background: "rgba(10, 22, 44, 0.75)",
                        borderColor: `${color}40`
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon size={14} style={{ color }} />
                          <span className="text-[11px] font-bold text-white group-hover:text-cyan-300">
                            {alert.title}
                          </span>
                        </div>
                        <SeverityBadge severity={alert.severity} />
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                        {alert.errorSummary}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                        <span className="text-cyan-400 flex items-center gap-1 font-bold">
                          <Sparkles size={11} /> AI Solution Available
                        </span>
                        <span className="text-slate-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          Diagnose <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resolved History */}
          {resolvedAlerts.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5 pt-2 border-t border-slate-800">
                <span>Resolved by AI ({resolvedAlerts.length})</span>
                <button
                  onClick={onClearResolved}
                  className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear History
                </button>
              </div>

              <div className="space-y-2">
                {resolvedAlerts.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-slate-200 text-[11px]">{res.title}</div>
                        <div className="text-[10px] text-emerald-400">{res.aiSolution.actionName}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">Fixed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
