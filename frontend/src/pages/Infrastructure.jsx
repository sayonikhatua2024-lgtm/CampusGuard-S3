import React from "react";
import { Server, Cpu, HardDrive, Wifi, Shield, ArrowUpRight, Activity } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { StatusBadge, TagPill } from "../components/ui/Badges";
import { theme } from "../theme";

export default function Infrastructure() {
  const infraItems = [
    { name: "SW-CORE-01", type: "Core Switch", ip: "10.0.0.1", cpu: 95, mem: 82, temp: "54°C", status: "active", zone: "Datacenter Rack 1" },
    { name: "RTR-BACKUP-01", type: "Edge Router", ip: "10.0.0.2", cpu: 28, mem: 44, temp: "38°C", status: "resolved", zone: "Datacenter Rack 1" },
    { name: "SRV-RACK4-07", type: "Application Server", ip: "10.0.4.7", cpu: 97, mem: 91, temp: "62°C", status: "investigating", zone: "Server Room Rack 4" },
    { name: "PG-CLUSTER-01", type: "PostgreSQL Primary", ip: "10.0.8.10", cpu: 64, mem: 88, temp: "46°C", status: "resolved", zone: "Database Pod A" },
    { name: "SW-CCTV-02", type: "PoE Distribution", ip: "10.0.2.12", cpu: 42, mem: 36, temp: "41°C", status: "investigating", zone: "Security Closet B" },
    { name: "AP-A2-01", type: "Wi-Fi 6 Access Point", ip: "10.0.12.44", cpu: 99, mem: 98, temp: "58°C", status: "active", zone: "Building A — Floor 2" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">Campus Infrastructure Hub</h1>
          <p className="text-xs font-mono text-slate-400">Real-time status of switches, servers, edge routers & access points</p>
        </div>
        <TagPill label="6 Monitored Nodes" color={theme.cyan} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infraItems.map((item, i) => {
          const isCrit = item.cpu > 90;
          return (
            <Card key={i} className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 font-mono">
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: isCrit ? "rgba(255,77,109,0.15)" : "rgba(0,255,136,0.1)" }}
                  >
                    <Server size={16} style={{ color: isCrit ? theme.red : theme.green }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.type}</div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="space-y-2.5 my-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>CPU Utilization</span>
                    <span style={{ color: isCrit ? theme.red : theme.cyan }}>{item.cpu}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.cpu}%`,
                        background: isCrit ? theme.red : theme.cyan
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>Memory Usage</span>
                    <span className="text-purple-400">{item.mem}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.mem}%`, background: theme.purple }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-400">
                <span>📍 {item.zone}</span>
                <span className="text-slate-300 font-bold">{item.temp}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
