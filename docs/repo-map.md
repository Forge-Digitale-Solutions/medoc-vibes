# Carte du monorepo — Médoc Vibes

**Repo :** https://github.com/Forge-Digitale-Solutions/medoc-vibes  
**Branches :** `dev` = travail (défaut) · `main` = prod  
**Handoff :** [handoff-ia.md](handoff-ia.md)

## Racine

| Chemin | Rôle |
|---|---|
| `api/` | AdonisJS 7 + PostGIS — JSON API (`/v1/feed/around`, auth starter) |
| `site/` | Landing Next.js — https://medocvibes.fr |
| `ops/` | Dashboard KPI Next.js (léger, non déployé) |
| `packages/shared` | Types / contrats partagés |
| `data/` | Allowlist CSV 56 communes |
| `docs/` | Pack handoff IA — entrée [`handoff-ia.md`](handoff-ia.md) |
| `ios/` · `android/` | Stubs natifs (README seulement) |
| `.github/workflows/site-ghcr.yml` | Build Docker site → GHCR `:latest` + webhook Dokploy |

## API (`api/`)

| Élément | Détail |
|---|---|
| Stack | AdonisJS, Lucid, Postgres + PostGIS |
| Local DB | `docker-compose.yml` → port hôte **55432** |
| Dockerfile | Présent ; **pas encore** de workflow GHCR / service Dokploy |
| Feed | `GET /v1/feed/around` + `/count` — seed local |
| Ingest OD | Stub `app/services/ingest_todo.ts` |
| README | Smoke curl dans `api/README.md` |

## Site (`site/`)

| Élément | Détail |
|---|---|
| Stack | Next.js (standalone Docker, Node 22, **PORT=80**) |
| Pages | `/`, `/contact`, `/partenaires`, `/mentions-legales` |
| API routes | `/api/waitlist`, `/api/contact` → Resend |
| Image | `ghcr.io/forge-digitale-solutions/medoc-vibes-site` |

## Workspaces npm

```text
npm install          # racine
npm run dev:api      # :3333
npm run dev:site     # :4310
npm run dev:ops      # :4311
```

Node **≥ 24** (engines racine ; Adonis 7).
