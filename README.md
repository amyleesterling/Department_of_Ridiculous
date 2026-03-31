# Department of Ridiculous Internet

An aggressively unnecessary website of absurd emergencies and a government-grade commitment to nonsense.

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

The homepage emergency ledger can use a Google Sheet as the shared global backend via a tiny Apps Script web app in [`google-apps-script/README.md`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\google-apps-script\README.md).

To enable global emergencies:

1. Paste and deploy the Apps Script from `google-apps-script/`
2. Edit the `<meta name="ridiculous-api-base" ...>` tag in [`index.html`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\index.html) so its `content` points at your deployed Apps Script `/exec` URL
3. Keep GitHub Pages serving the static site from `main` and `/(root)`

## Files

- `index.html` contains the page structure.
- `styles.css` contains the visual system, layout, and animation.
- `script.js` powers the chaos controls, random absurdity, and shared emergency client.
- `google-apps-script/Code.gs` is the Google Sheet-backed shared emergency API.
