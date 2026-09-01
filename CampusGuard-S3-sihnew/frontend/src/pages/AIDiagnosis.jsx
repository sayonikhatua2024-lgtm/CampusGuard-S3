import React, { useState } from "react";
import { Brain, Cpu, GitBranch, ArrowRight, Play, CheckCircle2, RefreshCw } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill } from "../components/ui/Badges";
import KeyValueRow from "../components/ui/KeyValueRow";
import { theme } from "../theme";

export default function AIDiagnosis() {
  const [simulating, setSimulating] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">AI Diagnostic & Counterfactual Playground</h1>
          <p className="text-xs font-mono text-slate-400">Simulate root cause permutations & counterfactual blast-radius isolation</p>
        </div>
        <TagPill label="S3 Inference Engine Active" color={theme.purple} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Counterfactual Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle accent={theme.purple}>Counterfactual Hypothesis Testing</SectionTitle>
            <p className="text-xs text-slate-300 font-mono mb-4 leading-relaxed">
              Evaluating alternate timeline outcomes if specific failure nodes are isolated prior to cascade.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                    <th className="pb-3">HYPOTHESIS / INTERVENTION</th>
                    <th className="pb-3">PROJECTED HEALTH</th>
                    <th className="pb-3">BLAST RADIUS</th>
                    <th className="pb-3">CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-3 text-cyan-400 font-bold">1. Isolate SW-CORE-01 port 12</td>
                    <td className="py-3 text-emerald-400">98.2% (+57%)</td>
                    <td className="py-3 text-slate-300">Building A Only</td>
                    <td className="py-3 text-purple-400">96.4%</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-200">2. Pre-emptive HSRP Failover</td>
                    <td className="py-3 text-emerald-400">99.1% (+58%)</td>
                    <td className="py-3 text-slate-300">Zero Downtime</td>
                    <td className="py-3 text-purple-400">94.8%</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-200">3. Drop Non-critical Broadcasts</td>
                    <td className="py-3 text-amber-400">82.0% (+41%)</td>
                    <td className="py-3 text-slate-300">Campus-wide QoS</td>
                    <td className="py-3 text-purple-400">88.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Causal Graph Preview */}
          <Card className="p-5">
            <SectionTitle accent={theme.cyan}>Causal Failure Dependency Chain</SectionTitle>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-center">
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <div className="text-[10px] text-slate-400">ROOT TRIGGER</div>
                <strong>Load Spike (&gt;95%)</strong>
              </div>
              <ArrowRight size={16} className="text-slate-600 hidden md:block" />
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <div className="text-[10px] text-slate-400">INTERMEDIATE</div>
                <strong>HSRP Priority Miss</strong>
              </div>
              <ArrowRight size={16} className="text-slate-600 hidden md:block" />
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <div className="text-[10px] text-slate-400">OUTAGE</div>
                <strong>AP-A2-01 Drop</strong>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Simulation Controller */}
        <div className="space-y-6">
          <Card className="p-5 border-cyan-500/30">
            <SectionTitle accent={theme.cyan}>Run Counterfactual Model</SectionTitle>
            <div className="space-y-3 font-mono text-xs">
              <KeyValueRow label="Engine Model" value="Transformer-RCA-v3" color={theme.purple} />
              <KeyValueRow label="Inference Latency" value="18ms" color={theme.green} />
              <KeyValueRow label="Verified Samples" value="14,280 Episodes" color={theme.cyan} />

              <button
                onClick={() => {
                  setSimulating(true);
                  setTimeout(() => setSimulating(false), 1200);
                }}
                className="w-full py-3 rounded-xl font-bold text-slate-950 transition-all hover:scale-105 flex items-center justify-center gap-2 mt-4"
                style={{ background: "linear-gradient(90deg, #a855f7, #00d4ff)" }}
              >
                {simulating ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {simulating ? "SIMULATING OUTCOMES..." : "RUN FULL SIMULATION"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
