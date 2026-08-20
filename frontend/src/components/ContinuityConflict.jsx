import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, GitPullRequest, Activity, Crosshair, Scale, Cpu, Zap, ArrowRight, ShieldCheck, AlertTriangle, AlertOctagon, RefreshCw, XOctagon } from 'lucide-react';

export function ContinuityConflict() {
  const [data, setData] = useState({
    state: null,
    conflicts: null,
    margin: null,
    optimization: null,
  });

  const [activeContext, setActiveContext] = useState('context_a'); // "context_a", "context_b", "context_c"
  const [loading, setLoading] = useState(true);

  // Load baseline data on mount
  useEffect(() => {
    fetchData();
  }, [activeContext]);

  async function fetchData() {
    setLoading(true);
    try {
      const [stateRes, marginRes, confRes, ctxRes] = await Promise.all([
        api.continuityState(),
        api.continuityMargin(),
        api.continuityConflicts(),
        api.runContextSwitch() // Getting the benchmark experiment results
      ]);

      let currentOpt = null;
      if (activeContext === 'context_a') currentOpt = ctxRes.scenario_a;
      else if (activeContext === 'context_b') currentOpt = ctxRes.scenario_b;
      else if (activeContext === 'context_c') currentOpt = ctxRes.scenario_c;

      setData({
         state: stateRes,
         margin: marginRes,
         conflicts: confRes,
         optimization: currentOpt,
         contextData: ctxRes
      });

    } catch (err) {
      console.error("Failed to load Continuity Conflict data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleContextSwitch = async (contextKey) => {
    // If the backend has a direct way to mutate active contracts via context, we call it.
    // For now we will just log it and update local state to trigger refetch.
    // Wait, the CampusGuard panel code shows `api.runContextSwitch()` as returning an experiment result, not necessarily mutating state.
    // I will check the API structure in the next step to ensure how to actually mutate context.
    setActiveContext(contextKey);
  };

  if (loading || !data.state) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">ANALYZING CONFLICT STATE...</div>
      </div>
    );
  }

  const { state, conflicts, margin, optimization } = data;


  const renderCapacityVsDemand = () => {
     // Use the existing margin calculation or simple representation.
     const overallMargin = margin?.overall_margin_pct ?? 0;
     const isConflict = overallMargin < 0 || conflicts?.has_conflict;

     return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 justify-between">
                <MetricCard label="Current Power Capacity" value={state?.infrastructure?.power?.capacity_pct || 70} unit="%" />
                <MetricCard label="Protected Demand" value={100 + Math.abs(overallMargin)} unit="%" status={isConflict ? "critical" : "safe"} />
                <MetricCard label="Capacity Shortfall" value={Math.abs(Math.min(0, overallMargin))} unit="%" status={isConflict ? "critical" : "safe"} />
            </div>

            {isConflict && (
                <div className="p-4 bg-error-container/10 border border-error-container/30 rounded flex items-start gap-3">
                    <AlertTriangle className="text-error shrink-0 mt-0.5" size={20} />
                    <div>
                        <div className="font-label-caps text-label-caps text-error mb-1 tracking-widest uppercase">Capacity Envelope Exceeded</div>
                        <div className="font-body-base text-body-base text-error/80">
                            Available infrastructure capacity cannot sustain all protected mission obligations. A resolution strategy must be selected.
                        </div>
                    </div>
                </div>
            )}
        </div>
     );
  };

  const renderMissionConflictMap = () => {
      // Safely fetch missions based on the selected context from the context switch API result
      const activeContracts = optimization?.active_contracts || [];
      const missions = state?.missions || [];

      return (
         <div className="flex flex-col gap-3">
             {missions.map(m => {
                 const isActive = activeContracts.some(c => c.includes(m.name.split(' ')[0].toUpperCase()));
                 const missionMargin = margin?.mission_margins?.[m.mission_id];
                 const isAtRisk = missionMargin?.sla_margin_pct < 0;

                 return (
                    <div key={m.mission_id} className={`p-4 rounded border flex flex-col gap-3 transition-colors ${isActive ? (isAtRisk ? 'bg-error-container/5 border-error-container/30' : 'bg-surface-container border-border-hairline') : 'bg-surface-container-lowest border-border-hairline opacity-50'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-headline-sm text-headline-sm text-on-surface">{m.name}</span>
                                {!isActive && <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">INACTIVE IN CONTEXT</span>}
                            </div>
                            <StatusBadge status={isActive ? (isAtRisk ? "AT RISK" : "PROTECTED") : "IDLE"} pulse={isActive && isAtRisk} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-t border-border-hairline pt-3">
                            <div>
                                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Required SLA</div>
                                <div className="font-code-data text-code-data text-on-surface">{m.required_power_pct}% Power</div>
                            </div>
                            <div>
                                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Hard Constraint</div>
                                <div className="font-code-data text-code-data text-on-surface">{m.priority === 1 ? 'YES (Life Safety)' : 'NO (Degradable)'}</div>
                            </div>
                            <div>
                                <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">SLA Margin</div>
                                <div className={`font-code-stat text-code-stat ${isAtRisk ? 'text-error' : 'text-secondary'}`}>
                                    {missionMargin?.sla_margin_pct?.toFixed(1) || '0.0'}%
                                </div>
                            </div>
                        </div>
                    </div>
                 );
             })}
         </div>
      );
  };

  const renderDecisionHierarchy = () => {
      return (
         <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded border border-border-hairline">
                 <div className="font-code-stat text-code-stat text-on-surface-variant opacity-50">1</div>
                 <div className="font-label-caps text-label-caps">Life Safety & Emergency Comms</div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded border border-border-hairline">
                 <div className="font-code-stat text-code-stat text-on-surface-variant opacity-50">2</div>
                 <div className="font-label-caps text-label-caps">Non-negotiable Continuity Contracts</div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded border border-border-hairline">
                 <div className="font-code-stat text-code-stat text-on-surface-variant opacity-50">3</div>
                 <div className="font-label-caps text-label-caps">Irreversible Mission Loss Minimization</div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded border border-border-hairline">
                 <div className="font-code-stat text-code-stat text-on-surface-variant opacity-50">4</div>
                 <div className="font-label-caps text-label-caps">Collateral Degradation Minimization</div>
             </div>
         </div>
      );
  };

  const renderResolutionJustification = () => {
      if (!optimization) return null;

      const { selected_plan, intervention_cost, collateral_degradation, min_overall_margin, is_feasible } = optimization;

      return (
         <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between p-4 bg-primary-container/10 border border-primary-container/30 rounded">
                 <div>
                     <div className="font-label-caps text-label-caps text-primary mb-1 uppercase tracking-widest">Recommended Plan</div>
                     <div className="font-headline-md text-headline-md text-primary-container">{selected_plan}</div>
                 </div>
                 <StatusBadge status={is_feasible ? 'FEASIBLE' : 'INFEASIBLE'} />
             </div>

             <div className="p-4 bg-surface-container rounded border border-border-hairline">
                 <div className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase tracking-widest">Expected Result</div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Intervention Cost</div>
                         <div className="font-code-stat text-code-stat">{intervention_cost.toFixed(2)}</div>
                     </div>
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Collateral Degradation</div>
                         <div className="font-code-stat text-code-stat">{collateral_degradation.toFixed(2)}</div>
                     </div>
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Overall Margin</div>
                         <div className="font-code-stat text-code-stat">{min_overall_margin > 0 ? '+' : ''}{min_overall_margin.toFixed(2)}%</div>
                     </div>
                 </div>
             </div>
         </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Continuity Conflict"
           description="Determine optimal mission preservation when infrastructure capacity cannot sustain all obligations."
           action={
             <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded border border-border-hairline">
                <button
                  onClick={() => handleContextSwitch('context_a')}
                  className={`px-4 py-1.5 rounded font-label-caps text-label-caps uppercase transition-colors ${activeContext === 'context_a' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Exam + Research + Emerg
                </button>
                <button
                  onClick={() => handleContextSwitch('context_b')}
                  className={`px-4 py-1.5 rounded font-label-caps text-label-caps uppercase transition-colors ${activeContext === 'context_b' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Research + Emerg
                </button>
                <button
                  onClick={() => handleContextSwitch('context_c')}
                  className={`px-4 py-1.5 rounded font-label-caps text-label-caps uppercase transition-colors ${activeContext === 'context_c' ? 'bg-primary/10 text-primary border border-primary/30' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  Emerg Only
                </button>
             </div>
           }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 flex flex-col gap-6">
               <SectionCard title="Capacity vs. Demand Analysis" icon={Activity}>
                   {renderCapacityVsDemand()}
               </SectionCard>
               <SectionCard title="Active Mission Conflict Map" icon={Crosshair}>
                   {renderMissionConflictMap()}
               </SectionCard>
           </div>

           <div className="flex flex-col gap-6">
               <SectionCard title="Decision Hierarchy" icon={Scale}>
                   {renderDecisionHierarchy()}
               </SectionCard>
               <SectionCard title="Selected Resolution Justification" icon={ShieldCheck}>
                   {renderResolutionJustification()}
               </SectionCard>
           </div>
        </div>
      </div>
  );
}
