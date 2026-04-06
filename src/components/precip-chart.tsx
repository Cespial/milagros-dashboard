"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit=" mm" />
          <Tooltip
            formatter={(value) => [`${value} mm`, "Precipitacion"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              fontSize: "13px",
            }}
          />
          <Bar
            dataKey="precipitacion"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
