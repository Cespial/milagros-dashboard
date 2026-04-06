import type { PrecipitationData } from "@/lib/data";
import AnimatedSection from "./animated-section";
import PrecipChart from "./precip-chart";
import FlowDurationChart from "./flow-duration-chart";
import GlowCard from "./glow-card";

interface FDCPoint {
  exceedance_pct: number;
  caudal_m3s: number;
}

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
  flowDuration: FDCPoint[] | null;
}

function Card({
  label,
  value,
  sub,
  delay,
}: {
  label: string;
  value: string;
  sub?: string;
  delay: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <GlowCard className="bg-card border border-border rounded-md p-5 hover:border-border-strong transition-colors duration-500">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.2em]">
          {label}
        </p>
        <p className="font-[family-name:var(--font-display)] text-2xl font-600 text-text mt-1 tracking-[-0.02em]">
          {value}
        </p>
        {sub && (
          <p className="font-[family-name:var(--font-sans)] text-sm text-muted mt-0.5">
            {sub}
          </p>
        )}
      </GlowCard>
    </AnimatedSection>
  );
}

export default function IndicatorsSection(props: Props) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
      <AnimatedSection>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-accent uppercase tracking-[0.2em] mb-2">
          Resultados
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-600 text-text tracking-[-0.02em]">
          Hallazgos Clave
        </h2>
        <p className="font-[family-name:var(--font-sans)] text-muted mt-2 mb-10 max-w-lg">
          Indicadores principales del area de estudio para la prefactibilidad
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <Card delay={0} label="Potencial Estimado" value={`${props.potencial_mw_min}–${props.potencial_mw_max}`} sub="MW (rango Q x H)" />
        <Card delay={0.05} label="Precipitacion Media" value={props.precipitacion_media_mm.toLocaleString()} sub="mm/ano" />
        <Card delay={0.1} label="Zona Sismica" value={props.zona_sismica} sub={`Aa=${props.aa}  Av=${props.av}`} />
        <Card delay={0.15} label="Areas Protegidas" value={String(props.areas_protegidas_count)} sub="en el AOI (RUNAP/SINAP)" />
        <Card delay={0.2} label="Sismos Registrados" value={props.sismos_count.toLocaleString()} sub="M>=2.5, radio 300km" />
        <Card delay={0.25} label="Deslizamientos" value={String(props.deslizamientos_count)} sub="registros SIMMA en AOI" />
        <Card delay={0.3} label="Emergencias UNGRD" value={props.emergencias_count.toLocaleString()} sub="Antioquia historico" />
        <Card delay={0.35} label="Fuentes de Datos" value="80+" sub="13 categorias identificadas" />
      </div>

      {props.precipitation && (
        <AnimatedSection delay={0.2}>
          <div className="bg-card border border-border rounded-md p-6">
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.2em] mb-1">
              CHIRPS + NASA POWER
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-500 text-text mb-5">
              Precipitacion Mensual Promedio
            </h3>
            <PrecipChart data={props.precipitation} />
          </div>
        </AnimatedSection>
      )}

      {props.flowDuration && props.flowDuration.length > 0 && (
        <AnimatedSection delay={0.3}>
          <div className="bg-card border border-border rounded-md p-6 mt-6">
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.2em] mb-1">
              Open-Meteo / GloFAS
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-500 text-text mb-5">
              Curva de Duracion de Caudales
            </h3>
            <FlowDurationChart data={props.flowDuration} />
          </div>
        </AnimatedSection>
      )}
    </section>
  );
}
