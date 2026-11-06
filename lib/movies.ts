import { request, post } from "./api";
import { createActor, type Actor, type ActorInput } from "./actors";

export type Named = { id: string; name?: string; type?: string };

export type MovieInput = {
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  genreId: string;
  directorId: string;
};
export type TrailerInput = { name: string; url: string; duration: number; channel: string };
export type PrizeInput = { name: string; category: string; year: number; status: "won" | "nominated" };

type Movie = { id: string; title: string };
export type Prize = { id: string; name: string; category?: string; year?: number; status?: string };
export type MovieListItem = Movie & { releaseDate: string; actors: Actor[]; prizes: Prize[] };
export type MovieDetail = MovieListItem & {
  poster: string;
  duration: number;
  country: string;
  popularity: number;
  director?: { id: string; name: string };
  genre?: { id: string; type: string };
  youtubeTrailer?: { id: string; name: string; url: string; duration: number; channel: string };
  platforms: { id: string; name: string; url: string }[];
  reviews: { id: string; text: string; score: number; creator: string }[];
};

export async function getMovieDetail(id: string): Promise<MovieDetail> {
  const [movie, prizes] = await Promise.all([
    request<Omit<MovieDetail, "prizes">>(`/movies/${id}`),
    request<Prize[]>(`/movies/${id}/prizes`),
  ]);
  return { ...movie, prizes };
}

export const getGenres = () => request<Named[]>("/genres");
export const getDirectors = () => request<Named[]>("/directors");

// GET /movies doesn't load prizes, so they come from /movies/:id/prizes.
// ponytail: one request per movie; add 'prizes' to MovieService.findAll relations if the list grows.
export async function getMoviesWithPrizes(): Promise<MovieListItem[]> {
  const movies = await request<Omit<MovieListItem, "prizes">[]>("/movies");
  return Promise.all(
    movies.map(async (m) => ({ ...m, prizes: await request<Prize[]>(`/movies/${m.id}/prizes`) })),
  );
}

async function step<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw new Error(`${label}: ${e instanceof Error ? e.message : e}`);
  }
}

// Each entity is created on its own endpoint, then linked through the association endpoints.
// ponytail: no rollback — if a later step fails, entities from earlier steps stay created.
export async function createMovieWithActorAndPrize(
  { genreId, directorId, ...movie }: MovieInput,
  trailer: TrailerInput,
  actor: ActorInput,
  prize: PrizeInput,
): Promise<{ movie: Movie; actor: Actor; prize: Prize }> {
  const t = await step("Crear tráiler", () => post<{ id: string }>("/youtube-trailers", trailer));
  const m = await step("Crear película", () =>
    post<Movie>("/movies", { ...movie, genre: { id: genreId }, director: { id: directorId }, youtubeTrailer: { id: t.id } }),
  );
  const a = await step("Crear actor", () => createActor(actor));
  await step("Asignar película al actor", () => post(`/actors/${a.id}/movies/${m.id}`));
  const p = await step("Crear premio", () => post<Prize>("/prizes", prize));
  await step("Asignar premio a la película", () => post(`/movies/${m.id}/prizes/${p.id}`));
  return { movie: m, actor: a, prize: p };
}
