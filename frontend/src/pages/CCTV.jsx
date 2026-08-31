import React from "react";
import { Camera, Eye, Video, ShieldAlert, Signal, Activity } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill, StatusBadge } from "../components/ui/Badges";
import { theme } from "../theme";
import { cctvCameras } from "../data/mockData";

export default function CCTV() {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">CCTV & Physical Surveillance Grid</h1>
          <p className="text-xs font-mono text-slate-400">High-definition live camera streams, PoE diagnostics & perimeter alarms</p>
        </div>
        <TagPill label="4 Camera Arrays" color={theme.cyan} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cctvCameras.map((cam) => {
          const isOnline = cam.status === "online";
          return (
            <Card key={cam.id} className="p-4 overflow-hidden border-slate-800">
              {/* Simulated Camera Feed Window */}
              <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden mb-3 border border-slate-800 flex items-center justify-center">
                {isOnline ? (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    {/* Scanline Animation */}
                    <div className="absolute inset-x-0 h-1 bg-cyan-400/20 blur-sm animate-[scanline_3s_linear_infinite]" />
                    <div className="text-center font-mono text-xs text-slate-500 z-10">
                      <Camera size={24} className="mx-auto text-cyan-400/60 mb-1" />
                      LIVE FEED STREAM: {cam.id}
                    </div>
                  </>
                ) : (
                  <div className="text-center font-mono text-xs text-rose-400">
                    <ShieldAlert size={28} className="mx-auto text-rose-500 mb-1 animate-pulse" />
                    VIDEO STREAM OFFLINE — POE FAULT
                  </div>
                )}

                {/* Stream Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 font-mono text-[10px] bg-black/60 px-2 py-1 rounded backdrop-blur">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                  <span className="text-white">{cam.id}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 font-mono text-[10px] bg-black/60 px-2 py-1 rounded text-cyan-300 backdrop-blur">
                  {cam.res} · {cam.fps} FPS
                </div>
              </div>

              {/* Camera Metadata */}
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="font-bold text-slate-200">{cam.location}</div>
                  <div className="text-[10px] text-slate-500">{cam.zone} · Bitrate: {cam.bitrate}</div>
                </div>
                <StatusBadge status={isOnline ? "resolved" : "active"} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
