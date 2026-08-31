
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { jsx as d, jsxs as S, Fragment as Tp } from 'react/jsx-runtime';
import * as Lucide from 'lucide-react';

const ae = useState;
const Dt = useEffect;
const ii = useRef;
const j0 = useMemo;
const u2 = useCallback;

// Lucide Icon Aliases
const Op = Lucide.Activity || Lucide.Circle;
const Z3 = Lucide.ArrowUpRight || Lucide.Circle;
const eD = Lucide.Bell || Lucide.Circle;
const rD = Lucide.BookOpen || Lucide.Circle;
const Da = Lucide.Brain || Lucide.Circle;
const iD = Lucide.Camera || Lucide.Circle;
const Ap = Lucide.Check || Lucide.Circle;
const sD = Lucide.ChevronDown || Lucide.Circle;
const uD = Lucide.ChevronLeft || Lucide.Circle;
const dD = Lucide.ChevronRight || Lucide.Circle;
const Sp = Lucide.AlertCircle || Lucide.Circle;
const Ba = Lucide.CheckCircle2 || Lucide.Circle;
const mD = Lucide.Clock || Lucide.Circle;
const gD = Lucide.Crosshair || Lucide.Circle;
const _p = Lucide.Download || Lucide.Circle;
const wD = Lucide.Droplets || Lucide.Circle;
const AD = Lucide.MoreVertical || Lucide.Circle;
const n2 = Lucide.Eye || Lucide.Circle;
const PD = Lucide.FileText || Lucide.Circle;
const ED = Lucide.Flame || Lucide.Circle;
const kD = Lucide.GitBranch || Lucide.Circle;
const CD = Lucide.LayoutDashboard || Lucide.Circle;
const La = Lucide.Loader2 || Lucide.Circle;
const a2 = Lucide.Lock || Lucide.Circle;
const RD = Lucide.Network || Lucide.Circle;
const Ho = Lucide.Play || Lucide.Circle;
const LD = Lucide.Radio || Lucide.Circle;
const FD = Lucide.RefreshCw || Lucide.Circle;
const WD = Lucide.Save || Lucide.Circle;
const HD = Lucide.Search || Lucide.Circle;
const i2 = Lucide.Server || Lucide.Circle;
const VD = Lucide.Settings || Lucide.Circle;
const Sa = Lucide.Shield || Lucide.Circle;
const YD = Lucide.Thermometer || Lucide.Circle;
const fn = Lucide.AlertTriangle || Lucide.Circle;
const o2 = Lucide.User || Lucide.Circle;
const t4 = Lucide.Wrench || Lucide.Circle;
const Fn = Lucide.X || Lucide.Circle;
const a4 = Lucide.Zap || Lucide.Circle;

// Theme and Components
let m = {
  green: "#00ff88",
  cyan: "#00d4ff",
  purple: "#a855f7",
  red: "#ff4d6d",
  orange: "#ff8c42",
  yellow: "#ffd60a",
  bg: "#020817",
  sidebar: "#060f20",
  text: "#e2e8f0",
  muted: "#64748b",
  subtle: "#334155"
}, gd = [
  {
    id: "INC-2024-0847",
    title: "Wi-Fi Network Downtime",
    severity: "critical",
    status: "active",
    location: "Building A — Floor 2",
    timestamp: "14:32:18",
    affectedSystems: 12,
    category: "Network",
    description: "Complete Wi-Fi outage detected affecting 450+ connected devices across Building A, second floor. Access point AP-A2-01 ceased responding to SNMP queries at 14:32. Packet loss at 100%. Users report full connectivity loss.",
    rootCause: "Main router SW-CORE-01 load exceeded 95% capacity triggering fail-safe shutdown. Secondary router RTR-BACKUP-01 failed to assume primary role due to misconfigured HSRP priority (set to 90 instead of 110).",
    aiConfidence: 92,
    estimatedRecovery: "5–10 min"
  },
  {
    id: "INC-2024-0846",
    title: "CCTV Camera Offline",
    severity: "high",
    status: "investigating",
    location: "Parking Lot B — Gate 3",
    timestamp: "13:58:44",
    affectedSystems: 3,
    category: "Physical Security",
    description: "Security camera CAM-PLB-003 at Parking Lot B Gate 3 went offline. No video feed. Adjacent cameras CAM-PLB-002 and CAM-PLB-004 remain operational. PoE switch SW-CCTV-02 shows port 12 in error-disabled state.",
    rootCause: "PoE switch port failure on SW-CCTV-02, port 12. Camera power draw spike of 18W detected 3 minutes before failure, exceeding the 15.4W 802.3af limit.",
    aiConfidence: 87,
    estimatedRecovery: "15–20 min"
  },
  {
    id: "INC-2024-0845",
    title: "High CPU Usage — SRV-RACK4-07",
    severity: "high",
    status: "investigating",
    location: "Server Room — Rack 4",
    timestamp: "13:21:05",
    affectedSystems: 1,
    category: "Server",
    description: "Server SRV-RACK4-07 reporting sustained CPU utilization of 97% for 23 minutes. Top process: java (PID 14882) consuming 94% CPU across all 8 cores. Student portal response times degraded to 12–18 seconds.",
    rootCause: "Infinite loop in student registration batch processing job triggered by malformed CSV input file. Missing null-check on optional field 'transfer_credits' causing repeated retry cycles.",
    aiConfidence: 96,
    estimatedRecovery: "2–5 min"
  },
  {
    id: "INC-2024-0844",
    title: "Database Connection Pool Exhausted",
    severity: "medium",
    status: "resolved",
    location: "Data Center — DB Cluster",
    timestamp: "12:47:33",
    affectedSystems: 8,
    category: "Database",
    description: "Intermittent connection timeouts to primary PostgreSQL cluster PG-CLUSTER-01. Applications experiencing 2–5 second delays on queries. HikariCP connection pool exhaustion observed on 3 application servers.",
    rootCause: "Missing index on student_records.enrollment_date column causing sequential scans on a 4.2M row table. Peak load from course registration window saturated the 200-connection pool.",
    aiConfidence: 89,
    estimatedRecovery: "Resolved"
  }
], l2 = [
  { name: "Temperature Sensors", icon: YD, count: 48, online: 46, value: "22.4", unit: "°C", trend: "+0.2°C", status: "warning", color: m.orange },
  { name: "Smoke Detectors", icon: ED, count: 32, online: 32, value: "All Clear", unit: "", trend: "", status: "healthy", color: m.green },
  { name: "Water Leak Sensors", icon: wD, count: 24, online: 23, value: "No Leaks", unit: "", trend: "", status: "healthy", color: m.cyan },
  { name: "Power Monitoring", icon: a4, count: 16, online: 15, value: "284.7", unit: "kW", trend: "−3.1 kW", status: "warning", color: m.purple }
], ni = [
  { name: "Healthy", value: 98, color: m.green },
  { name: "Warning", value: 18, color: m.orange },
  { name: "Critical", value: 7, color: m.red },
  { name: "Maintenance", value: 5, color: m.purple }
], i4 = [
  { id: "PB-001", name: "Router Failover Automation", category: "Network", lastRun: "2 hrs ago", success: 47, status: "active" },
  { id: "PB-002", name: "High CPU Auto-Restart", category: "Server", lastRun: "1 day ago", success: 128, status: "active" },
  { id: "PB-003", name: "DB Connection Pool Reset", category: "Database", lastRun: "4 hrs ago", success: 34, status: "active" },
  { id: "PB-004", name: "PoE Port Cycle (CCTV)", category: "Physical", lastRun: "6 hrs ago", success: 19, status: "active" },
  { id: "PB-005", name: "IoT Sensor Re-enrollment", category: "IoT", lastRun: "3 days ago", success: 8, status: "draft" },
  { id: "PB-006", name: "Firewall Rule Rollback", category: "Security", lastRun: "Never", success: 0, status: "draft" }
], o4 = [
  { id: "detect", label: "Detect", status: "complete" },
  { id: "diagnose", label: "Diagnose", status: "complete" },
  { id: "simulate", label: "Simulate", status: "complete" },
  { id: "approve", label: "Approve", status: "current" },
  { id: "execute", label: "Execute", status: "pending" },
  { id: "verify", label: "Verify", status: "pending" }
], Vt = {
  critical: { color: m.red, bg: "rgba(255,77,109,0.1)", label: "Critical" },
  high: { color: m.orange, bg: "rgba(255,140,66,0.1)", label: "High" },
  medium: { color: m.yellow, bg: "rgba(255,214,10,0.1)", label: "Medium" },
  low: { color: m.cyan, bg: "rgba(0,212,255,0.1)", label: "Low" }
};
function l4(e = 0) {
  return Array.from({ length: 20 }, (t, r) => ({
    time: new Date(Date.now() - (19 - r) * 3e3).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    network: Math.round(70 + Math.sin((r + e) * 0.4) * 16 + Math.random() * 8),
    server: Math.round(80 + Math.cos((r + e) * 0.3) * 12 + Math.random() * 6),
    database: Math.round(92 + Math.sin((r + e) * 0.2) * 5 + Math.random() * 3),
    iot: Math.round(85 + Math.cos((r + e) * 0.5) * 10 + Math.random() * 7)
  }));
}
function Z({ children: e, className: t = "", style: r = {}, onClick: n }) {
  return /* @__PURE__ */ d(
    "div",
    {
      onClick: n,
      className: `rounded-xl backdrop-blur-md ${n ? "cursor-pointer transition-all duration-150 hover:scale-[1.005]" : ""} ${t}`,
      style: {
        background: "rgba(10,22,40,0.82)",
        border: "1px solid rgba(0,212,255,0.11)",
        ...n ? {} : {},
        ...r
      },
      children: e
    }
  );
}
function se({ children: e, accent: t }) {
  return /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-4", children: [
    t && /* @__PURE__ */ d("div", { className: "w-0.5 h-4 rounded-full", style: { background: t } }),
    /* @__PURE__ */ d("span", { className: "text-[11px] font-semibold uppercase tracking-widest", style: { color: "#64748b", fontFamily: "JetBrains Mono, monospace" }, children: e })
  ] });
}
function qa({ severity: e }) {
  const t = Vt[e];
  return /* @__PURE__ */ d(
    "span",
    {
      className: "text-[10px] font-semibold px-2 py-0.5 rounded-full",
      style: { color: t.color, background: t.bg, border: `1px solid ${t.color}35`, fontFamily: "JetBrains Mono, monospace" },
      children: t.label
    }
  );
}
function Pp({ status: e }) {
  const t = { active: { color: m.red, label: "● Active" }, investigating: { color: m.orange, label: "◌ Investigating" }, resolved: { color: m.green, label: "✓ Resolved" } }[e];
  return /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: t.color, fontFamily: "JetBrains Mono, monospace" }, children: t.label });
}
function $t({ label: e, color: t }) {
  return /* @__PURE__ */ d(
    "span",
    {
      className: "text-[10px] px-2 py-0.5 rounded-full",
      style: { background: `${t}12`, color: t, border: `1px solid ${t}25`, fontFamily: "JetBrains Mono, monospace" },
      children: e
    }
  );
}
function fe({ label: e, value: t, color: r = m.text }) {
  return /* @__PURE__ */ S("div", { className: "flex items-center justify-between py-1.5", style: { borderBottom: "1px solid rgba(0,212,255,0.06)" }, children: [
    /* @__PURE__ */ d("span", { className: "text-xs", style: { color: m.muted }, children: e }),
    /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: r, fontFamily: "JetBrains Mono, monospace" }, children: t })
  ] });
}
function Go({ open: e, onClose: t, children: r }) {
  return e ? /* @__PURE__ */ S("div", { className: "fixed inset-0 z-50 flex items-center justify-center", onClick: t, children: [
    /* @__PURE__ */ d("div", { className: "absolute inset-0", style: { background: "rgba(2,8,23,0.82)", backdropFilter: "blur(6px)" } }),
    /* @__PURE__ */ d("div", { className: "relative z-10", onClick: (n) => n.stopPropagation(), children: r })
  ] }) : null;
}
function s4({ open: e, onClose: t, onConfirm: r }) {
  return /* @__PURE__ */ d(Go, { open: e, onClose: t, children: /* @__PURE__ */ S("div", { className: "w-[500px] rounded-2xl p-6", style: { background: "rgba(6,15,32,0.99)", border: "1px solid rgba(0,212,255,0.25)" }, children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ d("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center", style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)" }, children: /* @__PURE__ */ d(Sa, { size: 17, style: { color: m.cyan } }) }),
        /* @__PURE__ */ S("div", { children: [
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: "Human Approval Required" }),
          /* @__PURE__ */ d("div", { className: "text-[11px]", style: { color: m.muted }, children: "INC-2024-0847 · Wi-Fi Network Downtime" })
        ] })
      ] }),
      /* @__PURE__ */ d("button", { onClick: t, children: /* @__PURE__ */ d(Fn, { size: 15, style: { color: m.muted } }) })
    ] }),
    /* @__PURE__ */ S("div", { className: "p-4 rounded-xl mb-4", style: { background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.14)" }, children: [
      /* @__PURE__ */ d("div", { className: "text-[10px] font-semibold mb-3 uppercase tracking-widest", style: { color: m.cyan, fontFamily: "JetBrains Mono, monospace" }, children: "Remediation Plan" }),
      [
        "Shed 30% load from SW-CORE-01 via traffic rerouting",
        "Elevate HSRP priority on RTR-BACKUP-01 to 110",
        "Restart AP-A2-01 via PoE controller soft-cycle",
        "Monitor latency & packet-loss for 5 min post-execution"
      ].map((n, a) => /* @__PURE__ */ S("div", { className: "flex items-start gap-2.5 mb-2", children: [
        /* @__PURE__ */ d(
          "div",
          {
            className: "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
            style: { background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)" },
            children: /* @__PURE__ */ d("span", { className: "text-[8px] font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: a + 1 })
          }
        ),
        /* @__PURE__ */ d("span", { className: "text-xs", style: { color: "#94a3b8" }, children: n })
      ] }, a))
    ] }),
    /* @__PURE__ */ S("div", { className: "flex items-center gap-2 p-3 rounded-lg mb-5", style: { background: "rgba(255,214,10,0.06)", border: "1px solid rgba(255,214,10,0.18)" }, children: [
      /* @__PURE__ */ d(Sp, { size: 13, style: { color: m.yellow } }),
      /* @__PURE__ */ d("span", { className: "text-xs", style: { color: m.yellow }, children: "Affects 12 systems — 30s estimated micro-downtime during rerouting." })
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-3 mb-5", children: [{ l: "Affected Systems", v: "12", c: m.orange }, { l: "Est. Recovery", v: "5–10 min", c: m.green }, { l: "AI Confidence", v: "92%", c: m.purple }].map((n) => /* @__PURE__ */ S("div", { className: "p-2.5 rounded-lg text-center", style: { background: "rgba(15,31,61,0.7)" }, children: [
      /* @__PURE__ */ d("div", { className: "text-sm font-bold", style: { color: n.c, fontFamily: "JetBrains Mono, monospace" }, children: n.v }),
      /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: n.l })
    ] }, n.l)) }),
    /* @__PURE__ */ S("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ d(
        "button",
        {
          onClick: t,
          className: "flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.01]",
          style: { background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.28)", color: m.red, fontFamily: "JetBrains Mono, monospace" },
          children: "Reject"
        }
      ),
      /* @__PURE__ */ d(
        "button",
        {
          onClick: r,
          className: "flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.01]",
          style: { background: "linear-gradient(135deg,rgba(0,255,136,0.18),rgba(0,212,255,0.14))", border: "1px solid rgba(0,255,136,0.38)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
          children: "Approve & Execute"
        }
      )
    ] })
  ] }) });
}
function c4({ open: e, onClose: t }) {
  const [r, n] = ae(0), a = [
    "Rerouting traffic from SW-CORE-01...",
    "Elevating HSRP priority on RTR-BACKUP-01...",
    "Soft-cycling AP-A2-01 via PoE controller...",
    "Monitoring latency and packet-loss metrics...",
    "Remediation complete — all systems nominal."
  ], i = Math.min(4, Math.floor(r / 22));
  return Dt(() => {
    if (!e) {
      n(0);
      return;
    }
    const o = setInterval(() => n((l) => l >= 100 ? 100 : l + 1.8), 60);
    return () => clearInterval(o);
  }, [e]), /* @__PURE__ */ d(Go, { open: e, onClose: r >= 100 ? t : void 0, children: /* @__PURE__ */ S("div", { className: "w-[480px] rounded-2xl p-6", style: { background: "rgba(6,15,32,0.99)", border: "1px solid rgba(0,255,136,0.22)" }, children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ d("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center", style: { background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }, children: /* @__PURE__ */ d(Op, { size: 16, style: { color: m.green } }) }),
        /* @__PURE__ */ S("div", { children: [
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: "Remediation In Progress" }),
          /* @__PURE__ */ d("div", { className: "text-[11px]", style: { color: m.muted }, children: "INC-2024-0847 · Automated playbook executing" })
        ] })
      ] }),
      r >= 100 && /* @__PURE__ */ d("button", { onClick: t, children: /* @__PURE__ */ d(Fn, { size: 15, style: { color: m.muted } }) })
    ] }),
    /* @__PURE__ */ S("div", { className: "mb-5", children: [
      /* @__PURE__ */ S("div", { className: "flex justify-between mb-2", children: [
        /* @__PURE__ */ d("span", { className: "text-[10px] uppercase tracking-widest", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Progress" }),
        /* @__PURE__ */ S("span", { className: "text-[11px] font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: [
          Math.round(r),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ d("div", { className: "h-2 rounded-full overflow-hidden", style: { background: "rgba(0,255,136,0.08)" }, children: /* @__PURE__ */ d(
        "div",
        {
          className: "h-full rounded-full transition-all duration-100",
          style: { width: `${r}%`, background: "linear-gradient(90deg,#00ff88,#00d4ff)", boxShadow: "0 0 12px #00ff8850" }
        }
      ) })
    ] }),
    /* @__PURE__ */ d("div", { className: "space-y-3", children: a.map((o, l) => /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
      l < i ? /* @__PURE__ */ d(Ba, { size: 14, style: { color: m.green } }) : l === i ? /* @__PURE__ */ d(La, { size: 14, className: "animate-spin", style: { color: m.cyan } }) : /* @__PURE__ */ d("div", { className: "w-3.5 h-3.5 rounded-full border", style: { borderColor: "rgba(0,212,255,0.15)" } }),
      /* @__PURE__ */ d("span", { className: "text-xs", style: { color: l <= i ? m.text : m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: o })
    ] }, l)) }),
    r >= 100 && /* @__PURE__ */ d(
      "button",
      {
        onClick: t,
        className: "mt-5 w-full py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.01]",
        style: { background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
        children: "View Recovery Verification →"
      }
    )
  ] }) });
}
function u4({ open: e, onClose: t }) {
  return /* @__PURE__ */ d(Go, { open: e, onClose: t, children: /* @__PURE__ */ S("div", { className: "w-[460px] rounded-2xl p-6", style: { background: "rgba(6,15,32,0.99)", border: "1px solid rgba(0,255,136,0.25)" }, children: [
    /* @__PURE__ */ S("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ d(
        "div",
        {
          className: "w-12 h-12 rounded-2xl flex items-center justify-center",
          style: { background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.35)" },
          children: /* @__PURE__ */ d(Ba, { size: 22, style: { color: m.green } })
        }
      ),
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: "Recovery Confirmed" }),
        /* @__PURE__ */ d("div", { className: "text-xs", style: { color: m.muted }, children: "INC-2024-0847 · All systems operational" })
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-2 gap-3 mb-5", children: [
      { l: "Resolution Time", v: "7m 23s", c: m.green },
      { l: "Systems Restored", v: "12 / 12", c: m.green },
      { l: "Wi-Fi Availability", v: "100%", c: m.cyan },
      { l: "Packet Loss", v: "0.00%", c: m.cyan }
    ].map((r) => /* @__PURE__ */ S("div", { className: "p-3.5 rounded-xl", style: { background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.12)" }, children: [
      /* @__PURE__ */ d("div", { className: "text-base font-bold", style: { color: r.c, fontFamily: "JetBrains Mono, monospace" }, children: r.v }),
      /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: r.l })
    ] }, r.l)) }),
    /* @__PURE__ */ S("div", { className: "p-3 rounded-lg mb-4", style: { background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.1)" }, children: [
      /* @__PURE__ */ d("div", { className: "text-[10px] uppercase tracking-widest mb-2", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Verification Log" }),
      ["AP-A2-01 online — 42ms ping", "SW-CORE-01 load: 48%", "RTR-BACKUP-01 HSRP active", "450 devices reconnected"].map((r, n) => /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ d("div", { className: "w-1 h-1 rounded-full", style: { background: m.green } }),
        /* @__PURE__ */ d("span", { className: "text-xs", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: r })
      ] }, n))
    ] }),
    /* @__PURE__ */ d(
      "button",
      {
        onClick: t,
        className: "w-full py-2.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.01]",
        style: { background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.3)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
        children: "Archive Incident"
      }
    )
  ] }) });
}
const f4 = [
  { id: "dashboard", label: "Dashboard", icon: CD },
  { id: "infrastructure", label: "Infrastructure", icon: i2 },
  { id: "incidents", label: "Incidents", icon: fn, badge: 7 },
  { id: "predictive-risk", label: "Predictive Risk Radar", icon: gD },
  { id: "ai-diagnosis", label: "AI Diagnosis", icon: Da },
  { id: "remediation", label: "Remediation", icon: t4 },
  { id: "iot", label: "IoT & Sensors", icon: LD },
  { id: "cctv", label: "CCTV Monitoring", icon: iD },
  { id: "reports", label: "Reports & Logs", icon: PD },
  { id: "playbook", label: "Playbook Library", icon: rD },
  { id: "settings", label: "Settings", icon: VD }
];
function d4({ active: e, onNav: t }) {
  return /* @__PURE__ */ S("div", { className: "flex flex-col h-full flex-shrink-0 w-56", style: { background: m.sidebar, borderRight: "1px solid rgba(0,212,255,0.07)" }, children: [
    /* @__PURE__ */ d("div", { className: "px-4 py-4 flex-shrink-0", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: /* @__PURE__ */ S("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ d(
        "div",
        {
          className: "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
          style: { background: "linear-gradient(135deg,rgba(0,255,136,0.25),rgba(0,212,255,0.25))", border: "1px solid rgba(0,255,136,0.35)" },
          children: /* @__PURE__ */ d(Sa, { size: 15, style: { color: m.green } })
        }
      ),
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("div", { className: "text-sm font-bold", style: { color: m.text, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.02em" }, children: "CampusGuard" }),
        /* @__PURE__ */ d("div", { className: "text-[9px] tracking-wider", style: { color: m.cyan, fontFamily: "JetBrains Mono, monospace" }, children: "AIOPS CONTROLLER" })
      ] })
    ] }) }),
    /* @__PURE__ */ d("nav", { className: "flex-1 px-2 py-3 space-y-0.5 overflow-y-auto", children: f4.map(({ id: r, label: n, icon: a, badge: i }) => {
      const o = e === r || e === "incident-detail" && r === "incidents";
      return /* @__PURE__ */ S(
        "button",
        {
          onClick: () => t(r),
          className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150 group",
          style: {
            background: o ? "rgba(0,212,255,0.08)" : "transparent",
            borderLeft: `2px solid ${o ? m.cyan : "transparent"}`,
            color: o ? m.cyan : m.muted
          },
          children: [
            /* @__PURE__ */ d(a, { size: 13 }),
            /* @__PURE__ */ d("span", { className: "text-xs font-medium flex-1", children: n }),
            i && /* @__PURE__ */ d("span", { className: "text-[9px] px-1.5 py-0.5 rounded-full", style: { background: "rgba(255,77,109,0.18)", color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: i })
          ]
        },
        r
      );
    }) }),
    /* @__PURE__ */ S("div", { className: "m-3 p-3 rounded-xl", style: { background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.1)" }, children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: m.green } }),
        /* @__PURE__ */ d("span", { className: "text-[10px] font-semibold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: "AI Engine Active" })
      ] }),
      /* @__PURE__ */ d("div", { className: "text-[9px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Model v3.2.1 · 94% confidence" }),
      /* @__PURE__ */ d("div", { className: "mt-2 h-1 rounded-full overflow-hidden", style: { background: "rgba(0,255,136,0.1)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: "94%", background: "linear-gradient(90deg,#00ff88,#00d4ff)" } }) })
    ] })
  ] });
}
function p4({ timeFilter: e, setTimeFilter: t }) {
  const [r, n] = ae(!0), [a, i] = ae("");
  return /* @__PURE__ */ S(
    "div",
    {
      className: "h-12 flex items-center gap-3 px-5 flex-shrink-0",
      style: { background: "rgba(6,15,32,0.95)", borderBottom: "1px solid rgba(0,212,255,0.07)", backdropFilter: "blur(12px)" },
      children: [
        /* @__PURE__ */ S(
          "div",
          {
            className: "flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-lg",
            style: { background: "rgba(15,31,61,0.7)", border: "1px solid rgba(0,212,255,0.09)" },
            children: [
              /* @__PURE__ */ d(HD, { size: 12, style: { color: m.muted } }),
              /* @__PURE__ */ d(
                "input",
                {
                  value: a,
                  onChange: (o) => i(o.target.value),
                  placeholder: "Search systems, incidents and logs...",
                  className: "bg-transparent text-xs outline-none flex-1 placeholder:text-[#334155]",
                  style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ S("div", { className: "flex items-center gap-2 ml-auto", children: [
          /* @__PURE__ */ d(
            "select",
            {
              value: e,
              onChange: (o) => t(o.target.value),
              className: "text-[11px] px-2.5 py-1.5 rounded-lg outline-none cursor-pointer",
              style: { background: "rgba(15,31,61,0.7)", border: "1px solid rgba(0,212,255,0.09)", color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" },
              children: ["Last 1h", "Last 6h", "Last 24h", "Last 7d"].map((o) => /* @__PURE__ */ d("option", { children: o }, o))
            }
          ),
          /* @__PURE__ */ S(
            "button",
            {
              onClick: () => n((o) => !o),
              className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all",
              style: {
                background: r ? "rgba(0,255,136,0.08)" : "rgba(15,31,61,0.7)",
                border: `1px solid ${r ? "rgba(0,255,136,0.25)" : "rgba(0,212,255,0.09)"}`,
                color: r ? m.green : m.muted,
                fontFamily: "JetBrains Mono, monospace"
              },
              children: [
                /* @__PURE__ */ d(FD, { size: 11, style: { animation: r ? "spin 3s linear infinite" : "none" } }),
                r ? "Live" : "Paused"
              ]
            }
          ),
          /* @__PURE__ */ S("button", { className: "relative p-1.5 rounded-lg", style: { border: "1px solid rgba(0,212,255,0.09)" }, children: [
            /* @__PURE__ */ d(eD, { size: 14, style: { color: m.muted } }),
            /* @__PURE__ */ d(
              "div",
              {
                className: "absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center",
                style: { background: m.red, fontSize: "8px", color: "#fff", fontFamily: "JetBrains Mono, monospace" },
                children: "3"
              }
            )
          ] }),
          /* @__PURE__ */ S(
            "div",
            {
              className: "flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer",
              style: { border: "1px solid rgba(0,212,255,0.09)", background: "rgba(15,31,61,0.5)" },
              children: [
                /* @__PURE__ */ d(
                  "div",
                  {
                    className: "w-5 h-5 rounded-full flex items-center justify-center",
                    style: { background: "linear-gradient(135deg,#a855f7,#00d4ff)" },
                    children: /* @__PURE__ */ d(o2, { size: 10, style: { color: "#fff" } })
                  }
                ),
                /* @__PURE__ */ d("span", { className: "text-[11px]", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: "Admin" }),
                /* @__PURE__ */ d(sD, { size: 10, style: { color: m.muted } })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function h4() {
  const e = [
    { label: "Total Systems", value: "128", icon: i2, color: m.cyan, sub: "+3 this week" },
    { label: "Active Incidents", value: "7", icon: fn, color: m.red, sub: "2 critical" },
    { label: "Resolved Today", value: "23", icon: Ba, color: m.green, sub: "↑ 15% vs yesterday" },
    { label: "Availability", value: "99.2%", icon: Op, color: m.green, sub: "SLA: 99.0%" },
    { label: "AI Confidence", value: "94%", icon: Da, color: m.purple, sub: "Model v3.2.1" }
  ];
  return /* @__PURE__ */ d("div", { className: "grid grid-cols-5 gap-3", children: e.map((t) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ d(
        "div",
        {
          className: "w-8 h-8 rounded-lg flex items-center justify-center",
          style: { background: `${t.color}12`, border: `1px solid ${t.color}25` },
          children: /* @__PURE__ */ d(t.icon, { size: 14, style: { color: t.color } })
        }
      ),
      /* @__PURE__ */ d(
        "span",
        {
          className: "text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
          style: { color: m.green, background: "rgba(0,255,136,0.08)", fontFamily: "JetBrains Mono, monospace" },
          children: "LIVE"
        }
      )
    ] }),
    /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: t.color, fontFamily: "JetBrains Mono, monospace" }, children: t.value }),
    /* @__PURE__ */ d("div", { className: "text-xs font-medium mt-0.5", style: { color: "#94a3b8" }, children: t.label }),
    /* @__PURE__ */ d("div", { className: "text-[10px] mt-1", style: { color: m.muted }, children: t.sub })
  ] }, t.label)) });
}
function y4() {
  const [e, t] = ae(() => l4(0)), [r, n] = ae(0);
  Dt(() => {
    const i = setInterval(() => {
      n((o) => o + 1), t((o) => {
        const l = o.slice(1), s = /* @__PURE__ */ new Date();
        return l.push({
          time: s.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          network: Math.round(70 + Math.sin(r * 0.4) * 16 + Math.random() * 8),
          server: Math.round(80 + Math.cos(r * 0.3) * 12 + Math.random() * 6),
          database: Math.round(92 + Math.sin(r * 0.2) * 5 + Math.random() * 3),
          iot: Math.round(85 + Math.cos(r * 0.5) * 10 + Math.random() * 7)
        }), l;
      });
    }, 2e3);
    return () => clearInterval(i);
  }, [r]);
  const a = [
    { key: "network", color: m.cyan, label: "Network" },
    { key: "server", color: m.purple, label: "Server" },
    { key: "database", color: m.green, label: "Database" },
    { key: "iot", color: m.orange, label: "IoT Devices" }
  ];
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ d(se, { accent: m.cyan, children: "System Health Overview" }),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-4", children: a.map((i) => /* @__PURE__ */ S("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ d("div", { className: "w-3 h-0.5 rounded-full", style: { background: i.color } }),
        /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: i.label })
      ] }, i.key)) })
    ] }),
    /* @__PURE__ */ d(H_, { width: "100%", height: 175, children: /* @__PURE__ */ S(U3, { data: e, children: [
      /* @__PURE__ */ d(Lw, { strokeDasharray: "3 3", stroke: "rgba(0,212,255,0.05)" }),
      /* @__PURE__ */ d(zo, { dataKey: "time", tick: { fill: "#334155", fontSize: 9, fontFamily: "JetBrains Mono" }, tickLine: !1, axisLine: !1, interval: 4 }),
      /* @__PURE__ */ d(Wo, { domain: [50, 100], tick: { fill: "#334155", fontSize: 9, fontFamily: "JetBrains Mono" }, tickLine: !1, axisLine: !1, unit: "%", width: 30 }),
      /* @__PURE__ */ d(mt, { contentStyle: { background: "rgba(6,15,32,0.97)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "8px", fontSize: "11px", fontFamily: "JetBrains Mono" }, labelStyle: { color: "#94a3b8" } }),
      a.map((i) => /* @__PURE__ */ d(Ra, { type: "monotone", dataKey: i.key, stroke: i.color, strokeWidth: 1.5, dot: !1, isAnimationActive: !1 }, i.key))
    ] }) })
  ] });
}
function m4() {
  const e = [
    { id: "A", x: 75, y: 55, w: 85, h: 60, label: "Admin Block", status: "healthy" },
    { id: "B", x: 195, y: 55, w: 100, h: 50, label: "Science Hall", status: "healthy" },
    { id: "C", x: 325, y: 50, w: 90, h: 65, label: "Library", status: "healthy" },
    { id: "D", x: 75, y: 155, w: 75, h: 80, label: "Engineering", status: "warning" },
    { id: "E", x: 185, y: 150, w: 120, h: 72, label: "IT Center", status: "critical" },
    { id: "F", x: 335, y: 158, w: 80, h: 72, label: "Auditorium", status: "healthy" },
    { id: "G", x: 90, y: 278, w: 110, h: 55, label: "Sports Complex", status: "healthy" },
    { id: "H", x: 230, y: 272, w: 90, h: 62, label: "Cafeteria", status: "warning" },
    { id: "I", x: 350, y: 272, w: 65, h: 58, label: "Parking B", status: "warning" },
    { id: "J", x: 458, y: 55, w: 88, h: 68, label: "Dorm Block 1", status: "healthy" },
    { id: "K", x: 463, y: 168, w: 78, h: 60, label: "Dorm Block 2", status: "healthy" },
    { id: "L", x: 453, y: 268, w: 90, h: 58, label: "Medical Center", status: "healthy" }
  ], t = {
    healthy: { color: m.green },
    warning: { color: m.orange },
    critical: { color: m.red }
  };
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ d(se, { accent: m.green, children: "Campus Map" }),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-3", children: [["Healthy", m.green], ["Warning", m.orange], ["Critical", m.red]].map(([r, n]) => /* @__PURE__ */ S("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full", style: { background: n, boxShadow: `0 0 5px ${n}` } }),
        /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: r })
      ] }, r)) })
    ] }),
    /* @__PURE__ */ d("div", { className: "rounded-xl overflow-hidden", style: { background: "rgba(2,8,23,0.95)" }, children: /* @__PURE__ */ S("svg", { viewBox: "0 0 580 360", width: "100%", style: { display: "block" }, children: [
      /* @__PURE__ */ S("defs", { children: [
        /* @__PURE__ */ d("pattern", { id: "cgrid", width: "18", height: "18", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ d("path", { d: "M18 0L0 0 0 18", fill: "none", stroke: "rgba(0,212,255,0.055)", strokeWidth: "0.5" }) }),
        /* @__PURE__ */ S("radialGradient", { id: "mglow", cx: "50%", cy: "50%", r: "55%", children: [
          /* @__PURE__ */ d("stop", { offset: "0%", stopColor: "rgba(0,212,255,0.045)" }),
          /* @__PURE__ */ d("stop", { offset: "100%", stopColor: "rgba(2,8,23,0)" })
        ] })
      ] }),
      /* @__PURE__ */ d("rect", { width: "580", height: "360", fill: "url(#cgrid)" }),
      /* @__PURE__ */ d("rect", { width: "580", height: "360", fill: "url(#mglow)" }),
      /* @__PURE__ */ d("rect", { x: "0", y: "138", width: "580", height: "10", fill: "rgba(0,212,255,0.08)" }),
      /* @__PURE__ */ d("rect", { x: "0", y: "258", width: "580", height: "10", fill: "rgba(0,212,255,0.08)" }),
      /* @__PURE__ */ d("rect", { x: "162", y: "0", width: "10", height: "360", fill: "rgba(0,212,255,0.08)" }),
      /* @__PURE__ */ d("rect", { x: "444", y: "0", width: "10", height: "360", fill: "rgba(0,212,255,0.08)" }),
      /* @__PURE__ */ d("line", { x1: "0", y1: "143", x2: "580", y2: "143", stroke: "rgba(0,212,255,0.1)", strokeWidth: "0.5", strokeDasharray: "12,8" }),
      /* @__PURE__ */ d("line", { x1: "0", y1: "263", x2: "580", y2: "263", stroke: "rgba(0,212,255,0.1)", strokeWidth: "0.5", strokeDasharray: "12,8" }),
      e.map((r) => {
        const n = t[r.status];
        return /* @__PURE__ */ S("g", { children: [
          /* @__PURE__ */ d(
            "rect",
            {
              x: r.x - 1,
              y: r.y - 1,
              width: r.w + 2,
              height: r.h + 2,
              rx: 4,
              fill: "none",
              stroke: n.color,
              strokeWidth: "0.4",
              opacity: "0.35"
            }
          ),
          /* @__PURE__ */ d(
            "rect",
            {
              x: r.x,
              y: r.y,
              width: r.w,
              height: r.h,
              rx: 3,
              fill: `${n.color}07`,
              stroke: `${n.color}35`,
              strokeWidth: "0.8"
            }
          ),
          /* @__PURE__ */ d(
            "text",
            {
              x: r.x + r.w / 2,
              y: r.y + r.h / 2 + 4,
              textAnchor: "middle",
              fill: n.color,
              fontSize: "6.5",
              fontFamily: "JetBrains Mono",
              opacity: "0.75",
              children: r.label
            }
          ),
          /* @__PURE__ */ S(
            "circle",
            {
              cx: r.x + r.w - 8,
              cy: r.y + 8,
              r: "3.5",
              fill: n.color,
              style: { filter: `drop-shadow(0 0 4px ${n.color})` },
              children: [
                r.status === "critical" && /* @__PURE__ */ d("animate", { attributeName: "opacity", values: "1;0.25;1", dur: "0.9s", repeatCount: "indefinite" }),
                r.status === "warning" && /* @__PURE__ */ d("animate", { attributeName: "opacity", values: "1;0.5;1", dur: "2s", repeatCount: "indefinite" })
              ]
            }
          )
        ] }, r.id);
      }),
      /* @__PURE__ */ d("rect", { x: "4", y: "4", width: "572", height: "352", rx: "8", fill: "none", stroke: "rgba(0,212,255,0.12)", strokeWidth: "1" })
    ] }) })
  ] });
}
function v4({ onSelect: e }) {
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ d(se, { accent: m.red, children: "Recent Incidents" }),
      /* @__PURE__ */ d(
        "button",
        {
          className: "text-[10px] px-2 py-1 rounded-lg transition-all",
          style: { color: m.cyan, border: "1px solid rgba(0,212,255,0.18)", fontFamily: "JetBrains Mono, monospace" },
          children: "View All"
        }
      )
    ] }),
    /* @__PURE__ */ d("div", { className: "space-y-2", children: gd.map((t) => /* @__PURE__ */ S(
      "div",
      {
        onClick: () => e(t),
        className: "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 hover:scale-[1.005]",
        style: { background: "rgba(15,31,61,0.45)", border: "1px solid rgba(0,212,255,0.06)" },
        children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: "w-1 h-10 rounded-full flex-shrink-0",
              style: { background: Vt[t.severity].color, boxShadow: `0 0 6px ${Vt[t.severity].color}60` }
            }
          ),
          /* @__PURE__ */ S("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ d("span", { className: "text-xs font-semibold truncate", style: { color: m.text }, children: t.title }),
              /* @__PURE__ */ d(qa, { severity: t.severity })
            ] }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mt-0.5", children: [
              /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: t.id }),
              /* @__PURE__ */ d("span", { style: { color: "#1e3a5f" }, children: "·" }),
              /* @__PURE__ */ d("span", { className: "text-[10px] truncate", style: { color: m.muted }, children: t.location })
            ] })
          ] }),
          /* @__PURE__ */ S("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [
            /* @__PURE__ */ d(Pp, { status: t.status }),
            /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: t.timestamp })
          ] })
        ]
      },
      t.id
    )) })
  ] });
}
function g4({ onViewFull: e }) {
  const [t, r] = ae(92);
  return Dt(() => {
    const n = setInterval(() => r((a) => Math.max(88, Math.min(96, a + (Math.random() - 0.5) * 1.5))), 2500);
    return () => clearInterval(n);
  }, []), /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ d(se, { accent: m.purple, children: "AI Diagnosis" }),
    /* @__PURE__ */ S("div", { className: "space-y-3", children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: m.green } }),
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: "Root Cause Identified" })
      ] }),
      /* @__PURE__ */ S("div", { className: "p-3 rounded-xl", style: { background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.18)" }, children: [
        /* @__PURE__ */ d("div", { className: "text-sm font-semibold mb-1", style: { color: m.text }, children: "Network Latency Spike" }),
        /* @__PURE__ */ d("div", { className: "text-xs", style: { color: "#94a3b8" }, children: "Main Router Load High — SW-CORE-01 at 95% utilization" })
      ] }),
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ S("div", { className: "flex justify-between mb-1.5", children: [
          /* @__PURE__ */ d("span", { className: "text-[10px] uppercase tracking-widest", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Confidence" }),
          /* @__PURE__ */ S("span", { className: "text-[10px] font-bold", style: { color: m.purple, fontFamily: "JetBrains Mono, monospace" }, children: [
            Math.round(t),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ d("div", { className: "h-1.5 rounded-full overflow-hidden", style: { background: "rgba(168,85,247,0.12)" }, children: /* @__PURE__ */ d(
          "div",
          {
            className: "h-full rounded-full transition-all duration-500",
            style: { width: `${t}%`, background: "linear-gradient(90deg,#7c3aed,#a855f7)", boxShadow: "0 0 8px #a855f740" }
          }
        ) })
      ] }),
      /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-2", children: [{ l: "Impact", v: "High", c: m.red }, { l: "Affected", v: "12 sys", c: m.orange }, { l: "Recovery", v: "5–10m", c: m.green }].map((n) => /* @__PURE__ */ S("div", { className: "p-2.5 rounded-lg text-center", style: { background: "rgba(15,31,61,0.7)" }, children: [
        /* @__PURE__ */ d("div", { className: "text-xs font-bold", style: { color: n.c, fontFamily: "JetBrains Mono, monospace" }, children: n.v }),
        /* @__PURE__ */ d("div", { className: "text-[9px] mt-0.5", style: { color: m.muted }, children: n.l })
      ] }, n.l)) }),
      /* @__PURE__ */ S(
        "button",
        {
          onClick: e,
          className: "w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]",
          style: { background: "linear-gradient(135deg,rgba(168,85,247,0.14),rgba(0,212,255,0.08))", border: "1px solid rgba(168,85,247,0.28)", color: m.purple, fontFamily: "JetBrains Mono, monospace" },
          children: [
            "View Full Analysis ",
            /* @__PURE__ */ d(dD, { size: 12 })
          ]
        }
      )
    ] })
  ] });
}
function b4() {
  const e = ni.reduce((t, r) => t + r.value, 0);
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ d(se, { accent: m.cyan, children: "System Performance" }),
    /* @__PURE__ */ S("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ S("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ d(H3, { width: 130, height: 130, children: /* @__PURE__ */ d(Ft, { data: ni, cx: 65, cy: 65, innerRadius: 40, outerRadius: 58, dataKey: "value", strokeWidth: 0, startAngle: 90, endAngle: -270, children: ni.map((t, r) => /* @__PURE__ */ d(go, { fill: t.color }, r)) }) }),
        /* @__PURE__ */ S("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
          /* @__PURE__ */ d("span", { className: "text-xl font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: e }),
          /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "SYS" })
        ] })
      ] }),
      /* @__PURE__ */ d("div", { className: "flex-1 space-y-2.5", children: ni.map((t) => /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-sm flex-shrink-0", style: { background: t.color, boxShadow: `0 0 4px ${t.color}80` } }),
        /* @__PURE__ */ d("span", { className: "text-xs flex-1", style: { color: "#94a3b8" }, children: t.name }),
        /* @__PURE__ */ d("span", { className: "text-xs font-bold", style: { color: t.color, fontFamily: "JetBrains Mono, monospace" }, children: t.value })
      ] }, t.name)) })
    ] })
  ] });
}
function x4() {
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ d(se, { accent: m.green, children: "IoT & Sensor Status" }),
    /* @__PURE__ */ d("div", { className: "space-y-3", children: l2.map((e) => /* @__PURE__ */ S(
      "div",
      {
        className: "flex items-center gap-3 p-2.5 rounded-xl",
        style: { background: "rgba(15,31,61,0.5)", border: "1px solid rgba(0,212,255,0.05)" },
        children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
              style: { background: `${e.color}10`, border: `1px solid ${e.color}22` },
              children: /* @__PURE__ */ d(e.icon, { size: 13, style: { color: e.color } })
            }
          ),
          /* @__PURE__ */ S("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-medium", style: { color: m.text }, children: e.name }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ d("div", { className: "h-1 flex-1 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.04)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${e.online / e.count * 100}%`, background: e.color } }) }),
              /* @__PURE__ */ S("span", { className: "text-[9px] flex-shrink-0", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: [
                e.online,
                "/",
                e.count
              ] })
            ] })
          ] }),
          /* @__PURE__ */ S("div", { className: "text-right flex-shrink-0", children: [
            /* @__PURE__ */ S("div", { className: "text-xs font-bold", style: { color: e.color, fontFamily: "JetBrains Mono, monospace" }, children: [
              e.value,
              e.unit
            ] }),
            e.trend && /* @__PURE__ */ d("div", { className: "text-[9px] mt-0.5", style: { color: m.muted }, children: e.trend })
          ] })
        ]
      },
      e.name
    )) })
  ] });
}
function w4({ onApprove: e, onExecute: t, onVerify: r, pipelineState: n }) {
  return /* @__PURE__ */ S(Z, { className: "p-5", children: [
    /* @__PURE__ */ d(se, { accent: m.green, children: "Automation & Remediation" }),
    /* @__PURE__ */ d("div", { className: "flex items-start gap-0", children: n.map((a, i) => {
      const o = a.status === "complete", l = a.status === "current", s = o ? m.green : l ? m.cyan : "#1e3a5f", c = o ? m.green : l ? m.cyan : m.subtle;
      return /* @__PURE__ */ S("div", { className: "flex items-center", children: [
        /* @__PURE__ */ S("div", { className: "flex flex-col items-center gap-1.5 min-w-0", children: [
          /* @__PURE__ */ d(
            "button",
            {
              onClick: l ? () => {
                a.id === "approve" ? e() : a.id === "execute" ? t() : a.id === "verify" && r();
              } : void 0,
              className: `w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${l ? "hover:scale-110 cursor-pointer" : ""}`,
              style: { background: o ? "rgba(0,255,136,0.1)" : l ? "rgba(0,212,255,0.1)" : "rgba(30,58,95,0.25)", border: `2px solid ${s}`, boxShadow: l ? `0 0 14px ${s}35` : "none" },
              children: o ? /* @__PURE__ */ d(Ap, { size: 14, style: { color: m.green } }) : l ? /* @__PURE__ */ d(La, { size: 13, className: "animate-spin", style: { color: m.cyan } }) : /* @__PURE__ */ d("span", { className: "text-[10px] font-bold", style: { color: c, fontFamily: "JetBrains Mono, monospace" }, children: i + 1 })
            }
          ),
          /* @__PURE__ */ d("span", { className: "text-[9px] font-semibold whitespace-nowrap", style: { color: c, fontFamily: "JetBrains Mono, monospace" }, children: a.label }),
          l && /* @__PURE__ */ d(
            "button",
            {
              onClick: () => {
                a.id === "approve" ? e() : a.id === "execute" ? t() : a.id === "verify" && r();
              },
              className: "text-[9px] px-2 py-0.5 rounded-full capitalize",
              style: { background: "rgba(0,212,255,0.12)", color: m.cyan, border: "1px solid rgba(0,212,255,0.28)", fontFamily: "JetBrains Mono, monospace" },
              children: a.id
            }
          )
        ] }),
        i < n.length - 1 && /* @__PURE__ */ d("div", { className: "w-8 h-0.5 mb-5 mx-1", style: { background: o ? `linear-gradient(90deg,${m.green},${m.cyan}40)` : "rgba(30,58,95,0.5)" } })
      ] }, a.id);
    }) })
  ] });
}
function O4({ onSelectIncident: e, onViewAI: t, onApprove: r, onExecute: n, onVerify: a, pipelineState: i }) {
  return /* @__PURE__ */ S("div", { className: "space-y-3 pb-4", children: [
    /* @__PURE__ */ d(h4, {}),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d("div", { className: "col-span-2", children: /* @__PURE__ */ d(y4, {}) }),
      /* @__PURE__ */ d(g4, { onViewFull: t })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ d(m4, {}),
      /* @__PURE__ */ d(v4, { onSelect: e })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ d(b4, {}),
      /* @__PURE__ */ d(x4, {}),
      /* @__PURE__ */ d(w4, { onApprove: r, onExecute: n, onVerify: a, pipelineState: i })
    ] })
  ] });
}
function A4({ incident: e, onBack: t }) {
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ S(
        "button",
        {
          onClick: t,
          className: "flex items-center gap-1.5 text-xs transition-all hover:scale-105",
          style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" },
          children: [
            /* @__PURE__ */ d(uD, { size: 14 }),
            " Back to Incidents"
          ]
        }
      ),
      /* @__PURE__ */ d("div", { className: "flex-1" }),
      /* @__PURE__ */ d(qa, { severity: e.severity }),
      /* @__PURE__ */ d(Pp, { status: e.status })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ S("div", { className: "col-span-2 space-y-4", children: [
        /* @__PURE__ */ S(Z, { className: "p-6", children: [
          /* @__PURE__ */ d("div", { className: "flex items-start justify-between mb-4", children: /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("div", { className: "text-lg font-bold mb-1", style: { color: m.text }, children: e.title }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ d("span", { className: "text-xs", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: e.id }),
              /* @__PURE__ */ d("span", { style: { color: "#1e3a5f" }, children: "·" }),
              /* @__PURE__ */ d($t, { label: e.category, color: m.cyan }),
              /* @__PURE__ */ d("span", { style: { color: "#1e3a5f" }, children: "·" }),
              /* @__PURE__ */ d("span", { className: "text-xs", style: { color: m.muted }, children: e.location })
            ] })
          ] }) }),
          /* @__PURE__ */ d(fe, { label: "Reported At", value: e.timestamp }),
          /* @__PURE__ */ d(fe, { label: "Affected Systems", value: `${e.affectedSystems} systems`, color: m.orange }),
          /* @__PURE__ */ d(fe, { label: "Est. Recovery", value: e.estimatedRecovery, color: m.green }),
          /* @__PURE__ */ S("div", { className: "mt-4", children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.muted }, children: "Description" }),
            /* @__PURE__ */ d("p", { className: "text-sm leading-relaxed", style: { color: "#94a3b8" }, children: e.description })
          ] })
        ] }),
        /* @__PURE__ */ S(Z, { className: "p-6", children: [
          /* @__PURE__ */ d(se, { accent: m.purple, children: "Root Cause Analysis" }),
          /* @__PURE__ */ d("div", { className: "p-4 rounded-xl mb-4", style: { background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }, children: /* @__PURE__ */ d("p", { className: "text-sm leading-relaxed", style: { color: "#94a3b8" }, children: e.rootCause }) }),
          /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ S("div", { className: "p-3 rounded-xl", style: { background: "rgba(15,31,61,0.7)" }, children: [
              /* @__PURE__ */ d("div", { className: "text-[10px] mb-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "AI CONFIDENCE" }),
              /* @__PURE__ */ S("div", { className: "text-xl font-bold", style: { color: m.purple, fontFamily: "JetBrains Mono, monospace" }, children: [
                e.aiConfidence,
                "%"
              ] }),
              /* @__PURE__ */ d("div", { className: "mt-2 h-1.5 rounded-full overflow-hidden", style: { background: "rgba(168,85,247,0.12)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${e.aiConfidence}%`, background: "linear-gradient(90deg,#7c3aed,#a855f7)" } }) })
            ] }),
            /* @__PURE__ */ S("div", { className: "p-3 rounded-xl", style: { background: "rgba(15,31,61,0.7)" }, children: [
              /* @__PURE__ */ d("div", { className: "text-[10px] mb-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "IMPACT LEVEL" }),
              /* @__PURE__ */ d("div", { className: "text-xl font-bold", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "High" }),
              /* @__PURE__ */ S("div", { className: "text-xs mt-1", style: { color: m.muted }, children: [
                e.affectedSystems,
                " systems impacted"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ S("div", { className: "space-y-4", children: [
        /* @__PURE__ */ S(Z, { className: "p-5", children: [
          /* @__PURE__ */ d(se, { accent: m.cyan, children: "Timeline" }),
          [
            { time: e.timestamp, event: "Incident detected", color: m.red },
            { time: "+2m 14s", event: "AI diagnosis started", color: m.purple },
            { time: "+3m 41s", event: "Root cause identified", color: m.cyan },
            { time: "+4m 08s", event: "Remediation plan generated", color: m.orange },
            { time: "Pending", event: "Awaiting human approval", color: m.yellow }
          ].map((r, n) => /* @__PURE__ */ S("div", { className: "flex gap-3 mb-3", children: [
            /* @__PURE__ */ S("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full mt-1 flex-shrink-0", style: { background: r.color, boxShadow: `0 0 4px ${r.color}` } }),
              n < 4 && /* @__PURE__ */ d("div", { className: "w-0.5 flex-1 mt-1", style: { background: "rgba(0,212,255,0.08)" } })
            ] }),
            /* @__PURE__ */ S("div", { className: "pb-3", children: [
              /* @__PURE__ */ d("div", { className: "text-[9px] font-semibold", style: { color: r.color, fontFamily: "JetBrains Mono, monospace" }, children: r.time }),
              /* @__PURE__ */ d("div", { className: "text-xs mt-0.5", style: { color: "#94a3b8" }, children: r.event })
            ] })
          ] }, n))
        ] }),
        /* @__PURE__ */ S(Z, { className: "p-5", children: [
          /* @__PURE__ */ d(se, { accent: m.green, children: "Quick Actions" }),
          /* @__PURE__ */ d("div", { className: "space-y-2", children: [
            { label: "Run Diagnosis", color: m.purple, icon: Da },
            { label: "Execute Playbook", color: m.green, icon: Ho },
            { label: "Escalate Incident", color: m.orange, icon: fn },
            { label: "Download Report", color: m.cyan, icon: _p }
          ].map((r) => /* @__PURE__ */ S(
            "button",
            {
              className: "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:scale-[1.01]",
              style: { background: `${r.color}08`, border: `1px solid ${r.color}20`, color: r.color },
              children: [
                /* @__PURE__ */ d(r.icon, { size: 13 }),
                " ",
                r.label
              ]
            },
            r.label
          )) })
        ] })
      ] })
    ] })
  ] });
}
function S4({ onSelect: e }) {
  const [t, r] = ae("all"), n = t === "all" ? gd : gd.filter((a) => a.severity === t || a.status === t);
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Incidents" }),
        /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "7 active · 23 resolved today · 128 total systems monitored" })
      ] }),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: ["all", "critical", "high", "medium", "resolved"].map((a) => /* @__PURE__ */ d(
        "button",
        {
          onClick: () => r(a),
          className: "text-[11px] px-3 py-1.5 rounded-lg capitalize transition-all",
          style: {
            background: t === a ? "rgba(0,212,255,0.12)" : "rgba(15,31,61,0.5)",
            border: `1px solid ${t === a ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.07)"}`,
            color: t === a ? m.cyan : m.muted,
            fontFamily: "JetBrains Mono, monospace"
          },
          children: a
        },
        a
      )) })
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: [
      { l: "Total Active", v: "7", c: m.red },
      { l: "Critical", v: "2", c: m.red },
      { l: "Investigating", v: "3", c: m.orange },
      { l: "Resolved Today", v: "23", c: m.green }
    ].map((a) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
      /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: a.c, fontFamily: "JetBrains Mono, monospace" }, children: a.v }),
      /* @__PURE__ */ d("div", { className: "text-xs mt-1", style: { color: m.muted }, children: a.l })
    ] }, a.l)) }),
    /* @__PURE__ */ S(Z, { className: "overflow-hidden", children: [
      /* @__PURE__ */ S("div", { className: "px-5 py-3 flex items-center gap-3", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: [
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", flex: 2 }, children: "INCIDENT" }),
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", flex: 1 }, children: "LOCATION" }),
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", flex: 1 }, children: "STATUS" }),
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", flex: 1 }, children: "AI CONF." }),
        /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", flex: 1 }, children: "TIME" })
      ] }),
      n.map((a, i) => /* @__PURE__ */ S(
        "div",
        {
          onClick: () => e(a),
          className: "px-5 py-3 flex items-center gap-3 cursor-pointer transition-all duration-150 hover:scale-[1.001]",
          style: { borderBottom: i < n.length - 1 ? "1px solid rgba(0,212,255,0.05)" : "none", background: "transparent" },
          children: [
            /* @__PURE__ */ S("div", { style: { flex: 2 }, className: "flex items-center gap-3", children: [
              /* @__PURE__ */ d("div", { className: "w-1 h-8 rounded-full", style: { background: Vt[a.severity].color, boxShadow: `0 0 5px ${Vt[a.severity].color}60` } }),
              /* @__PURE__ */ S("div", { children: [
                /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: a.title }),
                /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mt-0.5", children: [
                  /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: a.id }),
                  /* @__PURE__ */ d(qa, { severity: a.severity })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "text-xs", style: { flex: 1, color: m.muted }, children: a.location }),
            /* @__PURE__ */ d("div", { style: { flex: 1 }, children: /* @__PURE__ */ d(Pp, { status: a.status }) }),
            /* @__PURE__ */ d("div", { style: { flex: 1 }, children: /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ d("div", { className: "h-1.5 flex-1 rounded-full overflow-hidden", style: { background: "rgba(168,85,247,0.12)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${a.aiConfidence}%`, background: m.purple } }) }),
              /* @__PURE__ */ S("span", { className: "text-[10px] font-bold", style: { color: m.purple, fontFamily: "JetBrains Mono, monospace" }, children: [
                a.aiConfidence,
                "%"
              ] })
            ] }) }),
            /* @__PURE__ */ d("div", { className: "text-xs", style: { flex: 1, color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: a.timestamp })
          ]
        },
        a.id
      ))
    ] })
  ] });
}
function _4() {
  const [e, t] = ae(92), [r, n] = ae(!0);
  Dt(() => {
    const o = setInterval(() => t((l) => Math.max(88, Math.min(96, l + (Math.random() - 0.5) * 1.5))), 2e3);
    return setTimeout(() => n(!1), 3500), () => clearInterval(o);
  }, []);
  const a = [
    { label: "SW-CORE-01 CPU Utilization", value: "95%", status: "critical", trend: "↑" },
    { label: "RTR-BACKUP-01 HSRP Priority", value: "90 (misconfigured)", status: "critical", trend: "—" },
    { label: "AP-A2-01 Response", value: "No response", status: "critical", trend: "↓" },
    { label: "Network Latency (avg)", value: "284ms", status: "high", trend: "↑" },
    { label: "Packet Loss (Building A)", value: "100%", status: "critical", trend: "↑" },
    { label: "Connected Devices Offline", value: "452 devices", status: "high", trend: "↑" },
    { label: "Backup Router Load", value: "12%", status: "healthy", trend: "—" },
    { label: "Firewall Status", value: "Operational", status: "healthy", trend: "—" }
  ], i = (o) => ({ critical: m.red, high: m.orange, medium: m.yellow, healthy: m.green })[o] || m.muted;
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "AI Diagnosis Engine" }),
        /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "Causal inference · Root cause analysis · Impact modeling" })
      ] }),
      /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: r ? m.orange : m.green } }),
        /* @__PURE__ */ d("span", { className: "text-xs", style: { color: r ? m.orange : m.green, fontFamily: "JetBrains Mono, monospace" }, children: r ? "Scanning..." : "Analysis Complete" })
      ] })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ S("div", { className: "col-span-2 space-y-4", children: [
        /* @__PURE__ */ S(Z, { className: "p-6", children: [
          /* @__PURE__ */ S("div", { className: "flex items-center gap-3 mb-5", children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "w-10 h-10 rounded-xl flex items-center justify-center",
                style: { background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.28)" },
                children: /* @__PURE__ */ d(Da, { size: 18, style: { color: m.purple } })
              }
            ),
            /* @__PURE__ */ S("div", { children: [
              /* @__PURE__ */ d("div", { className: "text-base font-bold", style: { color: m.text }, children: "Root Cause: Network Latency Spike" }),
              /* @__PURE__ */ d("div", { className: "text-xs", style: { color: m.muted }, children: "INC-2024-0847 · Identified at 14:35:22" })
            ] }),
            /* @__PURE__ */ S("div", { className: "ml-auto", children: [
              /* @__PURE__ */ S("div", { className: "text-2xl font-bold", style: { color: m.purple, fontFamily: "JetBrains Mono, monospace" }, children: [
                Math.round(e),
                "%"
              ] }),
              /* @__PURE__ */ d("div", { className: "text-[10px]", style: { color: m.muted }, children: "Confidence" })
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "p-4 rounded-xl mb-4", style: { background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.14)" }, children: /* @__PURE__ */ d("div", { className: "text-sm leading-relaxed", style: { color: "#94a3b8" }, children: "SW-CORE-01 reached 95% CPU utilization due to a MAC address table overflow storm. This triggered the fail-safe shutdown mechanism, dropping all connected access points including AP-A2-01. RTR-BACKUP-01 failed to assume primary role because its HSRP priority (90) is lower than SW-CORE-01's configured value (100), meaning failover was not initiated automatically." }) }),
          /* @__PURE__ */ d("div", { className: "space-y-2", children: a.map((o) => /* @__PURE__ */ S(
            "div",
            {
              className: "flex items-center gap-3 px-3 py-2.5 rounded-lg",
              style: { background: "rgba(15,31,61,0.5)", border: "1px solid rgba(0,212,255,0.05)" },
              children: [
                /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: i(o.status) } }),
                /* @__PURE__ */ d("span", { className: "text-xs flex-1", style: { color: "#94a3b8" }, children: o.label }),
                /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: i(o.status), fontFamily: "JetBrains Mono, monospace" }, children: o.value }),
                /* @__PURE__ */ d("span", { className: "text-xs w-4 text-center", style: { color: o.trend === "↑" ? m.red : o.trend === "↓" ? m.green : m.muted }, children: o.trend })
              ]
            },
            o.label
          )) })
        ] }),
        /* @__PURE__ */ S(Z, { className: "p-6", children: [
          /* @__PURE__ */ d(se, { accent: m.cyan, children: "Impact Analysis" }),
          /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3 mb-4", children: [
            { l: "Affected Systems", v: "12", c: m.red },
            { l: "Users Impacted", v: "452", c: m.orange },
            { l: "Services Degraded", v: "8", c: m.orange },
            { l: "Est. Recovery", v: "5–10 min", c: m.green }
          ].map((o) => /* @__PURE__ */ S("div", { className: "p-3 rounded-xl text-center", style: { background: "rgba(15,31,61,0.7)" }, children: [
            /* @__PURE__ */ d("div", { className: "text-xl font-bold", style: { color: o.c, fontFamily: "JetBrains Mono, monospace" }, children: o.v }),
            /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: o.l })
          ] }, o.l)) }),
          /* @__PURE__ */ S("div", { className: "p-3 rounded-xl", style: { background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }, children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.cyan }, children: "Affected Services" }),
            /* @__PURE__ */ d("div", { className: "flex flex-wrap gap-2", children: ["Student Portal", "Wi-Fi Auth", "CCTV Stream (A2)", "VoIP Phones", "Smart Classroom", "IoT Sensors (Floor 2)", "Print Services", "Campus App"].map((o) => /* @__PURE__ */ d($t, { label: o, color: m.orange }, o)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ S("div", { className: "space-y-4", children: [
        /* @__PURE__ */ S(Z, { className: "p-5", children: [
          /* @__PURE__ */ d(se, { accent: m.purple, children: "Model Reasoning" }),
          /* @__PURE__ */ d("div", { className: "space-y-3", children: [
            { step: "1", label: "Data Collection", desc: "SNMP, syslog, NetFlow from 128 systems", done: !0 },
            { step: "2", label: "Anomaly Detection", desc: "Identified 3 correlated anomalies", done: !0 },
            { step: "3", label: "Causal Graph", desc: "Built dependency chain (SW-CORE → APs)", done: !0 },
            { step: "4", label: "Confidence Scoring", desc: "Bayesian inference: 92%", done: !0 },
            { step: "5", label: "Playbook Match", desc: "PB-001: Router Failover", done: !0 }
          ].map((o) => /* @__PURE__ */ S("div", { className: "flex gap-2.5", children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                style: { background: o.done ? "rgba(0,255,136,0.12)" : "rgba(15,31,61,0.7)", border: `1px solid ${o.done ? m.green : "#1e3a5f"}` },
                children: o.done ? /* @__PURE__ */ d(Ap, { size: 10, style: { color: m.green } }) : /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: m.subtle }, children: o.step })
              }
            ),
            /* @__PURE__ */ S("div", { children: [
              /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: m.text }, children: o.label }),
              /* @__PURE__ */ d("div", { className: "text-[10px]", style: { color: m.muted }, children: o.desc })
            ] })
          ] }, o.step)) })
        ] }),
        /* @__PURE__ */ S(Z, { className: "p-5", children: [
          /* @__PURE__ */ d(se, { accent: m.green, children: "Recommended Playbook" }),
          /* @__PURE__ */ S("div", { className: "p-3 rounded-xl mb-3", style: { background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.14)" }, children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-bold mb-1", style: { color: m.green }, children: "PB-001: Router Failover" }),
            /* @__PURE__ */ d("div", { className: "text-[11px]", style: { color: "#94a3b8" }, children: "Auto-trigger HSRP failover and restart APs via PoE cycling." }),
            /* @__PURE__ */ d("div", { className: "flex items-center gap-2 mt-2", children: /* @__PURE__ */ d($t, { label: "47 successful runs", color: m.green }) })
          ] }),
          /* @__PURE__ */ d(
            "button",
            {
              className: "w-full py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.01]",
              style: { background: "rgba(0,255,136,0.12)", border: "1px solid rgba(0,255,136,0.28)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
              children: "Proceed to Remediation →"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function P4() {
  const e = [
    { id: "SRV-RACK1-01", role: "Web Server", cpu: 34, mem: 58, status: "healthy" },
    { id: "SRV-RACK1-02", role: "App Server", cpu: 51, mem: 72, status: "healthy" },
    { id: "SRV-RACK2-01", role: "Auth Service", cpu: 22, mem: 41, status: "healthy" },
    { id: "SRV-RACK2-02", role: "API Gateway", cpu: 68, mem: 85, status: "warning" },
    { id: "SRV-RACK3-01", role: "Analytics", cpu: 78, mem: 91, status: "warning" },
    { id: "SRV-RACK4-07", role: "Student Portal", cpu: 97, mem: 88, status: "critical" },
    { id: "PG-CLUSTER-01", role: "PostgreSQL Primary", cpu: 45, mem: 77, status: "healthy" },
    { id: "PG-CLUSTER-02", role: "PostgreSQL Replica", cpu: 38, mem: 74, status: "healthy" }
  ], t = (r) => ({ healthy: m.green, warning: m.orange, critical: m.red })[r] || m.muted;
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ d("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ S("div", { children: [
      /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Infrastructure Monitoring" }),
      /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "128 systems · 4 racks · 3 network zones · 2 data centers" })
    ] }) }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: [
      { l: "Servers Online", v: "42/44", c: m.green },
      { l: "Network Devices", v: "28/30", c: m.cyan },
      { l: "Avg CPU Load", v: "54%", c: m.orange },
      { l: "Avg Memory", v: "71%", c: m.purple }
    ].map((r) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
      /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: r.c, fontFamily: "JetBrains Mono, monospace" }, children: r.v }),
      /* @__PURE__ */ d("div", { className: "text-xs mt-1", style: { color: m.muted }, children: r.l })
    ] }, r.l)) }),
    /* @__PURE__ */ S(Z, { className: "overflow-hidden", children: [
      /* @__PURE__ */ d("div", { className: "px-5 py-3", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: /* @__PURE__ */ d(se, { accent: m.cyan, children: "Server Health Matrix" }) }),
      /* @__PURE__ */ d("div", { className: "p-4 grid grid-cols-2 gap-3", children: e.map((r) => /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(15,31,61,0.5)", border: `1px solid ${t(r.status)}18` }, children: [
        /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: m.text, fontFamily: "JetBrains Mono, monospace" }, children: r.id }),
            /* @__PURE__ */ d("div", { className: "text-[10px]", style: { color: m.muted }, children: r.role })
          ] }),
          /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full", style: { background: t(r.status), boxShadow: `0 0 5px ${t(r.status)}` } })
        ] }),
        /* @__PURE__ */ S("div", { className: "space-y-2", children: [
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ S("div", { className: "flex justify-between mb-1", children: [
              /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "CPU" }),
              /* @__PURE__ */ S("span", { className: "text-[9px] font-bold", style: { color: r.cpu > 80 ? m.red : r.cpu > 60 ? m.orange : m.green, fontFamily: "JetBrains Mono, monospace" }, children: [
                r.cpu,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "h-1.5 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${r.cpu}%`, background: r.cpu > 80 ? m.red : r.cpu > 60 ? m.orange : m.green } }) })
          ] }),
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ S("div", { className: "flex justify-between mb-1", children: [
              /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "MEM" }),
              /* @__PURE__ */ S("span", { className: "text-[9px] font-bold", style: { color: r.mem > 85 ? m.red : r.mem > 70 ? m.orange : m.green, fontFamily: "JetBrains Mono, monospace" }, children: [
                r.mem,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "h-1.5 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${r.mem}%`, background: r.mem > 85 ? m.red : r.mem > 70 ? m.orange : m.purple } }) })
          ] })
        ] })
      ] }, r.id)) })
    ] }),
    /* @__PURE__ */ S(Z, { className: "p-5", children: [
      /* @__PURE__ */ d(se, { accent: m.cyan, children: "Network Topology" }),
      /* @__PURE__ */ S("svg", { viewBox: "0 0 680 200", width: "100%", style: { display: "block" }, children: [
        /* @__PURE__ */ d("defs", { children: /* @__PURE__ */ d("marker", { id: "arr", markerWidth: "6", markerHeight: "6", refX: "5", refY: "3", orient: "auto", children: /* @__PURE__ */ d("path", { d: "M0,0 L6,3 L0,6 Z", fill: "rgba(0,212,255,0.4)" }) }) }),
        [{ x: 340, y: 50, label: "SW-CORE-01", color: m.red, sub: "95% load" }].map((r) => /* @__PURE__ */ S("g", { children: [
          /* @__PURE__ */ d("rect", { x: r.x - 50, y: r.y - 16, width: 100, height: 32, rx: 6, fill: `${r.color}12`, stroke: r.color, strokeWidth: "1" }),
          /* @__PURE__ */ d("text", { x: r.x, y: r.y - 2, textAnchor: "middle", fill: r.color, fontSize: "8.5", fontFamily: "JetBrains Mono", children: r.label }),
          /* @__PURE__ */ d("text", { x: r.x, y: r.y + 10, textAnchor: "middle", fill: r.color, fontSize: "7", fontFamily: "JetBrains Mono", opacity: "0.7", children: r.sub })
        ] }, r.label)),
        [{ x: 120, y: 130, label: "SW-DIST-01", color: m.green }, { x: 340, y: 130, label: "RTR-BACKUP-01", color: m.orange }, { x: 560, y: 130, label: "SW-DIST-02", color: m.green }].map((r) => /* @__PURE__ */ S("g", { children: [
          /* @__PURE__ */ d("line", { x1: 340, y1: 62, x2: r.x, y2: 114, stroke: "rgba(0,212,255,0.2)", strokeWidth: "1", markerEnd: "url(#arr)" }),
          /* @__PURE__ */ d("rect", { x: r.x - 55, y: r.y - 16, width: 110, height: 32, rx: 6, fill: `${r.color}10`, stroke: r.color, strokeWidth: "0.8" }),
          /* @__PURE__ */ d("text", { x: r.x, y: r.y - 2, textAnchor: "middle", fill: r.color, fontSize: "8", fontFamily: "JetBrains Mono", children: r.label }),
          /* @__PURE__ */ d("circle", { cx: r.x + 45, cy: r.y - 8, r: 3, fill: r.color })
        ] }, r.label)),
        [{ x: 80, y: 190, label: "AP-A1-01", color: m.green, px: 120 }, { x: 200, y: 190, label: "AP-A2-01", color: m.red, px: 120 }, { x: 340, y: 190, label: "FW-CAMPUS", color: m.cyan, px: 340 }, { x: 480, y: 190, label: "AP-B1-01", color: m.green, px: 560 }, { x: 600, y: 190, label: "AP-B2-01", color: m.green, px: 560 }].map((r) => /* @__PURE__ */ S("g", { children: [
          /* @__PURE__ */ d("line", { x1: r.px, y1: 146, x2: r.x, y2: 176, stroke: "rgba(0,212,255,0.12)", strokeWidth: "0.8" }),
          /* @__PURE__ */ d("rect", { x: r.x - 38, y: r.y - 14, width: 76, height: 24, rx: 4, fill: `${r.color}08`, stroke: r.color, strokeWidth: "0.7" }),
          /* @__PURE__ */ d("text", { x: r.x, y: r.y + 2, textAnchor: "middle", fill: r.color, fontSize: "7", fontFamily: "JetBrains Mono", children: r.label })
        ] }, r.label))
      ] })
    ] })
  ] });
}
function N4() {
  const e = [
    { zone: "Building A", temp: "23.1°C", humidity: "45%", smoke: "Clear", power: "42.3 kW", leak: "No", status: "healthy" },
    { zone: "Building B", temp: "21.8°C", humidity: "48%", smoke: "Clear", power: "38.7 kW", leak: "No", status: "healthy" },
    { zone: "IT Center", temp: "28.4°C", humidity: "35%", smoke: "Clear", power: "87.4 kW", leak: "No", status: "warning" },
    { zone: "Parking Lot B", temp: "—", humidity: "—", smoke: "Clear", power: "12.1 kW", leak: "No", status: "warning" },
    { zone: "Sports Complex", temp: "24.5°C", humidity: "62%", smoke: "Clear", power: "31.9 kW", leak: "No", status: "healthy" },
    { zone: "Medical Center", temp: "20.3°C", humidity: "40%", smoke: "Clear", power: "22.3 kW", leak: "No", status: "healthy" }
  ];
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { children: [
      /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "IoT & Sensor Monitoring" }),
      /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "120 sensors across 12 campus zones" })
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: l2.map((t) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ d("div", { className: "w-8 h-8 rounded-xl flex items-center justify-center", style: { background: `${t.color}10`, border: `1px solid ${t.color}22` }, children: /* @__PURE__ */ d(t.icon, { size: 14, style: { color: t.color } }) }),
        /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full", style: { background: t.status === "healthy" ? m.green : m.orange } })
      ] }),
      /* @__PURE__ */ S("div", { className: "text-xl font-bold mb-0.5", style: { color: t.color, fontFamily: "JetBrains Mono, monospace" }, children: [
        t.value,
        t.unit
      ] }),
      /* @__PURE__ */ d("div", { className: "text-xs", style: { color: "#94a3b8" }, children: t.name }),
      /* @__PURE__ */ S("div", { className: "text-[10px] mt-1", style: { color: m.muted }, children: [
        t.online,
        "/",
        t.count,
        " online"
      ] })
    ] }, t.name)) }),
    /* @__PURE__ */ S(Z, { className: "overflow-hidden", children: [
      /* @__PURE__ */ d("div", { className: "px-5 py-3", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: /* @__PURE__ */ d(se, { accent: m.green, children: "Zone-by-Zone Sensor Status" }) }),
      /* @__PURE__ */ d("div", { className: "overflow-x-auto", children: /* @__PURE__ */ S("table", { className: "w-full", children: [
        /* @__PURE__ */ d("thead", { children: /* @__PURE__ */ d("tr", { style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: ["Zone", "Temperature", "Humidity", "Smoke", "Power", "Water Leak", "Status"].map((t) => /* @__PURE__ */ d(
          "th",
          {
            className: "px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest",
            style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" },
            children: t
          },
          t
        )) }) }),
        /* @__PURE__ */ d("tbody", { children: e.map((t, r) => /* @__PURE__ */ S("tr", { style: { borderBottom: r < e.length - 1 ? "1px solid rgba(0,212,255,0.05)" : "none" }, children: [
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs font-semibold", style: { color: m.text }, children: t.zone }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs", style: { color: t.status === "warning" && t.zone === "IT Center" ? m.orange : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: t.temp }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: t.humidity }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: t.smoke }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: t.power }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: t.leak }),
          /* @__PURE__ */ d("td", { className: "px-5 py-3", children: /* @__PURE__ */ d($t, { label: t.status === "healthy" ? "Healthy" : "Warning", color: t.status === "healthy" ? m.green : m.orange }) })
        ] }, t.zone)) })
      ] }) })
    ] })
  ] });
}
function E4() {
  const e = [
    { id: "CAM-A1-001", location: "Building A — Main Entrance", zone: "Block A", status: "online", uptime: "99.8%", res: "4K", fps: 30, ip: "192.168.10.11", lastEvent: "Motion: 14:28:03" },
    { id: "CAM-A2-002", location: "Building A — Floor 2 Corridor", zone: "Block A", status: "motion", uptime: "99.1%", res: "1080p", fps: 25, ip: "192.168.10.12", lastEvent: "Motion: 14:31:47" },
    { id: "CAM-B1-001", location: "Science Hall — Main Lobby", zone: "Block B", status: "online", uptime: "100%", res: "4K", fps: 30, ip: "192.168.10.21", lastEvent: "Motion: 13:55:12" },
    { id: "CAM-LIB-001", location: "Library — Reading Room", zone: "Library", status: "online", uptime: "98.9%", res: "1080p", fps: 25, ip: "192.168.10.31", lastEvent: "Motion: 14:02:38" },
    { id: "CAM-PLB-003", location: "Parking Lot B — Gate 3", zone: "Parking", status: "offline", uptime: "72.3%", res: "1080p", fps: 0, ip: "192.168.10.43", lastEvent: "Offline: 13:58:44" },
    { id: "CAM-PLB-004", location: "Parking Lot B — Gate 4", zone: "Parking", status: "alert", uptime: "99.4%", res: "1080p", fps: 25, ip: "192.168.10.44", lastEvent: "Breach: 14:29:11" },
    { id: "CAM-CAFE-001", location: "Cafeteria — Main Area", zone: "Cafeteria", status: "online", uptime: "99.7%", res: "4K", fps: 30, ip: "192.168.10.51", lastEvent: "Motion: 14:30:55" },
    { id: "CAM-MED-001", location: "Medical Center — Reception", zone: "Medical", status: "online", uptime: "100%", res: "1080p", fps: 25, ip: "192.168.10.61", lastEvent: "Motion: 14:15:22" },
    { id: "CAM-DORM-001", location: "Dorm Block 1 — Lobby", zone: "Dormitories", status: "motion", uptime: "99.2%", res: "1080p", fps: 25, ip: "192.168.10.71", lastEvent: "Motion: 14:31:52" },
    { id: "CAM-DORM-002", location: "Dorm Block 2 — Stairwell", zone: "Dormitories", status: "online", uptime: "97.8%", res: "720p", fps: 15, ip: "192.168.10.72", lastEvent: "Motion: 14:10:44" },
    { id: "CAM-ENG-001", location: "Engineering Lab — Floor 1", zone: "Block C", status: "online", uptime: "99.5%", res: "4K", fps: 30, ip: "192.168.10.81", lastEvent: "Motion: 14:25:31" },
    { id: "CAM-PARK-001", location: "Main Parking — Zone A", zone: "Parking", status: "online", uptime: "98.3%", res: "1080p", fps: 25, ip: "192.168.10.91", lastEvent: "Motion: 14:27:18" }
  ], [t, r] = ae(null), [n, a] = ae("all"), [i, o] = ae((/* @__PURE__ */ new Date()).toLocaleTimeString());
  Dt(() => {
    const h = setInterval(() => o((/* @__PURE__ */ new Date()).toLocaleTimeString()), 1e3);
    return () => clearInterval(h);
  }, []);
  const l = n === "all" ? e : e.filter((h) => h.status === n), s = {
    online: { color: m.green, label: "● REC", bgScene: "rgba(0,255,136,0.02)" },
    offline: { color: m.red, label: "● OFFLINE", bgScene: "rgba(255,77,109,0.03)" },
    motion: { color: m.yellow, label: "◉ MOTION", bgScene: "rgba(255,214,10,0.04)" },
    alert: { color: m.orange, label: "⚠ ALERT", bgScene: "rgba(255,140,66,0.06)" }
  }, c = {
    all: e.length,
    online: e.filter((h) => h.status === "online").length,
    offline: e.filter((h) => h.status === "offline").length,
    motion: e.filter((h) => h.status === "motion").length,
    alert: e.filter((h) => h.status === "alert").length
  }, u = { all: m.cyan, online: m.green, offline: m.red, motion: m.yellow, alert: m.orange }, f = [
    { time: "14:31:52", cam: "CAM-DORM-001", event: "Motion detected — Dorm Lobby", type: "motion" },
    { time: "14:31:47", cam: "CAM-A2-002", event: "Motion detected — Floor 2 Corridor", type: "motion" },
    { time: "14:30:55", cam: "CAM-CAFE-001", event: "Motion detected — Cafeteria Area", type: "motion" },
    { time: "14:29:11", cam: "CAM-PLB-004", event: "⚠ Perimeter breach detected!", type: "alert" },
    { time: "14:28:03", cam: "CAM-A1-001", event: "Motion detected — Main Entrance", type: "motion" },
    { time: "14:27:18", cam: "CAM-PARK-001", event: "Motion detected — Parking Zone A", type: "motion" },
    { time: "13:58:44", cam: "CAM-PLB-003", event: "Camera offline — PoE port failure", type: "offline" }
  ], p = (h) => ({ motion: m.yellow, alert: m.orange, offline: m.red })[h] ?? m.green;
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "CCTV Monitoring" }),
        /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "32 cameras total · Real-time surveillance · Campus-wide coverage" })
      ] }),
      /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ d("span", { className: "text-[11px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: i }),
        /* @__PURE__ */ S(
          "div",
          {
            className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
            style: { background: "rgba(255,77,109,0.08)", border: "1px solid rgba(255,77,109,0.22)" },
            children: [
              /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: m.red } }),
              /* @__PURE__ */ d("span", { className: "text-[11px] font-bold", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "LIVE" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: [
      { label: "Online", count: c.online, color: m.green, icon: Ba },
      { label: "Offline", count: c.offline, color: m.red, icon: Sp },
      { label: "Motion Detected", count: c.motion, color: m.yellow, icon: Op },
      { label: "Alert / Breach", count: c.alert, color: m.orange, icon: fn }
    ].map((h) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
      /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ d(h.icon, { size: 15, style: { color: h.color } }),
        /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full", style: { background: h.color } })
      ] }),
      /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: h.color, fontFamily: "JetBrains Mono, monospace" }, children: h.count }),
      /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: h.label })
    ] }, h.label)) }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ S("div", { className: "col-span-2 space-y-3", children: [
        /* @__PURE__ */ d("div", { className: "flex items-center gap-2", children: ["all", "online", "offline", "motion", "alert"].map((h) => /* @__PURE__ */ d(
          "button",
          {
            onClick: () => a(h),
            className: "text-[11px] px-3 py-1.5 rounded-lg capitalize transition-all",
            style: {
              background: n === h ? `${u[h]}14` : "rgba(15,31,61,0.5)",
              border: `1px solid ${n === h ? `${u[h]}32` : "rgba(0,212,255,0.07)"}`,
              color: n === h ? u[h] : m.muted,
              fontFamily: "JetBrains Mono, monospace"
            },
            children: h === "all" ? `All (${c.all})` : `${h} (${c[h]})`
          },
          h
        )) }),
        /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-3", children: l.map((h) => {
          const g = s[h.status];
          return /* @__PURE__ */ S(
            Z,
            {
              className: "overflow-hidden cursor-pointer transition-all duration-150 hover:scale-[1.015]",
              onClick: () => r(h),
              children: [
                /* @__PURE__ */ S("div", { className: "relative", style: { aspectRatio: "16/9", background: "#000d1a" }, children: [
                  h.status !== "offline" ? /* @__PURE__ */ S("div", { className: "absolute inset-0", children: [
                    /* @__PURE__ */ S("svg", { viewBox: "0 0 160 90", width: "100%", height: "100%", className: "absolute inset-0", preserveAspectRatio: "none", children: [
                      /* @__PURE__ */ d("rect", { width: "160", height: "90", fill: g.bgScene }),
                      /* @__PURE__ */ d("rect", { x: "0", y: "55", width: "160", height: "35", fill: "rgba(0,8,20,0.45)" }),
                      /* @__PURE__ */ d("rect", { x: "10", y: "22", width: "32", height: "40", rx: "1", fill: "rgba(0,15,45,0.65)" }),
                      /* @__PURE__ */ d("rect", { x: "58", y: "28", width: "48", height: "32", rx: "1", fill: "rgba(0,15,45,0.55)" }),
                      /* @__PURE__ */ d("rect", { x: "120", y: "18", width: "28", height: "44", rx: "1", fill: "rgba(0,15,45,0.65)" }),
                      /* @__PURE__ */ d("rect", { x: "0", y: "0", width: "160", height: "14", fill: "rgba(0,0,0,0.5)" }),
                      /* @__PURE__ */ d("rect", { x: "0", y: "76", width: "160", height: "14", fill: "rgba(0,0,0,0.4)" }),
                      h.status === "motion" && /* @__PURE__ */ d(
                        "rect",
                        {
                          x: "50",
                          y: "32",
                          width: "24",
                          height: "18",
                          rx: "1",
                          fill: "rgba(255,214,10,0.1)",
                          stroke: "rgba(255,214,10,0.5)",
                          strokeWidth: "0.6",
                          strokeDasharray: "2,1"
                        }
                      ),
                      h.status === "alert" && /* @__PURE__ */ d(
                        "rect",
                        {
                          x: "8",
                          y: "12",
                          width: "144",
                          height: "60",
                          rx: "2",
                          fill: "rgba(255,140,66,0.06)",
                          stroke: "rgba(255,140,66,0.55)",
                          strokeWidth: "0.8",
                          strokeDasharray: "4,2"
                        }
                      )
                    ] }),
                    h.status === "online" && /* @__PURE__ */ d(
                      "div",
                      {
                        className: "absolute left-0 right-0 h-px",
                        style: { background: `${m.cyan}18`, animation: "scanline 4s linear infinite", top: "38%" }
                      }
                    )
                  ] }) : /* @__PURE__ */ S("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-1.5", children: [
                    /* @__PURE__ */ d(Fn, { size: 18, style: { color: m.red, opacity: 0.55 } }),
                    /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "NO SIGNAL" })
                  ] }),
                  /* @__PURE__ */ d("div", { className: "absolute top-1.5 left-1.5", children: /* @__PURE__ */ d(
                    "span",
                    {
                      className: "text-[8px] font-bold px-1.5 py-0.5 rounded",
                      style: { background: "rgba(0,5,15,0.85)", color: g.color, fontFamily: "JetBrains Mono, monospace" },
                      children: g.label
                    }
                  ) }),
                  /* @__PURE__ */ d("div", { className: "absolute bottom-1.5 right-1.5", children: /* @__PURE__ */ d("span", { className: "text-[8px]", style: { color: "rgba(148,163,184,0.5)", fontFamily: "JetBrains Mono, monospace" }, children: h.id }) })
                ] }),
                /* @__PURE__ */ S("div", { className: "px-3 py-2", style: { borderTop: "1px solid rgba(0,212,255,0.07)" }, children: [
                  /* @__PURE__ */ d("div", { className: "text-[10px] font-semibold truncate", style: { color: m.text, fontFamily: "JetBrains Mono, monospace" }, children: h.id }),
                  /* @__PURE__ */ d("div", { className: "text-[9px] truncate mt-0.5", style: { color: m.muted }, children: h.location })
                ] })
              ]
            },
            h.id
          );
        }) })
      ] }),
      /* @__PURE__ */ S("div", { className: "space-y-3", children: [
        /* @__PURE__ */ S(Z, { className: "p-4", children: [
          /* @__PURE__ */ d(se, { accent: m.orange, children: "Live Activity Feed" }),
          /* @__PURE__ */ d("div", { className: "space-y-2 max-h-72 overflow-y-auto", children: f.map((h, g) => /* @__PURE__ */ S(
            "div",
            {
              className: "flex items-start gap-2.5 p-2 rounded-lg",
              style: { background: "rgba(15,31,61,0.4)", border: "1px solid rgba(0,212,255,0.04)" },
              children: [
                /* @__PURE__ */ d(
                  "div",
                  {
                    className: "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                    style: { background: p(h.type), boxShadow: g === 0 ? `0 0 5px ${p(h.type)}` : "none" }
                  }
                ),
                /* @__PURE__ */ S("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ S("div", { className: "text-[9px] font-bold", style: { color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: [
                    h.time,
                    " · ",
                    h.cam
                  ] }),
                  /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: "#94a3b8" }, children: h.event })
                ] })
              ]
            },
            g
          )) })
        ] }),
        /* @__PURE__ */ S(Z, { className: "p-4", children: [
          /* @__PURE__ */ d(se, { accent: m.cyan, children: "System Summary" }),
          /* @__PURE__ */ S("div", { className: "space-y-1", children: [
            /* @__PURE__ */ d(fe, { label: "Total Cameras", value: "32" }),
            /* @__PURE__ */ d(fe, { label: "Online", value: `${c.online}`, color: m.green }),
            /* @__PURE__ */ d(fe, { label: "Offline", value: `${c.offline}`, color: m.red }),
            /* @__PURE__ */ d(fe, { label: "Motion Active", value: `${c.motion}`, color: m.yellow }),
            /* @__PURE__ */ d(fe, { label: "Alerts Active", value: `${c.alert}`, color: m.orange }),
            /* @__PURE__ */ d(fe, { label: "Recording Storage", value: "2.4 TB / 4 TB", color: m.cyan }),
            /* @__PURE__ */ d(fe, { label: "Avg Resolution", value: "1080p" }),
            /* @__PURE__ */ d(fe, { label: "System Uptime", value: "99.6%", color: m.green })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ d(Go, { open: t !== null, onClose: () => r(null), children: t && (() => {
      const h = s[t.status];
      return /* @__PURE__ */ S("div", { className: "w-[700px] rounded-2xl overflow-hidden", style: { background: "rgba(6,15,32,0.99)", border: "1px solid rgba(0,212,255,0.2)" }, children: [
        /* @__PURE__ */ S("div", { className: "relative", style: { aspectRatio: "16/9", background: "#000d1a" }, children: [
          t.status !== "offline" ? /* @__PURE__ */ S("div", { className: "absolute inset-0", children: [
            /* @__PURE__ */ S("svg", { viewBox: "0 0 700 394", width: "100%", height: "100%", className: "absolute inset-0", preserveAspectRatio: "none", children: [
              /* @__PURE__ */ d("rect", { width: "700", height: "394", fill: h.bgScene }),
              /* @__PURE__ */ d("rect", { x: "0", y: "230", width: "700", height: "164", fill: "rgba(0,8,20,0.45)" }),
              /* @__PURE__ */ d("rect", { x: "50", y: "100", width: "150", height: "150", rx: "4", fill: "rgba(0,15,40,0.7)" }),
              /* @__PURE__ */ d("rect", { x: "260", y: "120", width: "200", height: "130", rx: "4", fill: "rgba(0,15,40,0.6)" }),
              /* @__PURE__ */ d("rect", { x: "520", y: "90", width: "130", height: "160", rx: "4", fill: "rgba(0,15,40,0.7)" }),
              [0, 1, 2].map((g) => /* @__PURE__ */ d("rect", { x: 70 + g * 28, y: 112, width: 18, height: 14, rx: "2", fill: "rgba(0,212,255,0.07)" }, g)),
              t.status === "motion" && /* @__PURE__ */ d(
                "rect",
                {
                  x: "240",
                  y: "128",
                  width: "80",
                  height: "60",
                  rx: "3",
                  fill: "rgba(255,214,10,0.08)",
                  stroke: "rgba(255,214,10,0.5)",
                  strokeWidth: "1.5",
                  strokeDasharray: "5,3"
                }
              ),
              t.status === "alert" && /* @__PURE__ */ d(
                "rect",
                {
                  x: "20",
                  y: "70",
                  width: "660",
                  height: "260",
                  rx: "6",
                  fill: "rgba(255,140,66,0.05)",
                  stroke: "rgba(255,140,66,0.6)",
                  strokeWidth: "2",
                  strokeDasharray: "8,4"
                }
              ),
              /* @__PURE__ */ d("line", { x1: "350", y1: "170", x2: "350", y2: "230", stroke: "rgba(0,212,255,0.07)", strokeWidth: "0.5" }),
              /* @__PURE__ */ d("line", { x1: "310", y1: "200", x2: "390", y2: "200", stroke: "rgba(0,212,255,0.07)", strokeWidth: "0.5" }),
              /* @__PURE__ */ d("circle", { cx: "350", cy: "200", r: "20", fill: "none", stroke: "rgba(0,212,255,0.06)", strokeWidth: "0.5" })
            ] }),
            /* @__PURE__ */ d(
              "div",
              {
                className: "absolute left-0 right-0 h-px",
                style: { background: `${m.cyan}10`, animation: "scanline 5s linear infinite", top: "40%" }
              }
            )
          ] }) : /* @__PURE__ */ d("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ S("div", { className: "text-center", children: [
            /* @__PURE__ */ d(Fn, { size: 40, style: { color: m.red, opacity: 0.3, margin: "0 auto 8px" } }),
            /* @__PURE__ */ d("div", { className: "text-sm", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "SIGNAL LOST" }),
            /* @__PURE__ */ d("div", { className: "text-xs mt-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "PoE port error-disabled" })
          ] }) }),
          /* @__PURE__ */ S("div", { className: "absolute top-3 left-3 right-3 flex items-center justify-between", children: [
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ d(
                "span",
                {
                  className: "text-[10px] font-bold px-2 py-0.5 rounded",
                  style: { background: "rgba(0,0,0,0.8)", color: h.color, fontFamily: "JetBrains Mono, monospace" },
                  children: h.label
                }
              ),
              /* @__PURE__ */ S(
                "span",
                {
                  className: "text-[10px] px-2 py-0.5 rounded",
                  style: { background: "rgba(0,0,0,0.7)", color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" },
                  children: [
                    t.res,
                    " · ",
                    t.fps,
                    " fps"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: "rgba(148,163,184,0.7)", fontFamily: "JetBrains Mono, monospace" }, children: i }),
              /* @__PURE__ */ d(
                "button",
                {
                  onClick: () => r(null),
                  className: "w-7 h-7 rounded-lg flex items-center justify-center",
                  style: { background: "rgba(0,0,0,0.7)" },
                  children: /* @__PURE__ */ d(Fn, { size: 13, style: { color: m.muted } })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ S(
            "div",
            {
              className: "absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center justify-between",
              style: { background: "rgba(0,0,0,0.65)" },
              children: [
                /* @__PURE__ */ S("span", { className: "text-[10px] font-bold", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: [
                  t.id,
                  " · ",
                  t.location
                ] }),
                /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ S(
                    "button",
                    {
                      className: "flex items-center gap-1 text-[9px] px-2 py-0.5 rounded",
                      style: { background: "rgba(0,212,255,0.1)", color: m.cyan, fontFamily: "JetBrains Mono, monospace" },
                      children: [
                        /* @__PURE__ */ d(Ho, { size: 9 }),
                        " Record"
                      ]
                    }
                  ),
                  /* @__PURE__ */ S(
                    "button",
                    {
                      className: "flex items-center gap-1 text-[9px] px-2 py-0.5 rounded",
                      style: { background: "rgba(0,255,136,0.1)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
                      children: [
                        /* @__PURE__ */ d(_p, { size: 9 }),
                        " Export"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-4 p-5", children: [
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("div", { className: "text-[10px] uppercase tracking-widest mb-3", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Camera Details" }),
            /* @__PURE__ */ d(fe, { label: "Camera ID", value: t.id }),
            /* @__PURE__ */ d(fe, { label: "Zone", value: t.zone }),
            /* @__PURE__ */ d(fe, { label: "IP Address", value: t.ip, color: m.cyan }),
            /* @__PURE__ */ d(fe, { label: "Resolution", value: t.res }),
            /* @__PURE__ */ d(fe, { label: "Frame Rate", value: `${t.fps} fps` }),
            /* @__PURE__ */ d(
              fe,
              {
                label: "Uptime (30d)",
                value: t.uptime,
                color: t.status === "offline" ? m.red : m.green
              }
            )
          ] }),
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("div", { className: "text-[10px] uppercase tracking-widest mb-3", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Last Event" }),
            /* @__PURE__ */ d("div", { className: "p-3 rounded-xl mb-4", style: { background: `${h.color}08`, border: `1px solid ${h.color}20` }, children: /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: h.color, fontFamily: "JetBrains Mono, monospace" }, children: t.lastEvent }) }),
            /* @__PURE__ */ d("div", { className: "text-[10px] uppercase tracking-widest mb-2", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Quick Actions" }),
            /* @__PURE__ */ d("div", { className: "grid grid-cols-2 gap-2", children: [
              { label: "Pan / Tilt", color: m.cyan },
              { label: "Snapshot", color: m.purple },
              { label: "Reboot Cam", color: m.orange },
              { label: "Report", color: m.green }
            ].map((g) => /* @__PURE__ */ d(
              "button",
              {
                className: "py-2 rounded-lg text-[10px] font-semibold transition-all hover:scale-[1.02]",
                style: { background: `${g.color}0a`, border: `1px solid ${g.color}20`, color: g.color, fontFamily: "JetBrains Mono, monospace" },
                children: g.label
              },
              g.label
            )) })
          ] })
        ] })
      ] });
    })() })
  ] });
}
function T4({ onLogin: e }) {
  const [t, r] = ae(""), [n, a] = ae(""), [i, o] = ae(!1), [l, s] = ae(""), [c, u] = ae(!1), f = (p) => {
    p.preventDefault(), t === "admin" && n === "campus123" ? (u(!0), setTimeout(e, 1500)) : s("Invalid credentials. Use admin / campus123");
  };
  return /* @__PURE__ */ S("div", { className: "h-screen w-screen flex items-center justify-center relative overflow-hidden", style: { background: m.bg, fontFamily: "Inter, sans-serif" }, children: [
    /* @__PURE__ */ d("style", { children: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ` }),
    /* @__PURE__ */ S("svg", { className: "absolute inset-0 w-full h-full pointer-events-none", children: [
      /* @__PURE__ */ d("defs", { children: /* @__PURE__ */ d("pattern", { id: "lgrid", width: "40", height: "40", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ d("path", { d: "M40 0L0 0 0 40", fill: "none", stroke: "rgba(0,212,255,0.07)", strokeWidth: "0.5" }) }) }),
      /* @__PURE__ */ d("rect", { width: "100%", height: "100%", fill: "url(#lgrid)" })
    ] }),
    /* @__PURE__ */ d("div", { className: "absolute pointer-events-none", style: { width: 700, height: 700, top: -200, left: -200, background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 65%)" } }),
    /* @__PURE__ */ d("div", { className: "absolute pointer-events-none", style: { width: 500, height: 500, bottom: -150, right: -100, background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 65%)" } }),
    /* @__PURE__ */ S("div", { className: "hidden lg:flex flex-col gap-2 absolute left-8 top-1/2 -translate-y-1/2 w-56", children: [
      /* @__PURE__ */ d("div", { className: "text-[9px] uppercase tracking-widest mb-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "System Status" }),
      [
        { label: "CCTV Cameras", value: "31/32 Online", color: m.green },
        { label: "AI Engine", value: "Active v3.2.1", color: m.green },
        { label: "Active Incidents", value: "7 Open", color: m.red },
        { label: "Network Status", value: "Degraded", color: m.orange },
        { label: "IoT Sensors", value: "118/120 OK", color: m.green },
        { label: "Server Load", value: "54% avg", color: m.cyan }
      ].map((p) => /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-center justify-between px-3 py-2 rounded-lg",
          style: { background: "rgba(10,22,40,0.65)", border: "1px solid rgba(0,212,255,0.07)" },
          children: [
            /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: p.label }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: p.color } }),
              /* @__PURE__ */ d("span", { className: "text-[10px] font-bold", style: { color: p.color, fontFamily: "JetBrains Mono, monospace" }, children: p.value })
            ] })
          ]
        },
        p.label
      ))
    ] }),
    /* @__PURE__ */ S("div", { className: "relative z-10 w-full max-w-sm mx-4", children: [
      /* @__PURE__ */ S("div", { className: "rounded-2xl p-8", style: { background: "rgba(6,15,32,0.93)", border: "1px solid rgba(0,212,255,0.16)", backdropFilter: "blur(24px)" }, children: [
        /* @__PURE__ */ S("div", { className: "flex flex-col items-center mb-7", children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              style: { background: "linear-gradient(135deg,rgba(0,255,136,0.14),rgba(0,212,255,0.14))", border: "1px solid rgba(0,212,255,0.32)" },
              children: /* @__PURE__ */ d(Sa, { size: 28, style: { color: m.cyan } })
            }
          ),
          /* @__PURE__ */ d("div", { className: "text-xl font-bold tracking-tight", style: { color: m.text, fontFamily: "JetBrains Mono, monospace" }, children: "CampusGuard" }),
          /* @__PURE__ */ d("div", { className: "text-[10px] tracking-widest mt-1", style: { color: m.cyan, fontFamily: "JetBrains Mono, monospace" }, children: "AIOPS SECURITY CONTROLLER" }),
          /* @__PURE__ */ d(
            "div",
            {
              className: "mt-3 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest",
              style: { background: "rgba(255,77,109,0.09)", border: "1px solid rgba(255,77,109,0.24)", color: m.red, fontFamily: "JetBrains Mono, monospace" },
              children: "RESTRICTED SYSTEM ACCESS"
            }
          )
        ] }),
        /* @__PURE__ */ S("form", { onSubmit: f, className: "space-y-4", children: [
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("label", { className: "text-[10px] uppercase tracking-widest mb-1.5 block", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Username" }),
            /* @__PURE__ */ S(
              "div",
              {
                className: "flex items-center gap-2 px-3 py-2.5 rounded-xl",
                style: { background: "rgba(15,31,61,0.8)", border: `1px solid ${l ? "rgba(255,77,109,0.38)" : "rgba(0,212,255,0.12)"}` },
                children: [
                  /* @__PURE__ */ d(o2, { size: 13, style: { color: m.muted } }),
                  /* @__PURE__ */ d(
                    "input",
                    {
                      type: "text",
                      value: t,
                      onChange: (p) => {
                        r(p.target.value), s("");
                      },
                      placeholder: "Enter username",
                      className: "bg-transparent flex-1 outline-none text-sm",
                      style: { color: m.text, fontFamily: "JetBrains Mono, monospace" },
                      autoComplete: "username"
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("label", { className: "text-[10px] uppercase tracking-widest mb-1.5 block", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Password" }),
            /* @__PURE__ */ S(
              "div",
              {
                className: "flex items-center gap-2 px-3 py-2.5 rounded-xl",
                style: { background: "rgba(15,31,61,0.8)", border: `1px solid ${l ? "rgba(255,77,109,0.38)" : "rgba(0,212,255,0.12)"}` },
                children: [
                  /* @__PURE__ */ d(a2, { size: 13, style: { color: m.muted } }),
                  /* @__PURE__ */ d(
                    "input",
                    {
                      type: i ? "text" : "password",
                      value: n,
                      onChange: (p) => {
                        a(p.target.value), s("");
                      },
                      placeholder: "Enter password",
                      className: "bg-transparent flex-1 outline-none text-sm",
                      style: { color: m.text, fontFamily: "JetBrains Mono, monospace" },
                      autoComplete: "current-password"
                    }
                  ),
                  /* @__PURE__ */ d("button", { type: "button", onClick: () => o((p) => !p), children: /* @__PURE__ */ d(n2, { size: 13, style: { color: m.muted } }) })
                ]
              }
            )
          ] }),
          l && /* @__PURE__ */ S(
            "div",
            {
              className: "flex items-center gap-2 p-2.5 rounded-lg",
              style: { background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.2)" },
              children: [
                /* @__PURE__ */ d(Sp, { size: 12, style: { color: m.red } }),
                /* @__PURE__ */ d("span", { className: "text-[11px]", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: l })
              ]
            }
          ),
          /* @__PURE__ */ d(
            "button",
            {
              type: "submit",
              disabled: c,
              className: "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01]",
              style: {
                background: c ? "rgba(0,212,255,0.06)" : "linear-gradient(135deg,rgba(0,255,136,0.18),rgba(0,212,255,0.18))",
                border: "1px solid rgba(0,212,255,0.32)",
                color: c ? m.muted : m.cyan,
                fontFamily: "JetBrains Mono, monospace"
              },
              children: c ? /* @__PURE__ */ S(Tp, { children: [
                /* @__PURE__ */ d(La, { size: 14, style: { animation: "spin 1s linear infinite" } }),
                "Authenticating..."
              ] }) : /* @__PURE__ */ S(Tp, { children: [
                /* @__PURE__ */ d(Sa, { size: 14 }),
                "Secure Login"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ S("div", { className: "mt-5 p-3 rounded-xl", style: { background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-[9px] uppercase tracking-widest mb-2", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Demo Credentials" }),
          /* @__PURE__ */ S("div", { className: "flex gap-6", children: [
            /* @__PURE__ */ S("div", { children: [
              /* @__PURE__ */ d("div", { className: "text-[9px]", style: { color: m.muted }, children: "Username" }),
              /* @__PURE__ */ d("div", { className: "text-xs font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: "admin" })
            ] }),
            /* @__PURE__ */ S("div", { children: [
              /* @__PURE__ */ d("div", { className: "text-[9px]", style: { color: m.muted }, children: "Password" }),
              /* @__PURE__ */ d("div", { className: "text-xs font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: "campus123" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ d("div", { className: "text-center mt-4 text-[10px]", style: { color: m.subtle, fontFamily: "JetBrains Mono, monospace" }, children: "v3.2.1 · Secured by CampusGuard AIOps · © 2024" })
    ] }),
    /* @__PURE__ */ S("div", { className: "hidden xl:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 w-64", children: [
      /* @__PURE__ */ d("div", { className: "text-[9px] uppercase tracking-widest mb-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "Recent Alerts" }),
      [
        { time: "14:32", msg: "Wi-Fi outage — Building A", sev: "critical" },
        { time: "13:59", msg: "CCTV offline — Parking Lot B", sev: "high" },
        { time: "13:21", msg: "CPU spike — SRV-RACK4-07", sev: "high" },
        { time: "12:47", msg: "DB connection pool exhausted", sev: "medium" }
      ].map((p, h) => /* @__PURE__ */ S(
        "div",
        {
          className: "px-3 py-2.5 rounded-xl",
          style: { background: "rgba(10,22,40,0.65)", border: `1px solid ${Vt[p.sev].color}16` },
          children: [
            /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full flex-shrink-0", style: { background: Vt[p.sev].color } }),
              /* @__PURE__ */ d("span", { className: "text-[9px]", style: { color: Vt[p.sev].color, fontFamily: "JetBrains Mono, monospace" }, children: p.time }),
              /* @__PURE__ */ d(qa, { severity: p.sev })
            ] }),
            /* @__PURE__ */ d("div", { className: "text-[11px]", style: { color: "#94a3b8" }, children: p.msg })
          ]
        },
        h
      ))
    ] })
  ] });
}
function k4() {
  const e = [
    { time: "14:32:18", type: "INCIDENT", msg: "INC-2024-0847 created — Wi-Fi Network Downtime (Critical)", color: m.red },
    { time: "14:32:20", type: "AI", msg: "Diagnosis engine started for INC-2024-0847", color: m.purple },
    { time: "14:33:41", type: "AI", msg: "Root cause identified: SW-CORE-01 overload (92% confidence)", color: m.purple },
    { time: "14:34:08", type: "REMEDIATION", msg: "Playbook PB-001 matched and staged for approval", color: m.cyan },
    { time: "14:35:22", type: "SYSTEM", msg: "Awaiting human approval from admin@campus.edu", color: m.orange },
    { time: "13:58:44", type: "INCIDENT", msg: "INC-2024-0846 created — CCTV Camera Offline (High)", color: m.orange },
    { time: "13:21:05", type: "INCIDENT", msg: "INC-2024-0845 created — High CPU Usage on SRV-RACK4-07 (High)", color: m.orange },
    { time: "12:47:33", type: "INCIDENT", msg: "INC-2024-0844 created — Database Connection Timeout (Medium)", color: m.yellow },
    { time: "12:53:11", type: "REMEDIATION", msg: "PB-003 executed — DB connection pool reset successful", color: m.green },
    { time: "12:54:02", type: "SYSTEM", msg: "INC-2024-0844 resolved — recovery confirmed in 6m 29s", color: m.green }
  ];
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Reports & Logs" }),
        /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "Real-time event stream · 30-day retention" })
      ] }),
      /* @__PURE__ */ S(
        "button",
        {
          className: "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-[1.01]",
          style: { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: m.cyan, fontFamily: "JetBrains Mono, monospace" },
          children: [
            /* @__PURE__ */ d(_p, { size: 13 }),
            " Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: [{ l: "Events Today", v: "1,284", c: m.cyan }, { l: "Incidents", v: "7", c: m.red }, { l: "Remediations", v: "23", c: m.green }, { l: "AI Diagnoses", v: "31", c: m.purple }].map((t) => /* @__PURE__ */ S(Z, { className: "p-4", children: [
      /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: t.c, fontFamily: "JetBrains Mono, monospace" }, children: t.v }),
      /* @__PURE__ */ d("div", { className: "text-xs mt-1", style: { color: m.muted }, children: t.l })
    ] }, t.l)) }),
    /* @__PURE__ */ S(Z, { className: "overflow-hidden", children: [
      /* @__PURE__ */ S("div", { className: "px-5 py-3 flex items-center gap-3", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: [
        /* @__PURE__ */ d(se, { accent: m.cyan, children: "System Event Log" }),
        /* @__PURE__ */ d("div", { className: "flex gap-2 ml-auto", children: ["ALL", "INCIDENT", "AI", "REMEDIATION", "SYSTEM"].map((t) => /* @__PURE__ */ d(
          "button",
          {
            className: "text-[9px] px-2 py-0.5 rounded-full",
            style: { background: t === "ALL" ? "rgba(0,212,255,0.12)" : "rgba(15,31,61,0.5)", border: "1px solid rgba(0,212,255,0.08)", color: t === "ALL" ? m.cyan : m.muted, fontFamily: "JetBrains Mono, monospace" },
            children: t
          },
          t
        )) })
      ] }),
      /* @__PURE__ */ d("div", { className: "p-2", children: e.map((t, r) => /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-start gap-3 px-3 py-2.5 rounded-lg mb-1 hover:scale-[1.001] transition-all",
          style: { background: "rgba(15,31,61,0.3)" },
          children: [
            /* @__PURE__ */ d("span", { className: "text-[10px] font-semibold flex-shrink-0", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace", minWidth: 50 }, children: t.time }),
            /* @__PURE__ */ d(
              "span",
              {
                className: "text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded",
                style: { color: t.color, background: `${t.color}10`, fontFamily: "JetBrains Mono, monospace", minWidth: 80, textAlign: "center" },
                children: t.type
              }
            ),
            /* @__PURE__ */ d("span", { className: "text-xs flex-1", style: { color: "#94a3b8" }, children: t.msg })
          ]
        },
        r
      )) })
    ] })
  ] });
}
function M4({ onApprove: e, onExecute: t, onVerify: r, pipelineState: n }) {
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { children: [
      /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Remediation Center" }),
      /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "Human-governed AI remediation pipeline" })
    ] }),
    /* @__PURE__ */ S(Z, { className: "p-6", children: [
      /* @__PURE__ */ d(se, { accent: m.green, children: "Active Remediation — INC-2024-0847" }),
      /* @__PURE__ */ d("div", { className: "flex items-start gap-8 mb-6", children: n.map((a, i) => {
        const o = a.status === "complete", l = a.status === "current", s = o ? m.green : l ? m.cyan : "#1e3a5f";
        return /* @__PURE__ */ S("div", { className: "flex items-center", children: [
          /* @__PURE__ */ S("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ d(
              "button",
              {
                onClick: l ? () => {
                  a.id === "approve" ? e() : a.id === "execute" ? t() : a.id === "verify" && r();
                } : void 0,
                className: `w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${l ? "hover:scale-105 cursor-pointer" : ""}`,
                style: { background: o ? "rgba(0,255,136,0.1)" : l ? "rgba(0,212,255,0.1)" : "rgba(30,58,95,0.2)", border: `2px solid ${s}`, boxShadow: l ? `0 0 20px ${s}30` : "none" },
                children: o ? /* @__PURE__ */ d(Ap, { size: 20, style: { color: m.green } }) : l ? /* @__PURE__ */ d(La, { size: 18, className: "animate-spin", style: { color: m.cyan } }) : /* @__PURE__ */ d("span", { className: "text-sm font-bold", style: { color: s, fontFamily: "JetBrains Mono, monospace" }, children: i + 1 })
              }
            ),
            /* @__PURE__ */ d("span", { className: "text-xs font-semibold", style: { color: s, fontFamily: "JetBrains Mono, monospace" }, children: a.label }),
            l && /* @__PURE__ */ d(
              "button",
              {
                onClick: () => {
                  a.id === "approve" ? e() : a.id === "execute" ? t() : a.id === "verify" && r();
                },
                className: "text-[10px] px-3 py-1 rounded-full",
                style: { background: "rgba(0,212,255,0.12)", color: m.cyan, border: "1px solid rgba(0,212,255,0.28)", fontFamily: "JetBrains Mono, monospace" },
                children: a.id === "approve" ? "Approve" : a.id === "execute" ? "Execute" : "Verify"
              }
            )
          ] }),
          i < n.length - 1 && /* @__PURE__ */ d("div", { className: "w-12 h-0.5 mx-2 mb-8", style: { background: o ? `linear-gradient(90deg,${m.green},${m.cyan}50)` : "rgba(30,58,95,0.5)" } })
        ] }, a.id);
      }) }),
      /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(15,31,61,0.6)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.muted }, children: "Incident" }),
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: "Wi-Fi Network Downtime" }),
          /* @__PURE__ */ d("div", { className: "text-[10px] mt-1", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "INC-2024-0847" })
        ] }),
        /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(15,31,61,0.6)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.muted }, children: "Matched Playbook" }),
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.cyan }, children: "PB-001: Router Failover" }),
          /* @__PURE__ */ d("div", { className: "text-[10px] mt-1", style: { color: m.muted }, children: "47 successful runs" })
        ] }),
        /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(15,31,61,0.6)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.muted }, children: "Risk Assessment" }),
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.orange }, children: "Low Risk" }),
          /* @__PURE__ */ d("div", { className: "text-[10px] mt-1", style: { color: m.muted }, children: "30s micro-downtime during rerouting" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ S(Z, { className: "p-6", children: [
      /* @__PURE__ */ d(se, { accent: m.cyan, children: "Recent Remediations" }),
      [
        { id: "REM-0823", inc: "INC-2024-0844", title: "DB Connection Reset", duration: "6m 29s", result: "success", playbook: "PB-003" },
        { id: "REM-0822", inc: "INC-2024-0841", title: "AP-B1 Power Cycle", duration: "3m 12s", result: "success", playbook: "PB-004" },
        { id: "REM-0821", inc: "INC-2024-0839", title: "Server CPU Kill", duration: "1m 58s", result: "success", playbook: "PB-002" }
      ].map((a) => /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-center gap-4 px-4 py-3 rounded-xl mb-2",
          style: { background: "rgba(15,31,61,0.4)", border: "1px solid rgba(0,212,255,0.06)" },
          children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                style: { background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.2)" },
                children: /* @__PURE__ */ d(Ba, { size: 14, style: { color: m.green } })
              }
            ),
            /* @__PURE__ */ S("div", { className: "flex-1", children: [
              /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: m.text }, children: a.title }),
              /* @__PURE__ */ S("div", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: [
                a.inc,
                " · ",
                a.playbook
              ] })
            ] }),
            /* @__PURE__ */ d($t, { label: `${a.duration}`, color: m.green }),
            /* @__PURE__ */ d($t, { label: "Success", color: m.green })
          ]
        },
        a.id
      ))
    ] })
  ] });
}
function C4() {
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Playbook Library" }),
        /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "6 playbooks · 4 active · 2 draft" })
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          className: "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold",
          style: { background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
          children: "+ New Playbook"
        }
      )
    ] }),
    /* @__PURE__ */ d("div", { className: "grid grid-cols-2 gap-4", children: i4.map((e) => /* @__PURE__ */ S(Z, { className: "p-5", children: [
      /* @__PURE__ */ S("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ S("div", { children: [
          /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ d("span", { className: "text-[10px] font-semibold", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: e.id }),
            /* @__PURE__ */ d($t, { label: e.category, color: m.cyan }),
            /* @__PURE__ */ d($t, { label: e.status, color: e.status === "active" ? m.green : m.orange })
          ] }),
          /* @__PURE__ */ d("div", { className: "text-sm font-semibold", style: { color: m.text }, children: e.name })
        ] }),
        /* @__PURE__ */ d("button", { className: "p-1.5 rounded-lg", style: { color: m.muted }, children: /* @__PURE__ */ d(AD, { size: 14 }) })
      ] }),
      /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-3 mb-4", children: [
        /* @__PURE__ */ S("div", { className: "p-2.5 rounded-lg", style: { background: "rgba(15,31,61,0.7)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-[10px]", style: { color: m.muted }, children: "Last Run" }),
          /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: e.lastRun })
        ] }),
        /* @__PURE__ */ S("div", { className: "p-2.5 rounded-lg", style: { background: "rgba(15,31,61,0.7)" }, children: [
          /* @__PURE__ */ d("div", { className: "text-[10px]", style: { color: m.muted }, children: "Successful Runs" }),
          /* @__PURE__ */ d("div", { className: "text-xs font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: e.success })
        ] })
      ] }),
      /* @__PURE__ */ S("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ S(
          "button",
          {
            className: "flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5",
            style: { background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.18)", color: m.cyan, fontFamily: "JetBrains Mono, monospace" },
            children: [
              /* @__PURE__ */ d(n2, { size: 12 }),
              " View"
            ]
          }
        ),
        /* @__PURE__ */ S(
          "button",
          {
            className: "flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5",
            style: { background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.18)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
            children: [
              /* @__PURE__ */ d(Ho, { size: 12 }),
              " Run"
            ]
          }
        )
      ] })
    ] }, e.id)) })
  ] });
}
function j4() {
  const [e, t] = ae(!0), [r, n] = ae(!1), [a, i] = ae(!0), [o, l] = ae("30"), s = ({ value: c, onChange: u }) => /* @__PURE__ */ d(
    "button",
    {
      onClick: u,
      className: "relative w-10 h-5 rounded-full transition-all duration-200",
      style: { background: c ? "rgba(0,255,136,0.25)" : "rgba(15,31,61,0.8)", border: `1px solid ${c ? m.green : "#1e3a5f"}` },
      children: /* @__PURE__ */ d(
        "div",
        {
          className: "absolute top-0.5 transition-all duration-200 w-4 h-4 rounded-full",
          style: { left: c ? "calc(100% - 18px)" : "2px", background: c ? m.green : "#334155", boxShadow: c ? `0 0 8px ${m.green}60` : "none" }
        }
      )
    }
  );
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { children: [
      /* @__PURE__ */ d("h2", { className: "text-lg font-bold", style: { color: m.text }, children: "Settings" }),
      /* @__PURE__ */ d("p", { className: "text-xs", style: { color: m.muted }, children: "System configuration and preferences" })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ S(Z, { className: "p-6", children: [
        /* @__PURE__ */ d(se, { accent: m.purple, children: "AI Engine" }),
        /* @__PURE__ */ S("div", { className: "space-y-4", children: [
          [
            { label: "AI Diagnosis Active", desc: "Enable real-time AI root cause analysis", value: a, onChange: () => i((c) => !c) },
            { label: "Auto-Remediation", desc: "Allow AI to execute low-risk playbooks without approval", value: r, onChange: () => n((c) => !c) },
            { label: "Alert Notifications", desc: "Push notifications for critical events", value: e, onChange: () => t((c) => !c) }
          ].map((c) => /* @__PURE__ */ S("div", { className: "flex items-center justify-between py-3", style: { borderBottom: "1px solid rgba(0,212,255,0.06)" }, children: [
            /* @__PURE__ */ S("div", { children: [
              /* @__PURE__ */ d("div", { className: "text-xs font-semibold", style: { color: m.text }, children: c.label }),
              /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: c.desc })
            ] }),
            /* @__PURE__ */ d(s, { value: c.value, onChange: c.onChange })
          ] }, c.label)),
          /* @__PURE__ */ S("div", { children: [
            /* @__PURE__ */ d("div", { className: "text-xs font-semibold mb-2", style: { color: m.text }, children: "AI Confidence Threshold" }),
            /* @__PURE__ */ d("div", { className: "text-[10px] mb-2", style: { color: m.muted }, children: "Minimum confidence to auto-trigger playbook staging" }),
            /* @__PURE__ */ S("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ d(
                "input",
                {
                  type: "range",
                  min: 70,
                  max: 99,
                  defaultValue: 85,
                  className: "flex-1",
                  style: { accentColor: m.purple }
                }
              ),
              /* @__PURE__ */ d("span", { className: "text-xs font-bold", style: { color: m.purple, fontFamily: "JetBrains Mono, monospace", minWidth: 32 }, children: "85%" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ S(Z, { className: "p-6", children: [
        /* @__PURE__ */ d(se, { accent: m.cyan, children: "System" }),
        /* @__PURE__ */ S("div", { className: "space-y-4", children: [
          [
            { label: "Organization", value: "State University — IT Operations" },
            { label: "Admin Email", value: "admin@campus.edu" },
            { label: "Timezone", value: "America/New_York (UTC−5)" },
            { label: "Log Retention", value: o + " days" }
          ].map((c) => /* @__PURE__ */ S("div", { className: "py-2.5", style: { borderBottom: "1px solid rgba(0,212,255,0.06)" }, children: [
            /* @__PURE__ */ d("div", { className: "text-[10px] mb-1.5", style: { color: m.muted }, children: c.label }),
            /* @__PURE__ */ d("div", { className: "text-xs font-medium px-3 py-2 rounded-lg", style: { background: "rgba(15,31,61,0.7)", color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }, children: c.value })
          ] }, c.label)),
          /* @__PURE__ */ S(
            "button",
            {
              className: "w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 mt-2",
              style: { background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.25)", color: m.green, fontFamily: "JetBrains Mono, monospace" },
              children: [
                /* @__PURE__ */ d(WD, { size: 13 }),
                " Save Settings"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ S(Z, { className: "p-6", children: [
        /* @__PURE__ */ d(se, { accent: m.green, children: "Integrations" }),
        /* @__PURE__ */ d("div", { className: "space-y-3", children: [
          { name: "Slack Alerts", status: "connected", color: m.green },
          { name: "PagerDuty", status: "connected", color: m.green },
          { name: "JIRA Ticketing", status: "connected", color: m.green },
          { name: "Splunk SIEM", status: "disconnected", color: m.muted },
          { name: "ServiceNow", status: "disconnected", color: m.muted }
        ].map((c) => /* @__PURE__ */ S("div", { className: "flex items-center justify-between py-2.5", style: { borderBottom: "1px solid rgba(0,212,255,0.06)" }, children: [
          /* @__PURE__ */ S("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full", style: { background: c.color } }),
            /* @__PURE__ */ d("span", { className: "text-xs", style: { color: m.text }, children: c.name })
          ] }),
          /* @__PURE__ */ d($t, { label: c.status, color: c.status === "connected" ? m.green : m.muted })
        ] }, c.name)) })
      ] }),
      /* @__PURE__ */ S(Z, { className: "p-6", children: [
        /* @__PURE__ */ d(se, { accent: m.red, children: "Security" }),
        /* @__PURE__ */ d("div", { className: "space-y-3", children: [
          { label: "Two-Factor Auth", value: "Enabled (TOTP)", c: m.green },
          { label: "Session Timeout", value: "30 minutes", c: "#94a3b8" },
          { label: "API Keys Active", value: "3 keys", c: m.cyan },
          { label: "Last Audit", value: "2024-01-14 09:00", c: "#94a3b8" },
          { label: "Role", value: "Super Admin", c: m.purple }
        ].map((c) => /* @__PURE__ */ d(fe, { label: c.label, value: c.value, color: c.c }, c.label)) })
      ] })
    ] })
  ] });
}
function I4({ onNavigate: e }) {
  const [t, r] = ae(!1), [n, a] = ae(!1), [i, o] = ae(1080);
  Dt(() => {
    const u = setInterval(() => o((f) => Math.max(0, f - 1)), 1e3);
    return () => clearInterval(u);
  }, []);
  const l = (u) => `${Math.floor(u / 60)}m ${String(u % 60).padStart(2, "0")}s`, s = [
    { metric: "Online Examination SLA", current: "98%", projected: "71%", risk: "high" },
    { metric: "Emergency Communications", current: "99%", projected: "84%", risk: "medium" },
    { metric: "Identity Services", current: "96%", projected: "72%", risk: "high" },
    { metric: "Research Continuity", current: "100%", projected: "62%", risk: "medium" }
  ], c = [
    { id: "normal", label: "NORMAL", done: !0, current: !1 },
    { id: "signal", label: "SIGNAL DETECTED", done: !0, current: !1 },
    { id: "correlation", label: "CORRELATION RISING", done: !0, current: !1 },
    { id: "elevated", label: "RISK ELEVATED", done: !0, current: !1 },
    { id: "prevention", label: "PREVENTION WINDOW", done: !1, current: !0 }
  ];
  return /* @__PURE__ */ S("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ S("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ S("div", { children: [
        /* @__PURE__ */ d("h2", { className: "text-lg font-bold tracking-wider", style: { color: m.text, fontFamily: "JetBrains Mono, monospace" }, children: "PREDICTIVE RISK RADAR" }),
        /* @__PURE__ */ d("p", { className: "text-xs mt-0.5", style: { color: m.muted }, children: "Detect continuity threats before they become incidents." })
      ] }),
      /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-center gap-2 px-3 py-1.5 rounded-lg",
          style: { background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.18)" },
          children: [
            /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: m.cyan } }),
            /* @__PURE__ */ d("span", { className: "text-[11px] font-semibold", style: { color: m.cyan, fontFamily: "JetBrains Mono, monospace" }, children: "CONTINUOUS MONITORING" })
          ]
        }
      )
    ] }),
    n && /* @__PURE__ */ S(
      "div",
      {
        className: "p-4 rounded-xl flex items-start gap-3",
        style: { background: "rgba(255,140,66,0.07)", border: "2px solid rgba(255,140,66,0.45)" },
        children: [
          /* @__PURE__ */ d(fn, { size: 16, style: { color: m.orange, flexShrink: 0, marginTop: 1 } }),
          /* @__PURE__ */ S("div", { className: "flex-1", children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "text-xs font-bold mb-1 tracking-widest",
                style: { color: m.orange, fontFamily: "JetBrains Mono, monospace" },
                children: "STATE DRIFT DETECTED — PREVIOUS ASSESSMENT NO LONGER VALID"
              }
            ),
            /* @__PURE__ */ d("div", { className: "text-xs", style: { color: "#94a3b8" }, children: "The environment changed after the predictive assessment or authorization was issued." }),
            /* @__PURE__ */ d(
              "div",
              {
                className: "mt-2 px-2 py-1 rounded text-[10px] inline-block",
                style: {
                  background: "rgba(255,140,66,0.1)",
                  color: m.orange,
                  fontFamily: "JetBrains Mono, monospace",
                  border: "1px solid rgba(255,140,66,0.3)"
                },
                children: `"THE WORLD CHANGED. THE APPROVAL DIDN'T. SO WE BLOCKED IT."`
              }
            )
          ] }),
          /* @__PURE__ */ d(
            "button",
            {
              onClick: () => a(!1),
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-all hover:scale-[1.02]",
              style: {
                background: "rgba(255,140,66,0.12)",
                color: m.orange,
                border: "1px solid rgba(255,140,66,0.35)",
                fontFamily: "JetBrains Mono, monospace"
              },
              children: "Recalculate Risk"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(255,77,109,0.05)", border: "1px solid rgba(255,77,109,0.35)" }, children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: m.red } }),
        /* @__PURE__ */ d("span", { className: "text-sm font-bold tracking-wider", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "EARLY WARNING: COMMON-CAUSE DEPENDENCY RISK DETECTED" })
      ] }),
      /* @__PURE__ */ d("p", { className: "text-xs mb-4", style: { color: "#94a3b8", maxWidth: "70%" }, children: "Multiple apparently independent services share correlated upstream infrastructure. Current telemetry indicates elevated systemic failure exposure." }),
      /* @__PURE__ */ d("div", { className: "grid grid-cols-4 gap-3", children: [
        { label: "Dependency Correlation", value: "87%", color: m.red },
        { label: "Estimated Failure Risk", value: "68%", color: m.red },
        { label: "Services Exposed", value: "4", color: m.orange },
        { label: "Continuity Contracts at Risk", value: "3", color: m.orange }
      ].map((u) => /* @__PURE__ */ S(
        "div",
        {
          className: "p-3 rounded-lg text-center",
          style: { background: "rgba(2,8,23,0.6)", border: `1px solid ${u.color}22` },
          children: [
            /* @__PURE__ */ d("div", { className: "text-2xl font-bold", style: { color: u.color, fontFamily: "JetBrains Mono, monospace" }, children: u.value }),
            /* @__PURE__ */ d("div", { className: "text-[10px] mt-1 leading-tight", style: { color: m.muted }, children: u.label })
          ]
        },
        u.label
      )) })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ d("div", { className: "col-span-2", children: /* @__PURE__ */ S(Z, { className: "p-5", children: [
        /* @__PURE__ */ S("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ d(se, { accent: m.red, children: "Dependency Risk Map" }),
          /* @__PURE__ */ d(
            "span",
            {
              className: "text-[10px] px-2 py-1 rounded",
              style: {
                background: "rgba(255,77,109,0.1)",
                color: m.red,
                border: "1px solid rgba(255,77,109,0.3)",
                fontFamily: "JetBrains Mono, monospace"
              },
              children: "EFFECTIVE REDUNDANCY: 41%"
            }
          )
        ] }),
        /* @__PURE__ */ d("div", { className: "rounded-xl overflow-hidden", style: { background: "rgba(2,8,23,0.96)" }, children: /* @__PURE__ */ S("svg", { viewBox: "0 0 600 340", width: "100%", style: { display: "block" }, children: [
          /* @__PURE__ */ S("defs", { children: [
            /* @__PURE__ */ d("pattern", { id: "rmgrid", width: "20", height: "20", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ d("path", { d: "M20 0L0 0 0 20", fill: "none", stroke: "rgba(0,212,255,0.035)", strokeWidth: "0.5" }) }),
            /* @__PURE__ */ d("marker", { id: "rarr", markerWidth: "5", markerHeight: "5", refX: "4", refY: "2.5", orient: "auto", children: /* @__PURE__ */ d("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "rgba(0,212,255,0.45)" }) }),
            /* @__PURE__ */ d("marker", { id: "rarrGreen", markerWidth: "5", markerHeight: "5", refX: "4", refY: "2.5", orient: "auto", children: /* @__PURE__ */ d("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "rgba(0,255,136,0.5)" }) }),
            /* @__PURE__ */ d("marker", { id: "rarrRed", markerWidth: "5", markerHeight: "5", refX: "4", refY: "2.5", orient: "auto", children: /* @__PURE__ */ d("path", { d: "M0,0 L5,2.5 L0,5 Z", fill: "rgba(255,77,109,0.8)" }) }),
            /* @__PURE__ */ S("filter", { id: "redglow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
              /* @__PURE__ */ d("feGaussianBlur", { stdDeviation: "2.5", result: "blur" }),
              /* @__PURE__ */ S("feMerge", { children: [
                /* @__PURE__ */ d("feMergeNode", { in: "blur" }),
                /* @__PURE__ */ d("feMergeNode", { in: "SourceGraphic" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ d("rect", { width: "600", height: "340", fill: "url(#rmgrid)" }),
          /* @__PURE__ */ d("text", { x: "14", y: "47", fill: "rgba(100,116,139,0.6)", fontSize: "7", fontFamily: "JetBrains Mono", children: "CAMPUS SERVICES" }),
          [
            { x: 65, label: "STUDENT PORTAL" },
            { x: 225, label: "EXAM SYSTEM" },
            { x: 385, label: "EMERGENCY COMMS" },
            { x: 510, label: "RESEARCH PORTAL" }
          ].map((u) => /* @__PURE__ */ S("g", { children: [
            /* @__PURE__ */ d(
              "rect",
              {
                x: u.x,
                y: 20,
                width: 118,
                height: 30,
                rx: 5,
                fill: "rgba(0,212,255,0.06)",
                stroke: "rgba(0,212,255,0.4)",
                strokeWidth: "0.9"
              }
            ),
            /* @__PURE__ */ d(
              "text",
              {
                x: u.x + 59,
                y: 39,
                textAnchor: "middle",
                fill: m.cyan,
                fontSize: "8",
                fontFamily: "JetBrains Mono",
                children: u.label
              }
            )
          ] }, u.label)),
          /* @__PURE__ */ d("line", { x1: "124", y1: "50", x2: "235", y2: "96", stroke: "rgba(0,212,255,0.22)", strokeWidth: "1", markerEnd: "url(#rarr)" }),
          /* @__PURE__ */ d("line", { x1: "284", y1: "50", x2: "285", y2: "96", stroke: "rgba(0,212,255,0.22)", strokeWidth: "1", markerEnd: "url(#rarr)" }),
          /* @__PURE__ */ d("line", { x1: "444", y1: "50", x2: "330", y2: "96", stroke: "rgba(0,212,255,0.22)", strokeWidth: "1", markerEnd: "url(#rarr)" }),
          /* @__PURE__ */ d("line", { x1: "569", y1: "50", x2: "335", y2: "96", stroke: "rgba(0,212,255,0.14)", strokeWidth: "0.8", strokeDasharray: "3,2", markerEnd: "url(#rarr)" }),
          /* @__PURE__ */ d("text", { x: "14", y: "120", fill: "rgba(100,116,139,0.6)", fontSize: "7", fontFamily: "JetBrains Mono", children: "IDENTITY SERVICES" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 200,
              y: 96,
              width: 170,
              height: 30,
              rx: 5,
              fill: "rgba(168,85,247,0.07)",
              stroke: "rgba(168,85,247,0.4)",
              strokeWidth: "1"
            }
          ),
          /* @__PURE__ */ d(
            "text",
            {
              x: 285,
              y: 115,
              textAnchor: "middle",
              fill: m.purple,
              fontSize: "8.5",
              fontFamily: "JetBrains Mono",
              children: "IDENTITY SERVICES"
            }
          ),
          /* @__PURE__ */ d("line", { x1: "240", y1: "126", x2: "168", y2: "174", stroke: "rgba(0,255,136,0.35)", strokeWidth: "1", markerEnd: "url(#rarrGreen)" }),
          /* @__PURE__ */ d("line", { x1: "330", y1: "126", x2: "398", y2: "174", stroke: "rgba(0,255,136,0.35)", strokeWidth: "1", markerEnd: "url(#rarrGreen)" }),
          /* @__PURE__ */ d("text", { x: "14", y: "198", fill: "rgba(100,116,139,0.6)", fontSize: "7", fontFamily: "JetBrains Mono", children: "PROVIDERS (APPEAR INDEPENDENT)" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 100,
              y: 174,
              width: 120,
              height: 30,
              rx: 5,
              fill: "rgba(0,255,136,0.06)",
              stroke: "rgba(0,255,136,0.38)",
              strokeWidth: "1"
            }
          ),
          /* @__PURE__ */ d("text", { x: 160, y: 192, textAnchor: "middle", fill: m.green, fontSize: "8.5", fontFamily: "JetBrains Mono", children: "ISP A" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 350,
              y: 174,
              width: 120,
              height: 30,
              rx: 5,
              fill: "rgba(0,255,136,0.06)",
              stroke: "rgba(0,255,136,0.38)",
              strokeWidth: "1"
            }
          ),
          /* @__PURE__ */ d("text", { x: 410, y: 192, textAnchor: "middle", fill: m.green, fontSize: "8.5", fontFamily: "JetBrains Mono", children: "ISP B" }),
          /* @__PURE__ */ d(
            "line",
            {
              x1: "160",
              y1: "204",
              x2: "248",
              y2: "250",
              stroke: m.red,
              strokeWidth: "1.5",
              strokeDasharray: "5,3",
              markerEnd: "url(#rarrRed)"
            }
          ),
          /* @__PURE__ */ d(
            "line",
            {
              x1: "410",
              y1: "204",
              x2: "318",
              y2: "250",
              stroke: m.red,
              strokeWidth: "1.5",
              strokeDasharray: "5,3",
              markerEnd: "url(#rarrRed)"
            }
          ),
          /* @__PURE__ */ d("text", { x: "14", y: "274", fill: "rgba(255,77,109,0.7)", fontSize: "7", fontFamily: "JetBrains Mono", children: "SHARED UPSTREAM LAYER ← RISK ORIGIN" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 185,
              y: 252,
              width: 200,
              height: 32,
              rx: 6,
              fill: "rgba(255,77,109,0.12)",
              stroke: m.red,
              strokeWidth: "1.5",
              filter: "url(#redglow)"
            }
          ),
          /* @__PURE__ */ d(
            "text",
            {
              x: 285,
              y: 268,
              textAnchor: "middle",
              fill: m.red,
              fontSize: "8",
              fontFamily: "JetBrains Mono",
              fontWeight: "bold",
              children: "SHARED REGIONAL UPSTREAM"
            }
          ),
          /* @__PURE__ */ d(
            "text",
            {
              x: 285,
              y: 280,
              textAnchor: "middle",
              fill: "rgba(255,77,109,0.65)",
              fontSize: "7",
              fontFamily: "JetBrains Mono",
              children: "HIDDEN COMMON-CAUSE DEPENDENCY"
            }
          ),
          /* @__PURE__ */ d("line", { x1: "285", y1: "284", x2: "285", y2: "307", stroke: m.red, strokeWidth: "2", markerEnd: "url(#rarrRed)" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 170,
              y: 308,
              width: 230,
              height: 26,
              rx: 5,
              fill: "rgba(255,77,109,0.16)",
              stroke: m.red,
              strokeWidth: "2",
              filter: "url(#redglow)"
            }
          ),
          /* @__PURE__ */ d(
            "text",
            {
              x: 285,
              y: 325,
              textAnchor: "middle",
              fill: m.red,
              fontSize: "8.5",
              fontFamily: "JetBrains Mono",
              fontWeight: "bold",
              children: "COMMON NETWORK PROVIDER"
            }
          ),
          /* @__PURE__ */ d(
            "rect",
            {
              x: 430,
              y: 250,
              width: 148,
              height: 46,
              rx: 4,
              fill: "rgba(255,77,109,0.04)",
              stroke: "rgba(255,77,109,0.2)",
              strokeWidth: "0.8"
            }
          ),
          /* @__PURE__ */ d("text", { x: 504, y: 266, textAnchor: "middle", fill: m.red, fontSize: "7.5", fontFamily: "JetBrains Mono", children: "HIDDEN COMMON-CAUSE" }),
          /* @__PURE__ */ d("text", { x: 504, y: 278, textAnchor: "middle", fill: m.red, fontSize: "7.5", fontFamily: "JetBrains Mono", children: "DEPENDENCY DETECTED" }),
          /* @__PURE__ */ d("text", { x: 504, y: 291, textAnchor: "middle", fill: m.orange, fontSize: "8", fontFamily: "JetBrains Mono", fontWeight: "bold", children: "EFF. REDUNDANCY: 41%" }),
          /* @__PURE__ */ d(
            "rect",
            {
              x: "2",
              y: "2",
              width: "596",
              height: "336",
              rx: "6",
              fill: "none",
              stroke: "rgba(0,212,255,0.07)",
              strokeWidth: "0.8"
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ S(Z, { className: "p-5 flex flex-col", children: [
        /* @__PURE__ */ d(se, { accent: m.orange, children: "Predictive Assessment" }),
        /* @__PURE__ */ S("div", { className: "space-y-0.5 mb-4", children: [
          /* @__PURE__ */ d(fe, { label: "Failure Probability", value: "68%", color: m.red }),
          /* @__PURE__ */ d(fe, { label: "Confidence", value: "93%", color: m.cyan }),
          /* @__PURE__ */ d(fe, { label: "Dependency Correlation", value: "87%", color: m.red }),
          /* @__PURE__ */ d(fe, { label: "Telemetry Coverage", value: "94%", color: m.green }),
          /* @__PURE__ */ d(fe, { label: "Time to Projected Impact", value: "18–32 min", color: m.orange })
        ] }),
        /* @__PURE__ */ S(
          "div",
          {
            className: "flex items-center justify-between p-2.5 rounded-lg mb-4",
            style: { background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.38)" },
            children: [
              /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "RISK LEVEL" }),
              /* @__PURE__ */ d("span", { className: "text-sm font-bold", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "HIGH" })
            ]
          }
        ),
        /* @__PURE__ */ d("div", { className: "space-y-3 mb-4", children: [
          { label: "Failure Risk", pct: 68, color: m.red },
          { label: "Dep. Correlation", pct: 87, color: m.orange },
          { label: "Telemetry Coverage", pct: 94, color: m.green }
        ].map((u) => /* @__PURE__ */ S("div", { children: [
          /* @__PURE__ */ S("div", { className: "flex justify-between mb-1", children: [
            /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: u.label }),
            /* @__PURE__ */ S("span", { className: "text-[10px] font-bold", style: { color: u.color, fontFamily: "JetBrains Mono, monospace" }, children: [
              u.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "h-1.5 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.04)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: `${u.pct}%`, background: u.color } }) })
        ] }, u.label)) }),
        /* @__PURE__ */ d("div", { className: "p-3 rounded-xl mt-auto", style: { background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }, children: /* @__PURE__ */ d("p", { className: "text-[11px] leading-relaxed", style: { color: "#94a3b8" }, children: "Observed dependency correlation reduces effective redundancy. A failure in the shared upstream layer may simultaneously affect multiple institutional services." }) })
      ] })
    ] }),
    /* @__PURE__ */ S(Z, { className: "p-5", children: [
      /* @__PURE__ */ d(se, { accent: m.cyan, children: "Early Warning Timeline" }),
      /* @__PURE__ */ d("div", { className: "flex items-center gap-0 mb-4 overflow-x-auto pb-1", children: c.map((u, f) => {
        const p = u.current ? m.orange : u.done ? m.green : m.subtle;
        return /* @__PURE__ */ S("div", { className: "flex items-center flex-shrink-0", children: [
          /* @__PURE__ */ S("div", { className: "flex flex-col items-center gap-1.5", children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "px-3 py-1.5 rounded-lg whitespace-nowrap",
                style: {
                  background: u.current ? "rgba(255,140,66,0.14)" : u.done ? "rgba(0,255,136,0.07)" : "rgba(30,58,95,0.35)",
                  border: `1px solid ${p}40`
                },
                children: /* @__PURE__ */ d("span", { className: "text-[10px] font-bold", style: { color: p, fontFamily: "JetBrains Mono, monospace" }, children: u.label })
              }
            ),
            u.current && /* @__PURE__ */ d("div", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: m.orange } })
          ] }),
          f < c.length - 1 && /* @__PURE__ */ d(
            "div",
            {
              className: "w-8 h-0.5 mx-1 mb-3 flex-shrink-0",
              style: { background: u.done ? `linear-gradient(90deg,${m.green},${m.green}50)` : "rgba(30,58,95,0.5)" }
            }
          )
        ] }, u.id);
      }) }),
      /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-center gap-3 p-3 rounded-lg",
          style: { background: "rgba(255,140,66,0.05)", border: "1px solid rgba(255,140,66,0.28)" },
          children: [
            /* @__PURE__ */ d(mD, { size: 14, style: { color: m.orange, flexShrink: 0 } }),
            /* @__PURE__ */ S("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1", children: [
              /* @__PURE__ */ d("span", { className: "text-xs font-bold", style: { color: m.orange, fontFamily: "JetBrains Mono, monospace" }, children: "PREVENTION WINDOW OPEN" }),
              /* @__PURE__ */ S("span", { className: "text-xs", style: { color: "#94a3b8" }, children: [
                "Estimated time remaining:",
                /* @__PURE__ */ d("span", { className: "ml-1.5 font-bold", style: { color: m.orange, fontFamily: "JetBrains Mono, monospace" }, children: l(i) })
              ] })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ S(Z, { className: "overflow-hidden", children: [
      /* @__PURE__ */ d("div", { className: "px-5 py-3", style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: /* @__PURE__ */ d(se, { accent: m.orange, children: "Affected Continuity Contracts" }) }),
      /* @__PURE__ */ d("div", { className: "overflow-x-auto", children: /* @__PURE__ */ S("table", { className: "w-full", children: [
        /* @__PURE__ */ d("thead", { children: /* @__PURE__ */ d("tr", { style: { borderBottom: "1px solid rgba(0,212,255,0.07)" }, children: ["Metric / Contract", "Current SLA", "Projected Without Action", "Risk"].map((u) => /* @__PURE__ */ d(
          "th",
          {
            className: "px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest",
            style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" },
            children: u
          },
          u
        )) }) }),
        /* @__PURE__ */ d("tbody", { children: s.map((u, f) => {
          const p = u.risk === "high" ? m.red : m.orange;
          return /* @__PURE__ */ S(
            "tr",
            {
              style: { borderBottom: f < s.length - 1 ? "1px solid rgba(0,212,255,0.05)" : "none" },
              children: [
                /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs font-semibold", style: { color: m.text }, children: u.metric }),
                /* @__PURE__ */ d("td", { className: "px-5 py-3 text-xs font-bold", style: { color: m.green, fontFamily: "JetBrains Mono, monospace" }, children: u.current }),
                /* @__PURE__ */ S("td", { className: "px-5 py-3", children: [
                  /* @__PURE__ */ d("span", { className: "text-xs font-bold", style: { color: p, fontFamily: "JetBrains Mono, monospace" }, children: u.projected }),
                  /* @__PURE__ */ d("span", { className: "ml-2 text-[10px]", style: { color: m.muted }, children: "↓" })
                ] }),
                /* @__PURE__ */ d("td", { className: "px-5 py-3", children: /* @__PURE__ */ d(qa, { severity: u.risk }) })
              ]
            },
            u.metric
          );
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ S(Z, { className: "p-5", children: [
        /* @__PURE__ */ d(se, { accent: m.cyan, children: "Recommended Preventive Action" }),
        /* @__PURE__ */ d("div", { className: "flex items-center gap-2 mb-4", children: /* @__PURE__ */ S(
          "div",
          {
            className: "px-3 py-2 rounded-lg flex-1",
            style: { background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.28)" },
            children: [
              /* @__PURE__ */ d("div", { className: "text-[10px] mb-0.5", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: "STRATEGY" }),
              /* @__PURE__ */ d("div", { className: "text-sm font-bold", style: { color: m.cyan, fontFamily: "JetBrains Mono, monospace" }, children: "DIVERSIFY UPSTREAM PROVIDER" })
            ]
          }
        ) }),
        /* @__PURE__ */ S("div", { className: "space-y-0.5 mb-4", children: [
          /* @__PURE__ */ d(fe, { label: "Feasibility", value: "YES", color: m.green }),
          /* @__PURE__ */ d(fe, { label: "Estimated Cost", value: "MEDIUM", color: m.orange }),
          /* @__PURE__ */ d(fe, { label: "Continuity Utility", value: "OPTIMAL", color: m.green }),
          /* @__PURE__ */ d(fe, { label: "Risk Reduction", value: "HIGH", color: m.green }),
          /* @__PURE__ */ d(fe, { label: "Collateral Impact", value: "LOW", color: m.green }),
          /* @__PURE__ */ d(fe, { label: "Confidence", value: "96.4%", color: m.cyan })
        ] }),
        /* @__PURE__ */ d("div", { className: "p-3 rounded-xl", style: { background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }, children: /* @__PURE__ */ d("p", { className: "text-[11px] leading-relaxed", style: { color: "#94a3b8" }, children: "Removing the dominant shared dependency increases effective redundancy and reduces common-cause failure exposure before an incident occurs." }) })
      ] }),
      /* @__PURE__ */ S(Z, { className: "p-5", children: [
        /* @__PURE__ */ d(se, { accent: m.green, children: "Effective Redundancy Comparison" }),
        /* @__PURE__ */ S("div", { className: "space-y-3", children: [
          /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(255,77,109,0.05)", border: "1px solid rgba(255,77,109,0.22)" }, children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "text-[10px] uppercase tracking-widest mb-2",
                style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" },
                children: "CURRENT ARCHITECTURE"
              }
            ),
            /* @__PURE__ */ d(
              "div",
              {
                className: "text-3xl font-bold mb-1",
                style: { color: m.red, fontFamily: "JetBrains Mono, monospace" },
                children: "41%"
              }
            ),
            /* @__PURE__ */ d("div", { className: "text-[10px] mb-2", style: { color: m.muted }, children: "Effective redundancy" }),
            /* @__PURE__ */ d("div", { className: "h-2 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ d("div", { className: "h-full rounded-full", style: { width: "41%", background: m.red } }) })
          ] }),
          /* @__PURE__ */ S("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ d("div", { className: "h-px flex-1", style: { background: "rgba(0,255,136,0.12)" } }),
            /* @__PURE__ */ d(
              "span",
              {
                className: "text-[10px] whitespace-nowrap px-1",
                style: { color: m.green, fontFamily: "JetBrains Mono, monospace" },
                children: "↓ Preventive mitigation applied"
              }
            ),
            /* @__PURE__ */ d("div", { className: "h-px flex-1", style: { background: "rgba(0,255,136,0.12)" } })
          ] }),
          /* @__PURE__ */ S("div", { className: "p-4 rounded-xl", style: { background: "rgba(0,255,136,0.05)", border: "1px solid rgba(0,255,136,0.22)" }, children: [
            /* @__PURE__ */ d(
              "div",
              {
                className: "text-[10px] uppercase tracking-widest mb-2",
                style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" },
                children: "PROTECTED ARCHITECTURE"
              }
            ),
            /* @__PURE__ */ d(
              "div",
              {
                className: "text-3xl font-bold mb-1",
                style: { color: m.green, fontFamily: "JetBrains Mono, monospace" },
                children: "78%"
              }
            ),
            /* @__PURE__ */ d("div", { className: "text-[10px] mb-2", style: { color: m.muted }, children: "Effective redundancy" }),
            /* @__PURE__ */ d("div", { className: "h-2 rounded-full overflow-hidden", style: { background: "rgba(255,255,255,0.05)" }, children: /* @__PURE__ */ d(
              "div",
              {
                className: "h-full rounded-full",
                style: { width: "78%", background: `linear-gradient(90deg,${m.green},${m.cyan})` }
              }
            ) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ S("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ S(
        "button",
        {
          onClick: () => {
            r(!0), setTimeout(() => {
              r(!1), e("ai-diagnosis");
            }, 1400);
          },
          className: "flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.01]",
          style: {
            background: "linear-gradient(135deg,rgba(0,212,255,0.16),rgba(168,85,247,0.14))",
            border: "1px solid rgba(0,212,255,0.38)",
            color: m.cyan,
            fontFamily: "JetBrains Mono, monospace"
          },
          children: [
            t ? /* @__PURE__ */ d(La, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ d(Ho, { size: 16 }),
            t ? "LAUNCHING SIMULATION..." : "RUN PREVENTION SIMULATION"
          ]
        }
      ),
      /* @__PURE__ */ S(
        "button",
        {
          className: "flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.01]",
          style: {
            background: "rgba(0,212,255,0.05)",
            border: "1px solid rgba(0,212,255,0.18)",
            color: "#64748b",
            fontFamily: "JetBrains Mono, monospace"
          },
          children: [
            /* @__PURE__ */ d(RD, { size: 16 }),
            "VIEW DEPENDENCY GRAPH"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ S(Z, { className: "p-5", style: { border: "1px solid rgba(255,77,109,0.32)" }, children: [
      /* @__PURE__ */ S("div", { className: "flex items-center gap-3 mb-3", children: [
        /* @__PURE__ */ d(
          "div",
          {
            className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            style: { background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.3)" },
            children: /* @__PURE__ */ d(fn, { size: 15, style: { color: m.red } })
          }
        ),
        /* @__PURE__ */ S("div", { className: "flex-1", children: [
          /* @__PURE__ */ d("div", { className: "text-xs font-bold tracking-widest", style: { color: m.red, fontFamily: "JetBrains Mono, monospace" }, children: "RISK ESCALATION REQUIRED" }),
          /* @__PURE__ */ d("div", { className: "text-[10px] mt-0.5", style: { color: m.muted }, children: "If this risk becomes critical, the following escalation actions are available." })
        ] }),
        /* @__PURE__ */ d("div", { className: "w-2 h-2 rounded-full animate-pulse", style: { background: m.red } })
      ] }),
      /* @__PURE__ */ S("p", { className: "text-xs mb-4", style: { color: "#94a3b8" }, children: [
        "CampusGuard does ",
        /* @__PURE__ */ d("strong", { style: { color: m.text }, children: "NOT" }),
        " automatically execute recovery. Human authorization is required before any mitigation is applied. The Safety Gate remains active."
      ] }),
      /* @__PURE__ */ d("div", { className: "grid grid-cols-3 gap-3 mb-4", children: [
        { label: "Open Counterfactual", icon: kD, color: m.cyan, page: "ai-diagnosis" },
        { label: "Generate Recovery Strategy", icon: Da, color: m.purple, page: "remediation" },
        { label: "Request Human Authorization", icon: Sa, color: m.orange, page: "remediation" }
      ].map((u) => /* @__PURE__ */ S(
        "button",
        {
          onClick: () => e(u.page),
          className: "flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all hover:scale-[1.01]",
          style: {
            background: `${u.color}08`,
            border: `1px solid ${u.color}28`,
            color: u.color,
            fontFamily: "JetBrains Mono, monospace"
          },
          children: [
            /* @__PURE__ */ d(u.icon, { size: 13 }),
            /* @__PURE__ */ d("span", { className: "flex-1 text-left", children: u.label }),
            /* @__PURE__ */ d(Z3, { size: 11, style: { opacity: 0.5, flexShrink: 0 } })
          ]
        },
        u.label
      )) }),
      /* @__PURE__ */ S(
        "div",
        {
          className: "flex items-center gap-2 p-3 rounded-lg",
          style: { background: "rgba(255,77,109,0.04)", border: "1px solid rgba(255,77,109,0.14)" },
          children: [
            /* @__PURE__ */ d(a2, { size: 11, style: { color: m.muted, flexShrink: 0 } }),
            /* @__PURE__ */ d("span", { className: "text-[10px]", style: { color: m.muted, fontFamily: "JetBrains Mono, monospace" }, children: `SAFETY GATE ACTIVE — "THE WORLD CHANGED. THE APPROVAL DIDN'T. SO WE BLOCKED IT."` })
          ]
        }
      )
    ] }),
    !n && /* @__PURE__ */ d("div", { className: "flex justify-end", children: /* @__PURE__ */ d(
      "button",
      {
        onClick: () => a(!0),
        className: "text-[10px] px-3 py-1.5 rounded-lg transition-all hover:scale-[1.01]",
        style: {
          background: "rgba(255,140,66,0.04)",
          color: m.muted,
          border: "1px solid rgba(0,212,255,0.07)",
          fontFamily: "JetBrains Mono, monospace"
        },
        children: "[DEMO] Simulate State Drift"
      }
    ) })
  ] });
}
function $4() {
  const [e, t] = ae(!0), [r, n] = ae("dashboard"), [a, i] = ae(null), [o, l] = ae("Last 1h"), [s, c] = ae(!1), [u, f] = ae(!1), [p, h] = ae(!1), [g, v] = ae(o4), y = (N) => {
    i(N), n("incident-detail");
  }, x = () => c(!0), O = () => {
    c(!1), f(!0), v((N) => N.map((T) => T.id === "approve" ? { ...T, status: "complete" } : T.id === "execute" ? { ...T, status: "current" } : T));
  }, A = () => f(!0), _ = () => {
    f(!1), h(!0), v((N) => N.map((T) => T.id === "execute" ? { ...T, status: "complete" } : T.id === "verify" ? { ...T, status: "current" } : T));
  }, b = () => h(!0), w = (N) => {
    n(N), N !== "incident-detail" && i(null);
  }, P = () => {
    if (r === "incident-detail" && a)
      return /* @__PURE__ */ d(A4, { incident: a, onBack: () => w("incidents") });
    switch (r) {
      case "dashboard":
        return /* @__PURE__ */ d(O4, { onSelectIncident: y, onViewAI: () => n("ai-diagnosis"), onApprove: x, onExecute: A, onVerify: b, pipelineState: g });
      case "infrastructure":
        return /* @__PURE__ */ d(P4, {});
      case "incidents":
        return /* @__PURE__ */ d(S4, { onSelect: y });
      case "ai-diagnosis":
        return /* @__PURE__ */ d(_4, {});
      case "remediation":
        return /* @__PURE__ */ d(M4, { onApprove: x, onExecute: A, onVerify: b, pipelineState: g });
      case "iot":
        return /* @__PURE__ */ d(N4, {});
      case "cctv":
        return /* @__PURE__ */ d(E4, {});
      case "reports":
        return /* @__PURE__ */ d(k4, {});
      case "playbook":
        return /* @__PURE__ */ d(C4, {});
      case "settings":
        return /* @__PURE__ */ d(j4, {});
      case "predictive-risk":
        return /* @__PURE__ */ d(I4, { onNavigate: w });
      default:
        return null;
    }
  };
  return e ? /* @__PURE__ */ S("div", { className: "h-screen w-screen flex overflow-hidden", style: { background: m.bg, fontFamily: "Inter, sans-serif" }, children: [
    /* @__PURE__ */ d("style", { children: `
        @keyframes scanline { 0% { top: 10%; } 100% { top: 90%; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.15); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.3); }
      ` }),
    /* @__PURE__ */ d(d4, { active: r, onNav: w }),
    /* @__PURE__ */ S("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ d(p4, { timeFilter: o, setTimeFilter: l }),
      /* @__PURE__ */ d("main", { className: "flex-1 overflow-y-auto p-4", children: P() })
    ] }),
    /* @__PURE__ */ d(s4, { open: s, onClose: () => c(!1), onConfirm: O }),
    /* @__PURE__ */ d(c4, { open: u, onClose: _ }),
    /* @__PURE__ */ d(u4, { open: p, onClose: () => h(!1) })
  ] }) : /* @__PURE__ */ d(T4, { onLogin: () => t(!0) });
}

;


export default $4;
export { 
  $4 as CampusGuardApp,
  O4 as DashboardPage,
  P4 as InfrastructurePage,
  S4 as IncidentsPage,
  A4 as IncidentDetailPage,
  _4 as AIDiagnosisPage,
  M4 as RemediationPage,
  N4 as IoTMonitoringPage,
  E4 as CCTVPage,
  k4 as ReportsPage,
  C4 as PlaybooksPage,
  j4 as SettingsPage,
  I4 as PredictiveRiskPage,
  T4 as LoginPage,
  d4 as Sidebar,
  p4 as Header,
  s4 as ApproveModal,
  c4 as ExecuteModal,
  u4 as VerifyModal,
  m as theme,
  gd as incidentsData,
  l2 as iotSensorsData,
  ni as healthDistributionData,
  i4 as playbooksData,
  o4 as pipelineStagesData
};

