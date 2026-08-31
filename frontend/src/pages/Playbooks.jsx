import React from "react";
import { BookOpen, Play, CheckCircle2, Shield, Plus, ArrowUpRight } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill, StatusBadge } from "../components/ui/Badges";
import { theme } from "../theme";
import { playbooks } from "../data/mockData";

export default function Playbooks() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Automated Runbook Playbooks</h1>
          <p className="text-xs font-mono text-slate-400">Deterministic recovery routines with blast-radius containment</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all"
        >
          <Plus size={14} /> NEW PLAYBOOK
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playbooks.map((pb) => (
          <Card key={pb.id} className="p-5 font-mono">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-400">{pb.id}</span>
              <StatusBadge status={pb.status === "active" ? "resolved" : "investigating"} />
            </div>

            <h3 className="text-sm font-bold text-slate-100 mb-1">{pb.name}</h3>
            <div className="text-[11px] text-slate-500 mb-4">Category: {pb.category}</div>

            <div className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Success Executions:</span>
                <span className="text-emerald-400 font-bold">{pb.success} Runs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Triggered:</span>
                <span className="text-slate-200">{pb.lastRun}</span>
              </div>
            </div>

            <button className="w-full mt-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors flex items-center justify-center gap-1.5">
              <Play size={12} /> Test Dry-Run
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
