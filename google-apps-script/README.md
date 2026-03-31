# Google Sheet Backend

This lets the homepage use your Google Sheet as the shared global emergency backend.

## Paste

Paste [`Code.gs`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\google-apps-script\Code.gs) into your Apps Script project.

## Deploy

1. `Deploy` -> `New deployment`
2. Type: `Web app`
3. `Execute as`: `Me`
4. `Who has access`: `Anyone`
5. Copy the `/exec` URL

## Connect

Put that `/exec` URL in [`index.html`](C:\Users\amyle\Documents\New%20project\department-of-ridiculous-internet\index.html):

```html
<meta name="ridiculous-api-base" content="YOUR_APPS_SCRIPT_EXEC_URL" />
```

## Sheets

The script creates:

- `Emergencies`
- `BangVotes`

Main emergency columns are:

- `id`
- `name`
- `title`
- `details`
- `createdAt`

It also stores `bangs`, `seeded`, and a hashed source token for dedupe/rate limiting.
