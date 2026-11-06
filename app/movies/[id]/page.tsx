"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getMovieDetail, type MovieDetail } from "@/lib/movies";

// URLs come from the API; only render http(s) links.
const safeUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : undefined);

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMovieDetail(id).then(setMovie).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!movie) return <p>Cargando…</p>;

  const trailer = movie.youtubeTrailer;
  return (
    <>
      <Link href="/movies" className="muted">← Películas</Link>
      <div className="detail">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs */}
        <img src={movie.poster} alt={`Póster de ${movie.title}`} className="poster" />
        <div>
          <h1>{movie.title}</h1>
          <dl className="attrs">
            <dt>Fecha de lanzamiento</dt><dd>{movie.releaseDate.slice(0, 10)}</dd>
            <dt>Duración</dt><dd>{movie.duration} min</dd>
            <dt>País</dt><dd>{movie.country}</dd>
            <dt>Popularidad</dt><dd>{movie.popularity}</dd>
            <dt>Género</dt><dd>{movie.genre?.type ?? "—"}</dd>
            <dt>Director</dt><dd>{movie.director?.name ?? "—"}</dd>
            <dt>Tráiler</dt>
            <dd>{trailer ? <><a href={safeUrl(trailer.url)} target="_blank" rel="noopener noreferrer">{trailer.name}</a> · {trailer.channel} · {trailer.duration} min</> : "—"}</dd>
            <dt>Premios</dt>
            <dd>{movie.prizes.length ? movie.prizes.map((p) => `${p.name} (${p.category}, ${p.year}, ${p.status === "won" ? "ganado" : "nominado"})`).join("; ") : "—"}</dd>
            <dt>Plataformas</dt>
            <dd>{movie.platforms.length ? movie.platforms.map((p) => p.name).join(", ") : "—"}</dd>
          </dl>
        </div>
      </div>

      <h2>Actores</h2>
      {movie.actors.length === 0 && <p>Esta película no tiene actores.</p>}
      <ul className="grid">
        {movie.actors.map((a) => (
          <li key={a.id} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external URLs */}
            <img src={a.photo} alt={a.name} />
            <h3>{a.name}</h3>
            <p className="muted">{a.nationality} · {a.birthDate.slice(0, 10)}</p>
            <p>{a.biography}</p>
          </li>
        ))}
      </ul>

      <h2>Reseñas</h2>
      {movie.reviews.length === 0 && <p>Sin reseñas.</p>}
      <ul className="reviews">
        {movie.reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.creator}</strong> <span className="muted">· {r.score}/5</span>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
