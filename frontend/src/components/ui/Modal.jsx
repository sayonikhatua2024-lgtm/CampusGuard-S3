import React from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-2xl p-6 shadow-2xl transition-all"
        style={{
          background: "linear-gradient(180deg, #091326 0%, #030814 100%)",
          border: "1px solid rgba(0, 212, 255, 0.25)",
          boxShadow: "0 0 50px rgba(0, 212, 255, 0.15)"
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
