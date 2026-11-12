"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Film-leader countdown used while data loads.
export function Loading({ label = "Cargando la cinta" }: { label?: string }) {
  const [n, setN] = useState(5);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v <= 1 ? 5 : v - 1)), 750);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="leader" role="status" aria-live="polite">
      <div className="leader-ring" aria-hidden="true"><span>{n}</span></div>
      <p className="mono">{label}…</p>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="cut" role="alert">
      <p className="mono">Se cortó la proyección</p>
      <p className="cut-msg">{message}</p>
      <button type="button" className="btn ghost" onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  );
}

export function Empty({ title, hint, href, cta }: { title: string; hint: string; href: string; cta: string }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      <p className="empty-hint">{hint}</p>
      <Link href={href} className="btn">{cta}</Link>
    </div>
  );
}
