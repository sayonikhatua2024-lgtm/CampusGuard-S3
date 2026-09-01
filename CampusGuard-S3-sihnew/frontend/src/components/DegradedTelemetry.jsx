import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, SectionCard, StatusBadge, MetricCard, SectionHeader, PrimaryButton, SecondaryButton } from './ui';
import { ShieldAlert, Activity, Server, Zap, ShieldCheck, AlertTriangle, Shield, CheckCircle2, Lock, XOctagon, Radio } from 'lucide-react';

export function DegradedTelemetry() {
  const [data, setData] = useState({
    telemetry: null
  });

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const tStatus = await api.telemetryStatus();
      setData({
         telemetry: tStatus
      });
    } catch (err) {
      console.error("Failed to load Telemetry data", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSimulateLoss = async (sourceId) => {
      setProcessing(true);
      try {
          await api.telemetryDegrade(sourceId, false);
          const tStatus = await api.telemetryStatus();
          setData({ telemetry: tStatus });
      } catch (err) {
          console.error("Failed to simulate telemetry loss", err);
      } finally {
          setProcessing(false);
      }
  };

  const handleRestore = async () => {
      setProcessing(true);
      try {
          await api.telemetryReset();
          const tStatus = await api.telemetryStatus();
          setData({ telemetry: tStatus });
      } catch (err) {
          console.error("Failed to restore telemetry", err);
      } finally {
          setProcessing(false);
      }
  };

  if (loading || !data.telemetry) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="pulse-dot text-primary">SYNCING TELEMETRY STATE...</div>
      </div>
    );
  }

  const { telemetry } = data;
  const confLevel = telemetry.confidence_level || "HIGH";
  const isDegraded = confLevel === "LOW" || confLevel === "MEDIUM";
  const score = telemetry.overall_score || 100;


  const renderObservabilityState = () => {
      const { confidence_level, overall_score } = telemetry;
      const isRestricted = confidence_level === "LOW";

      return (
          <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-6 rounded border flex flex-col gap-2 justify-center text-center ${isRestricted ? 'bg-error-container/10 border-error/30' : (confidence_level === 'MEDIUM' ? 'bg-tertiary-container/10 border-tertiary/30' : 'bg-secondary-container/10 border-secondary/30')}`}>
                      <div className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">Observability Score</div>
                      <div className={`font-headline-md text-headline-md ${isRestricted ? 'text-error' : (confidence_level === 'MEDIUM' ? 'text-tertiary' : 'text-secondary')}`}>{overall_score} / 100</div>
                  </div>
                  <div className="p-6 bg-surface-container rounded border border-border-hairline flex flex-col gap-2 justify-center text-center">
                      <div className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest">Confidence Level</div>
                      <div className="font-code-stat text-code-stat text-on-surface">{confidence_level}</div>
                  </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded border border-border-hairline flex flex-col items-center justify-center text-center">
                  <div className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-widest mb-1">Autonomy Level</div>
                  <div className={`font-headline-sm text-headline-sm uppercase ${isRestricted ? 'text-error pulse-crimson' : 'text-secondary'}`}>
                      {isRestricted ? "RESTRICTED / BLOCKED" : "GOVERNED"}
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
                      {isRestricted
                          ? "LESS EVIDENCE → LESS AUTONOMY. High-risk actions are blocked due to insufficient telemetry verification."
                          : "CampusGuard is operating with sufficient diagnostic evidence to safely recommend interventions."}
                  </p>
              </div>

              {isRestricted && (
                  <div className="bg-error/10 border border-error/30 text-error p-3 rounded text-sm text-center">
                      <AlertTriangle size={16} className="inline mr-2 -mt-0.5" />
                      <strong>HIGH-RISK EXECUTION RESTRICTED</strong>
                  </div>
              )}
          </div>
      );
  };

  const renderSourceMatrix = () => {
      const sources = telemetry.sources || [];
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sources.map(s => {
                  const isAvailable = s.status === 'nominal' || s.status === 'available';
                  return (
                      <div key={s.source_id} className={`p-4 rounded border flex flex-col gap-3 ${!isAvailable ? 'bg-surface-container border-border-hairline opacity-75' : 'bg-surface-container-lowest border-border-hairline'}`}>
                          <div className="flex justify-between items-center">
                              <span className="font-label-caps text-label-caps uppercase text-on-surface tracking-widest">{s.source_id.replace(/_/g, ' ')}</span>
                              <StatusBadge status={isAvailable ? 'AVAILABLE' : 'OFFLINE'} pulse={!isAvailable} />
                          </div>

                          <div className="flex justify-between items-center text-xs mt-2 border-t border-border-hairline pt-2">
                             <span className="text-on-surface-variant uppercase font-label-caps">Diagnostic</span>
                             <span className={`font-code-data ${!isAvailable ? 'text-error' : 'text-secondary'}`}>{isAvailable ? 'HIGH CONF.' : 'PARTIAL EVIDENCE'}</span>
                          </div>

                          <SecondaryButton
                              onClick={() => handleSimulateLoss(s.source_id)}
                              disabled={processing || !isAvailable}
                              className="w-full text-[10px] py-1 mt-1"
                          >
                              {isAvailable ? "Simulate Sensor Loss" : "Offline"}
                          </SecondaryButton>
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
      <div className="flex flex-col gap-6 animate-fade-in pb-12">
        <SectionHeader
           title="Degraded Telemetry"
           description="Simulate incomplete observability. CampusGuard becomes more conservative as evidence decreases."
           action={
               <SecondaryButton onClick={handleRestore} disabled={processing}>
                   Restore All Telemetry
               </SecondaryButton>
           }
        />

        <div className="flex flex-col gap-6">
            <SectionCard title="Observability State" icon={Activity}>
                {renderObservabilityState()}
            </SectionCard>

            <SectionCard title="Telemetry Source Matrix" icon={Radio}>
                {renderSourceMatrix()}
            </SectionCard>
        </div>
      </div>
  );
}
