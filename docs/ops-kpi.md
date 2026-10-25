# Ops KPI — dashboard Next.js (Anthony)

**Date :** 2026-10-01 (maj paliers partenaire / boost N=3)  
**Statut :** conception (lecture seule phase 1)  
**Réf. :** [data-model-sync.md](data-model-sync.md) · [api-contracts.md](api-contracts.md) · [partner-cms-spec.md](partner-cms-spec.md) · [project-context.md](project-context.md)

---

## 1. Intention

`ops/` = **dashboard interne** pour Anthony (équipe Forge Digitale), pas l’app grand public ni le CMS partenaire.

Objectif phase 1 : **voir si la data Médoc est saine** — volumes par source, santé des syncs, chips vides, IRVE — sans outils d’édition ni facturation.

Stack cible : Next.js dans le monorepo (`ops/`), lecture contre Postgres / endpoints admin lecture (concepts de [data-model-sync](data-model-sync.md) + [api-contracts](api-contracts.md)).

---

## 2. KPIs phase 1 (lecture seule)

### 2.1 Volumes places / events par source

| Métrique | Source conceptuelle | Affichage |
|---|---|---|
| Places actives (`is_active`) par `source_id` | `places` + `sources` | Table ou barres : DT, OA, OSM, data.culture, Mérimée, partner_cms… |
| Events actifs par `source_id` | `events` | Idem |
| Places / events par `chip_slug` | `places` / `events` | Vue croisée chip × source (utile QA densités) |
| Total places / events dans le périmètre | Allowlist 56 communes | KPI header |

**Règle :** compter uniquement `is_active = true` ; soft-deleted exclus des totaux « live ».

### 2.2 Santé `sync_runs`

| Métrique | Détail |
|---|---|
| Dernier run par `source_id` | `status` (`ok` \| `partial` \| `failed` \| `running`), `started_at` / `finished_at` |
| Âge des données | Dérivé du dernier run `ok` → aligne `data_as_of` API |
| Stats run | `stats` jsonb : `fetched`, `upserted`, `soft_deleted`, `skipped` |
| Erreurs | `error_summary` + historique N derniers runs (liste) |
| Alerte visuelle | Rouge si dernier run `failed` ou trop vieux (seuil à fixer à l’impl — ex. DT > 36 h) |

Pas besoin d’alerting push en phase 1 : vue dashboard suffit.

### 2.3 Empty rates feed par chip

Proxy **usage produit** sans analytics user lourdes :

| Approche | Description |
|---|---|
| **A — densité cache (recommandée phase 1)** | Pour chaque `chip_slug`, count places+events actifs ; flag « chip à risque empty » si count ≈ 0 (ex. `vide-greniers`) |
| **B — sondes feed (optionnel)** | Appels internes `GET /v1/feed/around` sur 2–3 centroïdes allowlist (Lacanau, Soulac, Pauillac…) × chaque chip → taux `empty != null` |

Afficher : chip, count cache, last probe empty rate (si B), lien mental empty state 02b.

### 2.4 IRVE

| Métrique | Source |
|---|---|
| Nombre de stations syncées | `irve_stations` (`source_id = irve_pan`) |
| Dernier `sync_runs` IRVE | Statut + âge |
| Couverture rough | Stations avec commune/INSEE renseigné vs total (info QA) |

Rappel produit : IRVE **statique** — pas de KPI « disponible maintenant ».

### 2.5 Partner boost & paliers

Phase 1 data = **0 partenaires** OK ([partner-cms-spec](partner-cms-spec.md)) — cartes à zéro / grisées, pas d’erreur.

Quand peuplé :

| Métrique ops | Détail |
|---|---|
| Compteurs `partners` par `status` | `draft` / `active` / `paused` |
| Compteurs par `plan` | **Essentiel** vs **Premium** |
| Places / events avec `partner_id` | CMS live |
| Items `partner_boost = true` | Vs plafond **N=3** / page feed |
| Slots réservés (Premium / Essentiel) | Bool / ratio : parmi les feeds sondés, les slots Premium et Essentiel sont-ils remplis quand un partenaire éligible existe ? |
| Liste partenaires active / paused | Ops commercial léger |

Rappel règles feed : max 3 boosts ; **1 slot réservé Premium** + **1 slot réservé Essentiel** ; puis Premium/Essentiel restants, enfin organique — [partner-cms-spec](partner-cms-spec.md) §6.

---

## 3. Phase 1 — périmètre technique

| Inclus | Exclu |
|---|---|
| Pages lecture seule Next.js | Mutations CRUD lieux / events |
| Agrégats SQL / vues sur tables sync | CMS type Filament / admin éditorial |
| Consommation concepts API lecture (`data_as_of`, feed empty, IRVE nearby count) | Billing / Stripe / abonnements |
| Auth ops **simple plus tard** (voir §4) | Auth produit app (Apple / Google / magic link e-mail) |
| Liens docs conception | Dokploy / prod (après checklist) |

Données lues = **cache Postgres** (même vérité que l’API app) — pas de proxy live DT/OA depuis ops.

Endpoints éventuels (conception, pas à coder maintenant) :

- `GET /v1/ops/stats/overview` — totaux + last syncs  
- `GET /v1/ops/stats/by-source`  
- `GET /v1/ops/stats/by-chip`  
- `GET /v1/ops/sync-runs?source=&limit=`  

Ou requêtes SQL directes depuis `ops/` en interne — choix d’impl post-conception.

---

## 4. Auth ops (pas phase 1 produit)

- **Auth app grand public** (Apple / Google / magic link e-mail + explorer ; non-auth = pubs, connecté = pas de pub) = hors sujet ops — voir [auth-explorer.md](auth-explorer.md).
- **Auth ops** : simple, **plus tard** (Basic Auth reverse-proxy, allowlist IP, ou magic link équipe). Pas de SSO produit, pas de comptes partenaires.
- En conception / local : dashboard peut rester **sans auth** tant qu’il n’est pas exposé publiquement.

---

## 5. Hors scope explicite

- **CMS Filament-like** (édition riche, media library, workflows éditoriaux)
- **Billing** / facturation abonnements partenaires
- CMS partenaire self-serve ([partner-cms-spec](partner-cms-spec.md) — surface séparée)
- Analytics comportementales user (heatmaps, funnels) — hors budget data
- Live IRVE, ratings, attribution offline

Ops ≠ CMS partenaire. Curation manuelle ponctuelle = process humain, pas feature ops phase 1.

---

## 6. Lien checklist / suite

Livrable conception : **done** — [conception-checklist.md](conception-checklist.md).  
Implémentation `ops/` : **après** bouclage conception + infra, en lecture seule d’abord.

---

*Conception seule — pas de scaffold Next ops ni Dokploy dans ce livrable.*
