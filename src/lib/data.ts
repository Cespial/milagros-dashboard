// Static data types and loaders

export interface Indicators {
  potencial_mw_min: number;
  potencial_mw_max: number;
  caudal_q95_m3s: number | null;
  caudal_medio_m3s: number | null;
  precipitacion_media_mm: number;
  area_estudio_km2: number;
  zona_sismica: string;
  aa: number;
  av: number;
  areas_protegidas_count: number;
  deslizamientos_count: number;
  sismos_count: number;
  emergencias_count: number;
  fuentes_ingeridas: number;
  fuentes_total: number;
  lake_size_mb: number;
  last_update: string;
}

export interface IngestionEntry {
  name: string;
  source: string;
  category: string;
  status: "complete" | "failed" | "pending";
  records: number;
  size_mb: number;
}

export interface PrecipitationData {
  months: string[];
  values: number[];
}

export interface Municipio {
  codigo: string;
  nombre: string;
  poblacion: number | null;
}

export async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  return res.json();
}
