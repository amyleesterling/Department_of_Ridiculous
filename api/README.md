# Tiny API

This is the append-only backend for shared public emergency submissions.

## Run locally

```bash
cd api
npm install
npm run dev
```

The API starts on `http://localhost:8787` by default.

## Endpoints

- `GET /health`
- `GET /api/emergencies`
- `POST /api/emergencies`

## Notes

- Data is stored in `api/data/ridiculous-emergencies.db`.
- The API is append-only. There is no delete route.
- Basic rate limiting is enabled for emergency submissions.
- Set `ALLOW_ORIGIN` if you want to restrict which frontend origin can call the API.
