import React from "react";
import { Sparkles, TriangleAlert, CircleAlert, CircleCheck, Info } from "lucide-react";

const LEVEL_STYLE = {
  critical: { icon: CircleAlert, color: "text-signal-crit" },
  warning: { icon: TriangleAlert, color: "text-signal-warn" },
  info: { icon: Info, color: "text-signal-info" },
  success: { icon: CircleCheck, color: "text-signal-ok" },
};

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function resolveLevel(alert) {
  if (alert.level === "critical") return "critical";
  if (alert.level === "warning") return "warning";
  if (/recover|restart|resolved/i.test(alert.message)) return "success";
  return "info";
}

export default function AIActivityFeed({ alerts }) {
  return (
    <div className="panel flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-base-700/60">
        <Sparkles size={16} className="text-signal-info" />
        <h2 className="text-sm font-semibold text-slate-100">AI Activity</h2>
      </div>

      <div className="p-2 flex-1 overflow-y-auto max-h-64">
        {alerts.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No AI activity recorded yet.</p>
        )}
        {alerts.map((a) => {
          const level = resolveLevel(a);
          const { icon: Icon, color } = LEVEL_STYLE[level];
          return (
            <div key={a.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-base-800/50 transition-colors">
              <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
              <div className="min-w-0">
                <p className="text-[13px] text-slate-300 leading-snug">{a.message}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{timeAgo(a.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
