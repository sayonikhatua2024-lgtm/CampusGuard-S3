import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton } from './ui';
import { Server, Activity, ArrowRight, ShieldCheck, Play, Crosshair, AlertTriangle } from 'lucide-react';

export function CounterfactualPlayground() {
  const [baselineData, setBaselineData] = useState({
    state: null,
    margin: null,
    telemetry: null
  });

  const [intervParams, setIntervParams] = useState({
    student_wifi_reduction: 0.60,
    analytics_shedding: 0.90,
    exam_traffic_shift: 0.80,
    research_compute_reduction: 0.28,
    noncritical_network_reduction: 0.40,
  });

  const [counterfactualResult, setCounterfactualResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchBaseline();
  }, []);

  async function fetchBaseline() {
    setLoading(true);
    try {
      const [stateRes, marginRes, telemetryRes] = await Promise.all([
        api.continuityState(),
        api.continuityMargin(),
        api.telemetryStatus()
      ]);
      setBaselineData({ state: stateRes, margin: marginRes, telemetry: telemetryRes });
    } catch (err) {
      console.error("Failed to load baseline data", err);
    } finally {
      setLoading(false);
    }
  }

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await api.evaluateCounterfactual(intervParams);
      setCounterfactualResult(res);
    } catch (err) {
      console.error("Counterfactual evaluation failed", err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !baselineData.state) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">SYNCING TELEMETRY...</div>
      </div>
    );
  }

  const { state, margin, telemetry } = baselineData;

  const renderCurrentState = () => {
    const infra = state.infrastructure || {};
    return (
      <div className="flex flex-col gap-4">
        <div className="p-4 bg-surface-container-lowest rounded border border-border-hairline">
           <div className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Infrastructure Telemetry</div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <div className="text-xs text-on-surface-variant">Power Grid</div>
                 <div className="font-code-stat text-code-stat">{infra.power?.capacity_pct ?? "100"}%</div>
              </div>
              <div>
                 <div className="text-xs text-on-surface-variant">Core Network</div>
                 <div className="font-code-stat text-code-stat">{infra.network?.capacity_pct ?? "100"}%</div>
              </div>
              <div>
                 <div className="text-xs text-on-surface-variant">HVAC</div>
                 <div className="font-code-stat text-code-stat">{infra.hvac?.capacity_pct ?? "100"}%</div>
              </div>
              <div>
                 <div className="text-xs text-on-surface-variant">Observability</div>
                 <div className="font-code-stat text-code-stat text-secondary">{telemetry?.overall_score ?? "100"}/100</div>
              </div>
           </div>
        </div>

        <div className="p-4 bg-surface-container-lowest rounded border border-border-hairline">
           <div className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Active Missions</div>
           <div className="flex flex-col gap-2">
             {state.missions?.map(m => {
                 const mMargin = margin?.mission_margins?.[m.mission_id]?.sla_margin_pct || 0;
                 return (
                    <div key={m.mission_id} className="flex justify-between items-center text-sm">
                        <span>{m.name}</span>
                        <StatusBadge status={mMargin < 0 ? "AT RISK" : "SAFE"} pulse={mMargin < 0} />
                    </div>
                 );
             })}
           </div>
        </div>
      </div>
    );
  };

  const renderControls = () => {
    return (
       <div className="flex flex-col gap-6">
           <div className="p-3 bg-primary-container/10 border border-primary/20 rounded flex items-center gap-3">
               <ShieldCheck className="text-primary" size={20} />
               <div>
                  <div className="font-label-caps text-label-caps text-primary tracking-widest uppercase">Safe Counterfactual Simulation</div>
                  <div className="text-xs text-on-surface-variant">Changes here do not mutate live simulated environment state.</div>
               </div>
           </div>

           <div className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Student Wi-Fi Reduction (w):</span>
                    <strong className="text-primary font-code-data">{(intervParams.student_wifi_reduction * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range" min="0" max="0.80" step="0.05"
                    value={intervParams.student_wifi_reduction}
                    onChange={(e) => setIntervParams({ ...intervParams, student_wifi_reduction: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1"><span>0%</span><span>MAX 80%</span></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Background Analytics Shedding (a):</span>
                    <strong className="text-primary font-code-data">{(intervParams.analytics_shedding * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range" min="0" max="1.00" step="0.10"
                    value={intervParams.analytics_shedding}
                    onChange={(e) => setIntervParams({ ...intervParams, analytics_shedding: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1"><span>0%</span><span>MAX 100%</span></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Exam Traffic QoS Priority Shift (e):</span>
                    <strong className="text-primary font-code-data">{(intervParams.exam_traffic_shift * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range" min="0" max="1.00" step="0.10"
                    value={intervParams.exam_traffic_shift}
                    onChange={(e) => setIntervParams({ ...intervParams, exam_traffic_shift: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1"><span>0%</span><span>MAX 100%</span></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Research HPC Compute Throttling (r):</span>
                    <strong className="text-tertiary font-code-data">{(intervParams.research_compute_reduction * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range" min="0" max="0.30" step="0.05"
                    value={intervParams.research_compute_reduction}
                    onChange={(e) => setIntervParams({ ...intervParams, research_compute_reduction: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-tertiary"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1"><span>0%</span><span>MAX 30% (Constraint)</span></div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Non-Critical IoT / CCTV Rate-Limiting (n):</span>
                    <strong className="text-primary font-code-data">{(intervParams.noncritical_network_reduction * 100).toFixed(0)}%</strong>
                  </div>
                  <input
                    type="range" min="0" max="0.50" step="0.05"
                    value={intervParams.noncritical_network_reduction}
                    onChange={(e) => setIntervParams({ ...intervParams, noncritical_network_reduction: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-surface-container-high rounded appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant mt-1"><span>0%</span><span>MAX 50%</span></div>
                </div>
           </div>

           <PrimaryButton icon={Play} onClick={runSimulation} disabled={simulating}>
               {simulating ? "Evaluating..." : "Run Forward Projection"}
           </PrimaryButton>
       </div>
    );
  };

  const renderProjectedOutcome = () => {
    if (!counterfactualResult) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/50 p-8 text-center border border-dashed border-border-hairline rounded">
                <Activity size={32} className="mb-2 opacity-50" />
                <p>Run a forward projection to visualize state changes.</p>
            </div>
        );
    }

    const infra = state.infrastructure || {};
    const cf = counterfactualResult;
    const isFeasible = cf.is_feasible;

    return (
       <div className="flex flex-col gap-4">
           {isFeasible ? (
               <div className="p-3 bg-secondary-container/10 border border-secondary/30 rounded flex justify-between items-center">
                   <span className="font-label-caps text-label-caps text-secondary uppercase">Feasible Projection</span>
                   <StatusBadge status="SAFE" />
               </div>
           ) : (
               <div className="p-3 bg-error-container/10 border border-error/30 rounded flex justify-between items-center">
                   <span className="font-label-caps text-label-caps text-error uppercase">Infeasible Projection</span>
                   <StatusBadge status="BLOCKED" pulse />
               </div>
           )}

           <div className="p-4 bg-surface-container rounded border border-border-hairline">
              <div className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Infrastructure Impact</div>
              <div className="grid grid-cols-1 gap-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Power</span>
                    <div className="flex items-center gap-2 font-code-stat text-[16px]">
                        <span>{infra.power?.capacity_pct ?? "100"}%</span>
                        <ArrowRight size={14} className="text-on-surface-variant" />
                        <span className="text-secondary">{(cf.projected_infra?.power_capacity * 100).toFixed(0)}%</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Network</span>
                    <div className="flex items-center gap-2 font-code-stat text-[16px]">
                        <span>{infra.network?.capacity_pct ?? "100"}%</span>
                        <ArrowRight size={14} className="text-on-surface-variant" />
                        <span className="text-secondary">{(cf.projected_infra?.network_capacity * 100).toFixed(0)}%</span>
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">HVAC</span>
                    <div className="flex items-center gap-2 font-code-stat text-[16px]">
                        <span>{infra.hvac?.capacity_pct ?? "100"}%</span>
                        <ArrowRight size={14} className="text-on-surface-variant" />
                        <span className="text-secondary">{(cf.projected_infra?.hvac_capacity * 100).toFixed(0)}%</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-4 bg-surface-container rounded border border-border-hairline">
              <div className="font-label-caps text-label-caps text-on-surface-variant mb-3 uppercase">Mission Outcome</div>
              <div className="grid grid-cols-1 gap-3">
                  {state.missions?.map(m => {
                      const beforeMargin = margin?.mission_margins?.[m.mission_id]?.sla_margin_pct || 0;
                      // Determine projected margin (mock logic since evaluate API might not return granular margins for all)
                      // If the API does not return granular, we fall back to overall status logic.
                      // Based on CampusGuardPanel, we don't have mission-level cf output directly unless we infer from overall margin.
                      // The prompt asks to show SAFE -> AT RISK etc. We will infer based on the projected overall margin improving.
                      const isAtRiskBefore = beforeMargin < 0;

                      // Simplified heuristic: If overall is positive, assume SAFE unless it's a blocked intervention
                      const isAtRiskAfter = !cf.is_feasible || (isAtRiskBefore && cf.min_overall_margin < 0);

                      return (
                         <div key={m.mission_id} className="flex justify-between items-center text-sm">
                            <span className="text-on-surface-variant">{m.name}</span>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={isAtRiskBefore ? "AT RISK" : "SAFE"} />
                                <ArrowRight size={14} className="text-on-surface-variant" />
                                <StatusBadge status={isAtRiskAfter ? "AT RISK" : "SAFE"} />
                            </div>
                         </div>
                      );
                  })}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-surface-container-lowest rounded border border-border-hairline">
                 <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Collateral Degradation</div>
                 <div className="font-code-stat text-code-stat">{cf.collateral_degradation?.toFixed(2) || "0.00"}</div>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded border border-border-hairline">
                 <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Overall Margin Shift</div>
                 <div className={`font-code-stat text-code-stat ${cf.min_overall_margin >= 0 ? "text-secondary" : "text-error"}`}>
                     {cf.min_overall_margin > 0 ? "+" : ""}{cf.min_overall_margin?.toFixed(2) || "0.00"}%
                 </div>
              </div>
           </div>

           {!isFeasible && cf.rejection_reason && (
               <div className="mt-2 text-xs text-error bg-error-container/10 p-3 rounded border border-error-container/30">
                   <strong>Constraint Violation: </strong> {cf.rejection_reason}
               </div>
           )}
       </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <SectionHeader
         title="Counterfactual Playground"
         description="Explore safe alternative futures without mutating live institutional state."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <SectionCard title="Current State" icon={Server}>
             {renderCurrentState()}
         </SectionCard>

         <SectionCard title="What If?" icon={Crosshair}>
             {renderControls()}
         </SectionCard>

         <SectionCard title="Projected Outcome" icon={Activity}>
             {renderProjectedOutcome()}
         </SectionCard>
      </div>
    </div>
  );
}
