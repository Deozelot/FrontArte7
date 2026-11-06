"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHead from "@/components/PageHead";
import { Empty, ErrorBox, Loading } from "@/components/State";
import { getMoviesWithPrizes, type MovieListItem } from "@/lib/movies";
import { pad, year } from "@/lib/format";

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMoviesWithPrizes().then(setMovies).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <PageHead eyebrow="En cartelera" title="Películas" count={movies?.length} href="/movies/new" cta="+ Crear película" />
      {error && <ErrorBox message={error} />}
      {!movies && !error && <Loading />}
      {movies?.length === 0 && (
        <Empty title="Pantalla en blanco." hint="La cartelera aún no tiene ningún estreno." href="/movies/new" cta="Crear película" />
      )}
      <ol className="marquee-list">
        {movies?.map((m, i) => {
          const prize = m.prizes[0];
          return (
            <li key={m.id} className="rise" style={{ "--i": Math.min(i, 14) } as React.CSSProperties}>
              <Link href={`/movies/${m.id}`} className="mrow">
                <span className="mono mrow-no">Nº {pad(i + 1)}</span>
                <span className="mrow-main">
                  <span className="mrow-title">{m.title}</span>
                  <span className="mono mrow-sub">
                    {m.genre?.type && <>{m.genre.type} · </>}
                    {m.actors[0] ? <>con {m.actors[0].name}</> : "Sin reparto"}
                  </span>
                </span>
                <span className="mrow-side">
                  <span className="mrow-year">{year(m.releaseDate)}</span>
                  {prize ? (
                    <span className="mono badge" data-won={prize.status === "won"}>
                      ★ {prize.name}
                    </span>
                  ) : (
                    <span className="mono badge none">Sin premio</span>
                  )}
                </span>
                <span className="mrow-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
