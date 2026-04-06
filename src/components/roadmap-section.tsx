const PHASES = [
  {
    number: 1,
    title: "Infraestructura + Datos Criticos",
    status: "complete" as const,
    progress: 100,
    weeks: "Semanas 1-2",
    products: [
      "22 ingestores operativos",
      "Pipeline Bronze → Silver → Gold",
      "Balance hidrico, curvas de duracion, potencial de generacion",
      "Perfil geologico y amenazas naturales",
      "Linea base ambiental y socioeconomica",
      "Exports por audiencia (consultores, inversionistas, reguladores)",
    ],
  },
  {
    number: 2,
    title: "Datos Complementarios",
    status: "active" as const,
    progress: 15,
    weeks: "Semanas 3-4",
    products: [
      "Sentinel-1 SAR (InSAR deformacion)",
      "Sentinel-2 (indices espectrales 10m)",
      "CMIP6 (escenarios cambio climatico)",
      "GBIF biodiversidad detallada",
      "Global Solar/Wind Atlas",
      "INVIAS + UPME red electrica",
    ],
  },
  {
    number: 3,
    title: "Datos Especializados",
    status: "pending" as const,
    progress: 0,
    weeks: "Semanas 5-6",
    products: [
      "Copernicus Water Quality",
      "ICESat-2 altimetria",
      "GEDI estructura vegetacion",
      "NASA LHASA nowcast deslizamientos",
    ],
  },
  {
    number: 4,
    title: "Documentos y Regulatorio",
    status: "pending" as const,
    progress: 0,
    weeks: "Continuo",
    products: [
      "Expedientes ANLA VITAL",
      "Resoluciones CREG",
      "Informes CORANTIOQUIA",
      "EOT/PBOT San Pedro",
    ],
  },
];

const STATUS_STYLES = {
  complete: { bar: "bg-green-500", dot: "bg-green-500", text: "text-green-700", badge: "Completada" },
  active: { bar: "bg-blue-500", dot: "bg-blue-500 animate-pulse", text: "text-blue-700", badge: "En progreso" },
  pending: { bar: "bg-gray-200", dot: "bg-gray-300", text: "text-gray-400", badge: "Pendiente" },
};

export default function RoadmapSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-900">Roadmap</h2>
      <p className="text-gray-500 mt-1 mb-10">
        4 fases de construccion del lago de datos
      </p>

      <div className="space-y-8">
        {PHASES.map((phase) => {
          const style = STATUS_STYLES[phase.status];
          return (
            <div
              key={phase.number}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      phase.status === "complete"
                        ? "bg-green-500"
                        : phase.status === "active"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {phase.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-gray-500">{phase.weeks}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    phase.status === "complete"
                      ? "bg-green-100 text-green-700"
                      : phase.status === "active"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {style.badge}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${style.bar}`}
                  style={{ width: `${phase.progress}%` }}
                />
              </div>

              {/* Products */}
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {phase.products.map((product) => (
                  <li
                    key={product}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`}
                    />
                    {product}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
