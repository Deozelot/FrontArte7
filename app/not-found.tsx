import Link from "next/link";

export default function NotFound() {
  return (
    <section className="lost">
      <p className="mono eyebrow">Error 404 · Plano no encontrado</p>
      <h1>Fuera de cuadro</h1>
      <p className="lost-hint">Esta página no está en ningún carrete de la sala 7. Quizá se cortó en montaje.</p>
      <div className="actions">
        <Link href="/movies" className="btn">Volver a la cartelera</Link>
        <Link href="/actors" className="btn ghost">Ver el reparto</Link>
      </div>
    </section>
  );
}
