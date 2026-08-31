import React, { useState } from "react";
import { AlertTriangle, Clock, Search, Filter, ArrowUpRight } from "lucide-react";
import Card from "../components/ui/Card";
import { SeverityBadge, StatusBadge, TagPill } from "../components/ui/Badges";
import { theme } from "../theme";
import { initialIncidents } from "../data/mockData";

export default function Incidents({ onSelect }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = initialIncidents.filter((inc) => {
    if (filter !== "all" && inc.severity !== filter) return false;
    if (search && !inc.title.toLowerCase().includes(search.toLowerCase()) && !inc.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Institutional Incidents Feed</h1>
          <p className="text-xs font-mono text-slate-400">Chronological telemetry alerts & automated triage queue</p>
        </div>

        <div className="flex items-center gap-2">
          {["all", "critical", "high", "medium"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                filter === lvl
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((inc) => (
          <Card
            key={inc.id}
            onClick={() => onSelect && onSelect(inc)}
            className="p-5 cursor-pointer hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2 font-mono">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-cyan-400 group-hover:underline">
                  {inc.id}
                </span>
                <SeverityBadge severity={inc.severity} />
                <StatusBadge status={inc.status} />
                <TagPill label={inc.category} color={theme.purple} />
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock size={13} /> {inc.timestamp}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors">
              {inc.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{inc.description}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="text-slate-400">
                <span>📍 Location: </span>
                <strong className="text-slate-200">{inc.location}</strong>
              </div>
              <div className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Root Cause & Diagnostics <ArrowUpRight size={14} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
