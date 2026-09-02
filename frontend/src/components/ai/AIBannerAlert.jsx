import React from "react";
import {
  Brain,
  Camera,
  Server,
  Zap,
  ArrowRight,
  X,
  AlertTriangle,
  Sparkles
} from "lucide-react";
import { theme } from "../../theme";
import { SeverityBadge } from "../ui/Badges";

export default function AIBannerAlert({
  scenario,
  onOpenSolution,
  onDismiss
}) {
  if (!scenario) return null;

  const isCCTV = scenario.type === "CCTV_BLOCK";
  const isAPI = scenario.type === "API_BLOCK";
  const Icon = isCCTV ? Camera : isAPI ? Server : AlertTriangle;
  const accentColor = isCCTV ? theme.orange : isAPI ? theme.purple : theme.red;

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-[480px] z-50 animate-toast-in font-mono select-none">
      <div
        className="rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        style={{
          background: "rgba(6, 15, 32, 0.95)",
          border: `1px solid ${accentColor}60`,
          boxShadow: `0 10px 40px -10px ${accentColor}40`
        }}
      >
        {/* Glow Line Indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, #00d4ff)`
          }}
        />

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: `${accentColor}20`,
              border: `1px solid ${accentColor}40`
            }}
          >
            <Icon size={18} style={{ color: accentColor }} />
          </div>

          {/* Content */}
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                <Brain size={11} /> AI ALERT DETECTED
              </span>
              <SeverityBadge severity={scenario.severity} />
              <span className="text-[10px] text-slate-500">{scenario.detectedAt}</span>
            </div>

            <h4 className="text-xs font-bold text-white leading-snug">
              {scenario.title}
            </h4>

            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              {scenario.errorSummary}
            </p>

            {/* AI Generated Solution Preview */}
            <div
              className="mt-2.5 p-2 rounded-xl text-[11px] flex items-center justify-between"
              style={{
                background: "rgba(0, 212, 255, 0.07)",
                border: "1px solid rgba(0, 212, 255, 0.18)"
              }}
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold truncate pr-2">
                <Sparkles size={12} className="flex-shrink-0 text-cyan-400" />
                <span className="truncate">{scenario.aiSolution.actionName}</span>
              </div>
              <button
                onClick={() => onOpenSolution(scenario)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-950 flex items-center gap-1 flex-shrink-0 hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(90deg, #00ff88, #00d4ff)"
                }}
              >
                <span>Solution</span>
                <ArrowRight size={10} />
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onDismiss}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
