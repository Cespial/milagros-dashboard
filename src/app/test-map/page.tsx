"use client";

import { useEffect, useRef, useState } from "react";

export default function TestMapPage() {
  const container = useRef<HTMLDivElement>(null);
  const [log, setLog] = useState<string[]>(["Starting..."]);

  function addLog(msg: string) {
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);
  }

  useEffect(() => {
    async function init() {
      try {
        addLog("Fetching token from /data/mapbox.json...");
        const res = await fetch("/data/mapbox.json");
        const cfg = await res.json();
        addLog(`Token: ${cfg.token.slice(0, 25)}...`);

        addLog("Loading mapbox-gl CSS from CDN...");
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.css";
        document.head.appendChild(link);

        addLog("Loading mapbox-gl JS from CDN...");
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://api.mapbox.com/mapbox-gl-js/v3.9.4/mapbox-gl.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Script load failed"));
          document.head.appendChild(script);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapboxgl = (window as any).mapboxgl;
        addLog(`mapboxgl loaded: ${typeof mapboxgl}, version: ${mapboxgl?.version}`);

        if (!container.current) {
          addLog("ERROR: container.current is null");
          return;
        }

        const rect = container.current.getBoundingClientRect();
        addLog(`Container: ${rect.width}x${rect.height} at (${rect.left},${rect.top})`);

        mapboxgl.accessToken = cfg.token;
        addLog("Creating map...");

        const map = new mapboxgl.Map({
          container: container.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [-75.525, 6.475],
          zoom: 9,
        });

        map.on("load", () => addLog("MAP LOADED OK"));
        map.on("error", (e: unknown) => addLog(`MAP ERROR: ${JSON.stringify(e)}`));
        map.on("idle", () => addLog("Map idle (rendered)"));
      } catch (err) {
        addLog(`EXCEPTION: ${String(err)}`);
      }
    }

    init();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#111" }}>
      <div ref={container} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", top: 8, left: 8, zIndex: 999,
        background: "rgba(0,0,0,0.95)", color: "#0f0",
        padding: 12, borderRadius: 8, fontFamily: "monospace",
        fontSize: 12, maxWidth: 500, maxHeight: "50vh", overflow: "auto",
        border: "1px solid #333",
      }}>
        <p style={{ color: "#fff", marginBottom: 8, fontWeight: "bold" }}>Mapbox Debug Log</p>
        {log.map((l, i) => (
          <p key={i} style={{ margin: "2px 0", color: l.includes("ERROR") || l.includes("EXCEPTION") ? "#f00" : "#0f0" }}>
            {l}
          </p>
        ))}
      </div>
    </div>
  );
}
