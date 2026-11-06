"use client";

import { useEffect, useState, use } from "react";
import { ErrorBox, Loading } from "@/components/State";
import PageHead from "@/components/PageHead";
import ActorForm from "@/components/ActorForm";
import { type Actor, getActor, updateActor } from "@/lib/actors";

export default function EditActorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [actor, setActor] = useState<Actor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActor(id).then(setActor).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorBox message={error} />;
  if (!actor) return <Loading />;

  const { name, photo, nationality, birthDate, biography } = actor;
  return (
    <>
      <PageHead eyebrow="Revisión de ficha" title="Editar actor" />
      <ActorForm
        initial={{ name, photo, nationality, birthDate, biography }}
        submitLabel="Guardar cambios"
        onSubmit={(data) => updateActor(id, data)}
      />
    </>
  );
}
