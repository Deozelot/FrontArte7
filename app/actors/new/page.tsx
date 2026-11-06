"use client";

import ActorForm from "@/components/ActorForm";
import PageHead from "@/components/PageHead";
import { createActor } from "@/lib/actors";

export default function NewActorPage() {
  return (
    <>
      <PageHead eyebrow="Casting" title="Crear actor" />
      <ActorForm submitLabel="Crear actor" onSubmit={createActor} />
    </>
  );
}
