# Médoc Vibes

Monorepo for the **Médoc Vibes** tourism app (food, nightlife, local leisure in the Médoc): API, ops dashboard, landing, shared contracts, native app stubs.

## Structure

| Path | Role |
|------|------|
| `api/` | **AdonisJS** JSON API — Docker-ready for Dokploy |
| `ops/` | Lightweight **Next.js** KPI dashboard |
| `site/` | **Next.js** landing placeholder |
| `packages/shared` | Shared TypeScript types + OpenAPI stub |
| `ios/` | SwiftUI placeholder (+ README) |
| `android/` | Kotlin/Compose placeholder (+ README) |

## Prerequisites

- **Node.js ≥ 24** (AdonisJS 7)
- npm 11+
- **External Postgres** (infra / Dokploy) — **not required** to boot locally (SQLite by default)

## Local development

```bash
# From repo root (npm workspaces)
npm install

# API — http://localhost:3333
cd api
cp .env.example .env
node ace generate:key
npm run dev

# Ops KPI — http://localhost:4311
cd ../ops && npm run dev

# Landing — http://localhost:4310
cd ../site && npm run dev
```

Or from the root:

```bash
npm run dev:api
npm run dev:ops
npm run dev:site
```

Local ports above are **dev convenience only**.

### Database

- **Local:** SQLite (`api/tmp/db.sqlite3`) — no local Postgres needed.
- **Prod / Dokploy:** set `DATABASE_URL` (or `DB_CONNECTION=pg` + `DB_HOST` / `DB_USER` / …) to the shared infra Postgres.
- Do not commit secrets — `.env.example` only.

## Deploy (Dokploy)

1. Point a Dokploy service at `api/` using the provided `Dockerfile`.
2. **Port:** Dokploy owns publish / reverse-proxy mapping. The app must listen on `HOST=0.0.0.0` and whatever `PORT` Dokploy injects (do not hardcode a public port in docs or config). The Dockerfile default (`3333`) is only a container fallback.
3. Env: `APP_KEY`, `DATABASE_URL`, `HOST=0.0.0.0`, `PORT` (from Dokploy), `NODE_ENV=production`, CORS as needed.
4. `ops/` and `site/`: separate Node/Next services later (or static export).
5. Postgres lives outside this repo (infra project).

## API auth (scaffold)

Already present from the starter kit:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/account/profile` (auth)
- `POST /api/v1/account/logout` (auth)

## License

Private — Médoc Vibes.
