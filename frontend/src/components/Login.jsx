import { useState } from "react";
import { ShieldCheck, LogIn } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.login(username, password);
      login(res.access_token, res.username);
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="h-11 w-11 rounded-full border-2 border-signal-ok/60 flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-signal-ok" strokeWidth={2} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">SentryCore</h1>
          <p className="text-[11px] text-base-600 font-mono mt-0.5">
            campus infra · self-healing controller
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-base-700 bg-base-900/70 shadow-glow p-6 flex flex-col gap-4"
        >
          <div>
            <label className="text-[11px] uppercase tracking-wider text-base-500 font-medium block mb-1.5">
              Username
            </label>
            <input
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-base-850 border border-base-700 rounded-md px-3 py-2 text-sm text-base-500/90 font-mono focus:border-signal-info/50 outline-none transition-colors"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-base-500 font-medium block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-850 border border-base-700 rounded-md px-3 py-2 text-sm text-base-500/90 font-mono focus:border-signal-info/50 outline-none transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-xs text-signal-crit font-mono">{error}</div>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-signal-info/10 border border-signal-info/40 text-signal-info text-sm font-medium py-2.5 hover:bg-signal-info/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <LogIn size={14} strokeWidth={2.25} />
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[11px] text-base-600 font-mono mt-4">
          Default demo credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}
