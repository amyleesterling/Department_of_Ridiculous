# Codex Memory

## Project

- Repo: `Department_of_Ridiculous`
- Static site is served from GitHub Pages on `main` and `/(root)`.
- Live pages:
  - Homepage: `https://amyleesterling.github.io/Department_of_Ridiculous/`
  - React page: `https://amyleesterling.github.io/Department_of_Ridiculous/react-2/`

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
  - If `<meta name="ridiculous-api-base" content="">` in `index.html` is blank, emergencies use `localStorage`.
  - If that meta tag points to a backend URL, the homepage uses the API for shared public emergencies.
- Frontend emergency logic lives in `script.js`.

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

- GitHub Pages only serves the static site; it does not run the API.
- To enable shared public emergencies, deploy `api/` separately and set the homepage `ridiculous-api-base` meta tag to that backend URL.
- Backend dependencies have been scaffolded, but `npm install` was not run during the last edit pass.
