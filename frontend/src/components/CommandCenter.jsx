import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, Wind, Network, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export function CommandCenter() {
  const [data, setData] = useState({
    state: null,
    impact: null,
    contracts: null,
    margin: null,
    telemetry: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [state, impact, contracts, margin, telemetry] = await Promise.all([
          api.continuityState(),
          api.continuityImpact(),
          api.continuityContractsStatus(),
          api.continuityMargin(),
          api.telemetryStatus()
        ]);

        setData({ state, impact, contracts, margin, telemetry });
      } catch (err) {
        console.error("Failed to load Command Center data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data.state) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">SYNCING TELEMETRY...</div>
      </div>
    );
  }

  const { state, impact, contracts, margin, telemetry } = data;
  const isFailed = state.infrastructure?.power?.status === "failed" || state.infrastructure?.network?.status === "failed";

  // Incident Banner
  const renderIncidentBanner = () => {
    if (!isFailed) {
      return (
        <Card className="bg-secondary-container/10 border-secondary-container/30 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <ShieldCheck className="text-secondary" size={24} />
             <div>
                <div className="font-headline-sm text-headline-sm text-secondary uppercase tracking-widest">System Nominal</div>
                <div className="font-body-base text-body-base text-on-surface-variant">All infrastructure and mission parameters within operating tolerances.</div>
             </div>
          </div>
          <StatusBadge status="SAFE" pulse={false} />
        </Card>
      );
    }

    // Simplistic extraction of failure
    let failedInfra = "INFRASTRUCTURE";
    if (state.infrastructure?.power?.status === "failed") failedInfra = "POWER";
    else if (state.infrastructure?.network?.status === "failed") failedInfra = "NETWORK";
    else if (state.infrastructure?.hvac?.status === "failed") failedInfra = "HVAC";

    return (
      <Card className="bg-error-container/10 border-error-container/30 flex items-center justify-between mb-6 pulse-crimson">
        <div className="flex items-center gap-3">
            <AlertTriangle className="text-error" size={24} />
            <div>
              <div className="font-headline-sm text-headline-sm text-error uppercase tracking-widest">{failedInfra} DEGRADATION DETECTED</div>
              <div className="font-body-base text-body-base text-error/80 mt-1">
                Root cause analysis active. Evaluating collateral mission impact.
              </div>
            </div>
        </div>
        <StatusBadge status="CRITICAL" pulse={true} />
      </Card>
    );
  };

  // Telemetry row
  const renderTelemetryCards = () => {
    const infra = state.infrastructure || {};

    const getStatusInfo = (status) => {
        if (status === 'failed' || status === 'critical') return { status: 'critical' };
        if (status === 'degraded' || status === 'warning') return { status: 'warning' };
        return { status: 'safe' };
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <MetricCard
            label="Power Grid"
            value={infra.power?.capacity_pct ?? "100"}
            unit="%"
            status={getStatusInfo(infra.power?.status).status}
         />
         <MetricCard
            label="Core Network"
            value={infra.network?.capacity_pct ?? "100"}
            unit="%"
            status={getStatusInfo(infra.network?.status).status}
         />
         <MetricCard
            label="Cooling / HVAC"
            value={infra.hvac?.capacity_pct ?? "100"}
            unit="%"
            status={getStatusInfo(infra.hvac?.status).status}
         />
         <MetricCard
            label="Observability"
            value={telemetry?.overall_score ?? "100"}
            unit="/ 100"
            status={telemetry?.overall_score < 70 ? 'warning' : 'safe'}
            trendLabel="Confidence Level"
            trend={telemetry?.confidence_level ?? "HIGH"}
         />
      </div>
    );
  };

  // Dependency mapping
  const renderDependencyImpact = () => {
    const directImpacts = impact?.propagated_impacts || [];

    if (directImpacts.length === 0) {
        return (
            <div className="text-center py-12 text-on-surface-variant font-label-caps text-label-caps border border-dashed border-border-hairline rounded">
                No active cascading impact detected
            </div>
        );
    }

    return (
      <div className="flex flex-col gap-3">
         {directImpacts.map((imp, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-surface-container-low rounded border border-border-hairline">
               <div className="w-1/3">
                  <div className="font-badge-mono text-badge-mono text-error mb-1 uppercase">Source Failure</div>
                  <div className="font-label-caps text-label-caps">{imp.source_entity}</div>
               </div>
               <ChevronRight className="text-on-surface-variant" size={20} />
               <div className="flex-1">
                  <div className="font-badge-mono text-badge-mono text-tertiary mb-1 uppercase">Affected Mission</div>
                  <div className="font-label-caps text-label-caps">{imp.target_mission}</div>
               </div>
               <div className="text-right">
                  <div className="font-badge-mono text-badge-mono text-on-surface-variant mb-1 uppercase">Degradation</div>
                  <div className="font-code-stat text-code-stat text-error">-{imp.degradation_factor * 100}%</div>
               </div>
            </div>
         ))}
      </div>
    );
  };

  // Contracts
  const renderContracts = () => {
    const items = contracts?.contracts || [];

    return (
      <div className="flex flex-col gap-3">
        {items.map(c => {
           let badge = <StatusBadge status="SATISFIED" />;
           if (c.status === "violated") badge = <StatusBadge status="VIOLATED" pulse />;
           else if (c.status === "at_risk") badge = <StatusBadge status="AT RISK" pulse />;

           return (
             <div key={c.contract_id} className="p-3 bg-surface-container-low rounded border border-border-hairline flex justify-between items-center">
                <div>
                   <div className="font-label-caps text-label-caps mb-1">{c.contract_id.replace(/_/g, ' ')}</div>
                   <div className="font-code-data text-code-data text-on-surface-variant">Priority: {c.priority_level}</div>
                </div>
                <div>{badge}</div>
             </div>
           );
        })}
      </div>
    );
  };

  // Recommendation Box
  const renderRecommendation = () => {
      if (!isFailed) {
          return (
             <Card elevated className="bg-primary/5 border-primary/20 text-center py-8">
                 <ShieldCheck className="text-primary mx-auto mb-3" size={32} />
                 <div className="font-label-caps text-label-caps text-primary tracking-widest uppercase">System Secure</div>
                 <div className="font-body-base text-body-base text-on-surface-variant mt-2">No intervention required. Optimizer is idle.</div>
             </Card>
          );
      }

      return (
         <Card elevated className="bg-surface-container border-outline-variant">
            <div className="flex items-center gap-2 mb-4 text-primary">
               <Activity size={18} />
               <span className="font-label-caps text-label-caps uppercase tracking-widest">CampusGuard Recommended Action</span>
            </div>

            <div className="mb-6">
                <div className="font-headline-sm text-headline-sm mb-2">Execute Contract-Aware Shedding</div>
                <div className="font-body-base text-body-base text-on-surface-variant">
                    Optimizer has identified an intervention strategy that preserves critical {impact?.propagated_impacts?.[0]?.target_mission || "research"} commitments
                    while sacrificing non-essential demand.
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border-hairline pt-4">
                <div className="font-badge-mono text-badge-mono text-on-surface-variant uppercase">Intervention Cost: Minimal</div>
                <PrimaryButton icon={Play} className="text-sm py-1.5 px-3">
                   Review Plan
                </PrimaryButton>
            </div>
         </Card>
      );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <SectionHeader
         title="Command Center"
         description="Real-time campus infrastructure continuity state and automated mission impact assessment."
      />

      {renderIncidentBanner()}
      {renderTelemetryCards()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left col: Impact/Dependencies */}
         <div className="lg:col-span-2 flex flex-col gap-6">
            <SectionCard title="Impact & Dependency Chain" icon={Network}>
                {renderDependencyImpact()}
            </SectionCard>

            <SectionCard title="Active Missions" icon={Activity}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {state?.missions?.map(m => (
                        <div key={m.mission_id} className="p-3 bg-surface-container-lowest rounded border border-border-hairline">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-label-caps text-label-caps">{m.name}</div>
                                {m.status === 'failed' ? <StatusBadge status="FAILED" pulse />
                                   : m.status === 'degraded' ? <StatusBadge status="DEGRADED" pulse />
                                   : <StatusBadge status="VERIFIED" />}
                            </div>
                            <div className="font-code-data text-code-data text-on-surface-variant">SLA Margin: {margin?.mission_margins?.[m.mission_id]?.sla_margin_pct?.toFixed(1) || '0.0'}%</div>
                        </div>
                    ))}
                </div>
            </SectionCard>
         </div>

         {/* Right col: Contracts & Recommendation */}
         <div className="flex flex-col gap-6">
             {renderRecommendation()}

             <SectionCard title="Continuity Contracts" icon={ShieldAlert}>
                 {renderContracts()}
             </SectionCard>
         </div>
      </div>

    </div>
  );
}
