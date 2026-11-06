import { request, post } from "./api";

export type Actor = {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
};

export type ActorInput = Omit<Actor, "id">;

export const getActors = () => request<Actor[]>("/actors");
export const getActor = (id: string) => request<Actor>(`/actors/${id}`);
export const createActor = (data: ActorInput) => post<Actor>("/actors", data);
export const updateActor = (id: string, data: ActorInput) =>
  request<Actor>(`/actors/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteActor = (id: string) => request<void>(`/actors/${id}`, { method: "DELETE" });
