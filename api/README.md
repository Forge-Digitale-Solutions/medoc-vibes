# Médoc Vibes API (AdonisJS + PostGIS)

JSON API for the Médoc Vibes feed. Local stack: **Postgres 16 + PostGIS** via Docker Compose.

## Prerequisites

- Node.js ≥ 24
- Docker + Docker Compose
- npm

## Quick start

```bash
cd api

# 1) PostGIS
docker compose up -d
# wait until healthy: docker compose ps

# 2) Env
cp .env.example .env
node ace generate:key

# 3) Install + migrate + seed
npm install
node ace migration:run
node ace db:seed

# 4) Dev server (http://127.0.0.1:3333)
npm run dev
```

Default DB credentials (local only, not for prod):

| Var | Value |
|-----|-------|
| Host | `127.0.0.1` |
| Port | `55432` |
| User / password / db | `medoc` / `medoc` / `medoc_vibes` |

## Smoke test (curl)

Origin = Saint-Laurent-Médoc (product default when geolocation is denied):

```bash
curl -sS 'http://127.0.0.1:3333/v1/feed/around?lat=45.1502&lon=-0.8235&chip=tout&limit=10' | jq .

curl -sS 'http://127.0.0.1:3333/v1/feed/around/count?lat=45.1502&lon=-0.8235&chip=tout' | jq .

# Resolve origin from allowlist commune name
curl -sS 'http://127.0.0.1:3333/v1/feed/around?commune=Saint-Laurent-Médoc&limit=5' | jq .

# Empty chip example
curl -sS 'http://127.0.0.1:3333/v1/feed/around?lat=45.15&lon=-0.82&chip=vide-greniers' | jq .
```

Feed order: **partner-boosted first**, then organic **near → far**. No product hard cut-off at 15 km. Optional `radius_km` is a technical filter only. Pagination via opaque `cursor` / `next_cursor`.

## Endpoints (this slice)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | Health `{ ok: true }` |
| GET | `/v1/feed/around` | OpenAPI-aligned feed |
| GET | `/v1/feed/around/count` | Counter |
| POST | `/api/v1/auth/*` | Starter-kit auth scaffold (not OpenAPI read API) |

Not in this slice (documented stubs / TODO): place/event detail, IRVE nearby, DATAtourisme / OpenAgenda ingest jobs. See `app/services/ingest_todo.ts`.

## Schema notes

- Extension `postgis`
- Tables: `sources`, `communes` (56-commune allowlist), `partners`, `places`, `events`, `sync_runs` (+ starter `users` / tokens)
- `places` / `events` / `communes`: `lat`/`lon` + `geom geography(Point,4326)` maintained by trigger, **GiST** index
- Allowlist CSV: `database/data/medoc-communes-insee-map.csv` (also mirrored at repo `data/medoc-communes-codes-postaux.csv`)

## Deploy (Dokploy, later)

- Dockerfile listens on `HOST=0.0.0.0` and `PORT` from the platform
- Set `DATABASE_URL` (or `DB_*`) to shared Postgres **with PostGIS**
- Never commit secrets; use `.env.example` only

## Scripts

```bash
npm run dev          # ace serve --hmr
npm run build        # ace build
node ace migration:run
node ace db:seed
node ace migration:rollback
```
