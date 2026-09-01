import React from "react";
import { FileText, Download, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill } from "../components/ui/Badges";
import KeyValueRow from "../components/ui/KeyValueRow";
import { theme } from "../theme";

export default function Reports() {
  const reports = [
    { title: "Weekly Continuity & SLA Report", date: "August 2026", size: "2.4 MB", status: "Generated" },
    { title: "Incident Root-Cause Audit (INC-0847)", date: "Today, 14:40", size: "840 KB", status: "Ready" },
    { title: "Campus IoT Power Consumption Matrix", date: "Yesterday", size: "1.8 MB", status: "Generated" },
    { title: "Safety Gate Authorization Audit Trail", date: "Past 30 Days", size: "4.1 MB", status: "Archived" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Compliance & Incident Reports</h1>
          <p className="text-xs font-mono text-slate-400">Institutional SLA compliance, root-cause audit records & export logs</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all"
        >
          <Download size={14} /> EXPORT ALL (PDF/CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <Card key={i} className="p-5 flex items-center justify-between font-mono">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <FileText size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{r.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{r.date} · {r.size}</div>
              </div>
            </div>

            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors">
              <Download size={15} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
