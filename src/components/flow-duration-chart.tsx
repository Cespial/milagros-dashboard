"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface FDCPoint {
  exceedance_pct: number;
  caudal_m3s: number;
}

export default function FlowDurationChart({ data }: { data: FDCPoint[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
          <XAxis
            dataKey="exceedance_pct"
            tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }}
            label={{ value: "% tiempo excedido", position: "bottom", offset: -5, fontSize: 11, fill: "#5F5F5B" }}
            unit="%"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }}
            label={{ value: "m³/s", angle: -90, position: "insideLeft", fontSize: 11, fill: "#5F5F5B" }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(2)} m³/s`, "Caudal"]}
            labelFormatter={(label) => `Excedido ${label}% del tiempo`}
            contentStyle={{
              borderRadius: "6px",
              border: "1px solid #E5E5E0",
              fontSize: "12px",
              background: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          />
          <ReferenceLine
            x={95}
            stroke="#C0392B"
            strokeDasharray="3 3"
            label={{ value: "Q95", fill: "#C0392B", fontSize: 10 }}
          />
          <ReferenceLine
            x={50}
            stroke="#5F5F5B"
            strokeDasharray="3 3"
            label={{ value: "Q50", fill: "#5F5F5B", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="caudal_m3s"
            stroke="#1B6B6D"
            strokeWidth={2.5}
            dot={{ fill: "#1B6B6D", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
