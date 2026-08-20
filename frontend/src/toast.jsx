import { useEffect, useState, useCallback, createContext, useContext, useRef } from "react";
import { AlertOctagon, AlertTriangle, CheckCircle2, X } from "lucide-react";

const ToastContext = createContext(null);

const LEVEL_STYLE = {
  critical: {
    icon: AlertOctagon,
    border: "border-signal-crit/50",
    bg: "bg-signal-crit/10",
    text: "text-signal-crit",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-signal-warn/50",
    bg: "bg-signal-warn/10",
    text: "text-signal-warn",
  },
  success: {
    icon: CheckCircle2,
    border: "border-signal-ok/50",
    bg: "bg-signal-ok/10",
    text: "text-signal-ok",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((level, title, message) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, level, title, message }]);
    setTimeout(() => dismiss(id), 6000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const s = LEVEL_STYLE[t.level] || LEVEL_STYLE.warning;
          const Icon = s.icon;
          return (
            <div
              key={t.id}
              className={`rounded-lg border ${s.border} ${s.bg} backdrop-blur-md bg-base-900/95 shadow-glow px-3.5 py-3 flex items-start gap-2.5 animate-toast-in`}
            >
              <Icon size={16} className={`shrink-0 mt-0.5 ${s.text}`} strokeWidth={2.25} />
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-semibold ${s.text}`}>{t.title}</div>
                <div className="text-xs text-base-600 mt-0.5 leading-relaxed">{t.message}</div>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-base-600 hover:text-base-500 shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
