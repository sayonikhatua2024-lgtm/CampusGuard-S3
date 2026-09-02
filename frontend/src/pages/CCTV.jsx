import React, { useState } from "react";
import { Camera, Eye, Video, ShieldAlert, Signal, Activity, Brain, Sparkles, Wrench, CheckCircle2 } from "lucide-react";
import Card from "../components/ui/Card";
import SectionTitle from "../components/ui/SectionTitle";
import { TagPill, StatusBadge } from "../components/ui/Badges";
import { theme } from "../theme";
import { cctvCameras } from "../data/mockData";

export default function CCTV({ onTriggerAISolution }) {
  const [cameras, setCameras] = useState(cctvCameras);

  const handleFixCamera = (camId) => {
    if (onTriggerAISolution) {
      onTriggerAISolution("CCTV_BLOCK");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono text-white">CCTV Surveillance & Physical Security</h1>
          <p className="text-xs font-mono text-slate-400">High-definition live streams with AI PoE power & stream drop detection</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTriggerAISolution && onTriggerAISolution("CCTV_BLOCK")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all"
          >
            <Brain size={13} />
            <span>Simulate CCTV Stream Block</span>
          </button>
          <TagPill label="4 Camera Feeds" color={theme.cyan} />
        </div>
      </div>

      {/* AI Camera Alert Card */}
      <Card className="p-4 border-amber-500/40" style={{ background: "rgba(255, 140, 66, 0.05)" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <span>AI VISION TELEMETRY: 1 CAMERA STREAM BLOCKED</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">POE FAULT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Camera <strong className="text-slate-200">CAM-PLB-003</strong> at Parking Lot B Gate 3 tripped switch port 12.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleFixCamera("CAM-PLB-003")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono text-slate-950 hover:scale-105 transition-all shadow-md flex-shrink-0"
            style={{ background: "linear-gradient(90deg, #ff8c42, #00d4ff)" }}
          >
            <Sparkles size={13} />
            <span>VIEW AI SOLUTION & AUTO-FIX</span>
          </button>
        </div>
      </Card>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map((cam) => {
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
                  <div className="text-center font-mono text-xs text-rose-400 p-4">
                    <ShieldAlert size={28} className="mx-auto text-rose-500 mb-1.5 animate-pulse" />
                    <div className="font-bold">VIDEO STREAM OFFLINE — POE FAULT</div>
                    <div className="text-[11px] text-slate-500 mt-1">PoE Switch SW-CCTV-02 Port 12 Tripped</div>
                    <button
                      onClick={() => handleFixCamera(cam.id)}
                      className="mt-3 px-3 py-1 rounded-lg text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Wrench size={12} /> Apply AI Recovery
                    </button>
                  </div>
                )}

                {/* Stream Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 font-mono text-[10px] bg-black/70 px-2.5 py-1 rounded backdrop-blur">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                  <span className="text-white font-bold">{cam.id}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 font-mono text-[10px] bg-black/70 px-2.5 py-1 rounded text-cyan-300 backdrop-blur">
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
