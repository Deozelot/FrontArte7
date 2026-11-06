# Brief (design mode — the brief IS the spec)

Redesign the Arte7 frontend — a Spanish-language catalogue of actors and movies backed by the BackArte7 REST API — into a distinctive, award-worthy visual experience with a strong cinematic identity.

## Must keep (functionality, all existing routes)
- `/actors` list actors (photo, name, nationality, birth date), edit + delete
- `/actors/new` and `/actors/[id]/edit` actor form
- `/movies` list: title, release date, actor, prize
- `/movies/[id]` detail: all attributes (poster, duration, country, release date, popularity, genre, director, trailer, reviews…), actors list
- `/movies/new` create movie with trailer, lead actor and prize
- Keep `lib/*` API calls working; UI text stays in Spanish.

## Constraints
- Next.js 15 App Router + React 19, plain CSS (app/globals.css or CSS modules). No new npm dependencies; Google Fonts via `next/font/google` is allowed.
- Real data comes from http://localhost:3000/api/v1 (images are dummyimage.com placeholders — design must still look great with them, e.g. duotone/filters/frames).
- Responsive down to 375px, keyboard accessible, readable contrast, respects prefers-reduced-motion.

## Direction
Primary goal is visual excellence and originality. Think film festival programme, cinema marquee, projection booth, film-strip, editorial magazine — not a generic SaaS dashboard. Unusual layouts, custom motion, distinctive type and colour are encouraged.
