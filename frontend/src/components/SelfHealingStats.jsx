import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { HeartPulse } from "lucide-react";

const COLORS = { successful: "#3ddc97", partial: "#f5b942", failed: "#ff5c5c" };

export default function SelfHealingStats({ successful, partial, failed }) {
  const total = successful + partial + failed;
  const data = [
    { key: "successful", label: "Successful", value: successful },
    { key: "partial", label: "Partial", value: partial },
    { key: "failed", label: "Failed", value: failed },
  ];
  const nonZero = data.filter((d) => d.value > 0);

  return (
    <div className="panel flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-base-700/60">
        <HeartPulse size={16} className="text-signal-info" />
        <h2 className="text-sm font-semibold text-slate-100">Self-Healing Stats</h2>
      </div>

      <div className="p-4 flex items-center gap-5">
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={nonZero.length ? nonZero : [{ key: "empty", label: "None", value: 1 }]}
                dataKey="value"
                innerRadius={42}
                outerRadius={60}
                paddingAngle={nonZero.length > 1 ? 3 : 0}
                stroke="none"
                isAnimationActive={false}
              >
                {(nonZero.length ? nonZero : [{ key: "empty" }]).map((d) => (
                  <Cell key={d.key} fill={COLORS[d.key] || "#232833"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-xl font-bold text-slate-100 leading-none">{total}</p>
              <p className="text-[10px] text-slate-500 mt-1">Total Actions</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {data.map((d) => (
            <div key={d.key} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: COLORS[d.key] }} />
              <span className="text-slate-300 w-16">{d.label}</span>
              <span className="text-slate-500 text-xs">
                {d.value} ({total ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
