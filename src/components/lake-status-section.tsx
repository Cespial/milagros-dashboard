import type { IngestionEntry } from "@/lib/data";

interface Props {
  entries: IngestionEntry[];
  lakeSizeMb: number;
  lastUpdate: string;
  fuentesIngeridas: number;
  fuentesTotal: number;
}

const CATEGORY_TARGETS: Record<string, number> = {
  hidrologia: 6,
  meteorologia: 9,
  mercado_electrico: 6,
  geoespacial: 8,
  teledeteccion: 10,
  calidad_agua: 5,
  biodiversidad: 6,
  geologia: 8,
  solar_eolico: 5,
  socioeconomico: 7,
  infraestructura: 3,
  regulatorio: 7,
};

function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 capitalize">{label.replace("_", " ")}</span>
        <span className="text-gray-400">
          {value}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  complete: { label: "OK", cls: "bg-green-100 text-green-700" },
  failed: { label: "Error", cls: "bg-red-100 text-red-600" },
  pending: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
};

export default function LakeStatusSection(props: Props) {
  // Count ingeridos per category
  const byCat: Record<string, number> = {};
  for (const e of props.entries) {
    if (e.status === "complete") {
      byCat[e.category] = (byCat[e.category] || 0) + 1;
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-gray-900">Estado del Data Lake</h2>
      <p className="text-gray-500 mt-1 mb-8">
        Progreso de ingestion y procesamiento
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Fuentes ingeridas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {props.fuentesIngeridas}
            <span className="text-sm font-normal text-gray-400">/{props.fuentesTotal}</span>
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Tamano Bronze</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {props.lakeSizeMb >= 1000
              ? `${(props.lakeSizeMb / 1000).toFixed(1)} GB`
              : `${props.lakeSizeMb} MB`}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Archivos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{props.entries.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Ultima actualizacion</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{props.lastUpdate}</p>
        </div>
      </div>

      {/* Progress by category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-10">
        {Object.entries(CATEGORY_TARGETS).map(([cat, target]) => (
          <ProgressBar
            key={cat}
            label={cat}
            value={byCat[cat] || 0}
            max={target}
          />
        ))}
      </div>

      {/* Ingestor table */}
      <div className="overflow-x-auto border border-gray-200 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Ingestor</th>
              <th className="px-4 py-3 font-medium">Fuente</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Registros</th>
              <th className="px-4 py-3 font-medium">Tamano</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {props.entries.map((e) => {
              const badge = STATUS_BADGE[e.status] || STATUS_BADGE.pending;
              return (
                <tr key={e.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{e.name}</td>
                  <td className="px-4 py-3 text-gray-900">{e.source}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{e.category.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-gray-600">{e.records.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{e.size_mb < 1 ? `${Math.round(e.size_mb * 1024)} KB` : `${e.size_mb.toFixed(1)} MB`}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
