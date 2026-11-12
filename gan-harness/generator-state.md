# Generator State — Iteration 002

## What Was Built
Sala 7 concept kept; see iteration 1 plus the changes below.

## What Changed This Iteration
- Fixed: blurred placeholders -> typographic halftone cards (initials / stacked title words, tone from name hash); real photos get duotone without blur (components/Frame.tsx).
- Fixed: /actors and /movies client-side search, nationality/genre filter, "solo premiadas", "mostrar más" (24/30), 6-col denser contact sheet; no "SIN PREMIO" badge.
- Fixed: background seam (gradient on html, grain now absolute/full-height, no horizontal overflow).
- Fixed: Spanish inline validation (noValidate + label[data-error]), DD/MM/AAAA DateField, visible focus rings.
- Improved: detail page (title overlapping poster, reserved film frames, 8/4-col pull-quote + giant score, palette-only pips); movie form sticky rail with live poster preview + scene progress; per-route heroes (outlined / vermilion slab / clapperboard); not-found "Fuera de cuadro"; ticker hidden <640px; sprocket stub fixed; mrow no text shift.

## Known Issues
- Loading/error states not exercised visually this pass.

## Dev Server
http://localhost:3002
