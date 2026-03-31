# Codex Memory

## Project

- Repo: `Department_of_Ridiculous`
- Static site is served from GitHub Pages on `main` and `/(root)`.
- Live pages:
  - Homepage: `https://amyleesterling.github.io/Department_of_Ridiculous/`
  - React page: `https://amyleesterling.github.io/Department_of_Ridiculous/react-2/`

## Naming Direction

- Current naming direction under consideration: rename from `yto` to `Whai`.
- `Whai` was favored as a stronger, more intentional, more brandable name.
- No public rename has been applied yet; treat this as a noted direction for future branding and product naming decisions.

## Homepage

- Main site is plain static HTML/CSS/JS:
  - `index.html`
  - `styles.css`
  - `script.js`
- Important interactive behaviors already implemented:
  - `Increase Chaos` escalates text distortion from element -> word -> letter and can collapse the site into a boring 1990s government mode.
  - `Undo Chaos` reverses the collapse stages.
  - `Activate Disco Protocol` triggers a timed disco-ball drop, dark layout, and moving light beams for 6 seconds.
  - `Release Raccoons` releases visible raccoon convoys only.
  - `Feed the Bureaucrat` drops a coin and then sends bureaucratic chips across the screen.
  - `Issue New Emergency` opens a modal and creates timestamped emergency cards.

## Emergency Storage

- Current frontend behavior:
  - The homepage emergency ledger should run in shared global mode through a Google Sheet-backed Apps Script API.
  - If `<meta name="ridiculous-api-base" content="">` in `index.html` is blank, the ledger will not accept submissions until the Apps Script URL is configured.
- Frontend emergency logic lives in `script.js`.
- Current deployed Apps Script URL in `index.html`:
  - `https://script.google.com/macros/s/AKfycbwpkrCOWhMkvRDjUJJJDeFjCmDTuaGWNliBxJXMLNtxaUfazgJGsu6dvUUOXMuXiDZB/exec`
- Redeployed Version 3 on Mar 31 2026, matching `google-apps-script/Code.gs`.
- Public emergency reads and writes should both be working now.

## Tiny API

- Backend lives in `api/`.
- Main files:
  - `api/server.js`
  - `api/package.json`
  - `api/README.md`
- Tech:
  - Node + Express
  - SQLite via `better-sqlite3`
- Endpoints:
  - `GET /health`
  - `GET /api/emergencies`
  - `POST /api/emergencies`
- The API is append-only. There is no delete route.
- Local DB path is `api/data/ridiculous-emergencies.db` and is gitignored.

## React Second Page

- React page lives in `react-2/`.
- Files:
  - `react-2/index.html`
  - `react-2/page.jsx`
- Current theme:
  - "Department of Nothing"
  - Big flashy page whose joke is that it looks important but achieves nothing.
  - `Reassure Stakeholders` launches floating thumbs-ups / thoughts / prayers / corporate-support memes.

## Deployment Notes

- GitHub Pages live site was pushed during this session.
- A clean publish worktree was used at:
  - `C:\Users\amyle\Documents\New project\department-of-ridiculous-publish`
- The current live site includes:
  - share buttons in the top right
  - visible `Name` on emergencies
  - visible `!` button
  - critical infrastructure failures section
  - footer credit
  - polling refresh loop for public emergencies
- The remaining failing path is `Declare Emergency`.
- Fastest handoff path for Claude:
  - inspect `google-apps-script/Code.gs`
  - verify the user's Apps Script project exactly matches it
  - redeploy the web app
  - then retest `Declare Emergency`
