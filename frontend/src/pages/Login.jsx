import React, { useState } from "react";
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { theme } from "../theme";
import { SeverityBadge } from "../components/ui/Badges";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((username === "admin" && password === "campus123") || (username === "" && password === "")) {
      // Allow demo login or valid credentials
      setLoading(true);
      setError("");
      setTimeout(() => {
        onLogin();
      }, 1200);
    } else {
      setError("Invalid credentials. Use admin / campus123");
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("campus123");
    setError("");
  };

  const systemStatus = [
    { label: "CCTV Cameras", value: "31/32 Online", color: theme.green },
    { label: "AI Engine", value: "Active v3.2.1", color: theme.green },
    { label: "Active Incidents", value: "7 Open", color: theme.red },
    { label: "Network Status", value: "Degraded", color: theme.orange },
    { label: "IoT Sensors", value: "118/120 OK", color: theme.green },
    { label: "Server Load", value: "54% avg", color: theme.cyan }
  ];

  const recentAlerts = [
    { time: "14:32", msg: "Wi-Fi outage — Building A", sev: "critical" },
    { time: "13:59", msg: "CCTV offline — Parking Lot B", sev: "high" },
    { time: "13:21", msg: "CPU spike — SRV-RACK4-07", sev: "high" },
    { time: "12:47", msg: "DB connection pool exhausted", sev: "medium" }
  ];

  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden select-none"
      style={{ background: theme.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* Background SVG Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(0,212,255,0.07)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgrid)" />
      </svg>

      {/* Radial Glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: -200,
          left: -200,
          background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 65%)"
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          bottom: -150,
          right: -100,
          background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)"
        }}
      />

      {/* Left Sidebar Widget: System Status */}
      <div className="hidden lg:flex flex-col gap-2 absolute left-8 top-1/2 -translate-y-1/2 w-60 z-10">
        <div
          className="text-[10px] uppercase tracking-widest mb-1"
          style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
        >
          System Status
        </div>
        {systemStatus.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all"
            style={{
              background: "rgba(10,22,40,0.65)",
              border: "1px solid rgba(0,212,255,0.08)",
              backdropFilter: "blur(12px)"
            }}
          >
            <span
              className="text-[11px]"
              style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
            >
              {item.label}
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: item.color }}
              />
              <span
                className="text-[11px] font-bold"
                style={{ color: item.color, fontFamily: "JetBrains Mono, monospace" }}
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Center Login Box */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div
          className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: "rgba(6,15,32,0.92)",
            border: "1px solid rgba(0,212,255,0.18)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 50px rgba(0,212,255,0.12)"
          }}
        >
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,212,255,0.25)]"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,212,255,0.15))",
                border: "1px solid rgba(0,212,255,0.35)"
              }}
            >
              <Shield size={28} style={{ color: theme.cyan }} />
            </div>
            <h1
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              CampusGuard
            </h1>
            <div
              className="text-[10px] tracking-widest mt-1 font-bold"
              style={{ color: theme.cyan, fontFamily: "JetBrains Mono, monospace" }}
            >
              AIOPS SECURITY CONTROLLER
            </div>
            <div
              className="mt-3 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase"
              style={{
                background: "rgba(255,77,109,0.1)",
                border: "1px solid rgba(255,77,109,0.3)",
                color: theme.red,
                fontFamily: "JetBrains Mono, monospace"
              }}
            >
              RESTRICTED SYSTEM ACCESS
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="text-[10px] uppercase tracking-widest mb-1.5 block"
                style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
              >
                Username
              </label>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(15,31,61,0.8)",
                  border: `1px solid ${error ? "rgba(255,77,109,0.5)" : "rgba(0,212,255,0.15)"}`
                }}
              >
                <User size={14} style={{ color: theme.muted }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter username"
                  className="bg-transparent flex-1 outline-none text-xs text-white placeholder-slate-500"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
              </div>
            </div>

            <div>
              <label
                className="text-[10px] uppercase tracking-widest mb-1.5 block"
                style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
              >
                Password
              </label>
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(15,31,61,0.8)",
                  border: `1px solid ${error ? "rgba(255,77,109,0.5)" : "rgba(0,212,255,0.15)"}`
                }}
              >
                <Lock size={14} style={{ color: theme.muted }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter password"
                  className="bg-transparent flex-1 outline-none text-xs text-white placeholder-slate-500"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl text-[11px]"
                style={{
                  background: "rgba(255,77,109,0.1)",
                  border: "1px solid rgba(255,77,109,0.3)",
                  color: theme.red,
                  fontFamily: "JetBrains Mono, monospace"
                }}
              >
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] shadow-[0_0_15px_rgba(0,212,255,0.25)]"
              style={{
                background: loading
                  ? "rgba(0,212,255,0.1)"
                  : "linear-gradient(135deg, rgba(0,255,136,0.22), rgba(0,212,255,0.22))",
                border: "1px solid rgba(0,212,255,0.4)",
                color: loading ? theme.muted : theme.cyan
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Shield size={14} />
                  <span>SECURE LOGIN</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div
            onClick={handleFillDemo}
            className="mt-5 p-3 rounded-xl cursor-pointer hover:border-emerald-500/40 transition-all group"
            style={{
              background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.15)"
            }}
          >
            <div
              className="text-[9px] uppercase tracking-widest mb-1.5 flex justify-between"
              style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
            >
              <span>Demo Credentials</span>
              <span className="text-emerald-400 group-hover:underline">Click to fill</span>
            </div>
            <div className="flex gap-6 font-mono text-xs">
              <div>
                <span className="text-[9px] text-slate-500 block">Username</span>
                <strong style={{ color: theme.green }}>admin</strong>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block">Password</span>
                <strong style={{ color: theme.green }}>campus123</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-4 text-[10px]"
          style={{ color: theme.subtle, fontFamily: "JetBrains Mono, monospace" }}
        >
          v3.2.1 · Secured by CampusGuard AIOps · © 2024
        </div>
      </div>

      {/* Right Sidebar Widget: Recent Alerts */}
      <div className="hidden xl:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 w-64 z-10">
        <div
          className="text-[10px] uppercase tracking-widest mb-1"
          style={{ color: theme.muted, fontFamily: "JetBrains Mono, monospace" }}
        >
          Recent Alerts
        </div>
        {recentAlerts.map((alert, idx) => {
          const sevColor = alert.sev === "critical" ? theme.red : alert.sev === "high" ? theme.orange : theme.yellow;
          return (
            <div
              key={idx}
              className="px-3.5 py-2.5 rounded-xl font-mono text-xs space-y-1"
              style={{
                background: "rgba(10,22,40,0.65)",
                border: `1px solid ${sevColor}25`,
                backdropFilter: "blur(12px)"
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: sevColor }} />
                  <span className="text-[10px]" style={{ color: sevColor }}>{alert.time}</span>
                </div>
                <SeverityBadge severity={alert.sev} />
              </div>
              <div className="text-[11px] text-slate-300 line-clamp-1">{alert.msg}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
