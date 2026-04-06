import AnimatedSection from "./animated-section";

const PHASES = [
  { number: 1, title: "Infraestructura + Datos Criticos", status: "complete" as const, progress: 100, weeks: "Semanas 1-2", products: ["22 ingestores operativos", "Pipeline Bronze - Silver - Gold", "Balance hidrico, curvas de duracion", "Perfil geologico y amenazas", "Linea base ambiental", "Exports por audiencia"] },
  { number: 2, title: "Datos Complementarios", status: "active" as const, progress: 15, weeks: "Semanas 3-4", products: ["Sentinel-1 SAR (InSAR)", "Sentinel-2 (indices 10m)", "CMIP6 cambio climatico", "GBIF biodiversidad", "Solar/Wind Atlas", "INVIAS + UPME red"] },
  { number: 3, title: "Datos Especializados", status: "pending" as const, progress: 0, weeks: "Semanas 5-6", products: ["Copernicus Water Quality", "ICESat-2 altimetria", "GEDI biomasa", "NASA LHASA deslizamientos"] },
  { number: 4, title: "Documentos y Regulatorio", status: "pending" as const, progress: 0, weeks: "Continuo", products: ["Expedientes ANLA VITAL", "Resoluciones CREG", "Informes CORANTIOQUIA", "EOT/PBOT San Pedro"] },
];

const STYLES = {
  complete: { bar: "bg-accent", dot: "bg-accent", badge: "bg-accent-light text-accent", label: "Completada" },
  active: { bar: "bg-accent", dot: "bg-accent animate-pulse", badge: "bg-accent-light text-accent", label: "En progreso" },
  pending: { bar: "bg-border", dot: "bg-border-strong", badge: "bg-panel text-muted", label: "Pendiente" },
};

export default function RoadmapSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
      <AnimatedSection>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-accent uppercase tracking-[0.2em] mb-2">Progreso</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-600 text-text tracking-[-0.02em]">Roadmap</h2>
        <p className="font-[family-name:var(--font-sans)] text-muted mt-2 mb-10">4 fases de construccion del lago de datos</p>
      </AnimatedSection>

      <div className="space-y-5">
        {PHASES.map((phase, i) => {
          const style = STYLES[phase.status];
          return (
            <AnimatedSection key={phase.number} delay={i * 0.08}>
              <div className="bg-card border border-border rounded-md p-6 hover:border-border-strong transition-colors duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-600 ${
                      phase.status === "pending" ? "bg-panel text-muted" : "bg-accent text-white"
                    }`}>
                      {phase.number}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] font-500 text-text">{phase.title}</h3>
                      <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted tracking-[0.15em] uppercase">{phase.weeks}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-500 px-2.5 py-1 rounded-md ${style.badge}`}>{style.label}</span>
                </div>
                <div className="w-full bg-panel rounded-full h-1.5 mb-4">
                  <div className={`h-1.5 rounded-full transition-all duration-1000 ${style.bar}`} style={{ width: `${phase.progress}%` }} />
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {phase.products.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-text-body">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
