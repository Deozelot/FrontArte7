# Generator state — Iteration 1

## Concept: "Sala 7" — projection booth / film-leader cinemateca
Ink-black + projector-warm light, cream paper, one signal vermilion. Anton (marquee type), Bodoni Moda italic (editorial), DM Mono (labels). Film grain + load flicker, red ticker strip, sprocket-hole motifs.

## Built
- Layout: top bar with spinning-7 logo, active-link nav, scrolling ticker, sprocket footer.
- /actors: contact-sheet of 35mm negative frames (staggered), duotone photos, inline delete confirm.
- /movies: giant-type marquee rows that flood vermilion on hover (year, genre, lead, prize badge).
- /movies/[id]: tilted paper-framed poster, dashed ticket spec sheet, popularity pips, play-button trailer, prize stamps, actor reel, pull-quote reviews.
- Forms: underline inputs, numbered "Escena" sections, hard-shadow buttons; actor form has live negative-frame preview.
- States: countdown-leader loader, "Se cortó la proyección" error, designed empty states.
- Reduced motion respected.

## Known gaps
- Placeholder images are heavily blurred/duotoned to hide dummyimage size text; real photos would want less blur.
- No home page (/ redirects to /actors); list pages have no pagination/search (100+ items).
- Preview onError fallback for broken photo URLs untested.

## Dev server
http://localhost:3002
