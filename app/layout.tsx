import type { Metadata } from "next";
import { Anton, Bodoni_Moda, DM_Mono } from "next/font/google";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import "./globals.css";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const serif = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--f-serif" });
const mono = DM_Mono({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: { default: "Arte7 — Cinemateca", template: "%s · Arte7" },
  description: "Cartelera y reparto de Arte7",
};

const TICKER = ["Sesión continua", "Entrada libre", "Actores", "Películas", "Premios", "Reseñas", "Proyección en sala 7"];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <a href="#contenido" className="skip">Saltar al contenido</a>
        <header className="top">
          <Link href="/movies" className="brand" aria-label="Arte7, inicio">
            <span>ARTE</span><b>7</b>
          </Link>
          <NavLinks />
        </header>
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((k) => (
              <span key={k}>{TICKER.map((t) => <i key={t}>{t}</i>)}</span>
            ))}
          </div>
        </div>
        <main id="contenido">{children}</main>
        <footer className="foot">
          <div className="sprockets" aria-hidden="true" />
          <p className="mono">Arte7 · Cinemateca · Sala 7</p>
        </footer>
      </body>
    </html>
  );
}
