"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const AOI_CENTER: [number, number] = [-75.525, 6.475];
const AOI_BOUNDS: [[number, number], [number, number]] = [
  [-75.8, 6.25],
  [-75.25, 6.7],
];

interface Indicator {
  label: string;
  value: string;
  unit: string;
}

const LAYERS = [
  { id: "geologia", label: "Geologia", color: "#f59e0b" },
  { id: "fallas", label: "Fallas", color: "#ef4444" },
  { id: "areas-protegidas", label: "Areas Protegidas", color: "#22c55e" },
  { id: "sismos", label: "Sismos M>3.5", color: "#a855f7" },
  { id: "aoi", label: "Area de Estudio", color: "#f97316" },
];

export default function HeroMap({ indicators }: { indicators: Indicator[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(["aoi"])
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    if (!MAPBOX_TOKEN) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: AOI_CENTER,
      zoom: 10,
      accessToken: MAPBOX_TOKEN,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      "bottom-right"
    );

    map.current.on("load", () => {
      const m = map.current!;

      // AOI boundary
      fetch("/data/aoi_boundary.geojson")
        .then((r) => r.json())
        .then((data) => {
          m.addSource("aoi", { type: "geojson", data });
          m.addLayer({
            id: "aoi",
            type: "line",
            source: "aoi",
            paint: { "line-color": "#f97316", "line-width": 3, "line-dasharray": [3, 2] },
          });
        })
        .catch(() => {});

      // Geological units
      fetch("/data/geologia.geojson")
        .then((r) => r.json())
        .then((data) => {
          m.addSource("geologia", { type: "geojson", data });
          m.addLayer({
            id: "geologia",
            type: "fill",
            source: "geologia",
            paint: { "fill-color": "#f59e0b", "fill-opacity": 0.25 },
            layout: { visibility: "none" },
          });
        })
        .catch(() => {});

      // Faults
      fetch("/data/fallas.geojson")
        .then((r) => r.json())
        .then((data) => {
          m.addSource("fallas", { type: "geojson", data });
          m.addLayer({
            id: "fallas",
            type: "line",
            source: "fallas",
            paint: { "line-color": "#ef4444", "line-width": 2.5 },
            layout: { visibility: "none" },
          });
        })
        .catch(() => {});

      // Protected areas
      fetch("/data/areas_protegidas.geojson")
        .then((r) => r.json())
        .then((data) => {
          m.addSource("areas-protegidas", { type: "geojson", data });
          m.addLayer({
            id: "areas-protegidas",
            type: "fill",
            source: "areas-protegidas",
            paint: { "fill-color": "#22c55e", "fill-opacity": 0.3 },
            layout: { visibility: "none" },
          });
        })
        .catch(() => {});

      // Earthquakes
      fetch("/data/sismos.geojson")
        .then((r) => r.json())
        .then((data) => {
          m.addSource("sismos", { type: "geojson", data });
          m.addLayer({
            id: "sismos",
            type: "circle",
            source: "sismos",
            paint: {
              "circle-radius": ["interpolate", ["linear"], ["get", "mag"], 3.5, 3, 6, 12],
              "circle-color": "#a855f7",
              "circle-opacity": 0.6,
            },
            layout: { visibility: "none" },
          });
        })
        .catch(() => {});

      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  function toggleLayer(layerId: string) {
    if (!map.current || !mapLoaded) return;
    const next = new Set(activeLayers);
    const m = map.current;

    if (next.has(layerId)) {
      next.delete(layerId);
      try { m.setLayoutProperty(layerId, "visibility", "none"); } catch {}
    } else {
      next.add(layerId);
      try { m.setLayoutProperty(layerId, "visibility", "visible"); } catch {}
    }
    setActiveLayers(next);
  }

  return (
    <section className="relative h-screen w-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent px-6 pt-6 pb-16">
        <p className="text-sm font-medium text-blue-400 tracking-widest uppercase">
          Prefactibilidad
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-white mt-1">
          Central Hidroelectrica Milagros
        </h1>
        <p className="text-gray-300 mt-2 text-sm md:text-base max-w-2xl">
          San Pedro de los Milagros, norte de Antioquia — Lago de datos con 80+
          fuentes para estudios de prefactibilidad de central {">"}100 MW
        </p>
      </div>

      {/* Indicator cards */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 min-w-[140px]"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {ind.label}
            </p>
            <p className="text-xl font-bold text-white mt-0.5">
              {ind.value}
              <span className="text-sm font-normal text-gray-400 ml-1">
                {ind.unit}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* Layer toggle panel */}
      <div className="absolute top-24 right-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-1.5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-semibold">
          Capas
        </p>
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
              activeLayers.has(layer.id)
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: activeLayers.has(layer.id)
                  ? layer.color
                  : "#4b5563",
              }}
            />
            {layer.label}
          </button>
        ))}
      </div>

      {/* No token fallback */}
      {!MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <p className="text-gray-400">
            Configura NEXT_PUBLIC_MAPBOX_TOKEN en .env.local
          </p>
        </div>
      )}
    </section>
  );
}
