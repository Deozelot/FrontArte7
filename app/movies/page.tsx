"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMoviesWithPrizes, type MovieListItem } from "@/lib/movies";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMoviesWithPrizes().then(setMovies).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="header">
        <h1>Películas</h1>
        <Link href="/movies/new" className="button">+ Crear película</Link>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {!movies && !error && <p>Cargando…</p>}
      {movies?.length === 0 && <p>No hay películas registradas.</p>}
      {movies && movies.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha de lanzamiento</th>
              <th>Actor</th>
              <th>Premio</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.releaseDate.slice(0, 10)}</td>
                <td>{m.actors[0]?.name ?? "—"}</td>
                <td>{m.prizes[0]?.name ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
