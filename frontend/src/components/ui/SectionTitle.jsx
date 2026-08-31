import React from "react";
import { theme } from "../../theme";

export default function SectionTitle({ children, accent = theme.cyan }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className="w-1.5 h-4 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
      <h2
        className="text-xs font-bold uppercase tracking-wider font-mono text-slate-200"
      >
        {children}
      </h2>
    </div>
  );
}
