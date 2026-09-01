import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, ArrowRight, ShieldCheck, AlertTriangle, Shield, CheckCircle2, Lock, XOctagon, RefreshCw, Play, History, ListChecks } from 'lucide-react';

export function DecisionReplay() {
  const [data, setData] = useState({
    replay: null,
    provenance: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [replayRes, provRes] = await Promise.all([
        api.continuityReplay(50),
        api.decisionProvenance()
      ]);
      setData({
         replay: replayRes,
         provenance: provRes
      });
    } catch (err) {
      console.error("Failed to load Replay data", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">RECONSTRUCTING FORENSIC TIMELINE...</div>
      </div>
    );
  }

  const { replay, provenance } = data;


  const renderForensicTimeline = () => {
      const events = replay || [];
      return (
         <div className="flex flex-col gap-0 border-l-2 border-border-hairline ml-3">
             {events.map((e, idx) => {
                 let bgColor = 'bg-surface-container';
                 let textColor = 'text-on-surface-variant';
                 if (e.event_type.includes('ANOMALY') || e.event_type.includes('IMPACT')) { bgColor = 'bg-error-container/10 border-error/20'; textColor = 'text-error'; }
                 if (e.event_type.includes('VERIFIED')) { bgColor = 'bg-secondary-container/10 border-secondary/20'; textColor = 'text-secondary'; }
                 if (e.event_type.includes('APPROVED')) { bgColor = 'bg-primary-container/10 border-primary/20'; textColor = 'text-primary'; }

                 return (
                     <div key={idx} className="relative pl-6 pb-4">
                         <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-background ${bgColor.split(' ')[0].replace('/10', '')}`} />
                         <div className={`p-3 rounded border border-border-hairline ${bgColor}`}>
                             <div className="flex justify-between items-start mb-1">
                                 <span className={`font-label-caps text-label-caps uppercase ${textColor}`}>{e.event_type.replace(/_/g, ' ')}</span>
                                 <span className="font-code-data text-[10px] text-on-surface-variant">{new Date(e.timestamp).toISOString().split('T')[1].replace('Z', '')}</span>
                             </div>
                             <div className="font-body-base text-xs text-on-surface">{e.description}</div>
                         </div>
                     </div>
                 );
             })}
         </div>
      );
  };

  const renderProvenance = () => {
      if (!provenance) return <div className="p-4 text-center text-on-surface-variant">No provenance generated yet.</div>;

      const details = provenance.decision_details || {};
      const { incident, objective, optimization, constraints } = details;
      const { selected_plan, rejected_plans } = optimization || {};
      const bind = provenance.approval?.state_fingerprint || "UNBOUND";

      return (
         <div className="flex flex-col gap-4">
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-surface-container-low p-4 rounded border border-border-hairline">
                     <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-1">Optimization Objective</div>
                     <div className="font-code-data text-xs text-on-surface">{objective}</div>
                 </div>
                 <div className="bg-surface-container-low p-4 rounded border border-border-hairline">
                     <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-1">State Binding Fingerprint</div>
                     <div className="font-code-data text-xs text-primary">{bind.substring(0, 16)}...</div>
                 </div>
             </div>

             <div className="bg-surface-container p-4 rounded border border-border-hairline">
                  <div className="font-label-caps text-label-caps uppercase tracking-widest text-primary mb-2">SELECTED PATH</div>
                  <div className="flex justify-between items-center bg-primary-container/10 border border-primary/20 p-2 rounded">
                      <span className="font-headline-sm text-sm text-primary">{selected_plan?.name}</span>
                      <StatusBadge status="SELECTED" />
                  </div>
                  <div className="mt-2 text-xs text-on-surface-variant">Reason: Lowest feasible intervention cost minimizing collateral degradation.</div>
             </div>

             <div className="bg-surface-container-lowest p-4 rounded border border-border-hairline">
                  <div className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mb-2">ALTERNATIVE / REJECTED PATHS</div>
                  <div className="flex flex-col gap-2">
                      {rejected_plans?.slice(0, 3).map((p, idx) => (
                          <div key={idx} className="flex flex-col gap-1 border-b border-border-hairline pb-2 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-on-surface">{p.name}</span>
                                  <span className="text-[10px] text-error px-1 bg-error-container/10 border border-error/30 rounded uppercase">Rejected</span>
                              </div>
                              <span className="text-[10px] text-on-surface-variant">{p.reason}</span>
                          </div>
                      ))}
                  </div>
             </div>
         </div>
      );
  };

  const renderPredictedVsActual = () => {
      const verif = provenance?.verification;
      if (!verif) return <div className="p-4 text-center text-on-surface-variant">Execution not yet verified.</div>;

      const isMatched = verif.status === "CONTRACT_SATISFIED";
      return (
          <div className={`p-6 rounded border flex flex-col gap-4 text-center ${isMatched ? 'bg-secondary-container/10 border-secondary/30' : 'bg-error-container/10 border-error/30 pulse-crimson'}`}>
              <div className="font-label-caps text-label-caps tracking-widest uppercase text-on-surface-variant">PREDICTED vs ACTUAL</div>
              <div className="flex justify-center items-center gap-6">
                 <div>
                    <div className="font-code-stat text-lg text-on-surface">PREDICTED</div>
                 </div>
                 <ArrowRight size={24} className={isMatched ? "text-secondary" : "text-error"} />
                 <div>
                    <div className="font-code-stat text-lg text-on-surface">ACTUAL</div>
                 </div>
              </div>
              <div className={`font-headline-sm uppercase ${isMatched ? 'text-secondary' : 'text-error'}`}>
                 {isMatched ? "MATCHED" : "DEVIATED / FAILED"}
              </div>
          </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Incident Replay & Decision Provenance"
           description="Forensic reconstruction of the incident decision chain."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 flex flex-col gap-6">
               <SectionCard title="Decision Provenance" icon={ShieldCheck}>
                   {renderProvenance()}
               </SectionCard>
               <SectionCard title="Predicted vs Actual Evidence" icon={Activity}>
                   {renderPredictedVsActual()}
               </SectionCard>
           </div>

           <div className="flex flex-col gap-6">
               <SectionCard title="Forensic Timeline" icon={History}>
                   {renderForensicTimeline()}
               </SectionCard>
           </div>
        </div>
      </div>
  );
}
