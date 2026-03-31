# Tiny API

This is the tiny backend for shared public emergency submissions and public `!` votes.

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

- `GET /health`
- `GET /api/emergencies`
- `POST /api/emergencies`
- `POST /api/emergencies/:id/bang`

## Notes

- Data is stored in `api/data/ridiculous-emergencies.db`.
- The API seeds a handful of starter emergencies on boot if they do not already exist.
- Public ranking is based on `bangs desc, created_at desc`.
- A given source can only apply one public `!` per emergency.
- Basic rate limiting is enabled for both emergency submissions and `!` votes.
- Set `ALLOW_ORIGIN` if you want to restrict which frontend origin can call the API.
