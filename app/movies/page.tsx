"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Toolbar from "@/components/Toolbar";
import PageHead from "@/components/PageHead";
import { Empty, ErrorBox, Loading } from "@/components/State";
import { getMoviesWithPrizes, type MovieListItem } from "@/lib/movies";
import { pad, year } from "@/lib/format";

const PAGE = 30;

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [onlyPrized, setOnlyPrized] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const genres = useMemo(() => [...new Set((movies ?? []).map((m) => m.genre?.type).filter((g): g is string => !!g))].sort((a, b) => a.localeCompare(b, "es")), [movies]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (movies ?? []).filter((m) =>
      (!genre || m.genre?.type === genre) && (!onlyPrized || m.prizes.length > 0) &&
      (!q || m.title.toLowerCase().includes(q) || m.actors.some((a) => a.name.toLowerCase().includes(q))));
  }, [movies, query, genre, onlyPrized]);
  const reset = (fn: () => void) => { fn(); setLimit(PAGE); };

  useEffect(() => {
    getMoviesWithPrizes().then(setMovies).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <PageHead eyebrow="En cartelera" title="Películas" variant="movies" count={movies?.length} href="/movies/new" cta="+ Crear película" />
      {error && <ErrorBox message={error} />}
      {!movies && !error && <Loading />}
      {movies?.length === 0 && (
        <Empty title="Pantalla en blanco." hint="La cartelera aún no tiene ningún estreno." href="/movies/new" cta="Crear película" />
      )}
      {movies && movies.length > 0 && (
        <Toolbar
          query={query} onQuery={(q) => reset(() => setQuery(q))} placeholder="Título o actor…"
          select={{ value: genre, onChange: (v) => reset(() => setGenre(v)), all: "Todos los géneros", options: genres }}
          toggle={{ checked: onlyPrized, onChange: (c) => reset(() => setOnlyPrized(c)), label: "Solo premiadas" }}
          total={movies.length} shown={filtered.length}
        />
      )}
      {movies && movies.length > 0 && filtered.length === 0 && (
        <p className="nomatch">Ninguna película coincide. <button className="link-btn" onClick={() => { setQuery(""); setGenre(""); setOnlyPrized(false); }}>Limpiar filtros</button></p>
      )}
      <ol className="marquee-list">
        {filtered.slice(0, limit).map((m, i) => {
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
                  ) : null}
                </span>
                <span className="mrow-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {filtered.length > limit && (
        <div className="more">
          <button className="btn" onClick={() => setLimit(limit + PAGE)}>Mostrar más · quedan {filtered.length - limit}</button>
        </div>
      )}
    </>
  );
}
