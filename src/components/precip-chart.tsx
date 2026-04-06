"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { PrecipitationData } from "@/lib/data";

export default function PrecipChart({ data }: { data: PrecipitationData }) {
  const chartData = data.months.map((month, i) => ({
    month,
    precipitacion: Math.round(data.values[i]),
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }} />
          <YAxis tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }} unit=" mm" />
          <Tooltip
            formatter={(value) => [`${value} mm`, "Precipitacion"]}
            contentStyle={{
              borderRadius: "6px",
              border: "1px solid #E5E5E0",
              fontSize: "12px",
              fontFamily: "var(--font-sans)",
              background: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            }}
          />
          <Bar dataKey="precipitacion" fill="#1B6B6D" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
