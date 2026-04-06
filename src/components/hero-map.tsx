"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const AOI_CENTER: [number, number] = [-75.525, 6.475];

const LAYERS = [
  { id: "aoi", label: "Area de Estudio", color: "#1B6B6D" },
  { id: "geologia", label: "Geologia", color: "#D4A853" },
  { id: "fallas", label: "Fallas", color: "#C0392B" },
  { id: "areas-protegidas", label: "Areas Protegidas", color: "#27AE60" },
  { id: "sismos", label: "Sismos M>3.5", color: "#8E44AD" },
];

interface Indicator {
  label: string;
  value: string;
  unit: string;
}

export default function HeroMap({ indicators }: { indicators: Indicator[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["aoi"]));
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Load token at runtime from public JSON
    fetch("/data/mapbox.json")
      .then((r) => r.json())
      .then((cfg: { token: string }) => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || cfg.token;
        if (!token) return;
        setTokenLoaded(true);
        initMap(token);
      })
      .catch(() => {});

    function initMap(token: string) {
      if (!mapContainer.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: AOI_CENTER,
        zoom: 10,
        accessToken: token,
        attributionControl: false,
      });

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      const m = map.current!;

      fetch("/data/aoi_boundary.geojson").then((r) => r.json()).then((data) => {
        m.addSource("aoi", { type: "geojson", data });
        m.addLayer({
          id: "aoi", type: "line", source: "aoi",
          paint: { "line-color": "#1B6B6D", "line-width": 2.5, "line-dasharray": [4, 2] },
        });
      }).catch(() => {});

      fetch("/data/geologia.geojson").then((r) => r.json()).then((data) => {
        m.addSource("geologia", { type: "geojson", data });
        m.addLayer({
          id: "geologia", type: "fill", source: "geologia",
          paint: { "fill-color": "#D4A853", "fill-opacity": 0.2 },
          layout: { visibility: "none" },
        });
      }).catch(() => {});

      fetch("/data/fallas.geojson").then((r) => r.json()).then((data) => {
        m.addSource("fallas", { type: "geojson", data });
        m.addLayer({
          id: "fallas", type: "line", source: "fallas",
          paint: { "line-color": "#C0392B", "line-width": 2 },
          layout: { visibility: "none" },
        });
      }).catch(() => {});

      fetch("/data/areas_protegidas.geojson").then((r) => r.json()).then((data) => {
        m.addSource("areas-protegidas", { type: "geojson", data });
        m.addLayer({
          id: "areas-protegidas", type: "fill", source: "areas-protegidas",
          paint: { "fill-color": "#27AE60", "fill-opacity": 0.25 },
          layout: { visibility: "none" },
        });
      }).catch(() => {});

      fetch("/data/sismos.geojson").then((r) => r.json()).then((data) => {
        m.addSource("sismos", { type: "geojson", data });
        m.addLayer({
          id: "sismos", type: "circle", source: "sismos",
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["get", "mag"], 3.5, 3, 6, 12],
            "circle-color": "#8E44AD", "circle-opacity": 0.5,
          },
          layout: { visibility: "none" },
        });
      }).catch(() => {});

      setMapLoaded(true);
    });
    } // end initMap

    return () => { map.current?.remove(); map.current = null; };
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

      {/* Top gradient overlay with Tensor branding */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/40 to-transparent px-6 md:px-10 pt-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/isologo-tensor.svg" alt="Tensor" className="h-8 invert" />
          <div className="w-px h-5 bg-white/20" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-white/50 tracking-[0.2em] uppercase">
            Prefactibilidad
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-600 text-white tracking-[-0.02em] leading-tight">
          Central Hidroelectrica<br />Milagros
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base max-w-xl font-[family-name:var(--font-sans)] leading-relaxed">
          San Pedro de los Milagros, norte de Antioquia — Lago de datos con 80+
          fuentes para estudios de prefactibilidad de central &gt;100 MW
        </p>
      </div>

      {/* Indicator cards — bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="bg-[#0A0A0A]/70 backdrop-blur-md border border-white/[0.08] rounded-md px-4 py-3 min-w-[140px]"
          >
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40 uppercase tracking-[0.2em]">
              {ind.label}
            </p>
            <p className="font-[family-name:var(--font-display)] text-xl font-600 text-white mt-0.5">
              {ind.value}
              <span className="text-xs font-400 text-white/40 ml-1">{ind.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Layer panel — right */}
      <div className="absolute top-32 right-4 z-10 bg-[#0A0A0A]/70 backdrop-blur-md border border-white/[0.08] rounded-md p-3 space-y-1">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40 uppercase tracking-[0.2em] mb-2">
          Capas
        </p>
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs transition-all duration-500 ${
              activeLayers.has(layer.id)
                ? "bg-white/[0.08] text-white"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-500"
              style={{
                backgroundColor: activeLayers.has(layer.id) ? layer.color : "#333",
              }}
            />
            <span className="font-[family-name:var(--font-sans)]">{layer.label}</span>
          </button>
        ))}
      </div>

      {!tokenLoaded && !map.current && (
        <div className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center">
          <p className="text-white/30 font-[family-name:var(--font-mono)] text-sm">
            Cargando mapa...
          </p>
        </div>
      )}
    </section>
  );
}
