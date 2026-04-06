import type { Municipio } from "@/lib/data";

interface Props {
  municipios: Municipio[];
}

export default function StudyAreaSection({ municipios }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900">Area de Estudio</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Norte de Antioquia — 10 municipios, ~2,750 km2
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Municipios */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Municipios</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                <th className="pb-2 font-medium">Codigo DANE</th>
                <th className="pb-2 font-medium">Municipio</th>
                <th className="pb-2 font-medium text-right">Poblacion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {municipios.map((m) => (
                <tr key={m.codigo}>
                  <td className="py-2 font-mono text-xs text-gray-500">{m.codigo}</td>
                  <td className="py-2 text-gray-900">{m.nombre}</td>
                  <td className="py-2 text-right text-gray-600">
                    {m.poblacion ? m.poblacion.toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Parametros y contexto */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Parametros NSR-10</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Zona de amenaza</p>
                <p className="font-semibold text-gray-900">Intermedia</p>
              </div>
              <div>
                <p className="text-gray-500">Aa (aceleracion horizontal)</p>
                <p className="font-semibold text-gray-900">0.15</p>
              </div>
              <div>
                <p className="text-gray-500">Av (velocidad horizontal)</p>
                <p className="font-semibold text-gray-900">0.20</p>
              </div>
              <div>
                <p className="text-gray-500">Sistema de fallas cercano</p>
                <p className="font-semibold text-gray-900">Romeral</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Sistema Riogrande II (EPM) — Referencia
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Infraestructura existente en la zona (proyecto Milagros es independiente)
            </p>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Embalse Riogrande II</span>
                <span className="font-medium text-gray-900">245 Mm3, 2,270 msnm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Central La Tasajera</span>
                <span className="font-medium text-gray-900">306 MW (3x Pelton)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Central Niquia</span>
                <span className="font-medium text-gray-900">~20 MW (Francis)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operador</span>
                <span className="font-medium text-gray-900">EPM</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Autoridades Competentes</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Licencia ambiental (&gt;100 MW)</span>
                <span className="font-medium text-gray-900">ANLA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Autoridad ambiental regional</span>
                <span className="font-medium text-gray-900">CORANTIOQUIA (Tahamies)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registro de proyectos</span>
                <span className="font-medium text-gray-900">UPME</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
