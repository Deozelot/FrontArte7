"use client";

import ActorForm from "@/components/ActorForm";
import { createActor } from "@/lib/actors";

export default function NewActorPage() {
  return (
    <>
      <h1>Crear actor</h1>
      <ActorForm submitLabel="Crear" onSubmit={createActor} />
    </>
  );
}
