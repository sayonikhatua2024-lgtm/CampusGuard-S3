import React from "react";
import { CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Modal from "../ui/Modal";
import { theme } from "../../theme";

export default function VerificationModal({ open, onClose }) {
  const verifications = [
    { label: "AP-A2-01 SNMP Health Ping", result: "PASS (0% packet loss)", ok: true },
    { label: "450+ Device Re-association", result: "PASS (452 connected)", ok: true },
    { label: "Subnet Gateway Ping Response", result: "PASS (0.8ms latency)", ok: true },
    { label: "Secondary HSRP State", result: "PASS (Active Primary)", ok: true }
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}
        >
          <ShieldCheck size={22} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-base font-bold font-mono text-white">RECOVERY VERIFICATION PASSED</h3>
          <p className="text-xs font-mono text-slate-400">Post-mitigation telemetry validation successful</p>
        </div>
      </div>

      <div className="space-y-2.5 mb-6">
        {verifications.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl text-xs font-mono"
            style={{ background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.2)" }}
          >
            <span className="text-slate-300 flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-400" /> {v.label}
            </span>
            <span className="font-bold text-emerald-400">{v.result}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end font-mono">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all hover:scale-105"
          style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff)" }}
        >
          COMPLETE & CLOSE INCIDENT <ArrowRight size={14} />
        </button>
      </div>
    </Modal>
  );
}
