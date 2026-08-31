import React from "react";
import { Wrench, ShieldCheck, Play, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill, StatusBadge } from "../components/ui/Badges";
import KeyValueRow from "../components/ui/KeyValueRow";
import { theme } from "../theme";
import { playbooks } from "../data/mockData";

export default function Remediation({ onApprove, onExecute, onVerify, pipelineState }) {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Remediation Hub & Safety Gate</h1>
          <p className="text-xs font-mono text-slate-400">Human-authorized execution pipeline with continuous invariant validation</p>
        </div>
        <TagPill label="Safety Gate Active" color={theme.green} />
      </div>

      {/* Safety Gate Banner */}
      <Card className="p-5 border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">HUMAN AUTHORIZATION GATE READY</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: <strong>INC-2024-0847</strong> · Action: <strong>RTR-BACKUP-01 Failover</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={onApprove}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all hover:scale-105 flex items-center gap-2"
              style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff)" }}
            >
              <Lock size={14} /> AUTHORIZE SAFETY GATE
            </button>
          </div>
        </div>
      </Card>

      {/* Playbooks List */}
      <Card className="p-5">
        <SectionTitle accent={theme.cyan}>Active Automated Playbooks</SectionTitle>
        <div className="divide-y divide-slate-800/80 font-mono text-xs">
          {playbooks.map((pb) => (
            <div key={pb.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">{pb.id}</span>
                  <span className="text-slate-200 font-semibold">{pb.name}</span>
                  <TagPill label={pb.category} color={theme.purple} />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Last executed: {pb.lastRun} · Success Count: {pb.success}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={pb.status === "active" ? "resolved" : "investigating"} />
                <button
                  onClick={onExecute}
                  className="px-3 py-1.5 rounded-lg text-[11px] bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
                >
                  Trigger Runbook
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
