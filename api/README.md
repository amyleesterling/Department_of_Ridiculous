# Tiny API

This is the append-only backend for shared public emergency submissions.

## Run locally

```bash
cd api
npm install
npm run dev
```

The API starts on `http://localhost:8787` by default. Local mode uses SQLite on disk (`data/ridiculous-emergencies.db`).

## Deploy for global emergencies

Set one environment variable — `DATABASE_URL` — pointing at any PostgreSQL database. Works with Supabase, Neon, Railway, Render, AWS RDS, Google Cloud SQL, or any other Postgres provider.

### 1. Get a PostgreSQL database

Use whatever provider you prefer. Example with Supabase:

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database** and copy the connection string (URI format)

The table is created automatically on first startup.

### 2. Deploy the API

The API can be deployed anywhere that runs Node.js (Render, Railway, Fly.io, etc.). A `Dockerfile` is included for container-based platforms.

Set the environment variable:

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 3. Point the frontend at the API

In `index.html`, set the meta tag to your deployed API URL:

```html
<meta name="ridiculous-api-base" content="https://your-api-host.example.com" />
```

## Endpoints

- `GET /health` — returns `{ ok: true, db: "postgres" | "sqlite" }`
- `GET /api/emergencies` — list recent emergencies
- `POST /api/emergencies` — file a new emergency

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8787` | Server port |
| `DATABASE_URL` | _(empty)_ | PostgreSQL connection string. If empty, uses local SQLite. |
| `ALLOW_ORIGIN` | `*` | CORS allowed origin |
| `RATE_LIMIT_MAX` | `20` | Max POSTs per IP per window |
| `RATE_LIMIT_WINDOW_MS` | `600000` | Rate limit window (10 min) |

## Notes

- The API is append-only. There is no delete route.
- Basic rate limiting is enabled for emergency submissions.
- When `DATABASE_URL` is not set, the API falls back to local SQLite for development.
