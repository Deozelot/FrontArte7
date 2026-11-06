"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ActorInput } from "@/lib/actors";
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
    <form onSubmit={handleSubmit} className="form">
      <ActorFields value={form} onChange={setForm} />
      {error && <p className="error" role="alert">{error}</p>}
      <div className="actions">
        <button type="submit" disabled={saving}>{saving ? "Guardando…" : submitLabel}</button>
        <button type="button" className="secondary" onClick={() => router.push("/actors")}>Cancelar</button>
      </div>
    </form>
  );
}
