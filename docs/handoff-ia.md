# Médoc Vibes — handoff IA / reprise projet

> **Entrée unique pour une autre IA (ou un humain sans historique Cursor).**  
> Lire ce fichier d'abord, puis ouvrir uniquement les docs liées au ticket.  
> **Secrets hors git** : mots de passe DB, clés API, webhooks — chez Anthony / Dokploy / vault GitHub Secrets. Ne jamais committer de credentials.

**Date de rédaction :** 2026-10-23 (pack versionné dans ce repo)  
**Repo source de vérité :** https://github.com/Forge-Digitale-Solutions/medoc-vibes  
**Prod landing :** https://medocvibes.fr  
**FigJam conception :** https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa  

Les autres fichiers sous `docs/` sont du détail lié — ne pas les dupliquer. Captures media lourdes (LocalWandering, Dokploy…) : **Context Cursor only**, non versionnées ici.

---

## 1. Pitch produit + périmètre

**Médoc Vibes** = app touristique **festive / loisir** pour profiter du Médoc : arriver, explorer (avec ou sans compte), voir **autour de soi**, filtrer (restos, sorties, culture, loisirs locaux).

- **Complémentaire** à l’app Parc naturel régional Médoc (« Mon Médoc » = nature / balades). Vibes = **manger, boire, sortir, activités**.
- Priorité #1 : **ancrage Médoc** (surf, pêche, guinguettes, vides-greniers…) — pas un clone générique Paris.
- Périmètre geo **figé** : allowlist **56 communes** EPCI Médoc (sans Eysines). Triangle/bbox = préfiltre technique seulement — jamais critère d’inclusion.  
  Détail : [perimeter-medoc.md](perimeter-medoc.md) · CSV [data/medoc-communes-codes-postaux.csv](../data/medoc-communes-codes-postaux.csv)

Contexte court : [project-context.md](project-context.md)

---

## 2. Personas / parcours actés

```
Welcome → Auth (Google / Apple / Facebook / magic link) OU Explorer sans compte
       → Permission géoloc OS
            ├─ OK  → origine = GPS
            └─ refus / indispo → origine = Saint-Laurent-Médoc
       → Feed « Autour » immédiat (pas d’écran ville/CP avant)
       → Fiche lieu / event (km user↔POI + CTA)
```

| Règle | Acté |
|---|---|
| Géoloc | Demande à l’ouverture ; **ne bloque jamais** la découverte |
| Défaut sans GPS | **Saint-Laurent-Médoc** (pas Lacanau) |
| Ordre feed | **Partenaires d’abord** (boost plafonné N=3) puis organique **near → far** |
| Portée | **Pas de bride 15 km** ; pagination `cursor` ; rayon PostGIS éventuel = perf seulement |
| Changer d’origine | Bouton header feed → sheet CP / ville (allowlist) |
| Fiche | Toujours afficher **km** ; minutes piéton si &lt; ~2 km ; CTA conditionnels (pas de ★) |
| Explorer vs auth | Anonyme = découverte + **pubs** ; connecté = **pas de pub** + favoris cloud |
| Magic link | **Même device only** MVP (pas de deep link universel) |

Détail écrans / empty states : [app-journey-brainstorm.md](app-journey-brainstorm.md)  
Auth & pubs : [auth-explorer.md](auth-explorer.md)

---

## 3. Décisions produit verrouillées (checklist)

Ne **pas** rouvrir sans demande explicite Anthony.

| # | Décision |
|---|---|
| Périmètre | 56 communes EPCI + Portes ; Eysines hors |
| Data | DATAtourisme **primaire** ; OpenAgenda **appoint** ; soft-fail empty OK |
| Geo | **PostGIS** MVP (`geom` + GiST ; order distance serveur) |
| Launch partenaires | **0 partenaires** OK ; empty states |
| Auth | Google + Apple + Facebook + magic link + Explorer |
| Pubs | Non-connecté = pubs (revenu) ; connecté = **pas de pub** |
| CMS | Mini-CMS headless **planifié MVP** ; comptes métier ≠ OAuth conso |
| Boost | Plafond **N=3** ; plans Essentiel / Premium (1 slot Premium réservé) ; **ads ≠ boost** |
| Feed | Partenaires first · near→far · pagination · **pas** cut-off 15 km |
| Défaut geo | Saint-Laurent-Médoc |
| Magic link | Même device only |
| UI data | Pas de ★ MVP · CTA hide-if-empty · badges OT / Agenda / Partenaire |
| Locals Wandering | Inspiration **post-MVP** SEO/sponsoring seulement — ne pas devenir annuaire desktop / geoblock |

Checklist complète : [conception-checklist.md](conception-checklist.md)

---

## 4. Architecture technique

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ iOS / Android│────▶│  api/ AdonisJS   │────▶│ Postgres + PostGIS  │
│ (stubs)      │     │  /v1/*           │     │ medoc_vibes         │
└─────────────┘     └──────────────────┘     │ (infra-postgis)     │
┌─────────────┐              ▲               └─────────────────────┘
│ ops/ Next   │──────────────┘                         ▲
│ (KPI)       │     sync jobs (prévus)                  │
└─────────────┘     DT / OA / IRVE ─────────────────────┘
┌─────────────┐
│ site/ Next  │── Resend ──▶ contact@ / waitlist
│ medocvibes.fr│── GHCR ──▶ Dokploy Docker
└─────────────┘
```

| Couche | Choix |
|---|---|
| Monorepo | npm workspaces : `api`, `ops`, `site`, `packages/shared` (+ stubs `ios`/`android`) |
| API | AdonisJS 7, Node ≥ 24 |
| Site / ops | Next.js |
| DB | Postgres 16 + **PostGIS 3.4** partagée Dokploy (`infra-postgis`) |
| Deploy site | Docker → GHCR → webhook Dokploy (pas Nixpacks en prod) |
| Deploy API | **Pas encore** de service Dokploy (à préparer) |

Carte fichiers : [repo-map.md](repo-map.md) · Diagrammes : [diagrams.md](diagrams.md)

---

## 5. Data model + sources (résumé)

### Entités

| Entité | Rôle |
|---|---|
| `places` | Lieux géolocalisés (restos, plages, sports…) |
| `events` | Occurrences (marchés, concerts, vide-greniers…) |
| `partners` | Commerçants / OT partenaires (CMS) |
| `irve_stations` | Bornes recharge (hint 3 km fiche) |
| `communes` | Allowlist 56 |
| `sources` / `sync_runs` | Provenance + journal jobs |

`lat`/`lon` + `geom geography(Point,4326)` + index **GiST**. Détail schéma : [data-model-sync.md](data-model-sync.md)

### Sources

| Source | Rôle | Statut intention |
|---|---|---|
| **DATAtourisme** | Primaire POI + events OT | Clé reçue (secret hors git) ; ingest **stub** code |
| **OpenAgenda** | Appoint agenda | Inventaire Médoc fait ; ingest stub |
| data.culture / Mérimée / ODS | Enrichissement | Best-effort / plus tard |
| IRVE (PAN) | Bonus bornes | Snapshot, pas live |
| Partner CMS | Contenu payant | Spec done ; 0 au launch |

FR simple : [sources-plain.md](sources-plain.md) · Audit : [data-sources-audit.md](data-sources-audit.md) · OA : [openagenda-medoc.md](openagenda-medoc.md)  
Soft-fail : [integrations-soft-fail.md](integrations-soft-fail.md)

---

## 6. API / contrats

Base path lecture : `/v1` · Spec : [api-contracts.md](api-contracts.md) · [openapi-v1.yaml](openapi-v1.yaml)

| Endpoint | Statut code (`main`) |
|---|---|
| `GET /v1/feed/around` | **Implémenté** (seed local) — partenaires first, near→far, `cursor` |
| `GET /v1/feed/around/count` | Implémenté |
| `GET /v1/places/:id` · `events/:id` · IRVE nearby | **Non livrés** (contrat conception) |
| Auth starter `/api/v1/auth/*` | Scaffold kit (≠ OAuth produit Google/Apple/FB/magic) |
| Ingest DT/OA | Stub `ingest_todo.ts` |

Règles feed : pas de `rating` ; `radius_km` optionnel technique ; `commune` = origine, pas filtre d’inclusion.

---

## 7. Auth / pubs / partenaires CMS

| Sujet | Résumé | Doc |
|---|---|---|
| Auth conso | 4 providers + Explorer | [auth-explorer.md](auth-explorer.md) |
| Pubs | Anonyme = ads ; compte = sans pub | idem |
| Favoris | Local device (anon) / cloud (auth) | idem |
| CMS partenaire | CRUD fiche + events ; plans Essentiel/Premium ; boost N=3 | [partner-cms-spec.md](partner-cms-spec.md) |
| Attribution offline | Proxies (clics, montre l’écran…) — pas de promesse carte bancaire | [product-notes.md](product-notes.md) |

---

## 8. Infra & deploy

### Landing (prod)

| | |
|---|---|
| Domaine | `medocvibes.fr` + `www` → `178.32.16.231` |
| Panel | https://dokploy.drannocserver.com |
| Image | `ghcr.io/forge-digitale-solutions/medoc-vibes-site:latest` |
| Flux | push `site/**` → CI **Site GHCR** → POST `DOKPLOY_SITE_DEPLOY_WEBHOOK` → Dokploy pull |
| Provider Dokploy | **Docker** (pas GitHub/Nixpacks) · port conteneur **80** |

Doc : [deploy-workflow.md](deploy-workflow.md) · Réf. atasoif : [dokploy-atasoif-reference.md](dokploy-atasoif-reference.md)

### Waitlist / contact

Resend serveur (`RESEND_API_KEY` **Dokploy site only**). Pas Web3Forms / SMTP OVH.  
Détail mails : [contact-notify.md](contact-notify.md)

### Base de données

| | |
|---|---|
| Service | `infra-postgis` (projet Dokploy **infra**, partagé) |
| DB / user | `medoc_vibes` / `medoc_vibes` |
| PostGIS | 3.4 OK |
| Credentials | **Dokploy chez Anthony / vault — pas dans le git.** Noms de vars seulement (§9). Ne jamais coller un password ici. |

### Règles deploy BDD (figées)

- **Pas de wipe** auto au deploy (pas de `migration:fresh`, seed prod, drop).
- Migrations de **schéma additives / backward-safe** OK quand le code change la DB.
- Users + données prod restent intactes.

### Issue #16 — deploy uniforme

https://github.com/Forge-Digitale-Solutions/medoc-vibes/issues/16 — **ouverte**, notes projet = **en pause**.

Points critiques connus :

- ~~`site-ghcr.yml` se déclenchait aussi sur `dev`~~ → **corrigé 2026-10-23** : triggers + tag `:latest` **uniquement** sur `main` (reste de #16 : CI uniforme sha / smoke / rollback encore en pause).
- Pas encore de CI PR / smoke / rollback / GHCR **api**.
- Objectif futur : aligner Spawnzone / À ta soif (sha exact, API Dokploy, Tailscale CI, smoke, rollback).

---

## 9. Env & secrets (noms seulement)

### Site (Dokploy service **site**)

| Variable | Où | Notes |
|---|---|---|
| `RESEND_API_KEY` | Dokploy site | **Obligatoire** waitlist/contact |
| `RESEND_FROM_EMAIL` | Dokploy | Prod : `Médoc Vibes <noreply@medocvibes.fr>` |
| `CONTACT_TO_EMAIL` | Dokploy | Défaut `contact@medocvibes.fr` |
| `RESEND_REPLY_TO` | Dokploy | Confirmation visiteur → `contact@medocvibes.fr` |
| `NEXT_PUBLIC_API_URL` | Dev local | URL API (pas encore de prod API) |

### GitHub Actions (repo)

| Secret | Rôle |
|---|---|
| `DOKPLOY_SITE_DEPLOY_WEBHOOK` | URL HTTPS publique Dokploy `/api/deploy/<token>` |
| `GITHUB_TOKEN` | Implicit — push GHCR (`packages: write`) |

**Pas** de `RESEND_*` dans GitHub. Tailscale **pas** requis pour le flux site actuel.

### API (quand service Dokploy créé)

| Variable | Notes |
|---|---|
| `APP_KEY` | `node ace generate:key` |
| `DATABASE_URL` ou `DB_*` | Vers `infra-postgis` / DB `medoc_vibes` |
| `HOST` | `0.0.0.0` |
| `PORT` | Injecté Dokploy |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | site / ops / apps |
| `DATATOURISME_API_KEY` | Ingest (plus tard) |
| `OPENAGENDA_API_KEY` | Ingest appoint (plus tard) |

Local API : voir `api/.env.example` (compose port **55432**, user/db `medoc` — **≠** prod).

---

## 10. État réel (prod / code / conception / stubs)

| Zone | État |
|---|---|
| Landing medocvibes.fr | **En prod** — pages home, contact, partenaires (« À venir »), mentions ; waitlist Resend + mail confirmation |
| CI site GHCR + webhook | **En prod** (avec risque `dev`→prod, voir #16) |
| DB `medoc_vibes` PostGIS | **Créée** sur infra partagée ; credentials internal |
| API Adonis + feed around | **Code sur `main`** (PR #15) — **non déployée** Dokploy |
| Sync DATAtourisme / OpenAgenda | **Stub** conception + code TODO |
| OAuth Google/Apple/FB/magic | **Conception only** (auth starter kit ≠ produit) |
| CMS partenaires | **Conception only** |
| Apps iOS / Android | **Stubs** README |
| ops KPI | Scaffold Next — **non prod** |
| Maquettes / FigJam | Conception livrée |

PRs marquantes : #1 allowlist · #2–6 landing · #4/#13 GHCR/webhook · #12/#14 Resend · #15 API PostGIS.

---

## 11. Business model

| Flux | Qui paie | Qui voit |
|---|---|---|
| **Pubs réseau** | Inventaire ads | Users **Explorer** (non connectés) |
| **Compte gratuit** | — | Pas de pub ; favoris cloud |
| **Abo partenaires** Essentiel / Premium | Commerçants (hors app) | Badge + boost feed (N=3) pour **tous** |

Inspiration **Locals Wandering** (annuaire+magazine US) : storytelling / sponsoring éditorial = **post-MVP SEO/B2B**, pas pivot MVP. Ne pas geobloquer, ne pas copier Brilliant Directories.  
Analyse : [localwandering-analysis.md](localwandering-analysis.md)

---

## 12. Conventions

| Sujet | Règle |
|---|---|
| Commits | **Conventional Commits EN** (`feat(site): …`, `fix(ci): …`) |
| Copy FR | **Pas de tiret cadratin** (—) ; virgule, point ou tiret court |
| Co-authored | **Interdit** sur commits / PR |
| Branches | `cursor/…` depuis **`dev` à jour** → merge → **`dev`** → quand OK prod merge **`dev` → `main`** (Site GHCR). Sync 2026-10-23 ([#17](https://github.com/Forge-Digitale-Solutions/medoc-vibes/pull/17) · [#18](https://github.com/Forge-Digitale-Solutions/medoc-vibes/pull/18)). |
| Force-push `main` | **Jamais** |
| Secrets | Noms dans docs ; valeurs dans Dokploy / vault Anthony / secrets GH — **jamais** dans git |
| Remotes | GitHub FDS = vérité publique ; Origin Cursor = scratch agents — [remotes.md](remotes.md) |

Préférences durables : [conventions.md](conventions.md)

---

## 13. Comment lancer en local

```bash
git clone https://github.com/Forge-Digitale-Solutions/medoc-vibes.git
cd medoc-vibes
npm install

# API + PostGIS local
cd api
docker compose up -d
cp .env.example .env && node ace generate:key
npm install && node ace migration:run && node ace db:seed
npm run dev   # http://127.0.0.1:3333

# Smoke
curl -sS 'http://127.0.0.1:3333/v1/feed/around?lat=45.1502&lon=-0.8235&chip=tout&limit=10'

# Landing
cd ../site && cp .env.example .env && npm run dev   # :4310

# Ops (optionnel)
cd ../ops && npm run dev   # :4311
```

Détails : README racine + `api/README.md`.

---

## 14. Prochaines étapes recommandées

1. **Préparer service `api` Dokploy** — image Docker, réseau `dokploy-network`, `DATABASE_URL` → `medoc_vibes` (credentials Dokploy / vault Anthony). Pas de seed wipe.
2. **Issue #16** (quand reprise) — d’abord couper `dev` → tag `:latest` / webhook prod ; puis CI uniforme sha + smoke + rollback.
3. **Sync OD** — jobs DATAtourisme (primaire) + OpenAgenda (appoint) + soft-fail ; peupler prod.
4. **Endpoints manquants** — fiches place/event, IRVE nearby (contrats déjà écrits).
5. **Clients natifs** — brancher feed réel ; auth OAuth produit ; pubs SDK anonyme.
6. **CMS partenaires** selon [partner-cms-spec.md](partner-cms-spec.md) (0 partenaires launch OK).

Suivi open : Cursor Context `notes.md` (hors git).

---

## 15. Index des docs (`docs/`)

Chaque entrée = 1 ligne. Chemins relatifs sous `docs/` sauf indication.

| Doc | Contenu |
|---|---|
| **[handoff-ia.md](handoff-ia.md)** | **Ce fichier** — entrée unique reprise projet |
| [conventions.md](conventions.md) | Prefs projet (git / deploy / copy) |
| [repo-map.md](repo-map.md) | Structure monorepo GitHub (chemins / rôles) |
| [project-context.md](project-context.md) | Contexte produit + stack + phase (résumé) |
| [conception-checklist.md](conception-checklist.md) | Décisions figées + livrables conception |
| [app-journey-brainstorm.md](app-journey-brainstorm.md) | Parcours écrans, géoloc, feed, Q1–Q5 |
| [auth-explorer.md](auth-explorer.md) | Auth 4 providers, Explorer, pubs |
| [partner-cms-spec.md](partner-cms-spec.md) | CMS partenaire, Essentiel/Premium, boost N=3 |
| [api-contracts.md](api-contracts.md) | Contrats lecture v1 (humain) |
| [openapi-v1.yaml](openapi-v1.yaml) | OpenAPI machine-readable |
| [data-model-sync.md](data-model-sync.md) | Schéma Postgres/PostGIS + plan sync |
| [data-sources-audit.md](data-sources-audit.md) | Audit sources ouvertes |
| [sources-plain.md](sources-plain.md) | Sources en FR non-tech |
| [perimeter-medoc.md](perimeter-medoc.md) | Allowlist 56 communes |
| [data/medoc-communes-codes-postaux.csv](../data/medoc-communes-codes-postaux.csv) | CSV allowlist |
| [openagenda-medoc.md](openagenda-medoc.md) | Inventaire OpenAgenda Médoc |
| [openagenda-llms-full.txt](openagenda-llms-full.txt) | Dump doc API OpenAgenda (LLM) |
| [integrations-soft-fail.md](integrations-soft-fail.md) | Soft-fail / empty OK |
| [deploy-workflow.md](deploy-workflow.md) | Flux GHCR → Dokploy site |
| [dokploy-atasoif-reference.md](dokploy-atasoif-reference.md) | Référence panel atasoif |
| [contact-notify.md](contact-notify.md) | Resend waitlist / contact |
| [remotes.md](remotes.md) | Origin tmp vs GitHub FDS |
| [diagrams.md](diagrams.md) | Liens FigJam / ERD / flux |
| [ops-kpi.md](ops-kpi.md) | Périmètre dashboard ops |
| [glossary-pnr.md](glossary-pnr.md) | Glossaire vs app PNR |
| [product-notes.md](product-notes.md) | Attribution, compléments produit |
| [maquette-v2-data.md](maquette-v2-data.md) | Direction UI honnête data |
| [maquettes-vs-data.md](maquettes-vs-data.md) | Écarts maquette ↔ data |
| [maquette-v2.md](maquette-v2.md) | Historique maquette v2 |
| [maquette-loop-v1.md](maquette-loop-v1.md) | Historique LOOP v1 |
| [landing-board.md](landing-board.md) | Board landing |
| [landing-claude-design-prompt.md](landing-claude-design-prompt.md) | Prompt design landing |
| [localwandering-analysis.md](localwandering-analysis.md) | Analyse Locals Wandering |
| [claude-share-ff90ac33.md](claude-share-ff90ac33.md) | Cadrage Claude (Angular écarté) |
| [gemini-share-T98N3zDwMmz4.md](gemini-share-T98N3zDwMmz4.md) | Brainstorm Gemini (partiel obsolète) |

### Aussi dans ce pack / hors pack

| Chemin | Contenu |
|---|---|
| [conventions.md](conventions.md) | Prefs projet (git, deploy, copy, mails, feed) |
| [`../data/medoc-communes-codes-postaux.csv`](../data/medoc-communes-codes-postaux.csv) | Allowlist 56 communes (déjà à la racine `data/`) |
| Cursor Context `notes.md` / `archived.md` | Suivi todo (hors git) |
| Credentials DB | **Dokploy chez Anthony / vault — pas dans le git** |
| Media captures (webp LocalWandering, Dokploy…) | **Context Cursor only** — omises du repo (poids) |

---

## 16. Trous connus / vigilance reprise

| Trou | Impact |
|---|---|
| Service **api** Dokploy absent | Code feed non servi en prod |
| Ingest OD non écrit | Base prod vide (sauf migrations futures) |
| Issue #16 pause + `dev` push `:latest` | Risque redeploy prod involontaire |
| Coords centroïde Saint-Laurent-Médoc | Seed/README utilisent ~45.1502, −0.8235 ; CSV allowlist = nom+CP seulement |
| Auth OAuth produit | Non implémentée |
| `remotes.md` section Dokploy Nixpacks | **Obsolète** partiellement — vérité = [deploy-workflow.md](deploy-workflow.md) (Docker GHCR) |
| Health-check / rollback site auto | TODO non bloquant (smoke manuel) |

---

*Handoff versionné dans le repo — 2026-10-23. Entrée unique : ce fichier. Secrets hors git.*
