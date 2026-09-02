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

import AIBannerAlert from "./components/ai/AIBannerAlert";
import AINotificationModal from "./components/ai/AINotificationModal";
import AINotificationDrawer from "./components/ai/AINotificationDrawer";

import { theme } from "./theme";
import { initialIncidents } from "./data/mockData";
import { aiBlockScenarios } from "./data/aiBlockScenarios";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [timeFilter, setTimeFilter] = useState("Last 1h");

  // Standard Modals
  const [safetyGateOpen, setSafetyGateOpen] = useState(false);
  const [executionOpen, setExecutionOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);

  // AI Integration: Alert & Notification States
  const [activeAIAlerts, setActiveAIAlerts] = useState(aiBlockScenarios);
  const [resolvedAIAlerts, setResolvedAIAlerts] = useState([]);
  const [currentAIScenario, setCurrentAIScenario] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(aiBlockScenarios[0]); // Initial CCTV block banner alert

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
    // Show AI notification alert shortly after login
    setTimeout(() => {
      setBannerAlert(aiBlockScenarios[0]);
    }, 800);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    window.location.hash = "";
  };

  // AI Integration Handlers
  const handleOpenAISolution = (scenarioOrType) => {
    let target = scenarioOrType;
    if (typeof scenarioOrType === "string") {
      target = activeAIAlerts.find((a) => a.type === scenarioOrType) || aiBlockScenarios.find((a) => a.type === scenarioOrType) || aiBlockScenarios[0];
    }
    setCurrentAIScenario(target);
    setAiModalOpen(true);
    setAiDrawerOpen(false);
    setBannerAlert(null);
  };

  const handleTriggerAISimulation = (type) => {
    const template = aiBlockScenarios.find((a) => a.type === type) || aiBlockScenarios[0];
    const newAlert = {
      ...template,
      id: `AI-BLOCK-${Date.now().toString().slice(-4)}`,
      detectedAt: "Just now"
    };
    setActiveAIAlerts((prev) => [newAlert, ...prev.filter((a) => a.id !== newAlert.id)]);
    setBannerAlert(newAlert);
  };

  const handleApplyAISolutionSuccess = (scenarioId) => {
    const fixed = activeAIAlerts.find((a) => a.id === scenarioId) || currentAIScenario;
    if (fixed) {
      setActiveAIAlerts((prev) => prev.filter((a) => a.id !== scenarioId));
      setResolvedAIAlerts((prev) => [fixed, ...prev]);
    }
  };

  const handleAuthorizeSafetyGate = () => {
    setSafetyGateOpen(false);
    setExecutionOpen(true);
  };

  const handleExecutionComplete = () => {
    setExecutionOpen(false);
    setVerificationOpen(true);
  };

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
            onOpenAISolution={handleOpenAISolution}
            onTriggerSimulation={handleTriggerAISimulation}
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
        return <CCTV onTriggerAISolution={handleOpenAISolution} />;
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
            onOpenAISolution={handleOpenAISolution}
            onTriggerSimulation={handleTriggerAISimulation}
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
          alertCount={activeAIAlerts.length}
          onOpenAlerts={() => setAiDrawerOpen(true)}
          onSimulateBlock={() => handleTriggerAISimulation("API_BLOCK")}
        />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. AI Real-time Block Banner Notification */}
      <AIBannerAlert
        scenario={bannerAlert}
        onOpenSolution={handleOpenAISolution}
        onDismiss={() => setBannerAlert(null)}
      />

      {/* 4. AI Notification & Diagnostics Drawer */}
      <AINotificationDrawer
        open={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        activeAlerts={activeAIAlerts}
        resolvedAlerts={resolvedAIAlerts}
        onSelectAlert={handleOpenAISolution}
        onTriggerSimulation={handleTriggerAISimulation}
        onClearResolved={() => setResolvedAIAlerts([])}
      />

      {/* 5. AI Diagnosis & One-Click Solution Modal */}
      <AINotificationModal
        open={aiModalOpen}
        scenario={currentAIScenario}
        onClose={() => setAiModalOpen(false)}
        onApplySuccess={handleApplyAISolutionSuccess}
      />

      {/* 6. Standard Interactive Modals */}
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
