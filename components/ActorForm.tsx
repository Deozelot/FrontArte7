"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ActorInput } from "@/lib/actors";
import Frame from "./Frame";
import ActorFields, { EMPTY_ACTOR } from "./ActorFields";

type Props = {
  initial?: ActorInput;
  submitLabel: string;
  onSubmit: (data: ActorInput) => Promise<unknown>;
};

export default function ActorForm({ initial = EMPTY_ACTOR, submitLabel, onSubmit }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ActorInput>({ ...initial, birthDate: initial.birthDate.slice(0, 10) });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({ ...form, name: form.name.trim(), nationality: form.nationality.trim() });
      router.push("/actors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  }

  return (
    <div className="split rise">
      <form onSubmit={handleSubmit} className="form">
        <ActorFields value={form} onChange={setForm} />
        {error && <p className="inline-error" role="alert">{error}</p>}
        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>{saving ? "Guardando…" : submitLabel}</button>
          <button type="button" className="btn ghost" onClick={() => router.push("/actors")}>Cancelar</button>
        </div>
      </form>
      <aside className="negative preview" aria-label="Vista previa">
        <div className="film"><Preview url={form.photo} /></div>
        <p className="mono frame-no">▸ Vista previa</p>
        <h2>{form.name || "Nombre del actor"}</h2>
        <p className="mono meta">{form.nationality || "Nacionalidad"}</p>
      </aside>
    </div>
  );
}

function Preview({ url }: { url: string }) {
  const [bad, setBad] = useState<string | null>(null);
  if (!/^https?:\/\//i.test(url) || bad === url) return <div className="frame blank"><span className="mono">Sin imagen</span></div>;
  return (
    <div onErrorCapture={() => setBad(url)}>
      <Frame src={url} alt="Vista previa de la fotografía" />
    </div>
  );
}
