import React from 'react';
import { Shield, LayoutGrid, Zap, ShieldAlert, GitCommit, GitPullRequest, GitMerge, ListChecks, History, BarChart3, Menu, X, Database, LogOut, Thermometer } from 'lucide-react';
import { useAuth } from "../../auth.jsx";

const NAV_ITEMS = [
  { id: 'command-center', label: 'Command Center', icon: LayoutGrid },
  { id: 'continuity-conflict', label: 'Continuity Conflict', icon: GitPullRequest },
  { id: 'counterfactuals', label: 'Counterfactual Playground', icon: GitCommit },
  { id: 'tournament', label: 'Recovery Tournament', icon: GitMerge },
  { id: 'safety-gate', label: 'Safety Gate', icon: ShieldAlert },
  { id: 'execution', label: 'Controlled Execution', icon: Zap },
  { id: 'verification', label: 'Recovery Verification', icon: ListChecks },
  { id: 'telemetry', label: 'Degraded Telemetry', icon: Thermometer },
  { id: 'replay', label: 'Decision Replay', icon: History },
  { id: 'benchmark', label: 'Optimization Benchmark', icon: BarChart3 },
];

export function GlobalHeader({ onMenuToggle }) {
  const { logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-background border-b border-border-hairline flex justify-between items-center px-margin-desktop z-50">
      <div className="flex items-center gap-4 md:gap-8">
        <button className="md:hidden text-on-surface-variant hover:text-primary" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>
        <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
          <Shield size={24} className="text-primary" />
          <span className="hidden sm:inline">CampusGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-3 border-l border-border-hairline pl-8 h-8">
            <span className="font-label-caps text-label-caps text-on-surface-variant tracking-widest uppercase">Institutional Continuity Command Center</span>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 text-on-surface-variant">
            <Database size={16} />
            <span className="font-badge-mono text-badge-mono uppercase">Live Connection</span>
        </div>
        <button
          onClick={logout}
          className="text-on-surface-variant hover:text-primary transition-colors duration-200"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export function SidebarNavigation({ currentView, setCurrentView, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`
        fixed md:relative top-16 left-0 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-border-hairline z-40
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex-1 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-left
                      ${isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
                    <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="p-4 border-t border-border-hairline bg-surface-container-low">
            <div className="font-badge-mono text-badge-mono text-on-surface-variant mb-1">SYSTEM STATE</div>
            <div className="flex items-center gap-2 text-secondary">
                <div className="w-2 h-2 rounded-full bg-secondary pulse-dot"></div>
                <span className="font-label-caps text-label-caps font-bold">ACTIVE</span>
            </div>
        </div>
      </nav>
    </>
  );
}

export function CampusGuardShell({ children, currentView, setCurrentView }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-body-base">
      <GlobalHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex pt-16 h-[100vh]">
        <SidebarNavigation
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-background p-container-padding">
          <div className="max-w-[1600px] mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
