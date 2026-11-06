"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pad } from "@/lib/format";
import DateField from "@/components/DateField";
import Frame from "@/components/Frame";
import PageHead from "@/components/PageHead";
import ActorFields, { EMPTY_ACTOR } from "@/components/ActorFields";
import { clearFieldError, validateForm } from "@/lib/validate";
import type { ActorInput } from "@/lib/actors";
import { createMovieWithActorAndPrize, getDirectors, getGenres, type Named } from "@/lib/movies";

const EMPTY_MOVIE = { title: "", poster: "", duration: "", country: "", releaseDate: "", popularity: "", genreId: "", directorId: "" };
const EMPTY_TRAILER = { name: "", url: "", duration: "", channel: "" };
const EMPTY_PRIZE = { name: "", category: "", year: "", status: "won" as "won" | "nominated" };

type Input = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export default function NewMoviePage() {
  const [movie, setMovie] = useState(EMPTY_MOVIE);
  const [trailer, setTrailer] = useState(EMPTY_TRAILER);
  const [actor, setActor] = useState<ActorInput>(EMPTY_ACTOR);
  const [prize, setPrize] = useState(EMPTY_PRIZE);
  const [genres, setGenres] = useState<Named[]>([]);
  const [directors, setDirectors] = useState<Named[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getGenres(), getDirectors()])
      .then(([g, d]) => { setGenres(g); setDirectors(d); })
      .catch((e) => setError(`No se pudieron cargar géneros/directores: ${e.message}`));
  }, []);

  const setM = (f: keyof typeof movie) => (e: Input) => setMovie({ ...movie, [f]: e.target.value });
  const setT = (f: keyof typeof trailer) => (e: Input) => setTrailer({ ...trailer, [f]: e.target.value });
  const setP = (f: keyof typeof prize) => (e: Input) => setPrize({ ...prize, [f]: e.target.value });

  const count = (v: object) => Object.values(v).filter((x) => String(x).trim() !== "").length;
  const scenes: [string, number, number][] = [
    ["Película", count(movie), 8],
    ["Tráiler", count(trailer), 4],
    ["Actor", count(actor), 5],
    ["Premio", count({ n: prize.name, c: prize.category, y: prize.year }), 3],
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm(e.currentTarget as HTMLFormElement)) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await createMovieWithActorAndPrize(
        { ...movie, duration: Number(movie.duration), popularity: Number(movie.popularity) },
        { ...trailer, duration: Number(trailer.duration) },
        actor,
        { ...prize, year: Number(prize.year) },
      );
      setSuccess(`Película "${res.movie.title}" creada con el actor ${res.actor.name} y el premio ${res.prize.name}.`);
      setMovie(EMPTY_MOVIE);
      setTrailer(EMPTY_TRAILER);
      setActor(EMPTY_ACTOR);
      setPrize(EMPTY_PRIZE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la película");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHead eyebrow="Hoja de rodaje" title="Crear película" variant="form" />
      <div className="shoot-wrap">
      <aside className="rail" aria-label="Progreso del rodaje">
        <div className="rail-poster">
          <Frame src={movie.poster || ""} alt="Vista previa del póster" label={movie.title || "Sin título"} kind="title" />
        </div>
        <p className="rail-title">{movie.title || "Título por rodar"}</p>
        <ol className="scenes">
          {scenes.map(([name, done, total], i) => (
            <li key={name} data-done={done === total}>
              <a href={`#escena-${i + 1}`}>
                <span className="mono">Esc. {pad(i + 1)}</span>
                <b>{name}</b>
                <i className="mono">{done}/{total}</i>
              </a>
              <span className="bar" style={{ "--p": done / total } as React.CSSProperties} />
            </li>
          ))}
        </ol>
      </aside>
      <form onSubmit={handleSubmit} onInput={clearFieldError} className="form shoot rise" noValidate>
        <fieldset id="escena-1">
          <legend><span className="mono">Escena 01</span>Película</legend>
          <div className="fields">
          <label>Título<input value={movie.title} onChange={setM("title")} required /></label>
          <label>Póster (URL)<input type="url" value={movie.poster} onChange={setM("poster")} required /></label>
          <label>Duración (min)<input type="number" min={1} value={movie.duration} onChange={setM("duration")} required /></label>
          <label>País<input value={movie.country} onChange={setM("country")} required /></label>
          <DateField label="Fecha de estreno" value={movie.releaseDate} onChange={(releaseDate) => setMovie({ ...movie, releaseDate })} />
          <label>Popularidad (1-5)<input type="number" min={1} max={5} value={movie.popularity} onChange={setM("popularity")} required /></label>
          <label>
            Género
            <select value={movie.genreId} onChange={setM("genreId")} required>
              <option value="">Seleccione…</option>
              {genres.map((g) => <option key={g.id} value={g.id}>{g.type}</option>)}
            </select>
          </label>
          <label>
            Director
            <select value={movie.directorId} onChange={setM("directorId")} required>
              <option value="">Seleccione…</option>
              {directors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          </div>
        </fieldset>

        <fieldset id="escena-2">
          <legend><span className="mono">Escena 02</span>Tráiler de YouTube</legend>
          <div className="fields">
          <label>Nombre<input value={trailer.name} onChange={setT("name")} required /></label>
          <label>URL<input type="url" value={trailer.url} onChange={setT("url")} required /></label>
          <label>Duración (min)<input type="number" min={1} value={trailer.duration} onChange={setT("duration")} required /></label>
          <label>Canal<input value={trailer.channel} onChange={setT("channel")} required /></label>
          </div>
        </fieldset>

        <fieldset id="escena-3">
          <legend><span className="mono">Escena 03</span>Actor principal</legend>
          <div className="fields">
          <ActorFields value={actor} onChange={setActor} />
          </div>
        </fieldset>

        <fieldset id="escena-4">
          <legend><span className="mono">Escena 04</span>Premio</legend>
          <div className="fields">
          <label>Nombre<input value={prize.name} onChange={setP("name")} required /></label>
          <label>Categoría<input value={prize.category} onChange={setP("category")} required /></label>
          <label>Año<input type="number" min={1900} max={2100} value={prize.year} onChange={setP("year")} required /></label>
          <label>
            Estado
            <select value={prize.status} onChange={setP("status")}>
              <option value="won">Ganado</option>
              <option value="nominated">Nominado</option>
            </select>
          </label>
          </div>
        </fieldset>

        {error && <p className="inline-error" role="alert">{error}</p>}
        {success && <p className="success" role="status">{success} <Link href="/movies">Ver cartelera →</Link></p>}
        <div className="actions">
          <button type="submit" className="btn" disabled={saving}>{saving ? "Creando…" : "¡Acción! Crear película"}</button>
        </div>
      </form>
      </div>
    </>
  );
}
