import React from "react";
import { Bell, Search, RefreshCw, User, ShieldAlert, LogOut, Brain, Sparkles } from "lucide-react";
import { theme } from "../../theme";

export default function Header({
  timeFilter = "Last 1h",
  setTimeFilter,
  onSignOut,
  alertCount = 0,
  onOpenAlerts,
  onSimulateBlock
}) {
  const timeRanges = ["Last 15m", "Last 1h", "Last 6h", "Last 24h", "Last 7d"];

  return (
    <header
      className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 z-10 sticky top-0 flex-shrink-0"
      style={{
        background: theme.header,
        backdropFilter: "blur(16px)"
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search AI diagnostics, cameras, API endpoints, switches..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* AI Quick Simulate Button */}
        <button
          onClick={onSimulateBlock}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
        >
          <Sparkles size={13} className="text-cyan-400 animate-pulse" />
          <span>Simulate AI Block</span>
        </button>

        {/* Time Filter Selector */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeFilter && setTimeFilter(range)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                timeFilter === range
                  ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* AI Notification Bell */}
        <button
          onClick={onOpenAlerts}
          title="AI Alerts & Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 border border-slate-800 transition-colors"
        >
          <Bell size={16} />
          {alertCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
                {alertCount}
              </span>
            </>
          )}
        </button>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                <User size={14} />
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold font-mono text-slate-200 leading-tight">Admin Ops</div>
              <div className="text-[10px] font-mono text-emerald-400">Security Lead</div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
