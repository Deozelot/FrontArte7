import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arte7 · Actores",
  description: "CRUD de actores",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <nav className="nav">
          <strong>Arte7</strong>
          <Link href="/actors">Actores</Link>
          <Link href="/actors/new">Crear actor</Link>
          <Link href="/movies/new">Crear película</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
