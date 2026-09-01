import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Terminal, Play, Check } from "lucide-react";
import Modal from "../ui/Modal";
import { theme } from "../../theme";

export default function ControlledExecutionModal({ open, onClose }) {
  const [step, setStep] = useState(0);

  const steps = [
    "Pre-flight health invariant validation",
    "Sending HSRP priority renegotiation payload",
    "Switching default gateway to RTR-BACKUP-01",
    "Cycling PoE port power to AP-A2-01",
    "Verifying ping response & SNMP trap"
  ];

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }}
        >
          {step >= steps.length ? (
            <CheckCircle2 size={22} className="text-emerald-400" />
          ) : (
            <Loader2 size={22} className="text-cyan-400 animate-spin" />
          )}
        </div>
        <div>
          <h3 className="text-base font-bold font-mono text-white">CONTROLLED STAGED EXECUTION</h3>
          <p className="text-xs font-mono text-slate-400">Executing Runbook PB-001 with blast-radius containment</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4 border border-slate-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, (step / steps.length) * 100)}%`,
            background: "linear-gradient(90deg, #00d4ff, #00ff88)"
          }}
        />
      </div>

      {/* Logs Console */}
      <div
        className="p-4 rounded-xl mb-6 font-mono text-xs space-y-2 max-h-48 overflow-y-auto"
        style={{ background: "#01040a", border: "1px solid rgba(0,212,255,0.15)" }}
      >
        <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-900">
          <Terminal size={12} /> Staged Command Pipeline Logs
        </div>
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-emerald-400">
            <Check size={12} /> <span>[OK] {s}</span>
          </div>
        ))}
        {step < steps.length && (
          <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
            <Loader2 size={12} className="animate-spin" /> <span>[RUNNING] {steps[step]}...</span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          disabled={step < steps.length}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
            step >= steps.length
              ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          {step >= steps.length ? "PROCEED TO VERIFICATION" : "EXECUTING..."}
        </button>
      </div>
    </Modal>
  );
}
