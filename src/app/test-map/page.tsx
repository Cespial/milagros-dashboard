"use client";

import { useEffect, useRef, useState } from "react";

export default function TestMapPage() {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("1. Loading...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setStatus("2. Fetching token...");
        const res = await fetch("/data/mapbox.json");
        const cfg = await res.json();
        const token = cfg.token;
        setStatus(`3. Token: ${token.slice(0, 20)}...`);

        if (!container.current) {
          setError("Container ref is null");
          return;
        }

        setStatus("4. Importing mapbox-gl...");
        const mapboxgl = (await import("mapbox-gl")).default;
        setStatus(`5. mapbox-gl loaded: v${mapboxgl.version || "unknown"}`);

        setStatus("6. Creating map...");
        const map = new mapboxgl.Map({
          container: container.current,
          style: "mapbox://styles/mapbox/dark-v11",
          center: [-75.525, 6.475],
          zoom: 10,
          accessToken: token,
        });

        map.on("load", () => {
          setStatus("7. MAP LOADED SUCCESSFULLY");
        });

        map.on("error", (e) => {
          setError(`Map error: ${JSON.stringify(e.error || e)}`);
        });
      } catch (err) {
        setError(`Init error: ${String(err)}`);
      }
    }

    init();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        ref={container}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          background: "rgba(0,0,0,0.8)",
          color: "#0f0",
          padding: "12px 16px",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: 14,
          maxWidth: 400,
        }}
      >
        <p>Status: {status}</p>
        {error && <p style={{ color: "#f00" }}>ERROR: {error}</p>}
      </div>
    </div>
  );
}
