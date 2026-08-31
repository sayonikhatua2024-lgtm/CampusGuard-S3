import React from "react";
import { Radio, Thermometer, Flame, Droplets, Zap, Activity } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill } from "../components/ui/Badges";
import Sparkline from "../components/ui/Sparkline";
import { theme } from "../theme";
import { iotSensors } from "../data/mockData";

export default function IoTMonitoring() {
  const iconMap = {
    Thermometer: Thermometer,
    Flame: Flame,
    Droplets: Droplets,
    Zap: Zap
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Campus IoT Environmental Telemetry</h1>
          <p className="text-xs font-mono text-slate-400">Real-time status of thermal, smoke, water leak & power monitoring arrays</p>
        </div>
        <TagPill label="120 Connected Sensors" color={theme.cyan} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {iotSensors.map((s, i) => {
          const Icon = iconMap[s.icon] || Radio;
          return (
            <Card key={i} className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 font-mono">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <TagPill label={s.status.toUpperCase()} color={s.color} />
              </div>

              <div className="font-mono">
                <div className="text-xs text-slate-400">{s.name}</div>
                <div className="text-2xl font-bold text-slate-100 mt-1" style={{ color: s.color }}>
                  {s.value} <span className="text-sm">{s.unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>{s.online} of {s.count} Online</span>
                  <span className="text-cyan-400">{s.trend}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
