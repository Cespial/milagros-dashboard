import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central Hidroelectrica Milagros — Lago de Datos",
  description: "Dashboard de prefactibilidad para central hidroelectrica >100 MW en San Pedro de los Milagros, norte de Antioquia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
