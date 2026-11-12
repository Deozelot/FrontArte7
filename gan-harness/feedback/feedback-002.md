# Evaluation — Iteration 002 (design mode)

| Criterion | Score | Weight | Weighted |
|---|---|---|---|
| Design Quality | 7.8 | 0.35 | 2.73 |
| Originality | 8.0 | 0.30 | 2.40 |
| Craft | 7.2 | 0.25 | 1.80 |
| Functionality | 9.0 | 0.10 | 0.90 |

**Weighted Total: 7.83**

## Verdict: PASS (threshold 7.5, previous 7.23)

Tested 7 routes (/actors, /actors/new, /actors/<id>/edit, /movies, /movies/<id>, /movies/new, /nope) at 1440 and 375. Screenshots: gan-harness/screenshots/iter-002-*.png. No GAN test records were created (submit only exercised with empty/invalid data), nothing to delete.

## Required checks
1. React hydration: 0 warnings (/hydrat|didn't match/i) on all 6 real routes plus /nope, at 1440 and 375, and 0 more across a 28-combination sweep (4 locale/timezone pairs: es-ES/Madrid, en-US/LA, es-CO/Bogota, ja-JP/Auckland x 7 routes). The user's report could NOT be reproduced, so no +/- diff or component to quote. Source has no Math.random/Date.now/toLocale; lib/format.ts pins timeZone "UTC" (safe). Most likely cause of the user's warning is a browser extension (Dark Reader, Grammarly etc. inject attributes on <body>/<input>) or a stale dev build; suggest adding suppressHydrationWarning on <html>/<body> only if it persists, and ask for the diff text.
2. /movies performance: 2 requests to localhost:3000 (pass); first row ("Nº 01") visible 658 ms after navigation (dev server).
3. Console errors: 0 on all routes except the intentional 404 resource error on /nope (expected).
4. Horizontal overflow at 375: none on any route (scrollWidth == clientWidth == 375).
5. prefers-reduced-motion: 0 running animations on /movies, /actors, /nope.
6. Keyboard focus: all 9 Tabs showed a 2px outline (vermilion on links/buttons, cream on inputs) + skip link "Saltar al contenido". Fixed from iter 1.
7. Hover: movie row flood hover works; no text shift now.
8. Validation: Spanish inline errors "Este campo es obligatorio" (actor form 5/5, movie form 18/18); DD/MM/AAAA auto-slashes; 31/02/2000, 01/13/2000 and "3112" give "Fecha no válida. Usa DD/MM/AAAA".
9. Search/filter: /actors 24 initial, "ba" -> 4, nationality Brazil -> 4, empty state "Ningún fotograma coincide" + LIMPIAR FILTROS, "Mostrar más" 24 -> 48; /movies "solo premiadas" -> 2 (counter "2 / 102 FOTOGRAMAS"); XSS/emoji/600-char search input did not break layout.

## Critical issues
None.

## Major issues
1. /actors at 375: single column, 24 cards = 15,382 px (about 19 screens), exactly the problem iter 1 flagged, only fixed on desktop. Fix: 2-column contact sheet below 640px (cards ~170px wide, initials scale with clamp), or horizontal snap film-strip; drop to 12 per page on mobile.
2. /actors, /movies/[id], /actors/new preview: the halftone typographic card is a strong idea but all 101 actors are only 4 tones (vermilion/cream/dark-red/sand) with two letters; reads as repetitive after the second row and ignores real photo. The actor-form preview ("SIN IMAGEN") still uses the old blurred red gradient, inconsistent with the new card system. Fix: reuse Frame's halftone card in the preview (initials update live), vary composition (rotate crop, stripe/frame-number variants) by hash.
3. /movies: 100 rows still show "1925" and identical hierarchy; the page is 5,469px at 1440 and the rows are text-only (no poster, no frame). It is the least "designed" route now. Fix: add small poster-frame thumbnail in the left column or a year-decade divider; show genre in vermilion tag; make the hero slab collapse on scroll (sticky filter bar).
4. /movies/new: 18 required fields all turn red at once on submit (wall of vermilion, no scroll-to-first-error, no error summary). Fix: focus + scrollIntoView the first invalid field, add a sticky rail counter "18 errores", only flag fields of the current scene.

## Minor issues
1. /movies/<id>: "RESERVADO / PLANO SIN RODAR" empty frames (3) are decorative filler that imply missing data when the movie has one actor; right 25% of the strip is empty. Cap to remaining width or fill with a CTA "+ añadir actor".
2. /movies/<id> Reseñas: pull-quote at ~35px italics sits left, giant "2/5" far right with a ~300px dead gap and ~150px empty below; tighten with align-items:end.
3. /movies/<id> mobile: title overlap with poster is lost at 375 (stacked), the best detail-page moment is desktop-only.
4. Future dates accepted (15/05/2090 birthdate/release valid). Add max-year check for birth date.
5. /nope: 404 hero is excellent but the right 35% of the viewport is empty; add a rotated slate/clapperboard or film-strip graphic.
6. Mono sub-lines on rows/cards are ~10-11px at ~55% cream opacity; contrast approx 4:1, below AA for body-size text. Raise to 12px / 70%.
7. Footer sprocket line still ends with a 1px stub at the right edge on 1440.
8. Loading and error states (components/State.tsx) were not triggerable without stopping the backend, unverified.

## Improved since iteration 1
- Blurred muddy placeholders replaced by halftone typographic cards: biggest win, /actors went from 101 orange blobs to a legible contact sheet with film-sprocket frames, frame numbers and score badges.
- Search, nationality/genre filter, solo premiadas, Mostrar más; desktop page 17,359 px -> 2,728 px.
- Background seam gone; no overflow at 375.
- Spanish inline validation, DD/MM/AAAA field, visible focus rings, skip link.
- Detail page: title overlapping poster, filmstrip reparto, giant score; popularity pips now in palette.
- Movie form: sticky rail with live poster preview and scene progress counters (0/8...).
- Custom 404 "Fuera de cuadro"; "SIN PREMIO" noise removed; per-route heroes (outline / vermilion slab / clapperboard) fix the repeated-hero complaint.
- Movies list loads with 2 API requests.

## Regressed since iteration 1
- /actors mobile length is now the main weak point (see Major 1); card photos on actor form preview are inconsistent with the new system. No functional regressions found.

## Suggestions ranked by score impact
1. Mobile 2-col / strip for /actors (Craft +0.5, Design +0.2).
2. Rework /movies rows: poster thumbs/decade dividers, sticky filter (Design +0.4, Originality +0.2).
3. Placeholder card variety + use in form preview (Originality +0.3).
4. Form error UX: scroll/focus first error, per-scene errors (Craft +0.3).
5. Detail page: fill/remove RESERVADO frames, tighten review layout, keep overlap on mobile (Design +0.2).
6. Contrast and polish minors (Craft +0.2).
