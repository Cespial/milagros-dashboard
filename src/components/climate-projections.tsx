"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface DecadeRow {
  decade: string;
  temp_mean: number;
  precip_annual: number | null;
}

type ProjectionsData = Record<string, DecadeRow[]>;

// All decades that appear across any model, for a consistent X axis
function collectDecades(data: ProjectionsData): string[] {
  const set = new Set<string>();
  for (const rows of Object.values(data)) {
    for (const row of rows) set.add(row.decade);
  }
  return Array.from(set).sort();
}

// Pivot: one row per decade, one column per model
function buildChartRows(data: ProjectionsData, decades: string[], metric: "temp_mean" | "precip_annual") {
  return decades.map((decade) => {
    const row: Record<string, string | number | null> = { decade };
    for (const [model, rows] of Object.entries(data)) {
      const found = rows.find((r) => r.decade === decade);
      row[model] = found ? found[metric] : null;
    }
    return row;
  });
}

const MODEL_COLORS: Record<string, string> = {
  CMCC_CM2_VHR4:  "#1B6B6D",
  EC_Earth3P_HR:  "#D97706",
  FGOALS_f3_H:    "#8E44AD",
  HiRAM_SIT_HR:   "#C0392B",
  MRI_AGCM3_2_S:  "#27AE60",
  NICAM16_8S:     "#2563EB",
};

type Metric = "temp_mean" | "precip_annual";

export default function ClimateProjections() {
  const [data, setData] = useState<ProjectionsData | null>(null);
  const [metric, setMetric] = useState<Metric>("temp_mean");

  useEffect(() => {
    fetch("/data/cmip6_projections.json")
      .then((r) => r.json())
      .then((d: ProjectionsData) => setData(d))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <section className="py-16 px-6 md:px-10 max-w-6xl mx-auto">
        <div className="h-64 flex items-center justify-center">
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-[0.15em]">
            CARGANDO PROYECCIONES...
          </p>
        </div>
      </section>
    );
  }

  const models = Object.keys(data);
  const decades = collectDecades(data);
  const chartRows = buildChartRows(data, decades, metric);

  const isTemp = metric === "temp_mean";
  const yUnit = isTemp ? " °C" : " mm";
  const yLabel = isTemp ? "Temperatura media (°C)" : "Precipitacion anual (mm)";

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-[#1B6B6D] tracking-[0.25em] uppercase mb-2">
            Clima Futuro
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
            Proyecciones Climaticas CMIP6 (2025–2100)
          </h2>
          <p className="mt-2 text-sm text-muted font-[family-name:var(--font-sans)] max-w-2xl leading-relaxed">
            Promedios decadales de temperatura y precipitacion proyectados por 6 modelos de alta resolucion
            para la cuenca de San Pedro de los Milagros bajo escenarios SSP.
          </p>
        </div>

        {/* Metric toggle */}
        <div className="flex gap-2 mb-6">
          {(["temp_mean", "precip_annual"] as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] uppercase px-4 py-2 rounded border transition-all duration-200 ${
                metric === m
                  ? "bg-[#1B6B6D] text-white border-[#1B6B6D]"
                  : "bg-transparent text-muted border-border hover:border-[#1B6B6D] hover:text-[#1B6B6D]"
              }`}
            >
              {m === "temp_mean" ? "Temperatura" : "Precipitacion"}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartRows} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E0" />
              <XAxis
                dataKey="decade"
                tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                unit={yUnit}
                tick={{ fontSize: 11, fill: "#5F5F5B", fontFamily: "var(--font-mono)" }}
                width={72}
              />
              <Tooltip
                formatter={(value, name) => [
                  value != null ? `${value}${yUnit}` : "—",
                  String(name).replace(/_/g, "-"),
                ]}
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #E5E5E0",
                  fontSize: "12px",
                  fontFamily: "var(--font-sans)",
                  background: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  paddingTop: "12px",
                }}
                formatter={(value) => value.replace(/_/g, "-")}
              />
              {models.map((model) => (
                <Line
                  key={model}
                  type="monotone"
                  dataKey={model}
                  stroke={MODEL_COLORS[model] ?? "#888"}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Source label */}
        <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-[0.12em] uppercase">
          Fuente: CMIP6 HighResMIP via Open-Meteo Climate API &mdash; {yLabel} &mdash; 6 modelos GCM
        </p>
      </div>
    </section>
  );
}
