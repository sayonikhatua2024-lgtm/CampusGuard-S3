import React, { useEffect, useState } from "react";
import { UserRound, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";

const TITLES = {
  dashboard: "Dashboard",
  services: "Services",
  incidents: "Incidents",
  "ai-insights": "AI Insights",
  "self-healing": "Self-Healing",
  "action-history": "Action History",
  settings: "Settings",
};

function formatNow(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TopBar({ active, apiHealthy }) {
  const { username, logout } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-16 shrink-0 border-b border-base-700/60 bg-base-950/80 backdrop-blur px-6 flex items-center justify-between">
      <h1 className="text-[17px] font-semibold text-slate-100">{TITLES[active] ?? "Dashboard"}</h1>

      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span
            className={[
              "w-2 h-2 rounded-full",
              apiHealthy ? "bg-signal-ok" : "bg-signal-crit",
              apiHealthy ? "animate-pulse" : "",
            ].join(" ")}
          />
          {apiHealthy ? "System Online" : "Connection Lost"}
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 tabular-nums">{formatNow(now)}</span>
        <div className="flex items-center gap-2 pl-3 border-l border-base-700/60">
          <div className="grid place-items-center w-8 h-8 rounded-full bg-base-800 text-slate-300">
            <UserRound size={16} />
          </div>
          <span className="text-slate-300 hidden sm:inline">{username || "operator"}</span>
          <button
            onClick={logout}
            title="Sign out"
            className="text-slate-500 hover:text-slate-200 p-1.5 rounded-md hover:bg-base-800 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
