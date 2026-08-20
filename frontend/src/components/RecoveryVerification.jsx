import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, ArrowRight, ShieldCheck, AlertTriangle, Shield, CheckCircle2, Lock, XOctagon, RefreshCw, Play, ListChecks } from 'lucide-react';

export function RecoveryVerification({ setCurrentView }) {
  const [data, setData] = useState({
    execution: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const execRes = await api.latestExecution();
      setData({
         execution: execRes
      });
    } catch (err) {
      console.error("Failed to load Recovery Verification data", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">RETRIEVING VERIFICATION LEDGER...</div>
      </div>
    );
  }

  const exec = data.execution;

  const renderStatusBanner = () => {
     if (!exec) {
         return (
             <div className="flex flex-col items-center justify-center p-8 bg-surface-container-low border border-border-hairline rounded text-center gap-4">
                 <AlertTriangle size={48} className="text-on-surface-variant opacity-50" />
                 <div>
                     <div className="font-headline-md text-headline-md text-on-surface-variant tracking-widest uppercase">No Recent Execution</div>
                     <div className="font-body-base text-body-base text-on-surface-variant/80 mt-1 uppercase">Verification ledger requires execution provenance.</div>
                 </div>
             </div>
         );
     }

     // Determine status safely
     const status = exec.verification_status;

     if (status === "CONTRACT_SATISFIED") {
         return (
             <div className="flex items-center justify-between p-6 bg-secondary-container/10 border border-secondary/30 rounded">
                 <div className="flex items-center gap-4">
                     <CheckCircle2 size={36} className="text-secondary" />
                     <div>
                         <div className="font-headline-md text-headline-md text-secondary tracking-widest uppercase">RECOVERY VERIFIED</div>
                         <div className="font-body-base text-body-base text-secondary/80 mt-1 uppercase">All active continuity contracts are satisfied.</div>
                     </div>
                 </div>
                 <StatusBadge status="SAFE" />
             </div>
         );
     }

     if (status === "CONTRACT_STILL_AT_RISK") {
          return (
             <div className="flex items-center justify-between p-6 bg-tertiary-container/10 border border-tertiary/30 rounded pulse-pulse">
                 <div className="flex items-center gap-4">
                     <AlertTriangle size={36} className="text-tertiary" />
                     <div>
                         <div className="font-headline-md text-headline-md text-tertiary tracking-widest uppercase">RECOVERY PARTIALLY VERIFIED</div>
                         <div className="font-body-base text-body-base text-tertiary/80 mt-1 uppercase">Some continuity contracts remain at risk.</div>
                     </div>
                 </div>
                 <StatusBadge status="AT RISK" pulse />
             </div>
         );
     }

     return (
         <div className="flex items-center justify-between p-6 bg-error-container/10 border border-error/30 rounded pulse-crimson">
             <div className="flex items-center gap-4">
                 <XOctagon size={36} className="text-error" />
                 <div>
                     <div className="font-headline-md text-headline-md text-error tracking-widest uppercase">RECOVERY VERIFICATION FAILED</div>
                     <div className="font-body-base text-body-base text-error/80 mt-1 uppercase">Continuity contracts violated. Expected prediction mismatch.</div>
                 </div>
             </div>
             <StatusBadge status="VIOLATED" pulse />
         </div>
     );
  };

  const renderCoreMatrix = () => {
      if (!exec) return null;

      const metrics = exec.verification_comparison || [];
      const contracts = exec.contracts_verification || [];

      const allRows = [...contracts, ...metrics];

      return (
          <div className="flex flex-col gap-2 border border-border-hairline rounded bg-surface-container overflow-hidden">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-container-high border-b border-border-hairline text-on-surface-variant font-label-caps text-label-caps uppercase">
                   <tr>
                      <th className="p-3">METRIC / CONTRACT</th>
                      <th className="p-3">REQUIRED SLA</th>
                      <th className="p-3">BEFORE</th>
                      <th className="p-3">PREDICTED</th>
                      <th className="p-3">AFTER</th>
                      <th className="p-3">FINAL MARGIN</th>
                      <th className="p-3">STATUS</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border-hairline">
                   {allRows.map((row, i) => {
                      const isContract = !!row.contract_id;
                      const title = isContract ? row.contract_id.replace(/_/g, ' ') : row.metric;
                      const reqSla = isContract ? `${(row.required_power_pct || 0)}% Power` : 'N/A';
                      const before = row.before_val !== undefined ? `${row.before_val.toFixed(2)}` : 'N/A';
                      const pred = row.predicted_val !== undefined ? `${row.predicted_val.toFixed(2)}` : 'N/A';
                      const after = row.after_val !== undefined ? `${row.after_val.toFixed(2)}` : 'N/A';
                      const margin = row.margin_actual !== undefined ? row.margin_actual : null;
                      const status = isContract ? (row.is_satisfied ? 'PROTECTED' : 'VIOLATED') : (Math.abs(row.delta) > 5 ? 'DEVIATION' : 'VERIFIED');

                      const statusClass = status === 'VIOLATED' || status === 'DEVIATION' ? 'text-error' : (status === 'VERIFIED' ? 'text-secondary' : 'text-primary');

                      return (
                         <tr key={i} className="bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
                            <td className={`p-3 font-code-data ${isContract ? 'text-on-surface' : 'text-on-surface-variant'}`}>{title.toUpperCase()}</td>
                            <td className="p-3 text-on-surface-variant">{reqSla}</td>
                            <td className="p-3 text-on-surface-variant">{before}</td>
                            <td className="p-3 text-on-surface-variant">{pred}</td>
                            <td className="p-3 font-code-stat text-primary">{after}</td>
                            <td className={`p-3 font-code-stat ${margin < 0 ? 'text-error' : 'text-secondary'}`}>
                               {margin !== null ? `${margin > 0 ? '+' : ''}${margin.toFixed(2)}%` : 'N/A'}
                            </td>
                            <td className="p-3"><StatusBadge status={status} pulse={status === 'VIOLATED'} /></td>
                         </tr>
                      );
                   })}
                   {allRows.length === 0 && (
                      <tr><td colSpan="7" className="p-4 text-center text-on-surface-variant">No verification data available</td></tr>
                   )}
                </tbody>
             </table>
          </div>
      );
  };

  const renderSummaryBlock = () => {
      if (!exec) return null;

      const contracts = exec.contracts_verification || [];
      const totalContracts = contracts.length;
      const satisfiedContracts = contracts.filter(c => c.is_satisfied).length;

      // Assume mapping logic for hard constraints and SLA breaches
      // We will parse the contract verification to derive constraints
      const hardConstraintsTotal = contracts.filter(c => c.priority === 1).length;
      const hardConstraintsSatisfied = contracts.filter(c => c.priority === 1 && c.is_satisfied).length;
      const hardSlaBreaches = contracts.filter(c => c.priority === 1 && !c.is_satisfied).length;

      // We look at metric comparisons for prediction drift
      const metrics = exec.verification_comparison || [];
      const predictionsDrift = metrics.filter(m => Math.abs(m.delta) > 5).length;
      const driftState = predictionsDrift > 0 ? "DEVIATION DETECTED" : "ALIGNED";

      const isLoss = hardSlaBreaches > 0;

      return (
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <div className="p-4 bg-surface-container rounded border border-border-hairline">
                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Contracts Verified</div>
                 <div className="font-code-stat text-code-stat text-on-surface">{satisfiedContracts} / {totalContracts}</div>
             </div>

             <div className="p-4 bg-surface-container rounded border border-border-hairline">
                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Hard Constraints</div>
                 <div className="font-code-stat text-code-stat text-on-surface">{hardConstraintsSatisfied} / {hardConstraintsTotal}</div>
             </div>

             <div className={`p-4 rounded border ${isLoss ? 'bg-error-container/10 border-error/30' : 'bg-surface-container border-border-hairline'}`}>
                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Irrecoverable Mission Loss</div>
                 <div className={`font-code-stat text-code-stat ${isLoss ? 'text-error' : 'text-secondary'}`}>{isLoss ? "DETECTED" : "NONE"}</div>
             </div>

             <div className={`p-4 rounded border ${hardSlaBreaches > 0 ? 'bg-error-container/10 border-error/30' : 'bg-surface-container border-border-hairline'}`}>
                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Hard SLA Breaches</div>
                 <div className={`font-code-stat text-code-stat ${hardSlaBreaches > 0 ? 'text-error' : 'text-secondary'}`}>{hardSlaBreaches}</div>
             </div>

             <div className={`p-4 rounded border ${predictionsDrift > 0 ? 'bg-tertiary-container/10 border-tertiary/30' : 'bg-surface-container border-border-hairline'}`}>
                 <div className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Predicted vs Actual</div>
                 <div className={`font-code-data text-code-data mt-1 ${predictionsDrift > 0 ? 'text-tertiary' : 'text-secondary'}`}>{driftState}</div>
             </div>
         </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Recovery Verification"
           description="Authoritative ledger verifying projected outcomes against actual post-execution infrastructure state."
           action={
             <div className="flex items-center gap-3">
                <PrimaryButton icon={Play} onClick={() => setCurrentView('replay')}>
                   View Incident Provenance
                </PrimaryButton>
             </div>
           }
        />

        {renderStatusBanner()}

        {exec && (
            <>
                <SectionCard title="Verification Matrix" icon={ListChecks}>
                    {renderCoreMatrix()}
                </SectionCard>

                <SectionCard title="Post-Action Summary" icon={Activity}>
                    {renderSummaryBlock()}
                </SectionCard>
            </>
        )}
      </div>
  );
}
