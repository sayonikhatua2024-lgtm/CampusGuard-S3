import React, { useState } from "react";
import { GitBranch, ShieldAlert, TrendingDown, ArrowRight, Play, RefreshCw, CheckCircle2 } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill, SeverityBadge } from "../components/ui/Badges";
import KeyValueRow from "../components/ui/KeyValueRow";
import { theme } from "../theme";

export default function PredictiveRisk({ onNavigate }) {
  const [driftSimulated, setDriftSimulated] = useState(false);

  const riskTable = [
    { metric: "Core Switch Redundancy Ratio", current: "41%", projected: "18%", risk: "critical" },
    { metric: "PoE Distribution Overload Exposure", current: "62%", projected: "44%", risk: "high" },
    { metric: "Edge Gateway Mean Latency", current: "1.2ms", projected: "18.4ms", risk: "high" },
    { metric: "Database Connection Buffer", current: "78%", projected: "12%", risk: "medium" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Predictive Risk & State Drift Simulation</h1>
          <p className="text-xs font-mono text-slate-400">Proactive failure mode projection & redundancy matrix comparison</p>
        </div>
        <TagPill label="Early Warning Engine" color={theme.orange} />
      </div>

      {/* Redundancy Comparison: Current vs Protected */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border-rose-500/30">
          <SectionTitle accent={theme.red}>Current Architecture (Vulnerable)</SectionTitle>
          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 mb-4 font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Effective Redundancy</div>
            <div className="text-4xl font-bold text-rose-400 mb-2">41%</div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: "41%" }} />
            </div>
          </div>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            High single-point-of-failure exposure. A fault on SW-CORE-01 immediately cascades to Floor 2 Wi-Fi without automated failover priority.
          </p>
        </Card>

        <Card className="p-5 border-emerald-500/30">
          <SectionTitle accent={theme.green}>Protected Architecture (CampusGuard S3)</SectionTitle>
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-4 font-mono">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Effective Redundancy</div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">78%</div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: "78%" }} />
            </div>
          </div>
          <p className="text-xs font-mono text-slate-400 leading-relaxed">
            Diversified upstream links with dual HSRP priority renegotiation and continuous safety gate validation prevent service blackouts.
          </p>
        </Card>
      </div>

      {/* Risk Projections Table */}
      <Card className="p-5">
        <SectionTitle accent={theme.cyan}>Multi-point Failure Projections</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="pb-3">METRIC / VECTOR</th>
                <th className="pb-3">CURRENT BASELINE</th>
                <th className="pb-3">PROJECTED (DRIFT)</th>
                <th className="pb-3">RISK SEVERITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {riskTable.map((r, i) => (
                <tr key={i}>
                  <td className="py-3 font-semibold text-slate-200">{r.metric}</td>
                  <td className="py-3 text-emerald-400 font-bold">{r.current}</td>
                  <td className="py-3 text-rose-400 font-bold flex items-center gap-1">
                    {r.projected} <TrendingDown size={14} />
                  </td>
                  <td className="py-3">
                    <SeverityBadge severity={r.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => setDriftSimulated(true)}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-all flex items-center gap-2"
          >
            <Play size={12} /> {driftSimulated ? "[DEMO] State Drift Simulated" : "[DEMO] Simulate State Drift"}
          </button>
        </div>
      </Card>
    </div>
  );
}
