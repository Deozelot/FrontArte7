# FrontArte7

Frontend en Next.js (App Router) para la API de [BackArte7](../BackArte7).

- `/actors` — listar, editar y eliminar actores
- `/actors/new` — crear actor (formulario controlado)
- `/movies/new` — crear película con tráiler, actor principal y premio; cada entidad se crea por separado y luego se asocian con `/actors/:actorId/movies/:movieId` y `/movies/:movieId/prizes/:prizeId`

## Ejecutar

1. Levantar el backend (puerto 3000).
2. `npm install && npm run dev` → http://localhost:3001

La URL de la API se puede cambiar con `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3000/api/v1`).
