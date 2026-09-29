# Médoc Vibes

Monorepo de l’app touristique **Médoc Vibes** (festif / loisir Médoc) : API, dashboard ops, landing, contrats partagés, stubs apps natives.

## Structure

| Dossier | Rôle |
|---------|------|
| `api/` | Backend **AdonisJS** (JSON API) — Docker-ready Dokploy |
| `ops/` | Dashboard KPI léger **Next.js** |
| `site/` | Landing placeholder **Next.js** |
| `packages/shared` | Types + stub OpenAPI partagés |
| `ios/` | Placeholder SwiftUI (+ README) |
| `android/` | Placeholder Kotlin/Compose (+ README) |

## Prérequis

- **Node.js ≥ 24** (AdonisJS 7)
- npm 11+
- Postgres **externe** (projet infra / Dokploy) — **pas obligatoire** pour booter en local (SQLite par défaut)

## Démarrage local

```bash
# À la racine (workspaces npm)
npm install

# API (http://localhost:3333)
cd api
cp .env.example .env
node ace generate:key
npm run dev

# Ops KPI (http://localhost:4311)
cd ../ops && npm run dev

# Site landing (http://localhost:4310)
cd ../site && npm run dev
```

Depuis la racine :

```bash
npm run dev:api
npm run dev:ops
npm run dev:site
```

### Base de données

- **Local** : SQLite (`api/tmp/db.sqlite3`) — aucune Postgres locale requise.
- **Prod / Dokploy** : définir `DATABASE_URL` (ou `DB_CONNECTION=pg` + `DB_HOST` / `DB_USER` / …) vers la Postgres partagée du projet infra.
- Ne pas committer de secrets : uniquement `.env.example`.

## Deploy Dokploy

1. Service container sur `api/` avec le `Dockerfile` fourni.
2. Variables d’env : `APP_KEY`, `DATABASE_URL`, `HOST=0.0.0.0`, `PORT=3333`, `NODE_ENV=production`, CORS si besoin.
3. `ops/` et `site/` : services Node/Next séparés (ou static export plus tard).
4. Postgres gérée hors de ce repo (infra).

## Auth API (scaffold)

Endpoints déjà présents via le starter kit :

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/account/profile` (auth)
- `POST /api/v1/account/logout` (auth)

## Licence

Privé — Médoc Vibes.
