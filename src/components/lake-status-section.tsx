import type { IngestionEntry } from "@/lib/data";
import AnimatedSection from "./animated-section";

interface Props {
  entries: IngestionEntry[];
  lakeSizeMb: number;
  lastUpdate: string;
  fuentesIngeridas: number;
  fuentesTotal: number;
}

const CATEGORY_TARGETS: Record<string, number> = {
  meteorologia: 9, geologia: 6, biodiversidad: 6, teledeteccion: 5,
  infraestructura: 4, regulatorio: 4, solar_eolico: 3, socioeconomico: 3,
  hidrologia: 2, mercado_electrico: 2, geoespacial: 2, calidad_agua: 1,
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  complete: { label: "OK", cls: "bg-accent-light text-accent" },
  failed: { label: "Error", cls: "bg-[#FDECEA] text-[#C0392B]" },
  pending: { label: "Pendiente", cls: "bg-[#FFF8E1] text-[#B8860B]" },
};

export default function LakeStatusSection(props: Props) {
  const byCat: Record<string, number> = {};
  for (const e of props.entries) {
    if (e.status === "complete") byCat[e.category] = (byCat[e.category] || 0) + 1;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20 bg-panel">
      <AnimatedSection>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-accent uppercase tracking-[0.2em] mb-2">Pipeline</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-600 text-text tracking-[-0.02em]">Estado del Data Lake</h2>
        <p className="font-[family-name:var(--font-sans)] text-muted mt-2 mb-8">Progreso de ingestion y procesamiento</p>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Fuentes ingeridas", value: `${props.fuentesIngeridas}`, sub: `/ ${props.fuentesTotal}` },
            { label: "Tamano Bronze", value: props.lakeSizeMb >= 1000 ? `${(props.lakeSizeMb / 1000).toFixed(1)}` : `${props.lakeSizeMb}`, sub: props.lakeSizeMb >= 1000 ? "GB" : "MB" },
            { label: "Archivos", value: `${props.entries.length}`, sub: "datasets" },
            { label: "Ultima actualizacion", value: props.lastUpdate, sub: "" },
          ].map((c) => (
            <div key={c.label} className="bg-card border border-border rounded-md p-5">
              <p className="font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.2em]">{c.label}</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-600 text-text mt-1">
                {c.value}<span className="text-sm font-400 text-muted ml-1">{c.sub}</span>
              </p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-10">
          {Object.entries(CATEGORY_TARGETS).map(([cat, target]) => (
            <div key={cat}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-body capitalize font-[family-name:var(--font-sans)]">{cat.replace("_", " ")}</span>
                <span className="font-[family-name:var(--font-mono)] text-muted">{byCat[cat] || 0}/{target}</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div className="bg-accent h-1.5 rounded-full transition-all" style={{ width: `${Math.round(((byCat[cat] || 0) / target) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {props.entries.length > 0 && (
        <AnimatedSection delay={0.2}>
          <div className="overflow-x-auto border border-border rounded-md bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Ingestor", "Fuente", "Categoria", "Registros", "Tamano", "Estado"].map((h) => (
                    <th key={h} className="px-4 py-3 font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.15em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {props.entries.map((e) => {
                  const badge = STATUS_BADGE[e.status] || STATUS_BADGE.pending;
                  return (
                    <tr key={e.name} className="hover:bg-card-hover transition-colors duration-300">
                      <td className="px-4 py-2.5 font-[family-name:var(--font-mono)] text-xs text-text">{e.name}</td>
                      <td className="px-4 py-2.5 text-text-body">{e.source}</td>
                      <td className="px-4 py-2.5 text-muted capitalize">{e.category.replace("_", " ")}</td>
                      <td className="px-4 py-2.5 font-[family-name:var(--font-mono)] text-text-body">{e.records.toLocaleString()}</td>
                      <td className="px-4 py-2.5 font-[family-name:var(--font-mono)] text-muted">{e.size_mb < 1 ? `${Math.round(e.size_mb * 1024)} KB` : `${e.size_mb.toFixed(1)} MB`}</td>
                      <td className="px-4 py-2.5"><span className={`inline-block px-2 py-0.5 rounded text-[11px] font-500 ${badge.cls}`}>{badge.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      )}
    </section>
  );
}
