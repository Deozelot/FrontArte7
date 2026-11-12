export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    // Content-Type only with a body: on GETs it forces a CORS preflight per request.
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = body?.message ?? res.statusText;
    throw new Error(Array.isArray(msg) ? msg.join(", ") : msg);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const post = <T>(path: string, data?: unknown) =>
  request<T>(path, { method: "POST", body: data === undefined ? undefined : JSON.stringify(data) });
