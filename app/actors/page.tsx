"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Frame from "@/components/Frame";
import PageHead from "@/components/PageHead";
import { Empty, ErrorBox, Loading } from "@/components/State";
import { type Actor, getActors, deleteActor } from "@/lib/actors";
import { longDate, pad } from "@/lib/format";

export default function ActorsPage() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askId, setAskId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    getActors().then(setActors).catch((e) => setError(e.message));
  }, []);

  async function handleDelete(actor: Actor) {
    setBusyId(actor.id);
    setDeleteError(null);
    try {
      await deleteActor(actor.id);
      setActors((list) => list?.filter((a) => a.id !== actor.id) ?? null);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setBusyId(null);
      setAskId(null);
    }
  }

  return (
    <>
      <PageHead eyebrow="Hoja de contactos" title="Reparto" count={actors?.length} href="/actors/new" cta="+ Crear actor" />
      {error && <ErrorBox message={error} />}
      {!actors && !error && <Loading />}
      {actors?.length === 0 && (
        <Empty title="Sala vacía." hint="Nadie ha pisado el escenario todavía. Da de alta al primer actor." href="/actors/new" cta="Crear actor" />
      )}
      {deleteError && <p className="inline-error" role="alert">{deleteError}</p>}
      <ul className="sheet">
        {actors?.map((a, i) => (
          <li key={a.id} className="negative rise" style={{ "--i": Math.min(i, 12) } as React.CSSProperties}>
            <div className="film">
              <Frame src={a.photo} alt={`Fotografía de ${a.name}`} />
            </div>
            <p className="mono frame-no">▸ {pad(i + 1)}A</p>
            <h2>{a.name}</h2>
            <p className="mono meta">{a.nationality} · {longDate(a.birthDate)}</p>
            <p className="bio">{a.biography}</p>
            <div className="row-actions">
              {askId === a.id ? (
                <>
                  <span className="mono ask">¿Eliminar?</span>
                  <button className="link-btn danger" onClick={() => handleDelete(a)} disabled={busyId === a.id}>
                    {busyId === a.id ? "Eliminando…" : "Sí, eliminar"}
                  </button>
                  <button className="link-btn" onClick={() => setAskId(null)}>No</button>
                </>
              ) : (
                <>
                  <Link href={`/actors/${a.id}/edit`} className="link-btn">Editar</Link>
                  <button className="link-btn danger" onClick={() => setAskId(a.id)} aria-label={`Eliminar a ${a.name}`}>Eliminar</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
