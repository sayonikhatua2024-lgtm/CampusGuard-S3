import { useState } from "react";
import { Zap, AlertCircle } from "lucide-react";

export default function FailureSimulatorPanel({ services, failureTypes, onInject }) {
  const [service, setService] = useState(services[0] || "");
  const [failure, setFailure] = useState(failureTypes[0] || "");
  const [busy, setBusy] = useState(false);
  const [lastMsg, setLastMsg] = useState(null);

  const submit = async () => {
    if (!service || !failure) return;
    setBusy(true);
    setLastMsg(null);
    try {
      const res = await onInject(service, failure);
      setLastMsg(res?.message || "Failure injected.");
    } catch (e) {
      setLastMsg("Failed to inject — is the backend reachable?");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-base-700 bg-base-900/70 p-4 flex flex-col gap-3">
      <div className="text-[11px] uppercase tracking-wider text-base-500 font-medium flex items-center gap-1.5">
        <Zap size={12} strokeWidth={2.25} /> Failure simulator
      </div>
      <p className="text-xs text-base-600 leading-relaxed">
        Inject a synthetic fault into a simulated service and watch the controller detect,
        diagnose, and self-heal it.
      </p>
      <div className="flex flex-col gap-2">
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="bg-base-850 border border-base-700 rounded-md px-2 py-2 text-sm text-base-500/90 font-mono"
        >
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={failure}
          onChange={(e) => setFailure(e.target.value)}
          className="bg-base-850 border border-base-700 rounded-md px-2 py-2 text-sm text-base-500/90 font-mono"
        >
          {failureTypes.map((f) => <option key={f} value={f}>{f.replaceAll("_", " ")}</option>)}
        </select>
      </div>
      <button
        onClick={submit}
        disabled={busy}
        className="rounded-md bg-signal-crit/10 border border-signal-crit/40 text-signal-crit text-sm font-medium py-2 hover:bg-signal-crit/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
      >
        <AlertCircle size={14} strokeWidth={2.25} />
        {busy ? "Injecting…" : "Inject failure"}
      </button>
      {lastMsg && <div className="text-xs font-mono text-base-600">{lastMsg}</div>}
    </div>
  );
}
