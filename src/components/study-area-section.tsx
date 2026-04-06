import type { Municipio } from "@/lib/data";
import AnimatedSection from "./animated-section";

export default function StudyAreaSection({ municipios }: { municipios: Municipio[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
      <AnimatedSection>
        <p className="font-[family-name:var(--font-mono)] text-[11px] text-accent uppercase tracking-[0.2em] mb-2">Territorio</p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-600 text-text tracking-[-0.02em]">Area de Estudio</h2>
        <p className="font-[family-name:var(--font-sans)] text-muted mt-2 mb-10">Norte de Antioquia — 10 municipios, ~2,750 km2</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedSection delay={0.05}>
          <div className="bg-card border border-border rounded-md p-6">
            <h3 className="font-[family-name:var(--font-display)] font-500 text-text mb-4">Municipios</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-2 font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.15em]">DANE</th>
                  <th className="pb-2 font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.15em]">Municipio</th>
                  <th className="pb-2 font-[family-name:var(--font-mono)] text-[10px] text-muted uppercase tracking-[0.15em] text-right">Poblacion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {municipios.map((m) => (
                  <tr key={m.codigo} className="hover:bg-card-hover transition-colors duration-300">
                    <td className="py-2 font-[family-name:var(--font-mono)] text-xs text-muted">{m.codigo}</td>
                    <td className="py-2 text-text">{m.nombre}</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)] text-text-body">{m.poblacion ? m.poblacion.toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        <div className="space-y-5">
          <AnimatedSection delay={0.1}>
            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-[family-name:var(--font-display)] font-500 text-text mb-3">Parametros NSR-10</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Zona de amenaza", "Intermedia"],
                  ["Aa (aceleracion)", "0.15"],
                  ["Av (velocidad)", "0.20"],
                  ["Sistema de fallas", "Romeral"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-muted text-xs">{k}</p>
                    <p className="font-[family-name:var(--font-display)] font-500 text-text">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-[family-name:var(--font-display)] font-500 text-text mb-1">Sistema Riogrande II (EPM)</h3>
              <p className="text-xs text-muted mb-3">Referencia — proyecto Milagros es independiente</p>
              <div className="text-sm space-y-2">
                {[
                  ["Embalse Riogrande II", "245 Mm3, 2,270 msnm"],
                  ["Central La Tasajera", "306 MW (3x Pelton)"],
                  ["Central Niquia", "~20 MW (Francis)"],
                  ["Operador", "EPM"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-text-body">{k}</span>
                    <span className="font-[family-name:var(--font-mono)] text-text font-500 text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-card border border-border rounded-md p-6">
              <h3 className="font-[family-name:var(--font-display)] font-500 text-text mb-3">Autoridades Competentes</h3>
              <div className="text-sm space-y-2">
                {[
                  ["Licencia ambiental (>100 MW)", "ANLA"],
                  ["Autoridad regional", "CORANTIOQUIA"],
                  ["Registro de proyectos", "UPME"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-text-body">{k}</span>
                    <span className="font-500 text-text">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
