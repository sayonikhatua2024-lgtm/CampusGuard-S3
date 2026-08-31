import React, { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Infrastructure from "./pages/Infrastructure";
import Incidents from "./pages/Incidents";
import IncidentDetail from "./pages/IncidentDetail";
import AIDiagnosis from "./pages/AIDiagnosis";
import Remediation from "./pages/Remediation";
import IoTMonitoring from "./pages/IoTMonitoring";
import CCTV from "./pages/CCTV";
import Reports from "./pages/Reports";
import Playbooks from "./pages/Playbooks";
import Settings from "./pages/Settings";
import PredictiveRisk from "./pages/PredictiveRisk";
import Login from "./pages/Login";

import SafetyGateModal from "./components/modals/SafetyGateModal";
import ControlledExecutionModal from "./components/modals/ControlledExecutionModal";
import VerificationModal from "./components/modals/VerificationModal";

import { theme } from "./theme";
import { initialIncidents } from "./data/mockData";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [timeFilter, setTimeFilter] = useState("Last 1h");

  // Modals state
  const [safetyGateOpen, setSafetyGateOpen] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  // Hash-based routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        if (hash.startsWith("incident/")) {
          const incId = hash.replace("incident/", "");
          const inc = initialIncidents.find((i) => i.id === incId) || initialIncidents[0];
          setSelectedIncident(inc);
          setActiveTab("incident-detail");
        } else {
          setActiveTab(hash);
          setSelectedIncident(null);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelectIncident = (inc) => {
    setSelectedIncident(inc);
    setActiveTab("incident-detail");
    window.location.hash = `incident/${inc.id}`;
  };

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "incident-detail") {
      setSelectedIncident(null);
      window.location.hash = tabId;
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    window.location.hash = "dashboard";
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    window.location.hash = "";
  };

  const handleAuthorizeSafetyGate = () => {
    setSafetyGateOpen(false);
    setExecutionOpen(true);
  };

  const handleExecutionComplete = () => {
    setExecutionOpen(false);
    setVerificationOpen(true);
  };

  // If unauthenticated, show the Login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderActivePage = () => {
    if (activeTab === "incident-detail" && selectedIncident) {
      return (
        <IncidentDetail
          incident={selectedIncident}
          onBack={() => handleNav("incidents")}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            onSelectIncident={handleSelectIncident}
            onViewAI={() => handleNav("ai-diagnosis")}
            onApprove={() => setSafetyGateOpen(true)}
            onExecute={() => setExecutionOpen(true)}
            onVerify={() => setVerificationOpen(true)}
          />
        );
      case "infrastructure":
        return <Infrastructure />;
      case "incidents":
        return <Incidents onSelect={handleSelectIncident} />;
      case "ai-diagnosis":
        return <AIDiagnosis />;
      case "remediation":
        return (
          <Remediation
            onApprove={() => setSafetyGateOpen(true)}
            onExecute={() => setExecutionOpen(true)}
            onVerify={() => setVerificationOpen(true)}
          />
        );
      case "iot":
        return <IoTMonitoring />;
      case "cctv":
        return <CCTV />;
      case "reports":
        return <Reports />;
      case "playbook":
        return <Playbooks />;
      case "predictive-risk":
        return <PredictiveRisk onNavigate={handleNav} />;
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            onSelectIncident={handleSelectIncident}
            onViewAI={() => handleNav("ai-diagnosis")}
            onApprove={() => setSafetyGateOpen(true)}
            onExecute={() => setExecutionOpen(true)}
            onVerify={() => setVerificationOpen(true)}
          />
        );
    }
  };

  return (
    <div
      className="h-screen w-screen flex overflow-hidden font-sans select-none"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* 1. Left Navigation Sidebar */}
      <Sidebar active={activeTab} onNav={handleNav} />

      {/* 2. Main Content Area with Sticky Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Interactive Modals */}
      <SafetyGateModal
        open={safetyGateOpen}
        onClose={() => setSafetyGateOpen(false)}
        onConfirm={handleAuthorizeSafetyGate}
      />
      <ControlledExecutionModal
        open={executionOpen}
        onClose={handleExecutionComplete}
      />
      <VerificationModal
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
      />
    </div>
  );
}
