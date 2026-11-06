"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/movies", label: "Cartelera" },
  { href: "/actors", label: "Reparto" },
  { href: "/movies/new", label: "+ Película" },
  { href: "/actors/new", label: "+ Actor" },
];

export default function NavLinks() {
  const path = usePathname();
  return (
    <nav aria-label="Principal" className="links">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>{l.label}</Link>
      ))}
    </nav>
  );
}
