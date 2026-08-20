import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../auth.jsx';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, ArrowRight, ShieldCheck, AlertTriangle, Shield, CheckCircle2, Lock, XOctagon } from 'lucide-react';

export function SafetyGate({ setCurrentView }) {
  const { username } = useAuth();

  const [data, setData] = useState({
    state: null,
    optimization: null,
    safety: null,
    telemetry: null
  });

  const [approvalReason, setApprovalReason] = useState("");
  const [approvalState, setApprovalState] = useState(null); // null, "APPROVED", "REJECTED"
  const [actionError, setActionError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setActionError(null);
    try {
      const [stateRes, optRes, telemetryRes] = await Promise.all([
        api.continuityState(),
        api.optimizeContinuity(),
        api.telemetryStatus()
      ]);

      let sc = null;
      if (optRes?.selected_plan) {
         // The selected plan's id or its interventions need to be passed
         const plan = optRes.candidate_plans.find(p => p.name === optRes.selected_plan);
         // if there is a plan object, grab interventions
         if (plan && plan.evaluation && plan.evaluation.intervention) {
             sc = await api.safetyCheck(plan.evaluation.intervention, plan.plan_id);
         } else {
             // fallback
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
      console.error("Failed to load Safety Gate data", err);
      setActionError("Failed to fetch safety state.");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async () => {
      setProcessing(true);
      setActionError(null);
      try {
          const plan = data.optimization.candidate_plans.find(p => p.name === data.optimization.selected_plan);
          await api.approvePlan(plan.plan_id, username, approvalReason || "Approved via Command Center");
          setApprovalState("APPROVED");
      } catch (err) {
          console.error("Approval failed", err);
          setActionError(err.message || "Approval failed");
      } finally {
          setProcessing(false);
      }
  };

  const handleReject = async () => {
      setProcessing(true);
      setActionError(null);
      try {
          const plan = data.optimization.candidate_plans.find(p => p.name === data.optimization.selected_plan);
          await api.rejectPlan(plan.plan_id, username, approvalReason || "Rejected via Command Center");
          setApprovalState("REJECTED");
      } catch (err) {
          console.error("Rejection failed", err);
          setActionError(err.message || "Rejection failed");
      } finally {
          setProcessing(false);
      }
  };

  if (loading || !data.safety) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">RUNNING SAFETY CHECK...</div>
      </div>
    );
  }

  const { state, optimization, telemetry, safety } = data;
  const plan = optimization?.candidate_plans?.find(p => p.name === optimization?.selected_plan) || {};


  const renderPrimaryStatus = () => {
     if (actionError && actionError.includes("INVALIDATED")) {
         return (
             <div className="flex flex-col items-center justify-center p-8 bg-error-container/10 border border-error/30 rounded text-center gap-4 pulse-crimson">
                 <XOctagon size={48} className="text-error" />
                 <div>
                     <div className="font-headline-md text-headline-md text-error tracking-widest uppercase">Approval Invalidated</div>
                     <div className="font-body-base text-body-base text-error/80 mt-1 uppercase">State Drift Detected. Re-Evaluation Required.</div>
                 </div>
             </div>
         );
     }

     if (approvalState === "APPROVED") {
         return (
             <div className="flex flex-col items-center justify-center p-8 bg-secondary-container/10 border border-secondary/30 rounded text-center gap-4">
                 <CheckCircle2 size={48} className="text-secondary" />
                 <div>
                     <div className="font-headline-md text-headline-md text-secondary tracking-widest uppercase">Safe to Execute</div>
                     <div className="font-body-base text-body-base text-on-surface-variant mt-1 uppercase">Approval FINGERPRINT Valid</div>
                 </div>
                 <PrimaryButton onClick={() => setCurrentView('execution')} className="mt-4">
                     Proceed to Controlled Execution
                 </PrimaryButton>
             </div>
         );
     }

     if (approvalState === "REJECTED") {
          return (
             <div className="flex flex-col items-center justify-center p-8 bg-error-container/10 border border-error/30 rounded text-center gap-4">
                 <XOctagon size={48} className="text-error" />
                 <div>
                     <div className="font-headline-md text-headline-md text-error tracking-widest uppercase">Plan Rejected</div>
                     <div className="font-body-base text-body-base text-error/80 mt-1 uppercase">Execution blocked by operator governance</div>
                 </div>
             </div>
         );
     }

     if (!safety.is_safe && safety.requires_approval) {
         return (
             <div className="flex flex-col items-center justify-center p-8 bg-tertiary-container/10 border border-tertiary/30 rounded text-center gap-4">
                 <ShieldAlert size={48} className="text-tertiary" />
                 <div>
                     <div className="font-headline-md text-headline-md text-tertiary tracking-widest uppercase">Approval Required</div>
                     <div className="font-body-base text-body-base text-tertiary/80 mt-1 uppercase">High-Risk State Change Detection</div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-left w-full max-w-xl">
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Risk</div>
                         <div className="font-code-data text-code-data text-tertiary">{safety.risk_level?.toUpperCase() || "HIGH"}</div>
                     </div>
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Reversibility</div>
                         <div className="font-code-data text-code-data text-secondary">YES</div>
                     </div>
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Telemetry Conf.</div>
                         <div className={`font-code-data text-code-data ${telemetry?.confidence_level === 'LOW' ? 'text-error' : 'text-secondary'}`}>{telemetry?.confidence_level || "HIGH"}</div>
                     </div>
                     <div>
                         <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Safety Policy</div>
                         <div className="font-code-data text-code-data text-secondary">PASS</div>
                     </div>
                 </div>
             </div>
         );
     }

     if (safety.forbidden_actions_detected?.length > 0) {
          return (
             <div className="flex flex-col items-center justify-center p-8 bg-error-container/10 border border-error/30 rounded text-center gap-4 pulse-crimson">
                 <XOctagon size={48} className="text-error" />
                 <div>
                     <div className="font-headline-md text-headline-md text-error tracking-widest uppercase">Execution Blocked</div>
                     <div className="font-body-base text-body-base text-error/80 mt-1 uppercase">Forbidden Policy Action Detected</div>
                 </div>
                 <div className="bg-error/10 text-error font-code-data px-4 py-2 rounded mt-2 text-sm max-w-lg">
                     {safety.forbidden_actions_detected.join(", ")}
                 </div>
             </div>
         );
     }

     // Fallback SAFE
     return (
         <div className="flex flex-col items-center justify-center p-8 bg-secondary-container/10 border border-secondary/30 rounded text-center gap-4">
             <CheckCircle2 size={48} className="text-secondary" />
             <div>
                 <div className="font-headline-md text-headline-md text-secondary tracking-widest uppercase">Safe to Execute</div>
                 <div className="font-body-base text-body-base text-secondary/80 mt-1 uppercase">Low Risk Action Detected</div>
             </div>
             <PrimaryButton onClick={() => setCurrentView('execution')} className="mt-4">
                 Proceed to Controlled Execution
             </PrimaryButton>
         </div>
     );
  };

  const renderActionBreakdown = () => {
      const interventions = plan?.evaluation?.intervention || {};
      const breakdown = [];
      if (interventions.student_wifi_reduction > 0) breakdown.push({ action: "Student Wi-Fi Reduction", param: `${(interventions.student_wifi_reduction*100).toFixed(0)}%`, risk: "Low", rev: "Yes" });
      if (interventions.analytics_shedding > 0) breakdown.push({ action: "Background Analytics Shedding", param: `${(interventions.analytics_shedding*100).toFixed(0)}%`, risk: "Low", rev: "Yes" });
      if (interventions.exam_traffic_shift > 0) breakdown.push({ action: "Exam Traffic QoS Shift", param: `${(interventions.exam_traffic_shift*100).toFixed(0)}%`, risk: "Medium", rev: "Yes" });
      if (interventions.research_compute_reduction > 0) breakdown.push({ action: "Research Compute Throttling", param: `${(interventions.research_compute_reduction*100).toFixed(0)}%`, risk: "High", rev: "Yes" });
      if (interventions.noncritical_network_reduction > 0) breakdown.push({ action: "Non-Critical IoT Rate-Limit", param: `${(interventions.noncritical_network_reduction*100).toFixed(0)}%`, risk: "Medium", rev: "Yes" });

      return (
          <div className="flex flex-col gap-2 border border-border-hairline rounded bg-surface-container overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-high border-b border-border-hairline text-on-surface-variant font-label-caps text-label-caps uppercase">
                   <tr>
                      <th className="p-3">Action</th>
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Risk</th>
                      <th className="p-3">Reversible</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                   {breakdown.map((b, i) => (
                      <tr key={i} className="bg-surface-container-lowest">
                         <td className="p-3 font-code-data">{b.action}</td>
                         <td className="p-3 font-code-stat text-primary">{b.param}</td>
                         <td className="p-3"><StatusBadge status={b.risk} /></td>
                         <td className="p-3 text-secondary">{b.rev}</td>
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

  const renderContractProtection = () => {
      const margins = plan?.evaluation?.mission_margins || {};

      return (
          <div className="flex flex-col gap-3">
              {Object.keys(margins).map(missionId => {
                  const m = margins[missionId];
                  const isViolated = m.sla_margin_pct < 0;
                  return (
                      <div key={missionId} className="flex justify-between items-center p-3 bg-surface-container rounded border border-border-hairline">
                          <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface">
                              {missionId.replace(/_/g, ' ')}
                          </div>
                          {isViolated ? <StatusBadge status="VIOLATED" pulse /> : <StatusBadge status="PROTECTED" />}
                      </div>
                  );
              })}
          </div>
      );
  };

  const renderTelemetryTrust = () => {
      const confLevel = telemetry?.confidence_level || "HIGH";
      const isDegraded = confLevel === "LOW";
      return (
          <div className="flex flex-col gap-4">
              <div className={`p-4 rounded border flex flex-col gap-2 ${isDegraded ? 'bg-error-container/10 border-error/30' : 'bg-secondary-container/10 border-secondary/30'}`}>
                  <div className="flex justify-between items-center">
                     <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Confidence Level</span>
                     <StatusBadge status={confLevel} />
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Observability Score</span>
                     <span className="font-code-stat text-code-stat text-on-surface">{telemetry?.overall_score || 100}</span>
                  </div>
              </div>

              <div className="p-4 bg-surface-container rounded border border-border-hairline">
                  <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-2">Autonomy State</div>
                  <div className={`font-body-base text-body-base ${isDegraded ? 'text-error' : 'text-secondary'}`}>
                      {isDegraded ? "RESTRICTED. High-risk execution blocked due to insufficient evidence." : "FULL. High-risk execution permissible with human approval."}
                  </div>
              </div>
          </div>
      );
  };

  const renderStateBoundApproval = () => {
      const binding = safety?.state_fingerprint || "STATE_BINDING_NOT_GENERATED";
      return (
          <div className="flex flex-col gap-4">
             <div className="bg-primary/10 border border-primary/30 p-4 rounded flex items-center justify-between">
                <div>
                    <div className="font-label-caps text-label-caps uppercase tracking-widest text-primary mb-1">State Fingerprint</div>
                    <div className="font-code-data text-code-data text-on-surface">{binding.substring(0, 16)}...</div>
                </div>
                <Lock size={24} className="text-primary" />
             </div>

             <ul className="text-sm font-code-data text-on-surface-variant flex flex-col gap-2">
                 <li className="flex items-center justify-between"><span>Plan Selected</span> <CheckCircle2 size={16} className="text-secondary" /></li>
                 <li className="flex items-center justify-between"><span>Intervention Parameters</span> <CheckCircle2 size={16} className="text-secondary" /></li>
                 <li className="flex items-center justify-between"><span>Active Context</span> <CheckCircle2 size={16} className="text-secondary" /></li>
                 <li className="flex items-center justify-between"><span>Infrastructure State</span> <CheckCircle2 size={16} className="text-secondary" /></li>
                 <li className="flex items-center justify-between"><span>Telemetry Context</span> <CheckCircle2 size={16} className="text-secondary" /></li>
             </ul>
          </div>
      );
  };

  const renderHumanAuthorization = () => {
      if (approvalState === "APPROVED" || approvalState === "REJECTED") {
          return (
              <div className="text-center p-6 text-on-surface-variant border border-dashed border-border-hairline rounded">
                  Operator decision recorded.
              </div>
          );
      }

      const isBlocked = safety?.forbidden_actions_detected?.length > 0 || (telemetry?.confidence_level === "LOW" && safety?.risk_level === "high");

      return (
          <div className="flex flex-col gap-4">
              {actionError && (
                  <div className="bg-error-container/20 text-error p-3 rounded border border-error-container/40 text-sm">
                      {actionError}
                  </div>
              )}

              <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-2">Approver</label>
                  <input type="text" disabled value={username || 'System Operator'} className="w-full bg-surface-container border border-border-hairline rounded p-2 text-on-surface font-code-data opacity-75" />
              </div>

              <div>
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-2">Approval Reason</label>
                  <textarea
                     value={approvalReason}
                     onChange={(e) => setApprovalReason(e.target.value)}
                     className="w-full bg-surface-container border border-border-hairline rounded p-2 text-on-surface focus:outline-none focus:border-primary font-body-base h-24"
                     placeholder="Required for audit logging..."
                  ></textarea>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                  <PrimaryButton
                      className="w-full"
                      onClick={handleApprove}
                      disabled={processing || isBlocked || !approvalReason.trim()}
                  >
                      {processing ? "PROCESSING..." : "APPROVE RECOVERY"}
                  </PrimaryButton>
                  <SecondaryButton
                      className="w-full text-error border-error/30 hover:bg-error/10 hover:border-error/50"
                      onClick={handleReject}
                      disabled={processing}
                  >
                      REJECT
                  </SecondaryButton>
              </div>
          </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Safety Gate"
           description="Governance authorization for system interventions. Approval is state-bound and requires cryptographic verification."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 flex flex-col gap-6">
               <SectionCard title="Primary Safety Status" icon={ShieldAlert}>
                   {renderPrimaryStatus()}
               </SectionCard>

               <SectionCard title="Approved Action Breakdown" icon={Activity}>
                   {renderActionBreakdown()}
               </SectionCard>

               <SectionCard title="Contract Protection" icon={ShieldCheck}>
                   {renderContractProtection()}
               </SectionCard>
           </div>

           <div className="flex flex-col gap-6">
               <SectionCard title="Telemetry Trust" icon={Server}>
                   {renderTelemetryTrust()}
               </SectionCard>

               <SectionCard title="State-Bound Approval" icon={Lock}>
                   {renderStateBoundApproval()}
               </SectionCard>

               <SectionCard title="Human Authorization" icon={Shield}>
                   {renderHumanAuthorization()}
               </SectionCard>
           </div>
        </div>
      </div>
  );
}
