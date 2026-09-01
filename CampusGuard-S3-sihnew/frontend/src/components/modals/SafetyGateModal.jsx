import React from "react";
import { ShieldCheck, AlertTriangle, ArrowRight, Lock } from "lucide-react";
import Modal from "../ui/Modal";
import { theme } from "../../theme";

export default function SafetyGateModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}
        >
          <ShieldCheck size={22} style={{ color: theme.green }} />
        </div>
        <div>
          <h3 className="text-base font-bold font-mono text-white">HUMAN SAFETY GATE AUTHORIZATION</h3>
          <p className="text-xs font-mono text-slate-400">CampusGuard Safety Gate · Verification Required</p>
        </div>
      </div>

      <div
        className="p-4 rounded-xl mb-4 text-xs font-mono space-y-2"
        style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}
      >
        <div className="flex justify-between">
          <span className="text-slate-400">Target Incident:</span>
          <span className="text-cyan-400 font-bold">INC-2024-0847 (Wi-Fi Downtime)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Action:</span>
          <span className="text-emerald-400 font-bold">Failover AP-A2-01 to RTR-BACKUP-01</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Confidence:</span>
          <span className="text-cyan-400 font-bold">96.4% Verified</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Blast Radius:</span>
          <span className="text-amber-400 font-bold">Isolated to Bldg A Floor 2</span>
        </div>
      </div>

      <div
        className="p-3 rounded-xl mb-6 text-[11px] font-mono text-slate-300 flex items-start gap-2.5"
        style={{ background: "rgba(255,77,109,0.06)", border: "1px solid rgba(255,77,109,0.2)" }}
      >
        <AlertTriangle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-rose-400">Safety Guarantee:</strong> "The world changed. The approval didn't. So we blocked it."
          Automated pre-flight checks ensure state invariants before rollback triggers.
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 font-mono">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all hover:scale-105"
          style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff)" }}
        >
          <Lock size={14} /> AUTHORIZE RECOVERY EXECUTION
        </button>
      </div>
    </Modal>
  );
}
