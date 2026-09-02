import React, { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Zap,
  Camera,
  Server,
  Network,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  X,
  Lock,
  Sparkles
} from "lucide-react";
import { theme } from "../../theme";
import { SeverityBadge } from "../ui/Badges";
import KeyValueRow from "../ui/KeyValueRow";

export default function AINotificationModal({
  scenario,
  open,
  onClose,
  onApplySuccess
}) {
  const [executing, setExecuting] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [resolved, setResolved] = useState(false);

  if (!open || !scenario) return null;

  const handleApplySolution = () => {
    setExecuting(true);
    setStepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < scenario.aiSolution.steps.length) {
        setStepIndex(current);
      } else {
        clearInterval(interval);
        setExecuting(false);
        setResolved(true);
        if (onApplySuccess) onApplySuccess(scenario.id);
      }
    }, 900);
  };

  const isCCTV = scenario.type === "CCTV_BLOCK";
  const isAPI = scenario.type === "API_BLOCK";
  const Icon = isCCTV ? Camera : isAPI ? Server : Network;
  const accentColor = isCCTV ? theme.orange : isAPI ? theme.purple : theme.red;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono select-none">
      <div
        className="relative w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #071224 0%, #030814 100%)",
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 0 60px ${accentColor}22`
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-30"
          style={{ background: accentColor }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accentColor}25, rgba(0,212,255,0.2))`,
              border: `1px solid ${accentColor}60`
            }}
          >
            <Icon size={24} style={{ color: accentColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-400">
                AI FAILURE MITIGATION SYSTEM
              </span>
              <SeverityBadge severity={scenario.severity} />
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(0,212,255,0.1)", color: theme.cyan }}
              >
                {scenario.category}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
              {scenario.title}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Node: <strong className="text-slate-200">{scenario.target}</strong>
            </p>
          </div>
        </div>

        {/* AI Diagnosis Section */}
        <div
          className="p-4 rounded-2xl mb-5 space-y-3"
          style={{
            background: "rgba(10, 22, 44, 0.65)",
            border: "1px solid rgba(0, 212, 255, 0.15)"
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-300 font-bold flex items-center gap-1.5">
              <Brain size={14} /> AI Root Cause Diagnostics
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Sparkles size={13} /> {scenario.aiDiagnosis.confidence}% Confidence
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {scenario.aiDiagnosis.rootCause}
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col md:flex-row md:justify-between gap-1">
            <span>
              Blast Radius: <strong className="text-slate-200">{scenario.aiDiagnosis.blastRadius}</strong>
            </span>
            <span>
              Model: <strong className="text-cyan-400">{scenario.aiDiagnosis.model}</strong>
            </span>
          </div>
        </div>

        {/* AI Solution Section */}
        <div
          className="p-4 rounded-2xl mb-6"
          style={{
            background: resolved ? "rgba(0, 255, 136, 0.06)" : "rgba(0, 212, 255, 0.05)",
            border: `1px solid ${resolved ? "rgba(0,255,136,0.3)" : "rgba(0,212,255,0.2)"}`
          }}
        >
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Zap size={14} style={{ color: theme.cyan }} /> AI Recommended Solution
            </span>
            <span className="text-slate-400 text-[11px]">
              Est. Time: <strong className="text-emerald-400">{scenario.aiSolution.estimatedRecovery}</strong>
            </span>
          </div>

          <div className="text-sm font-bold text-white mb-2.5">
            {scenario.aiSolution.actionName}
          </div>

          {/* Staged Solution Steps */}
          <div className="space-y-2">
            {scenario.aiSolution.steps.map((step, idx) => {
              const isDone = resolved || (executing && stepIndex > idx);
              const isCurrent = executing && stepIndex === idx;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                    isDone
                      ? "bg-emerald-950/30 text-emerald-300 border border-emerald-500/20"
                      : isCurrent
                      ? "bg-cyan-950/40 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,212,255,0.2)] animate-pulse"
                      : "bg-slate-900/40 text-slate-400 border border-slate-800/60"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 size={14} className="text-cyan-400 animate-spin flex-shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px] flex-shrink-0">
                      {idx + 1}
                    </span>
                  )}
                  <span className="flex-1">{step}</span>
                </div>
              );
            })}
          </div>

          {/* Safety guarantee */}
          <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>{scenario.aiSolution.safetyInvariant}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {resolved ? "Close" : "Dismiss Alert"}
          </button>

          {resolved ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 shadow-[0_0_20px_rgba(0,255,136,0.4)]">
              <CheckCircle2 size={15} /> SOLUTION APPLIED & VERIFIED ONLINE
            </div>
          ) : (
            <button
              onClick={handleApplySolution}
              disabled={executing}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 transition-all duration-200 shadow-lg ${
                executing
                  ? "bg-cyan-600/50 cursor-not-allowed text-slate-300"
                  : "hover:scale-105"
              }`}
              style={{
                background: executing
                  ? undefined
                  : "linear-gradient(90deg, #00ff88, #00d4ff)",
                boxShadow: "0 0 25px rgba(0, 212, 255, 0.35)"
              }}
            >
              {executing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>APPLYING MITIGATION ({stepIndex + 1}/{scenario.aiSolution.steps.length})...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>AUTHORIZE & APPLY AI SOLUTION</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
