"use client";

import { useEffect, useRef, useState } from "react";

const toText = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "");

function toIso(text: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!m) return null;
  const d = new Date(`${m[3]}-${m[2]}-${m[1]}T00:00:00Z`);
  return d.getUTCDate() === Number(m[1]) && d.getUTCMonth() + 1 === Number(m[2]) ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

// Spanish dd/mm/aaaa text field (native date inputs follow the browser locale); value is ISO yyyy-mm-dd.
export default function DateField({ label, value, onChange }: { label: string; value: string; onChange: (iso: string) => void }) {
  const [text, setText] = useState(toText(value));
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== (toIso(text) ?? "")) setText(toText(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to external value changes
  }, [value]);

  useEffect(() => {
    ref.current?.setCustomValidity(text && !toIso(text) ? "Fecha no válida. Usa DD/MM/AAAA" : "");
  }, [text]);

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const t = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
    setText(t);
    onChange(toIso(t) ?? "");
  }

  return (
    <label>
      {label}
      <input ref={ref} value={text} onChange={handle} inputMode="numeric" placeholder="DD/MM/AAAA" autoComplete="off" required />
    </label>
  );
}
