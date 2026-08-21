import React from "react";
import { Construction } from "lucide-react";

export default function ComingSoon({ label }) {
  return (
    <div className="p-6">
      <div className="panel p-12 flex flex-col items-center justify-center gap-3 text-center">
        <div className="grid place-items-center w-11 h-11 rounded-xl bg-base-800 text-slate-500">
          <Construction size={20} />
        </div>
        <p className="text-slate-200 font-medium">{label} is on the way</p>
        <p className="text-sm text-slate-500 max-w-sm">
          This module isn't wired up yet in the prototype — head back to the Dashboard for the live overview.
        </p>
      </div>
    </div>
  );
}
