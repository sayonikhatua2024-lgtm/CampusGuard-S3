import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function MetricChart({ title, data, dataKey, unit, color, anomalyKey = "is_anomaly" }) {
  const formatted = data.map((d) => ({
    ...d,
    t: new Date(d.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
  }));

  return (
    <div className="rounded-xl border border-base-700 bg-base-900/70 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-base-500 font-medium">{title}</span>
        <span className="text-xs font-mono text-base-600">
          {formatted.length ? `${formatted[formatted.length - 1][dataKey]}${unit}` : "—"}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={formatted} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid stroke="#171b24" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis stroke="#4a5262" fontSize={10} width={36} />
          <Tooltip
            contentStyle={{ background: "#12151c", border: "1px solid #232833", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#5b6478" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload, index } = props;
              if (!payload[anomalyKey]) return null;
              return <circle key={`dot-${index}`} cx={cx} cy={cy} r={3} fill="#ff5c5c" stroke="none" />;
            }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
