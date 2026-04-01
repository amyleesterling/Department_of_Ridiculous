# Department of Ridiculous

Absurdist government satire website deployed via GitHub Pages from `main` branch.
Repo: `amyleesterling/Department_of_Ridiculous`
Live: https://amyleesterling.github.io/Department_of_Ridiculous/

## Architecture
- Static site: HTML + vanilla JS + CSS (no build step)
- Google Apps Script backend for shared emergency ledger
- Canvas 2D rendering for all games
- GitHub Pages deployment from `main` branch

## Key Files
- `index.html` — main page with all sections
- `tetris.html` — standalone Constitutional Tetris page ("build within the bounds of the Constitution")
- `tetris.js` — Tetris + Form 27-B canvas, uses @chenglou/pretext for constitution text reflow
- `bureaucrat.js` — "Feed the Bureaucrat" tapper game (tap coins into pocket, resets at 99% with administration change, tie swaps blue↔red)
- `frogger.js` — fullscreen Frogger overlay (bureaucratic vehicles)
- `invaders.js` — Space Invaders ("Defend the Homeland")
- `pong.js` — Pong ("The Lobby", filibuster mode)
- `breakout.js` — Breakout ("HQ Demolition", org chart bricks)
- `script.js` — main controller (chaos stages, missions, ticker, disco, emergencies)
- `styles.css` — all styles, CSS custom properties for theming

## Color Scheme
- `--navy: #1a3a6b` (primary buttons, headings)
- `--gold: #d4a017` / `--gold-light: #f0d060`
- `--red: #c41e3a`
- Background: cream gradient `#fff8ef`

## Fonts (Google Fonts)
- **Bungee** — h1 only
- **Outfit** (weight 800) — h2/h3
- **Crimson Pro** — body text, literary quotes (serif)
- **Space Grotesk** — body, UI text
- **IBM Plex Mono** — labels, kickers, badges

## Title
"The Department of Ridiculous" (no "Internet")

## Conventions
- Games expose global functions (e.g. `window.openPacman`, `window.openFrogger`) for decoupled button handling
- script.js checks `typeof window.openPacman === "function"` before calling
- Dynamic ES module import from CDN for pretext: `https://esm.sh/@chenglou/pretext@0.0.3`
- Mobile controls shown via `@media (pointer: coarse)`
- Crest image: `favicon.png` in repo root, displayed fixed top-right (hidden if file missing)
- Theatre Wing has been removed
- "Stamp It Official" button lives in the footer (not fixed)
- "Enter the Parade Annex" link lives in the footer
- All game/interactive buttons consolidated in "Approved Controls" panel

## React Annex
- Lives in `./react-2/` subdirectory (separate React app)

## Pending
- `favicon.png` needs to be added to repo root (crest image)
