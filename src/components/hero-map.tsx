"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const AOI_CENTER: [number, number] = [-75.525, 6.475];

const LAYERS_CONFIG = [
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadMapboxFromCDN(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = globalThis as Record<string, unknown>;
    if (w.mapboxgl) { resolve(w.mapboxgl); return; }
    if (typeof document === "undefined") { reject(new Error("No document")); return; }
    if (!document.querySelector('link[href*="mapbox-gl"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css";
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js";
    script.onload = () => {
      const gl = (globalThis as Record<string, unknown>).mapboxgl;
      if (gl) resolve(gl); else reject(new Error("mapboxgl not on window"));
    };
    script.onerror = () => reject(new Error("CDN script load failed"));
    document.head.appendChild(script);
  });
}

export default function HeroMap({ indicators }: { indicators: Indicator[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["aoi"]));
  const [mapReady, setMapReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState("Initializing...");

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    let cancelled = false;

    async function init() {
      try {
        setDebugInfo("Loading token...");
        const res = await fetch("/data/mapbox.json");
        const cfg = await res.json();
        const token = cfg.token;
        if (!token || cancelled) return;

        setDebugInfo("Loading Mapbox GL JS from CDN...");
        const mapboxgl = await loadMapboxFromCDN();
        if (cancelled || !mapContainer.current) return;

        setDebugInfo("Creating map...");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mb = mapboxgl as any;
        mb.accessToken = token;

        const map = new mb.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: AOI_CENTER,
          zoom: 10,
          attributionControl: false,
        });

        mapInstance.current = map;
        map.addControl(new mb.NavigationControl(), "bottom-right");

        map.on("load", () => {
          if (cancelled) return;
          setDebugInfo("Map loaded! Adding layers...");

          fetch("/data/aoi_boundary.geojson").then((r) => r.json()).then((data: unknown) => {
            map.addSource("aoi", { type: "geojson", data });
            map.addLayer({ id: "aoi", type: "line", source: "aoi", paint: { "line-color": "#1B6B6D", "line-width": 2.5, "line-dasharray": [4, 2] } });
          }).catch(() => {});

          fetch("/data/geologia.geojson").then((r) => r.json()).then((data: unknown) => {
            map.addSource("geologia", { type: "geojson", data });
            map.addLayer({ id: "geologia", type: "fill", source: "geologia", paint: { "fill-color": "#D4A853", "fill-opacity": 0.2 }, layout: { visibility: "none" } });
          }).catch(() => {});

          fetch("/data/fallas.geojson").then((r) => r.json()).then((data: unknown) => {
            map.addSource("fallas", { type: "geojson", data });
            map.addLayer({ id: "fallas", type: "line", source: "fallas", paint: { "line-color": "#C0392B", "line-width": 2 }, layout: { visibility: "none" } });
          }).catch(() => {});

          fetch("/data/areas_protegidas.geojson").then((r) => r.json()).then((data: unknown) => {
            map.addSource("areas-protegidas", { type: "geojson", data });
            map.addLayer({ id: "areas-protegidas", type: "fill", source: "areas-protegidas", paint: { "fill-color": "#27AE60", "fill-opacity": 0.25 }, layout: { visibility: "none" } });
          }).catch(() => {});

          fetch("/data/sismos.geojson").then((r) => r.json()).then((data: unknown) => {
            map.addSource("sismos", { type: "geojson", data });
            map.addLayer({ id: "sismos", type: "circle", source: "sismos", paint: { "circle-radius": ["interpolate", ["linear"], ["get", "mag"], 3.5, 3, 6, 12], "circle-color": "#8E44AD", "circle-opacity": 0.5 }, layout: { visibility: "none" } });
          }).catch(() => {});

          setMapReady(true);
          setDebugInfo("");
        });

        map.on("error", (e: { error?: { message?: string } }) => {
          setDebugInfo(`Map error: ${e.error?.message || JSON.stringify(e)}`);
        });
      } catch (err) {
        setDebugInfo(`INIT ERROR: ${String(err)}`);
      }
    }

    init();
    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const toggleLayer = useCallback(
    (layerId: string) => {
      if (!mapInstance.current || !mapReady) return;
      const map = mapInstance.current;
      const next = new Set(activeLayers);
      if (next.has(layerId)) {
        next.delete(layerId);
        try { map.setLayoutProperty(layerId, "visibility", "none"); } catch {}
      } else {
        next.add(layerId);
        try { map.setLayoutProperty(layerId, "visibility", "visible"); } catch {}
      }
      setActiveLayers(next);
    },
    [activeLayers, mapReady]
  );

  return (
    <section className="relative h-screen w-full bg-[#0A0A0A]">
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Debug overlay — visible until map loads */}
      {debugInfo && (
        <div className="absolute top-20 left-4 z-20 bg-black/90 text-green-400 text-xs px-3 py-2 rounded font-mono max-w-xs">
          {debugInfo}
        </div>
      )}

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/40 to-transparent px-6 md:px-10 pt-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/isologo-tensor.svg" alt="Tensor" className="h-8 invert" />
          <div className="w-px h-5 bg-white/20" />
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-white/50 tracking-[0.2em] uppercase">Prefactibilidad</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
          Central Hidroelectrica<br />Milagros
        </h1>
        <p className="text-white/50 mt-3 text-sm md:text-base max-w-xl font-[family-name:var(--font-sans)] leading-relaxed">
          San Pedro de los Milagros, norte de Antioquia — Lago de datos con 80+ fuentes para estudios de prefactibilidad de central &gt;100 MW
        </p>
      </div>

      {/* Indicator cards */}
      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-3">
        {indicators.map((ind) => (
          <div key={ind.label} className="bg-[#0A0A0A]/70 backdrop-blur-md border border-white/[0.08] rounded-md px-4 py-3 min-w-[140px]">
            <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40 uppercase tracking-[0.2em]">{ind.label}</p>
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white mt-0.5">
              {ind.value}<span className="text-xs font-normal text-white/40 ml-1">{ind.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Layer panel */}
      <div className="absolute top-32 right-4 z-10 bg-[#0A0A0A]/70 backdrop-blur-md border border-white/[0.08] rounded-md p-3 space-y-1">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-white/40 uppercase tracking-[0.2em] mb-2">Capas</p>
        {LAYERS_CONFIG.map((layer) => (
          <button key={layer.id} onClick={() => toggleLayer(layer.id)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs transition-all duration-500 ${activeLayers.has(layer.id) ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}>
            <span className="w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-500" style={{ backgroundColor: activeLayers.has(layer.id) ? layer.color : "#333" }} />
            <span className="font-[family-name:var(--font-sans)]">{layer.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
