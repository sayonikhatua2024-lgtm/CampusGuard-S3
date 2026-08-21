import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";

const SERIES = [
  { key: "cpu", name: "CPU", color: "#5b6ff2" },
  { key: "memory", name: "Memory", color: "#b478f0" },
  { key: "network", name: "Network", color: "#37c6e0" },
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-800 border border-base-700 rounded-lg px-3 py-2 text-xs shadow-glow">
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}: {p.value}%
        </div>
      ))}
    </div>
  );
}

export default function ResourceUtilizationChart({ data }) {
  return (
    <div className="panel flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-base-700/60">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-signal-info" />
          <h2 className="text-sm font-semibold text-slate-100">Resource Utilization</h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 h-56">
        {data.length === 0 ? (
          <div className="h-full grid place-items-center text-sm text-slate-500">Collecting telemetry…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1c212c" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="index" tick={false} axisLine={{ stroke: "#232833" }} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#4a5262", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#333a48" }} />
              {SERIES.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
