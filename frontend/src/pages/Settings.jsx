import React from "react";
import { Settings, Shield, Bell, Lock, User, Key, Sliders } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill } from "../components/ui/Badges";
import { theme } from "../theme";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">System Settings & Policies</h1>
          <p className="text-xs font-mono text-slate-400">Institutional thresholds, AI confidence gating & user permissions</p>
        </div>
        <TagPill label="Admin Mode" color={theme.green} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Safety Gate Settings */}
        <Card className="p-5 space-y-4">
          <SectionTitle accent={theme.green}>Safety Gate & Human-in-the-Loop</SectionTitle>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">Require Human Approval for Critical</div>
                <div className="text-[11px] text-slate-500">Prevent autonomous mitigation on core infrastructure</div>
              </div>
              <input type="checkbox" defaultChecked className="accent-cyan-400 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">AI Confidence Minimum Threshold</div>
                <div className="text-[11px] text-slate-500">Do not execute unless confidence &gt;= 90%</div>
              </div>
              <span className="text-cyan-400 font-bold">90.0%</span>
            </div>
          </div>
        </Card>

        {/* Telemetry & Notification Settings */}
        <Card className="p-5 space-y-4">
          <SectionTitle accent={theme.cyan}>Telemetry & Alert Hooks</SectionTitle>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">SNMP Polling Frequency</div>
                <div className="text-[11px] text-slate-500">Query access points and core switches</div>
              </div>
              <span className="text-slate-200 font-bold">Every 5s</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-bold text-slate-200">Webhook PagerDuty Integration</div>
                <div className="text-[11px] text-slate-500">Send critical alerts to SOC team</div>
              </div>
              <span className="text-emerald-400 font-bold">CONNECTED</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
