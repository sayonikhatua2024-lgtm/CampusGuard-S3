import React from "react";
import {
  Activity,
  AlertTriangle,
  Server,
  ShieldAlert,
  ArrowUpRight,
  Brain,
  Wrench,
  Radio,
  Camera,
  Play,
  CheckCircle,
  Clock
} from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { SeverityBadge, StatusBadge, TagPill } from "../components/ui/Badges";
import Sparkline from "../components/ui/Sparkline";
import { theme } from "../theme";
import { initialIncidents, iotSensors, cctvCameras } from "../data/mockData";

export default function Dashboard({
  onSelectIncident,
  onViewAI,
  onApprove,
  onExecute,
  onVerify,
  pipelineState
}) {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* 1. Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* System Health */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 font-mono">
            <span className="text-xs text-slate-400">INSTITUTIONAL HEALTH</span>
            <TagPill label="OPTIMAL" color={theme.green} />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-emerald-400">98.4%</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">SLA Target: 99.0%</div>
            </div>
            <Sparkline color={theme.green} points={[92, 94, 96, 95, 98, 97, 99, 98]} />
          </div>
        </Card>

        {/* Active Incidents */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 font-mono">
            <span className="text-xs text-slate-400">ACTIVE INCIDENTS</span>
            <TagPill label="1 CRITICAL" color={theme.red} />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-rose-400">3</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">1 Critical · 2 High</div>
            </div>
            <Sparkline color={theme.red} points={[1, 2, 2, 4, 3, 2, 3]} />
          </div>
        </Card>

        {/* MTTR */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 font-mono">
            <span className="text-xs text-slate-400">AVG RECOVERY TIME</span>
            <TagPill label="-42% vs Human" color={theme.cyan} />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-cyan-400">4.2m</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">AI Guided Resolution</div>
            </div>
            <Sparkline color={theme.cyan} points={[12, 10, 8, 7, 5, 4.2]} />
          </div>
        </Card>

        {/* Protected Redundancy */}
        <Card className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 font-mono">
            <span className="text-xs text-slate-400">EFFECTIVE REDUNDANCY</span>
            <TagPill label="+37% Safe" color={theme.purple} />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-purple-400">78%</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">Multi-path Isolated</div>
            </div>
            <Sparkline color={theme.purple} points={[41, 41, 55, 62, 70, 78]} />
          </div>
        </Card>
      </div>

      {/* 2. Interactive Remediation Pipeline Bar */}
      <Card className="p-5 border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle accent={theme.cyan}>Active Remediation Workflow — INC-2024-0847</SectionTitle>
          <div className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            STAGED MITIGATION READY
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-mono">
          {[
            { id: "detect", label: "1. Detect", status: "complete" },
            { id: "diagnose", label: "2. Diagnose", status: "complete" },
            { id: "simulate", label: "3. Simulate", status: "complete" },
            { id: "approve", label: "4. Approve", status: "current", action: onApprove },
            { id: "execute", label: "5. Execute", status: "pending", action: onExecute },
            { id: "verify", label: "6. Verify", status: "pending", action: onVerify }
          ].map((stage) => {
            const isDone = stage.status === "complete";
            const isCurrent = stage.status === "current";
            return (
              <button
                key={stage.id}
                onClick={stage.action}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isDone
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                    : isCurrent
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase">{stage.label}</div>
                <div className="text-xs font-bold mt-1">
                  {isDone ? "✓ Completed" : isCurrent ? "⚡ Awaiting Action" : "Pending"}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Main Split Grid: Live Incidents & AI Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incident Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle accent={theme.red}>Active Incidents Timeline</SectionTitle>
              <span className="text-xs font-mono text-slate-400">Real-time Telemetry Stream</span>
            </div>

            <div className="space-y-3">
              {initialIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onSelectIncident(inc)}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/50 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-cyan-400 group-hover:underline">
                        {inc.id}
                      </span>
                      <SeverityBadge severity={inc.severity} />
                      <StatusBadge status={inc.status} />
                    </div>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {inc.timestamp}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {inc.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inc.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                    <span>📍 {inc.location}</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      AI Confidence: <strong>{inc.aiConfidence}%</strong> <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: AI Diagnosis & IoT preview */}
        <div className="space-y-6">
          {/* AI Root Cause Card */}
          <Card className="p-5 border-purple-500/30">
            <SectionTitle accent={theme.purple}>AI Root Cause Diagnosis</SectionTitle>
            <div className="space-y-3 font-mono text-xs">
              <div
                className="p-3 rounded-xl"
                style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)" }}
              >
                <div className="text-[10px] text-purple-300 uppercase tracking-wider mb-1">
                  Primary Failure Mode
                </div>
                <div className="font-bold text-slate-100">HSRP Priority Misconfiguration</div>
                <div className="text-slate-400 text-[11px] mt-1">
                  SW-CORE-01 load exceeded 95% capacity. RTR-BACKUP-01 failed primary elevation.
                </div>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Diagnostic Confidence:</span>
                <span className="text-emerald-400 font-bold">96.4% Verified</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Recommended Action:</span>
                <span className="text-cyan-400 font-bold">Failover AP-A2-01</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Estimated MTTR:</span>
                <span className="text-purple-400 font-bold">2–5 Minutes</span>
              </div>

              <button
                onClick={onViewAI}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all text-slate-950 flex items-center justify-center gap-2 mt-2"
                style={{ background: "linear-gradient(90deg, #a855f7, #00d4ff)" }}
              >
                <Brain size={14} /> OPEN COUNTERFACTUAL ENGINE
              </button>
            </div>
          </Card>

          {/* IoT & CCTV Quick Grid */}
          <Card className="p-5">
            <SectionTitle accent={theme.cyan}>Campus Telemetry Grid</SectionTitle>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
              {iotSensors.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">{s.name}</div>
                  <div className="text-sm font-bold mt-1" style={{ color: s.color }}>
                    {s.value} {s.unit}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.online}/{s.count} Online</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
