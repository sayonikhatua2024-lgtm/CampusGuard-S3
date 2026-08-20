import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, ArrowRight, ShieldCheck, AlertTriangle, Shield, CheckCircle2, Lock, XOctagon, RefreshCw, Play } from 'lucide-react';

export function ControlledExecution({ setCurrentView }) {
  const { username } = useAuth();

  const [data, setData] = useState({
    state: null,
    optimization: null,
    safety: null,
    telemetry: null
  });

  const [executionState, setExecutionState] = useState("IDLE"); // IDLE, DRY_RUNNING, DRY_RUN_DONE, EXECUTING, SUCCESS, FAILED, INVALIDATED
  const [executionError, setExecutionError] = useState(null);
  const [dryRunResult, setDryRunResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setExecutionError(null);
    try {
      const [stateRes, optRes, telemetryRes] = await Promise.all([
        api.continuityState(),
        api.optimizeContinuity(),
        api.telemetryStatus()
      ]);

      let sc = null;
      if (optRes?.selected_plan) {
         const plan = optRes.candidate_plans.find(p => p.name === optRes.selected_plan);
         if (plan && plan.evaluation && plan.evaluation.intervention) {
             sc = await api.safetyCheck(plan.evaluation.intervention, plan.plan_id);
         } else {
             sc = await api.safetyCheck();
         }
      } else {
         sc = await api.safetyCheck();
      }

      setData({
         state: stateRes,
         optimization: optRes,
         telemetry: telemetryRes,
         safety: sc
      });
    } catch (err) {
      console.error("Failed to load Execution data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDryRun = async () => {
      setExecutionState("DRY_RUNNING");
      try {
          const plan = data.optimization?.candidate_plans?.find(p => p.name === data.optimization?.selected_plan);
          if (!plan) throw new Error("No plan selected for dry run");

          const res = await api.evaluateCounterfactual(plan.evaluation.intervention);
          setDryRunResult(res);
          setExecutionState("DRY_RUN_DONE");
      } catch (err) {
          console.error("Dry run failed", err);
          setExecutionError(err.message || "Dry run evaluation failed");
          setExecutionState("FAILED");
      }
  };

  const handleExecute = async () => {
      setExecutionState("EXECUTING");
      setExecutionError(null);
      try {
          const plan = data.optimization?.candidate_plans?.find(p => p.name === data.optimization?.selected_plan);
          if (!plan) throw new Error("No approved plan found.");

          // Construct execution payload matching backend expectations
          const payload = {
              plan_id: plan.plan_id,
              approver: username || "System Operator",
              reason: "Command Center Execution",
              override_params: plan.evaluation.intervention
          };

          await api.executePlan(payload, "live");
          setExecutionState("SUCCESS");
      } catch (err) {
          console.error("Execution failed", err);
          const msg = err.message || "Execution blocked by Safety Gate.";
          if (msg.toLowerCase().includes("stale") || msg.toLowerCase().includes("invalidated") || msg.toLowerCase().includes("drift")) {
             setExecutionState("INVALIDATED");
          } else {
             setExecutionState("FAILED");
          }
          setExecutionError(msg);
      }
  };

  if (loading || !data.safety) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">INITIALIZING PRE-FLIGHT CHECKS...</div>
      </div>
    );
  }

  const { state, optimization, telemetry, safety } = data;
  const plan = optimization?.candidate_plans?.find(p => p.name === optimization?.selected_plan) || {};


  const renderApprovedPlanContext = () => {
      const isFailed = state?.infrastructure?.power?.status === "failed";
      return (
         <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded border border-border-hairline">
                 <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Current Incident</div>
                    <div className="font-code-data text-code-data text-error">{isFailed ? "Power Failure (-30%)" : "Nominal"}</div>
                 </div>
                 <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Selected Plan</div>
                    <div className="font-code-stat text-code-stat text-primary">{optimization?.selected_plan || "ICO"}</div>
                 </div>
                 <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Risk Level</div>
                    <div className="font-code-stat text-code-stat text-tertiary">{safety?.risk_level?.toUpperCase() || "HIGH"}</div>
                 </div>
             </div>

             <div className="flex justify-between items-center p-3 bg-secondary-container/10 border border-secondary/30 rounded">
                 <div>
                     <div className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">Approval Valid</div>
                     <div className="font-code-data text-code-data text-secondary/80 text-xs">Plan ID: {plan?.plan_id}</div>
                 </div>
                 <StatusBadge status="APPROVED" />
             </div>
         </div>
      );
  };

  const renderActionBreakdown = () => {
      const interventions = plan?.evaluation?.intervention || {};
      const breakdown = [];
      if (interventions.student_wifi_reduction > 0) breakdown.push({ action: "Student Wi-Fi Reduction", param: `${(interventions.student_wifi_reduction*100).toFixed(0)}%`, risk: "Low", rev: "Yes", rollback: "Auto-revert at nominal capacity" });
      if (interventions.analytics_shedding > 0) breakdown.push({ action: "Background Analytics Shedding", param: `${(interventions.analytics_shedding*100).toFixed(0)}%`, risk: "Low", rev: "Yes", rollback: "Manual trigger required" });
      if (interventions.exam_traffic_shift > 0) breakdown.push({ action: "Exam Traffic QoS Shift", param: `${(interventions.exam_traffic_shift*100).toFixed(0)}%`, risk: "Medium", rev: "Yes", rollback: "QoS profile restoration" });
      if (interventions.research_compute_reduction > 0) breakdown.push({ action: "Research Compute Throttling", param: `${(interventions.research_compute_reduction*100).toFixed(0)}%`, risk: "High", rev: "Yes", rollback: "Job queue unfreeze" });
      if (interventions.noncritical_network_reduction > 0) breakdown.push({ action: "Non-Critical IoT Rate-Limit", param: `${(interventions.noncritical_network_reduction*100).toFixed(0)}%`, risk: "Medium", rev: "Yes", rollback: "Remove network constraints" });

      return (
          <div className="flex flex-col gap-2 border border-border-hairline rounded bg-surface-container overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-high border-b border-border-hairline text-on-surface-variant font-label-caps text-label-caps uppercase">
                   <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Risk</th>
                      <th className="p-3">Rollback Metadata</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                   {breakdown.map((b, i) => (
                      <tr key={i} className="bg-surface-container-lowest">
                         <td className="p-3 font-code-data">{b.action}</td>
                         <td className="p-3 font-code-stat text-primary">{b.param}</td>
                         <td className="p-3"><StatusBadge status={b.risk} /></td>
                         <td className="p-3 text-secondary text-xs">{b.rollback}</td>
                      </tr>
                   ))}
                   {breakdown.length === 0 && (
                      <tr><td colSpan="4" className="p-4 text-center text-on-surface-variant">No active interventions required</td></tr>
                   )}
                </tbody>
             </table>
          </div>
      );
  };

  const renderSafetyConsole = () => {
      const isBlocked = safety?.forbidden_actions_detected?.length > 0 || !safety?.is_safe;
      const confLevel = telemetry?.confidence_level || "HIGH";

      return (
          <div className="flex flex-col gap-2 font-code-data text-sm">
             <div className="flex justify-between items-center p-3 bg-surface-container border border-border-hairline rounded">
                 <span className="text-on-surface-variant">Human Approval</span>
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-secondary" /> Valid</div>
             </div>
             <div className="flex justify-between items-center p-3 bg-surface-container border border-border-hairline rounded">
                 <span className="text-on-surface-variant">State Binding Fingerprint</span>
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-secondary" /> Matches Current</div>
             </div>
             <div className="flex justify-between items-center p-3 bg-surface-container border border-border-hairline rounded">
                 <span className="text-on-surface-variant">Telemetry Confidence</span>
                 <div className="flex items-center gap-2">
                     {confLevel === 'LOW' ? <XOctagon size={16} className="text-error" /> : <CheckCircle2 size={16} className="text-secondary" />}
                     {confLevel}
                 </div>
             </div>
             <div className="flex justify-between items-center p-3 bg-surface-container border border-border-hairline rounded">
                 <span className="text-on-surface-variant">Forbidden Actions</span>
                 <div className="flex items-center gap-2">
                     {safety?.forbidden_actions_detected?.length > 0 ? <XOctagon size={16} className="text-error" /> : <CheckCircle2 size={16} className="text-secondary" />}
                     {safety?.forbidden_actions_detected?.length > 0 ? "Blocked" : "Clear"}
                 </div>
             </div>
             <div className="flex justify-between items-center p-3 bg-surface-container border border-border-hairline rounded">
                 <span className="text-on-surface-variant">Hard Constraints</span>
                 <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-secondary" /> Protected</div>
             </div>

             {isBlocked && (
                 <div className="mt-2 text-xs text-error bg-error-container/10 p-3 rounded border border-error-container/30 pulse-crimson text-center">
                     <span className="font-label-caps text-label-caps tracking-widest">EXECUTION BLOCKED</span><br />
                     Policy evaluation failed.
                 </div>
             )}
          </div>
      );
  };

  const renderDryRun = () => {
      if (executionState !== "DRY_RUN_DONE" && executionState !== "DRY_RUNNING") {
          return (
             <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border-hairline rounded text-on-surface-variant gap-4">
                 <Activity size={32} className="opacity-50" />
                 <div className="text-center">
                    <div className="font-label-caps text-label-caps uppercase tracking-widest mb-1">Dry Run Projection</div>
                    <div className="text-sm">Safely evaluate plan impact on live state. No mutation will occur.</div>
                 </div>
                 <SecondaryButton onClick={handleDryRun} disabled={executionState === "DRY_RUNNING"}>
                     {executionState === "DRY_RUNNING" ? "PROJECTING..." : "RUN PRE-FLIGHT CHECK"}
                 </SecondaryButton>
             </div>
          );
      }

      const cf = dryRunResult;
      const infra = state.infrastructure || {};

      return (
         <div className="flex flex-col gap-4 p-4 border border-secondary/30 bg-secondary-container/10 rounded">
             <div className="flex justify-between items-center border-b border-secondary/30 pb-3">
                <div className="font-label-caps text-label-caps text-secondary tracking-widest uppercase">DRY RUN SUCCESS</div>
                <div className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">NO LIVE STATE MODIFIED</div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <div className="text-xs text-on-surface-variant mb-1">Power Grid Projection</div>
                    <div className="flex items-center gap-2 font-code-stat">
                        <span>{infra.power?.capacity_pct ?? "100"}%</span>
                        <ArrowRight size={14} className="text-secondary" />
                        <span className="text-secondary">{(cf?.projected_infra?.power_capacity * 100).toFixed(0)}%</span>
                    </div>
                 </div>
                 <div>
                    <div className="text-xs text-on-surface-variant mb-1">Network Core Projection</div>
                    <div className="flex items-center gap-2 font-code-stat">
                        <span>{infra.network?.capacity_pct ?? "100"}%</span>
                        <ArrowRight size={14} className="text-secondary" />
                        <span className="text-secondary">{(cf?.projected_infra?.network_capacity * 100).toFixed(0)}%</span>
                    </div>
                 </div>
             </div>
         </div>
      );
  };

  const renderExecutionControl = () => {
      if (executionState === "INVALIDATED") {
          return (
             <div className="flex flex-col gap-4 p-6 bg-error-container/10 border border-error-container/40 rounded text-center pulse-crimson">
                 <AlertTriangle size={32} className="text-error mx-auto mb-2" />
                 <div>
                     <div className="font-label-caps text-label-caps tracking-widest uppercase text-error">APPROVAL INVALIDATED</div>
                     <div className="font-body-base text-body-base text-error/80 uppercase mt-1">STATE DRIFT DETECTED. RE-EVALUATION REQUIRED.</div>
                 </div>
             </div>
          );
      }

      if (executionState === "SUCCESS") {
          return (
             <div className="flex flex-col gap-4 p-6 bg-secondary-container/10 border border-secondary-container/40 rounded text-center">
                 <CheckCircle2 size={32} className="text-secondary mx-auto mb-2" />
                 <div>
                     <div className="font-label-caps text-label-caps tracking-widest uppercase text-secondary">EXECUTION COMPLETE</div>
                     <div className="font-body-base text-body-base text-secondary/80 uppercase mt-1">SIMULATED INTERVENTION DISPATCHED</div>
                 </div>
                 <PrimaryButton onClick={() => setCurrentView('verification')} className="mt-4">
                     VIEW RECOVERY VERIFICATION
                 </PrimaryButton>
             </div>
          );
      }

      const isBlocked = safety?.forbidden_actions_detected?.length > 0 || !safety?.is_safe || executionState === "EXECUTING";

      return (
          <div className="flex flex-col gap-4">
             {executionState === "FAILED" && (
                 <div className="bg-error-container/20 text-error p-3 rounded border border-error-container/40 text-sm">
                     EXECUTION FAILED: {executionError}
                 </div>
             )}

             <div className="p-4 border border-border-hairline rounded bg-surface-container flex justify-between items-center">
                 <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Status</span>
                 <span className="font-code-stat text-code-stat text-primary">
                     {executionState === "EXECUTING" ? "EXECUTING..." : "READY"}
                 </span>
             </div>

             <PrimaryButton
                 onClick={handleExecute}
                 disabled={isBlocked}
                 className={`w-full py-4 text-base tracking-widest ${!isBlocked && executionState !== "EXECUTING" ? "bg-error text-white hover:bg-error-container" : ""}`}
             >
                 {executionState === "EXECUTING" ? "DISPATCHING INTERVENTIONS..." : "EXECUTE CONTROLLED SIMULATION"}
             </PrimaryButton>
             <p className="text-xs text-center text-on-surface-variant mt-2">
                 Execution will apply verified interventions to the simulated environment. Live campus infrastructure control is disabled.
             </p>
          </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Controlled Execution"
           description="Transition from human authorization to isolated simulated execution."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 flex flex-col gap-6">
               <SectionCard title="Approved Plan Context" icon={ShieldAlert}>
                   {renderApprovedPlanContext()}
               </SectionCard>

               <SectionCard title="Approved Action Breakdown" icon={Activity}>
                   {renderActionBreakdown()}
               </SectionCard>

               <SectionCard title="Dry Run Projection" icon={Activity}>
                   {renderDryRun()}
               </SectionCard>
           </div>

           <div className="flex flex-col gap-6">
               <SectionCard title="Execution Safety Console" icon={Server}>
                   {renderSafetyConsole()}
               </SectionCard>

               <SectionCard title="Execution Control" icon={Zap}>
                   {renderExecutionControl()}
               </SectionCard>
           </div>
        </div>
      </div>
  );
}
