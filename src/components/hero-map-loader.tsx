"use client";

import dynamic from "next/dynamic";

const HeroMap = dynamic(() => import("./hero-map"), {
  ssr: false,
  loading: () => (
    <section className="relative h-screen w-full bg-[#0A0A0A] flex items-center justify-center">
      <p className="text-white/30 text-sm font-[family-name:var(--font-mono)]">
        Cargando mapa...
      </p>
    </section>
  ),
});

export default function HeroMapLoader({
  indicators,
}: {
  indicators: { label: string; value: string; unit: string }[];
}) {
  return <HeroMap indicators={indicators} />;
}
