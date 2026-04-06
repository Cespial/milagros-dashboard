import type { PrecipitationData } from "@/lib/data";
import PrecipChart from "./precip-chart";

interface Props {
  precipitacion_media_mm: number;
  zona_sismica: string;
  aa: number;
  av: number;
  areas_protegidas_count: number;
  deslizamientos_count: number;
  sismos_count: number;
  emergencias_count: number;
  potencial_mw_min: number;
  potencial_mw_max: number;
  precipitation: PrecipitationData | null;
}

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function IndicatorsSection(props: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-gray-900">Hallazgos Clave</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Indicadores principales del area de estudio para la prefactibilidad
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card
          label="Potencial Estimado"
          value={`${props.potencial_mw_min}–${props.potencial_mw_max}`}
          sub="MW (rango Q x H)"
        />
        <Card
          label="Precipitacion Media"
          value={props.precipitacion_media_mm.toLocaleString()}
          sub="mm/ano"
        />
        <Card
          label="Zona Sismica"
          value={props.zona_sismica}
          sub={`Aa=${props.aa} Av=${props.av}`}
        />
        <Card
          label="Areas Protegidas"
          value={String(props.areas_protegidas_count)}
          sub="en el AOI (RUNAP/SINAP)"
        />
        <Card
          label="Sismos Registrados"
          value={props.sismos_count.toLocaleString()}
          sub="M>=2.5, radio 300km"
        />
        <Card
          label="Deslizamientos"
          value={String(props.deslizamientos_count)}
          sub="registros SIMMA en AOI"
        />
        <Card
          label="Emergencias UNGRD"
          value={props.emergencias_count.toLocaleString()}
          sub="Antioquia historico"
        />
        <Card
          label="Fuentes de Datos"
          value="80+"
          sub="13 categorias identificadas"
        />
      </div>

      {props.precipitation && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Precipitacion Mensual Promedio
          </h3>
          <PrecipChart data={props.precipitation} />
        </div>
      )}
    </section>
  );
}
