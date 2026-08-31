import React from "react";
import { theme } from "../../theme";

export default function Card({ children, className = "", style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-cyan-500/40 hover:scale-[1.008]" : ""
      } ${className}`}
      style={{
        background: "rgba(6, 15, 32, 0.75)",
        border: "1px solid rgba(0, 212, 255, 0.12)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        ...style
      }}
    >
      {children}
    </div>
  );
}
