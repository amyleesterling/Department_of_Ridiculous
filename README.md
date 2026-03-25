# Department of Ridiculous Internet

An aggressively unnecessary website featuring absurd emergencies, disco toggles, heroic typography, and a government-grade commitment to nonsense.

## Live Site

- Homepage: https://amyleesterling.github.io/Department_of_Ridiculous/
- Department of Nothing: https://amyleesterling.github.io/Department_of_Ridiculous/react-2/

## Pages

- `index.html` is the original Department of Ridiculous Internet homepage.
- `react-2/index.html` is the React-powered Department of Nothing page for GitHub Pages.

## Run

Open `index.html` directly in a browser.

For GitHub Pages, keep the repository publishing from `main` and `/(root)`. The site will serve the homepage at the repository root and the second page at `/react-2/`.

## Shared Public Emergencies

The homepage emergency ledger can now run in two modes:

- Fallback mode: browser-only storage with `localStorage`
- Shared mode: the tiny append-only API in [`api/README.md`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\api\README.md)

To enable shared public emergencies:

1. Run or deploy the API from `api/`
2. Edit the `<meta name="ridiculous-api-base" ...>` tag in [`index.html`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\index.html) so its `content` points at your deployed API base URL
3. Keep GitHub Pages serving the static site from `main` and `/(root)`

Example API base:

- `http://localhost:8787` for local testing
- `https://your-ridiculous-api.example.com` for deployment

## Files

- `index.html` contains the page structure.
- `styles.css` contains the visual system, layout, and animation.
- `script.js` powers the chaos controls and random absurdity.
- `api/server.js` is the tiny append-only backend for shared emergencies.
