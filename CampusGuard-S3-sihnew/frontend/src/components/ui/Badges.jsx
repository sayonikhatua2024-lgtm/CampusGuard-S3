import React from "react";
import { theme } from "../../theme";
import { severityConfig, statusConfig } from "../../data/mockData";

export function SeverityBadge({ severity }) {
  const conf = severityConfig[severity] || severityConfig.low;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono"
      style={{
        color: conf.color,
        background: conf.bg,
        border: `1px solid ${conf.color}33`
      }}
    >
      {conf.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const conf = statusConfig[status] || { color: theme.muted, label: status };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold font-mono"
      style={{
        color: conf.color,
        background: `${conf.color}15`,
        border: `1px solid ${conf.color}30`
      }}
    >
      {conf.label}
    </span>
  );
}

export function TagPill({ label, color = theme.cyan }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium font-mono"
      style={{
        color: color,
        background: `${color}10`,
        border: `1px solid ${color}25`
      }}
    >
      {label}
    </span>
  );
}
