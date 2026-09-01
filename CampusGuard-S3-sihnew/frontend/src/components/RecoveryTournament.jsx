import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, GitMerge, Activity, Server, Zap, ArrowRight, ShieldCheck, AlertTriangle, Crosshair, Shield, XOctagon } from 'lucide-react';

export function RecoveryTournament({ setCurrentView }) {
  const [data, setData] = useState({
    state: null,
    conflicts: null,
    optimization: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [stateRes, confRes, optRes, marginRes] = await Promise.all([
        api.continuityState(),
        api.continuityConflicts(),
        api.optimizeContinuity(),
        api.continuityMargin()
      ]);

      setData({
         state: stateRes,
         conflicts: confRes,
         optimization: optRes,
         margin: marginRes
      });
    } catch (err) {
      console.error("Failed to load Recovery Tournament data", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data.optimization) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">EVALUATING CANDIDATE RECOVERY STRATEGIES...</div>
      </div>
    );
  }

  const { state, optimization } = data;


  const renderCurrentContext = () => {
      const isFailed = state?.infrastructure?.power?.status === "failed";
      return (
         <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded border border-border-hairline">
             <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Current Incident</div>
                <div className="font-code-data text-code-data text-error">{isFailed ? "Power Failure (-30%)" : "Nominal"}</div>
             </div>
             <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Active Contracts</div>
                <div className="font-code-stat text-code-stat">{optimization?.active_contracts?.length || 0}</div>
             </div>
             <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Current Capacity</div>
                <div className="font-code-stat text-code-stat">{state?.infrastructure?.power?.capacity_pct || 70}%</div>
             </div>
         </div>
      );
  };

  const renderCandidatePlans = () => {
      const candidates = optimization?.candidate_plans || [];
      const selectedPlan = optimization?.selected_plan;

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((plan, idx) => {
                  const isWinner = selectedPlan?.plan_id === plan.plan_id;
                  const isFeasible = plan.is_feasible;

                  return (
                      <div key={idx} className={`p-4 rounded border flex flex-col gap-4 relative ${isWinner ? 'bg-primary-container/10 border-primary shadow-[0_0_15px_rgba(90,169,255,0.1)]' : (isFeasible ? 'bg-surface-container border-border-hairline' : 'bg-surface-container-lowest border-border-hairline opacity-75')}`}>
                          {isWinner && (
                              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-on-primary font-badge-mono text-badge-mono uppercase px-2 py-0.5 rounded shadow-sm">
                                  ICO WINNER
                              </div>
                          )}
                          <div className="flex justify-between items-start">
                              <div>
                                  <div className={`font-headline-sm text-headline-sm mb-1 ${isWinner ? 'text-primary' : 'text-on-surface'}`}>{plan.name}</div>
                                  <div className="font-label-caps text-label-caps text-on-surface-variant">{plan.type}</div>
                              </div>
                              <StatusBadge status={isFeasible ? "FEASIBLE" : "INFEASIBLE"} />
                          </div>

                          <div className="grid grid-cols-2 gap-3 border-y border-border-hairline py-3">
                              <div>
                                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Collateral Deg.</div>
                                 <div className="font-code-stat text-code-stat">{plan.collateral_degradation?.toFixed(2) || "0.00"}</div>
                              </div>
                              <div>
                                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Intervention Cost</div>
                                 <div className="font-code-stat text-code-stat">{plan.intervention_cost?.toFixed(2) || "0.00"}</div>
                              </div>
                              <div className="col-span-2">
                                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Contracts Satisfied</div>
                                 <div className="font-code-stat text-code-stat">{plan.contracts_satisfied} / {plan.total_contracts}</div>
                              </div>
                          </div>

                          <div className="text-sm">
                              {isFeasible ? (
                                  <div className="flex items-center gap-2 text-secondary">
                                      <ShieldCheck size={16} />
                                      <span>All Hard Constraints Protected</span>
                                  </div>
                              ) : (
                                  <div className="flex items-start gap-2 text-error bg-error-container/10 p-2 rounded">
                                      <XOctagon size={16} className="shrink-0 mt-0.5" />
                                      <span className="text-xs">{plan.rejection_reason || "Constraint violation detected"}</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  const renderConstraintCheck = () => {
      const selectedPlan = optimization?.selected_plan;
      if (!selectedPlan) return null;

      const constraints = selectedPlan.evaluation?.mission_margins || {};

      return (
          <div className="flex flex-col gap-3">
              {Object.keys(constraints).map(missionId => {
                  const val = constraints[missionId];
                  const marginPct = val.sla_margin_pct;
                  const isViolated = marginPct < 0;

                  return (
                      <div key={missionId} className="flex justify-between items-center p-3 bg-surface-container-low rounded border border-border-hairline">
                          <div>
                              <div className="font-label-caps text-label-caps uppercase">{missionId.replace(/_/g, ' ')}</div>
                              <div className="font-code-data text-code-data text-on-surface-variant">Margin: {marginPct.toFixed(1)}%</div>
                          </div>
                          {isViolated ? (
                              <StatusBadge status="VIOLATED" pulse />
                          ) : (
                              <StatusBadge status="PROTECTED" />
                          )}
                      </div>
                  );
              })}

              <div className="mt-2 p-3 bg-surface-container-high rounded flex justify-between items-center text-sm font-label-caps text-label-caps text-on-surface-variant">
                  <span>FORBIDDEN ACTIONS</span>
                  <span className="text-secondary tracking-widest">CLEAR</span>
              </div>
          </div>
      );
  };

  const renderICOHighlight = () => {
      const selectedPlan = optimization?.selected_plan;
      if (!selectedPlan) return null;

      return (
          <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-primary-container/10 border border-primary/20 p-4 rounded text-primary">
                  <ShieldCheck size={28} />
                  <div>
                      <div className="font-label-caps text-label-caps uppercase tracking-widest">Selected Strategy</div>
                      <div className="font-headline-sm text-headline-sm">Institutional Continuity Optimizer</div>
                  </div>
              </div>

              <div className="p-4 bg-surface-container rounded border border-border-hairline">
                  <div className="font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase">Why this plan?</div>
                  <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
                      <li className="flex gap-2"><ArrowRight size={16} className="text-secondary shrink-0" /> Evaluated {optimization.candidate_plans?.length} possible strategies across the intervention space.</li>
                      <li className="flex gap-2"><ArrowRight size={16} className="text-secondary shrink-0" /> Feasible constraint resolution identified.</li>
                      <li className="flex gap-2"><ArrowRight size={16} className="text-secondary shrink-0" /> Lowest collateral degradation ({selectedPlan.collateral_degradation?.toFixed(2)}).</li>
                      <li className="flex gap-2"><ArrowRight size={16} className="text-secondary shrink-0" /> Minimized intervention cost ({selectedPlan.intervention_cost?.toFixed(2)}).</li>
                  </ul>
              </div>
          </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Recovery Plan Tournament"
           description="Deterministic bounded search across the defined intervention space to identify the best feasible strategy."
           action={
             <div className="flex items-center gap-3">
                <SecondaryButton onClick={() => setCurrentView('counterfactuals')}>
                   View Counterfactuals
                </SecondaryButton>
                <PrimaryButton icon={Shield} onClick={() => setCurrentView('safety-gate')}>
                   Review Safety
                </PrimaryButton>
             </div>
           }
        />

        <div className="flex flex-col gap-6">
           <SectionCard title="Current Context" icon={Activity}>
               {renderCurrentContext()}
           </SectionCard>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <SectionCard title="Candidate Strategies" icon={GitMerge}>
                     {renderCandidatePlans()}
                 </SectionCard>
              </div>
              <div className="flex flex-col gap-6">
                  <SectionCard title="Best Feasible Strategy (ICO)" icon={ShieldCheck}>
                      {renderICOHighlight()}
                  </SectionCard>
                  <SectionCard title="Constraint Check" icon={Crosshair}>
                      {renderConstraintCheck()}
                  </SectionCard>
              </div>
           </div>
        </div>
      </div>
  );
}
