"use client";

import { useState } from "react";

interface Source {
  name: string;
  category: string;
  variables: string;
  url: string;
  cost: string;
  status: "ingerido" | "pendiente" | "fase2" | "pago";
}

const CATEGORIES = [
  "Todas",
  "Hidrologia",
  "Meteorologia",
  "Mercado Electrico",
  "Geoespacial",
  "Teledeteccion",
  "Calidad Agua",
  "Biodiversidad",
  "Geologia",
  "Solar/Eolico",
  "Socioeconomico",
  "Infraestructura",
  "Regulatorio",
];

const SOURCES: Source[] = [
  { name: "IDEAM DHIME", category: "Hidrologia", variables: "Caudal, nivel, precipitacion", url: "http://dhime.ideam.gov.co", cost: "Gratuito", status: "pendiente" },
  { name: "GloFAS v4", category: "Hidrologia", variables: "Descarga fluvial modelada", url: "https://cds.climate.copernicus.eu", cost: "Gratuito", status: "pendiente" },
  { name: "HydroSHEDS", category: "Hidrologia", variables: "Subcuencas, red fluvial", url: "https://www.hydrosheds.org", cost: "Gratuito", status: "pendiente" },
  { name: "ERA5-Land", category: "Meteorologia", variables: "50 vars: precip, ET, escorrentia, T, viento", url: "https://cds.climate.copernicus.eu", cost: "Gratuito", status: "ingerido" },
  { name: "CHIRPS v2", category: "Meteorologia", variables: "Precipitacion satelital 5.5km", url: "https://data.chc.ucsb.edu", cost: "Gratuito", status: "ingerido" },
  { name: "NASA POWER", category: "Meteorologia", variables: "Radiacion, viento, T, HR — 300+ vars", url: "https://power.larc.nasa.gov", cost: "Gratuito", status: "ingerido" },
  { name: "CMIP6 NEX-GDDP", category: "Meteorologia", variables: "Escenarios cambio climatico SSP1-SSP5", url: "https://registry.opendata.aws", cost: "Gratuito", status: "fase2" },
  { name: "CHELSA v2.1", category: "Meteorologia", variables: "Climatologia 1km, bioclimaticas", url: "https://www.chelsa-climate.org", cost: "Gratuito", status: "fase2" },
  { name: "XM SiMEM", category: "Mercado Electrico", variables: "Generacion, precios, demanda, embalses", url: "https://simem.xm.com.co", cost: "Gratuito", status: "pendiente" },
  { name: "UPME Proyectos", category: "Mercado Electrico", variables: "Registro proyectos generacion", url: "https://www.upme.gov.co", cost: "Gratuito", status: "pendiente" },
  { name: "Copernicus DEM GLO-30", category: "Geoespacial", variables: "Elevacion 30m", url: "https://registry.opendata.aws", cost: "Gratuito", status: "ingerido" },
  { name: "SRTM 30m", category: "Geoespacial", variables: "Elevacion 30m (ano 2000)", url: "https://earthexplorer.usgs.gov", cost: "Gratuito", status: "ingerido" },
  { name: "ALOS PALSAR 30m", category: "Geoespacial", variables: "Elevacion DSM (banda L)", url: "https://search.asf.alaska.edu", cost: "Gratuito", status: "ingerido" },
  { name: "IGAC Cartografia", category: "Geoespacial", variables: "Limites, drenajes, vias, curvas nivel", url: "https://geoportal.igac.gov.co", cost: "Gratuito", status: "pendiente" },
  { name: "Sentinel-1 SAR", category: "Teledeteccion", variables: "InSAR deformacion, inundaciones", url: "https://dataspace.copernicus.eu", cost: "Gratuito", status: "fase2" },
  { name: "Sentinel-2 MSI", category: "Teledeteccion", variables: "NDVI, NDWI, turbidez — 10m", url: "https://dataspace.copernicus.eu", cost: "Gratuito", status: "fase2" },
  { name: "Planet Labs", category: "Teledeteccion", variables: "Imagenes 3m diarias", url: "https://api.planet.com", cost: "Pago", status: "pago" },
  { name: "Maxar", category: "Teledeteccion", variables: "Imagenes 31cm", url: "https://www.maxar.com", cost: "Pago ~$15-25/km2", status: "pago" },
  { name: "CORANTIOQUIA / PIRAGUA", category: "Calidad Agua", variables: "pH, OD, DBO, turbidez", url: "https://www.corantioquia.gov.co", cost: "Gratuito", status: "pendiente" },
  { name: "Corine Land Cover", category: "Biodiversidad", variables: "Cobertura/uso suelo — 5 epocas", url: "https://siac-datosabiertos-mads.hub.arcgis.com", cost: "Gratuito", status: "pendiente" },
  { name: "MapBiomas Colombia", category: "Biodiversidad", variables: "Cobertura anual 30m — 1985-2024", url: "https://colombia.mapbiomas.org", cost: "Gratuito", status: "pendiente" },
  { name: "RUNAP / SINAP", category: "Biodiversidad", variables: "Areas protegidas nacionales", url: "https://runap.parquesnacionales.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "GBIF / SiB Colombia", category: "Biodiversidad", variables: "Registros de especies", url: "https://api.gbif.org", cost: "Gratuito", status: "fase2" },
  { name: "SGC Mapa Geologico", category: "Geologia", variables: "Litologia, formaciones, fallas", url: "https://geoportal.sgc.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "SGC SIMMA", category: "Geologia", variables: "Inventario deslizamientos 32K+", url: "https://simma.sgc.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "SGC Amenaza Sismica", category: "Geologia", variables: "Aa, Av — parametros NSR-10", url: "https://amenazasismica.sgc.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "SGC/USGS Sismicidad", category: "Geologia", variables: "Catalogo sismico M>=2.5", url: "https://earthquake.usgs.gov", cost: "Gratuito", status: "ingerido" },
  { name: "UNGRD Emergencias", category: "Geologia", variables: "Inventario desastres historicos", url: "https://www.datos.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "NASA LHASA v2", category: "Geologia", variables: "Nowcast deslizamientos 1km", url: "https://landslides.nasa.gov", cost: "Gratuito", status: "fase2" },
  { name: "Global Solar Atlas", category: "Solar/Eolico", variables: "GHI, DNI, PVOUT — 250m", url: "https://globalsolaratlas.info", cost: "Gratuito", status: "fase2" },
  { name: "Global Wind Atlas", category: "Solar/Eolico", variables: "Velocidad viento 10-200m — 250m", url: "https://globalwindatlas.info", cost: "Gratuito", status: "fase2" },
  { name: "DANE CNPV 2018", category: "Socioeconomico", variables: "Poblacion, vivienda, servicios", url: "https://www.datos.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "DNP TerriData", category: "Socioeconomico", variables: "800+ indicadores municipales", url: "https://terridata.dnp.gov.co", cost: "Gratuito", status: "pendiente" },
  { name: "AGRONET/EVA", category: "Socioeconomico", variables: "Produccion agropecuaria municipal", url: "https://www.datos.gov.co", cost: "Gratuito", status: "ingerido" },
  { name: "INVIAS Red Vial", category: "Infraestructura", variables: "Vias primarias/secundarias, estado", url: "https://hermes2.invias.gov.co", cost: "Gratuito", status: "fase2" },
  { name: "UPME Red Electrica", category: "Infraestructura", variables: "Lineas STN, subestaciones", url: "https://www1.upme.gov.co", cost: "Gratuito", status: "fase2" },
  { name: "ANLA VITAL", category: "Regulatorio", variables: "Expedientes EIA, resoluciones", url: "https://vital.anla.gov.co", cost: "Gratuito", status: "fase2" },
  { name: "CORANTIOQUIA POMCA", category: "Regulatorio", variables: "Jurisdiccion, cuencas POMCA", url: "https://www.corantioquia.gov.co", cost: "Gratuito", status: "pendiente" },
];

const STATUS_BADGE = {
  ingerido: { label: "Ingerido", cls: "bg-green-100 text-green-700" },
  pendiente: { label: "Pendiente", cls: "bg-yellow-100 text-yellow-700" },
  fase2: { label: "Fase 2+", cls: "bg-gray-100 text-gray-500" },
  pago: { label: "Pago", cls: "bg-red-100 text-red-600" },
};

export default function DataSourcesTable() {
  const [filter, setFilter] = useState("Todas");

  const filtered =
    filter === "Todas"
      ? SOURCES
      : SOURCES.filter((s) => s.category === filter);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-gray-900">
        Inventario de Fuentes de Datos
      </h2>
      <p className="text-gray-500 mt-1 mb-6">
        {SOURCES.length} fuentes identificadas en 13 categorias — ~95% gratuitas
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Fuente</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Variables</th>
              <th className="px-4 py-3 font-medium">Costo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((s) => {
              const badge = STATUS_BADGE[s.status];
              return (
                <tr key={s.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {s.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.category}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {s.variables}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.cost}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                    >
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
