"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Actor, getActors, deleteActor } from "@/lib/actors";

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActors().then(setActors).catch((e) => setError(e.message));
  }, []);

  async function handleDelete(actor: Actor) {
    if (!confirm(`¿Eliminar a ${actor.name}?`)) return;
    try {
      await deleteActor(actor.id);
      setActors((list) => list?.filter((a) => a.id !== actor.id) ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
    }
  }

  return (
    <>
      <div className="header">
        <h1>Actores</h1>
        <Link href="/actors/new" className="button">+ Crear actor</Link>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!actors && !error && <p>Cargando…</p>}
      {actors?.length === 0 && <p>No hay actores registrados.</p>}
      <ul className="grid">
        {actors?.map((a) => (
          <li key={a.id} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs */}
            <img src={a.photo} alt={a.name} />
            <h2>{a.name}</h2>
            <p className="muted">{a.nationality} · {a.birthDate.slice(0, 10)}</p>
            <p>{a.biography}</p>
            <div className="actions">
              <Link href={`/actors/${a.id}/edit`} className="button secondary">Editar</Link>
              <button className="danger" onClick={() => handleDelete(a)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
