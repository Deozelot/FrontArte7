"use client";

import { useEffect, useState, use } from "react";
import ActorForm from "@/components/ActorForm";
import { type Actor, getActor, updateActor } from "@/lib/actors";

export default function EditActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [actor, setActor] = useState<Actor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActor(id).then(setActor).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!actor) return <p>Cargando…</p>;

  const { name, photo, nationality, birthDate, biography } = actor;
  return (
    <>
      <h1>Editar actor</h1>
      <ActorForm
        initial={{ name, photo, nationality, birthDate, biography }}
        submitLabel="Guardar cambios"
        onSubmit={(data) => updateActor(id, data)}
      />
    </>
  );
}
