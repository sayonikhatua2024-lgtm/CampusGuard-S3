import React, { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";

const LABELS = {
  services: "Services",
  incidents: "Incidents",
  "ai-insights": "AI Insights",
  "self-healing": "Self-Healing",
  "action-history": "Action History",
  settings: "Settings",
};

function Shell() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="h-screen flex bg-base-950">
      <Sidebar active={active} onNavigate={setActive} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar active={active} apiHealthy />
        <main className="flex-1 overflow-y-auto">
          {active === "dashboard" ? <Dashboard /> : <ComingSoon label={LABELS[active]} />}
        </main>
      </div>
    </div>
  );
}

function Gate() {
  const { authed } = useAuth();
  return authed ? <Shell /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
