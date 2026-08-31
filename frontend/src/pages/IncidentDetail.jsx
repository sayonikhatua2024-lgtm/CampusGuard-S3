import React from "react";
import { ArrowLeft, Brain, ShieldAlert, Clock, CheckCircle2, Wrench, AlertTriangle, ArrowUpRight } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { SeverityBadge, StatusBadge, TagPill } from "../components/ui/Badges";
import KeyValueRow from "../components/ui/KeyValueRow";
import { theme } from "../theme";

export default function IncidentDetail({ incident, onBack }) {
  if (!incident) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Incidents Feed
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 font-mono">
            <span className="text-lg font-bold text-white">{incident.id}</span>
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{incident.title}</h1>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <TagPill label={`Estimated Recovery: ${incident.estimatedRecovery}`} color={theme.cyan} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Root Cause */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <SectionTitle accent={theme.red}>Incident Telemetry Summary</SectionTitle>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{incident.description}</p>

            <div className="space-y-1 font-mono">
              <KeyValueRow label="Impacted Location" value={incident.location} />
              <KeyValueRow label="Timestamp of Detection" value={incident.timestamp} />
              <KeyValueRow label="Affected Nodes/Devices" value={`${incident.affectedSystems} Systems`} color={theme.red} />
              <KeyValueRow label="Category Domain" value={incident.category} color={theme.purple} />
            </div>
          </Card>

          <Card className="p-5 border-purple-500/40">
            <SectionTitle accent={theme.purple}>AI Root Cause Analysis</SectionTitle>
            <div
              className="p-4 rounded-xl mb-4 leading-relaxed text-xs font-mono text-slate-200"
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.25)" }}
            >
              {incident.rootCause}
            </div>

            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>Diagnosis Confidence: <strong className="text-emerald-400">{incident.aiConfidence}%</strong></span>
              <span>Model: <strong className="text-cyan-400">CampusGuard S3 Transformer</strong></span>
            </div>
          </Card>
        </div>

        {/* Right Col: Remediation Actions */}
        <div className="space-y-6">
          <Card className="p-5 border-cyan-500/30">
            <SectionTitle accent={theme.cyan}>Automated Recovery Strategy</SectionTitle>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Verified blast-radius contained runbook ready for authorization.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Recommended Action</div>
                <div className="text-emerald-400 font-bold mt-0.5">Failover to RTR-BACKUP-01</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-500 text-[10px] uppercase">Safety Pre-flight</div>
                <div className="text-cyan-400 font-bold mt-0.5">PASSED (Zero Data Loss)</div>
              </div>

              <button
                className="w-full py-3 rounded-xl font-bold text-slate-950 transition-all hover:scale-105 flex items-center justify-center gap-2 mt-4"
                style={{ background: "linear-gradient(90deg, #00ff88, #00d4ff)" }}
              >
                <Wrench size={14} /> LAUNCH SAFETY GATE
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
