/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#08090c",
          900: "#0d0f14",
          850: "#12151c",
          800: "#171b24",
          700: "#232833",
          600: "#333a48",
          500: "#4a5262",
        },
        signal: {
          ok: "#3ddc97",
          warn: "#f5b942",
          crit: "#ff5c5c",
          idle: "#5b6478",
          info: "#5aa9ff",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px -8px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
