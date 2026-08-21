import React, { useState } from "react";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Login() {
  const { login, error, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) return;
    login(username, password);
  }

  return (
    <div className="min-h-screen bg-base-950 grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-signal-info/15 text-signal-info">
            <ShieldCheck size={24} strokeWidth={2.25} />
          </div>
          <h1 className="text-lg font-semibold text-slate-100">CampusGuard</h1>
          <p className="text-sm text-slate-500">Sign in to the Self-Healing Controller</p>
        </div>

        <form onSubmit={handleSubmit} className="panel p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-base-800 border border-base-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:border-signal-info"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-800 border border-base-700/70 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:border-signal-info"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-signal-crit bg-signal-crit/10 border border-signal-crit/25 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-signal-info hover:bg-signal-info/90 text-base-950 font-medium text-sm py-2.5 transition-colors disabled:opacity-60"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-600 mt-5">
          Institutional continuity &amp; self-healing operations
        </p>
      </div>
    </div>
  );
}
