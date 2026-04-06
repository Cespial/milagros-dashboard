import { readFile } from "fs/promises";
import { join } from "path";
import HeroMap from "@/components/hero-map";
import IndicatorsSection from "@/components/indicators-section";
import DataSourcesTable from "@/components/data-sources-table";
import RoadmapSection from "@/components/roadmap-section";
import LakeStatusSection from "@/components/lake-status-section";
import StudyAreaSection from "@/components/study-area-section";
import type { Indicators, IngestionEntry, PrecipitationData, Municipio } from "@/lib/data";

async function loadData<T>(filename: string, fallback: T): Promise<T> {
  try {
    const path = join(process.cwd(), "public", "data", filename);
    const raw = await readFile(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const DEFAULT_INDICATORS: Indicators = {
  potencial_mw_min: 50,
  potencial_mw_max: 800,
  caudal_q95_m3s: null,
  caudal_medio_m3s: null,
  precipitacion_media_mm: 2100,
  area_estudio_km2: 2750,
  zona_sismica: "Intermedia",
  aa: 0.15,
  av: 0.20,
  areas_protegidas_count: 21,
  deslizamientos_count: 42,
  sismos_count: 2183,
  emergencias_count: 2718,
  fuentes_ingeridas: 12,
  fuentes_total: 80,
  lake_size_mb: 888,
  last_update: "2026-04-05",
};

export default async function Home() {
  const indicators = await loadData<Indicators>("indicators.json", DEFAULT_INDICATORS);
  const ingestion = await loadData<IngestionEntry[]>("ingestion_status.json", []);
  const precipitation = await loadData<PrecipitationData | null>("precipitation.json", null);
  const municipios = await loadData<Municipio[]>("municipios.json", [
    { codigo: "05664", nombre: "San Pedro de los Milagros", poblacion: 27898 },
    { codigo: "05264", nombre: "Entrerrios", poblacion: 12513 },
    { codigo: "05086", nombre: "Belmira", poblacion: 7386 },
    { codigo: "05237", nombre: "Donmatias", poblacion: 24010 },
    { codigo: "05686", nombre: "Santa Rosa de Osos", poblacion: 37298 },
    { codigo: "05079", nombre: "Barbosa", poblacion: 53542 },
    { codigo: "05088", nombre: "Bello", poblacion: 576786 },
    { codigo: "05761", nombre: "Sopetran", poblacion: 15609 },
    { codigo: "05576", nombre: "Olaya", poblacion: 3644 },
    { codigo: "05042", nombre: "Santafe de Antioquia", poblacion: 25385 },
  ]);

  const heroIndicators = [
    {
      label: "Potencial",
      value: `${indicators.potencial_mw_min}-${indicators.potencial_mw_max}`,
      unit: "MW",
    },
    {
      label: "Precipitacion",
      value: indicators.precipitacion_media_mm.toLocaleString(),
      unit: "mm/ano",
    },
    {
      label: "Fuentes",
      value: `${indicators.fuentes_ingeridas}/${indicators.fuentes_total}`,
      unit: "ingeridas",
    },
    {
      label: "Area",
      value: indicators.area_estudio_km2.toLocaleString(),
      unit: "km2",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <HeroMap indicators={heroIndicators} />

      <IndicatorsSection
        precipitacion_media_mm={indicators.precipitacion_media_mm}
        zona_sismica={indicators.zona_sismica}
        aa={indicators.aa}
        av={indicators.av}
        areas_protegidas_count={indicators.areas_protegidas_count}
        deslizamientos_count={indicators.deslizamientos_count}
        sismos_count={indicators.sismos_count}
        emergencias_count={indicators.emergencias_count}
        potencial_mw_min={indicators.potencial_mw_min}
        potencial_mw_max={indicators.potencial_mw_max}
        precipitation={precipitation}
      />

      <DataSourcesTable />

      <RoadmapSection />

      <LakeStatusSection
        entries={ingestion}
        lakeSizeMb={indicators.lake_size_mb}
        lastUpdate={indicators.last_update}
        fuentesIngeridas={indicators.fuentes_ingeridas}
        fuentesTotal={indicators.fuentes_total}
      />

      <StudyAreaSection municipios={municipios} />

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Arquitectura</h4>
            <p>
              Lake Medallion: Bronze (crudo) &rarr; Silver (estandarizado) &rarr; Gold
              (analitico). Motor: DuckDB + Parquet + GeoParquet + COG GeoTIFF.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Stack</h4>
            <p>
              Python 3.11, DuckDB, GeoPandas, Rasterio, xarray, GEE, CDS API.
              Dashboard: Next.js 16, Tailwind, Mapbox GL JS, Recharts.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Reproducibilidad</h4>
            <p>
              Todo el lake se reconstruye desde codigo + API keys. Datos no se
              versionan — la reproducibilidad se garantiza por los ingestores.
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-8">
          Central Hidroelectrica Milagros — Lago de datos de prefactibilidad.
          Codigo: MIT. Datos: cada fuente tiene su propia licencia.
        </p>
      </footer>
    </main>
  );
}
