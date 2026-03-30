# Tiny API

This is the append-only backend for shared public emergency submissions.

## Run locally

```bash
cd api
npm install
npm run dev
```

The API starts on `http://localhost:8787` by default. Local mode uses SQLite on disk (`data/ridiculous-emergencies.db`).

## Deploy with Turso (free hosted database)

For global persistence, the API supports [Turso](https://turso.tech) — a free hosted SQLite service.

### 1. Create a Turso database

```bash
# Install the Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Sign up / log in
turso auth signup   # or: turso auth login

# Create a database
turso db create ridiculous-emergencies

# Get the connection URL
turso db show ridiculous-emergencies --url

# Create an auth token
turso db tokens create ridiculous-emergencies
```

### 2. Set environment variables

```bash
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

### 3. Deploy the API

The API can be deployed anywhere that runs Node.js (Render, Railway, Fly.io, etc.). A `Dockerfile` is included for container-based platforms.

Example with Render:
1. Create a new **Web Service** from this repo's `api/` directory
2. Set the environment variables above
3. Use `npm install && npm start` as the build/start commands
4. Note your service URL (e.g. `https://your-service.onrender.com`)

### 4. Point the frontend at the API

In `index.html`, set the meta tag to your deployed API URL:

```html
<meta name="ridiculous-api-base" content="https://your-service.onrender.com" />
```

## Endpoints

- `GET /health` — returns `{ ok: true, db: "turso" | "sqlite" }`
- `GET /api/emergencies` — list recent emergencies
- `POST /api/emergencies` — file a new emergency

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8787` | Server port |
| `TURSO_DATABASE_URL` | _(empty)_ | Turso database URL. If empty, uses local SQLite. |
| `TURSO_AUTH_TOKEN` | _(empty)_ | Turso auth token |
| `ALLOW_ORIGIN` | `*` | CORS allowed origin |
| `RATE_LIMIT_MAX` | `20` | Max POSTs per IP per window |
| `RATE_LIMIT_WINDOW_MS` | `600000` | Rate limit window (10 min) |

## Notes

- The API is append-only. There is no delete route.
- Basic rate limiting is enabled for emergency submissions.
- When `TURSO_DATABASE_URL` is not set, the API falls back to local SQLite for development.
