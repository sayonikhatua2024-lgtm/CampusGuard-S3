import React from "react";
import { theme } from "../../theme";

export default function KeyValueRow({ label, value, color = theme.text }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-slate-800/60 text-xs">
      <span className="text-slate-400 font-mono text-[11px]">{label}</span>
      <span className="font-bold font-mono text-[11px]" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
