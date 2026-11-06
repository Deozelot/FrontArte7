"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Frame from "@/components/Frame";
import { ErrorBox, Loading } from "@/components/State";
import { getMovieDetail, type MovieDetail } from "@/lib/movies";
import { longDate, pad } from "@/lib/format";

// URLs come from the API; only render http(s) links.
const safeUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : undefined);

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMovieDetail(id).then(setMovie).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <ErrorBox message={error} />;
  if (!movie) return <Loading label="Montando la película" />;

  const trailer = movie.youtubeTrailer;
  const trailerHref = trailer ? safeUrl(trailer.url) : undefined;
  return (
    <article>
      <Link href="/movies" className="back mono">← Cartelera</Link>
      <section className="hero">
        <div className="hero-poster rise">
          <Frame src={movie.poster} alt={`Póster de ${movie.title}`} label={movie.title} kind="title" />
          <p className="mono caption">Fig. 1 — Póster</p>
        </div>
        <div className="hero-body">
          <p className="mono eyebrow rise" style={{ "--i": 1 } as React.CSSProperties}>
            {movie.genre?.type ?? "Sin género"} · {movie.country} · {movie.duration} min
          </p>
          <h1 className="hero-title rise" style={{ "--i": 2 } as React.CSSProperties}>{movie.title}</h1>
          <p className="hero-dir rise" style={{ "--i": 3 } as React.CSSProperties}>
            Dirigida por <em>{movie.director?.name ?? "—"}</em>
          </p>
          <dl className="ticket rise" style={{ "--i": 4 } as React.CSSProperties}>
            <div><dt>Estreno</dt><dd>{longDate(movie.releaseDate)}</dd></div>
            <div><dt>Duración</dt><dd>{movie.duration} min</dd></div>
            <div><dt>País</dt><dd>{movie.country}</dd></div>
            <div>
              <dt>Popularidad</dt>
              <dd>
                <span className="pips" role="img" aria-label={`${movie.popularity} de 5`}>
                  {[1, 2, 3, 4, 5].map((n) => <i key={n} data-on={n <= movie.popularity} />)}
                </span>
                {movie.popularity}
              </dd>
            </div>
            <div><dt>Género</dt><dd>{movie.genre?.type ?? "—"}</dd></div>
            <div><dt>Director</dt><dd>{movie.director?.name ?? "—"}</dd></div>
            <div>
              <dt>Plataformas</dt>
              <dd>{movie.platforms.length ? movie.platforms.map((p) => p.name).join(", ") : "—"}</dd>
            </div>
          </dl>
          <div className="hero-cta rise" style={{ "--i": 5 } as React.CSSProperties}>
            {trailer && trailerHref ? (
              <a className="play" href={trailerHref} target="_blank" rel="noopener noreferrer">
                <span className="play-icon" aria-hidden="true" />
                <span>
                  <b>Ver tráiler</b>
                  <small className="mono">{trailer.name} · {trailer.channel} · {trailer.duration} min</small>
                </span>
              </a>
            ) : (
              <p className="mono muted">Tráiler no disponible</p>
            )}
          </div>
        </div>
      </section>

      <section className="block">
        <h2 className="sec"><span className="mono">I</span>Premios</h2>
        {movie.prizes.length === 0 && <p className="quiet">Esta película aún no ha recibido premios.</p>}
        <ul className="prizes">
          {movie.prizes.map((p) => (
            <li key={p.id} data-won={p.status === "won"}>
              <span className="stamp mono">{p.status === "won" ? "Ganado" : "Nominado"}</span>
              <span className="prize-name">{p.name}</span>
              <span className="mono prize-meta">{p.category} · {p.year}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2 className="sec"><span className="mono">II</span>Reparto</h2>
        {movie.actors.length === 0 && <p className="quiet">Esta película no tiene actores.</p>}
        <ul className="reel">
          {movie.actors.map((a, i) => (
            <li key={a.id} className="negative small">
              <div className="film"><Frame src={a.photo} alt={`Fotografía de ${a.name}`} label={a.name} /></div>
              <p className="mono frame-no">▸ {pad(i + 1)}A</p>
              <h3>{a.name}</h3>
              <p className="mono meta">{a.nationality} · {longDate(a.birthDate)}</p>
              <p className="bio">{a.biography}</p>
            </li>
          ))}
          {Array.from({ length: Math.max(0, 4 - movie.actors.length) }, (_, k) => (
            <li key={`r${k}`} className="negative small reserved" aria-hidden="true">
              <div className="film"><div className="frame blank"><span className="mono">Reservado</span></div></div>
              <p className="mono frame-no">▸ {pad(movie.actors.length + k + 1)}A</p>
              <p className="mono meta">Plano sin rodar</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <h2 className="sec"><span className="mono">III</span>Reseñas</h2>
        {movie.reviews.length === 0 && <p className="quiet">Sin reseñas. El público aún no ha dicho nada.</p>}
        <ul className="quotes">
          {movie.reviews.map((r) => (
            <li key={r.id}>
              <div>
                <p className="quote-text">{r.text}</p>
                <p className="quote-by mono">— {r.creator}</p>
              </div>
              <p className="score" aria-label={`Puntuación ${r.score} de 5`}>{r.score}<small>/5</small></p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
