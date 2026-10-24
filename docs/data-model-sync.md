# Médoc Vibes — modèle de données & plan de sync

**Date :** 2026-10-01 (soir — feedback Anthony) · maj 2026-10-02 Q3 PostGIS  
**Statut :** conception (avant code app lourd)  
**Références :** [contexte](project-context.md), [maquette v2 data](maquette-v2-data.md), [maquettes ↔ data](maquettes-vs-data.md), [audit sources](data-sources-audit.md), [notes produit](product-notes.md), [auth-explorer](auth-explorer.md), [partner-cms-spec](partner-cms-spec.md), [integrations soft-fail](integrations-soft-fail.md), [parcours app](app-journey-brainstorm.md)

**Stack cible :** `api/` AdonisJS · Postgres partagée **+ PostGIS** (infra) · containers Dokploy  
**UI figée :** pas de ★ MVP · CTA conditionnels · badges OT / Agenda / Partenaire · distances affichées (km ; min piéton &lt; 2 km) · hint IRVE statique

---

## 1. Entités cœur

### Place

Lieu géolocalisé affiché en liste « autour de moi » et en fiche (écran 03).

| Champ logique | Rôle |
|---|---|
| `id` | UUID interne |
| `kind` | `poi` \| `venue` \| `heritage` \| `beach` \| `sport` (sous-types métier) |
| `name`, `short_description`, `description` | Affichage |
| `chip` | Chip UI principale (voir mapping §1.3) |
| `lat`, `lon` | Obligatoires pour liste géo ; sinon exclu du feed « autour » |
| `geom` | `geography(Point, 4326)` PostGIS — index GiST ; sync depuis lat/lon |
| `commune`, `insee_code` | Sous-titre / filtres ville |
| `opening_hours` | Texte ou JSON normalisé ; **hide-if-empty** |
| `amenities[]` | Tags structurés connus (PMR, terrasse…) ; 0–n |
| `media[]` | URLs + licence ; placeholder UI si vide / droits douteux |
| `booking_url`, `website_url`, `phone` | CTA conditionnels |
| `partner_id` | Nullable — boost + badge Partenaire |
| Provenance | Voir §3 |

**Règle UI :** fiche OD pauvre = nom, type, commune, geo, description courte, amenities connus, IRVE proche, CTA **Y aller** seul. Pas de « Réserver » sans URL.

### Event

Occurrence temporelle (sortie, marché, fête, vide-grenier, concert).

| Champ logique | Rôle |
|---|---|
| `id` | UUID |
| `title`, `description`, `genre_or_keywords` | Affichage |
| `chip` | Sorties / Culture / Vide-greniers / Marchés & fêtes |
| `starts_at`, `ends_at` | Filtre « ce soir / week-end » ; hide-if-empty horaires |
| `price_label` | Texte libre (« 12 € », « gratuit ») ; hide-if-empty |
| `lat`, `lon` | Lieu de l’event (peut différer du Place lié) |
| `geom` | PostGIS Point — même règle que Place |
| `place_id` | Nullable — lien vers Place (fiche sortie 04a : liste « prochains events ») |
| `ticket_url`, `registration_url`, `website_url` | CTA **Billets** / **Site** conditionnels |
| `partner_id` | Nullable |
| Provenance | Voir §3 |

**Règle UI :** 04a (Partenaire) = events + Billets si URL + Site ; 04b (Agenda seule) = pas de billets, **Y aller**.

### Category / chip mapping

Chips UI ≠ ontologies sources. Une table de mapping + enum stable côté API.

| Chip UI (`chip_slug`) | Sources prioritaires | Filtres techniques (MVP) |
|---|---|---|
| `tout` | Union | bbox + chips ci-dessous ; exclure hébergement lourd si hors scope |
| `restos-bars` | DATAtourisme, OSM appoint | DT Restaurant / Bar / Food… ; OSM amenity restaurant\|bar\|cafe\|pub\|fast_food |
| `sorties` | OA, DT events, Partner CMS | EntertainmentAndEvent futurs ; OA ; CMS `sortie\|concert\|guinguette` |
| `culture` | DT, data.culture, Mérimée, OA | Lieux culturels + monuments (badge patrimoine) + events culture |
| `vide-greniers` | OA, DT keywords, Partner | Types / mots-clés brocante ; **densité CMS** |
| `marches-fetes` | DT FMA, OA, OSM marketplace | Foire / Marché / Fête |
| `surf-cote` | Data ES (ODS), DT activités, OSM | Équipements aquatiques / surf / beach |

Chaque Place / Event porte **un** `chip_slug` principal (carte liste) + éventuellement `chip_slugs[]` secondaires pour filtres.

### Partner

Compte éditorial / commercial (resto, bar, guinguette, OT partenaire…).

| Champ | Rôle |
|---|---|
| `id`, `name`, `slug` | Identité |
| `status` | `draft` \| `active` \| `paused` |
| `plan` | Abonnement (hors sync OD) |
| `cms_enabled` | Accès publication events / enrichissement Place |
| Contact / branding | Post-MVP ops |

**MVP phase 1 data :** table présente, **0 seed au launch** (défauté Q4) ; empty states OK.  
**CMS headless :** **planifié MVP produit** (CRUD fiche + events + URLs/photos) — pas « post-MVP forever » ; voir [partner-cms-spec](partner-cms-spec.md). Auth partenaire = comptes métier distincts.

### Offer / booking URLs (optionnel)

Pas d’entité « offre » obligatoire en phase 1. Suffit :

- Sur Place : `booking_url`, `website_url`
- Sur Event : `ticket_url`, `registration_url`
- Plus tard : table `offers` (code apéro, QR, attribution — [product-notes](product-notes.md))

### IrveStation (ou embed)

Bornes PAN IRVE (statique). Hint « N bornes à &lt; 3 km » + détail minimal.

| Champ | Rôle |
|---|---|
| `id`, `external_id` | Clé PAN |
| `lat`, `lon`, `power_kw`, `operator_name` | Affichage hint |
| `address` / commune | Optionnel |
| Pas de `available_now` | **Ne pas promettre live** MVP |

Alternative embed : ne pas exposer CRUD IRVE à l’app ; endpoint agrégé `GET /irve/nearby?lat=&lon=&radius_km=3` qui lit la table sync.

### SyncRun + provenance source

| Entité | Rôle |
|---|---|
| `sources` | Catalogue : `datatourisme`, `openagenda`, `data_culture`, `merimee`, `opendatasoft_*`, `irve_pan`, `osm`, `partner_cms` |
| `sync_runs` | Une exécution job : source, started/finished, status, counts, error |
| Champs sur Place/Event/Irve | Voir §3 |

---

## 2. Tables Postgres suggérées

Schéma logique (noms Adonis/Lucid possibles). **Q3 = Avec PostGIS** (revisit 2026-10-02) : colonne `geom` + index **GiST** ; feed via `ST_DWithin` / KNN `ORDER BY geom <-> origin` **serveur**. `lat`/`lon` restent pour l’API et l’affichage. Allowlist communes = vérité d’inclusion sync. Détail parcours : [app-journey-brainstorm.md](app-journey-brainstorm.md) §5.

### `sources`

| Colonne | Type | Notes |
|---|---|---|
| `id` | text PK | ex. `datatourisme` |
| `label` | text | Affichage badge OT / Agenda / … |
| `license` | text | LO 2.0, ODbL… |
| `attribution_template` | text | |
| `badge` | enum | `ot` \| `agenda` \| `partenaire` \| `autre` |

### `sync_runs`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `source_id` | text FK | |
| `started_at`, `finished_at` | timestamptz | |
| `status` | enum | `running` \| `ok` \| `partial` \| `failed` |
| `stats` | jsonb | `{fetched, upserted, soft_deleted, skipped}` |
| `error_summary` | text | |
| `bbox` / `params` | jsonb | Snapshot paramètres job |

### `partners`

| Colonne | Type |
|---|---|
| `id` | uuid |
| `name`, `slug` | text unique |
| `status` | enum |
| `created_at`, `updated_at` | |

### `places`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `source_id` | text FK | |
| `external_id` | text | Unique avec `source_id` |
| `partner_id` | uuid FK null | |
| `name` | text not null | |
| `chip_slug` | text | |
| `kind` | text | |
| `short_description`, `description` | text | |
| `lat`, `lon` | double precision | Conservés pour API / affichage |
| `geom` | geography(Point,4326) | **GiST** ; maintenu depuis lat/lon à l’upsert |
| `commune`, `insee_code` | text | |
| `opening_hours` | jsonb/text null | |
| `amenities` | jsonb | `string[]` |
| `media` | jsonb | `[{url, license, attribution}]` |
| `booking_url`, `website_url`, `phone` | text null | |
| `raw_ref` | text/uuid | Pointeur payload (§3) |
| `license`, `attribution` | text | |
| `source_updated_at` | timestamptz | Date côté producteur |
| `synced_at`, `updated_at` | timestamptz | |
| `is_active` | boolean | Soft-delete sync |
| `dedup_key` | text null | Clé fusion cross-source |

**Contrainte :** `UNIQUE (source_id, external_id)`.

### `events`

Même pattern provenance + :

| Colonne | Type |
|---|---|
| `title` | text |
| `place_id` | uuid null FK → places |
| `starts_at`, `ends_at` | timestamptz |
| `price_label` | text null |
| `genre_or_keywords` | text/jsonb |
| `ticket_url`, `registration_url`, `website_url` | text null |
| + champs provenance / geo (`lat`/`lon`/`geom`) / chip / partner comme places | |

### `irve_stations`

| Colonne | Type |
|---|---|
| `id` | uuid |
| `source_id` | text default `irve_pan` |
| `external_id` | text unique |
| `lat`, `lon` | |
| `geom` | geography(Point,4326) | GiST — hint nearby |
| `power_kw` | numeric null |
| `operator_name`, `address` | text null |
| + provenance minimale | |

### `raw_payloads` (préparé — jsonb in-DB, défaut Q9)

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `source_id`, `external_id` | | |
| `payload` | jsonb | **In-DB dès le schéma** ; S3 plus tard si volume |
| `fetched_at` | timestamptz | |
| `content_hash` | text | Skip upsert si inchangé |

### `chip_mappings` (config)

| Colonne | Type |
|---|---|
| `chip_slug` | text |
| `source_id` | text |
| `match_rules` | jsonb | Types DT, tags OSM, keywords OA… |

### Hors sync OD (phase 1)

- Favoris : **client local** (anonyme) + table `favorites` pour comptes Google/Apple  
- Users / OAuth Google + Apple : **inclus MVP conception** — voir [auth-explorer](auth-explorer.md)  
- Partner CMS auth : comptes métier séparés — [partner-cms-spec](partner-cms-spec.md)

Pas de table `ratings` / `reviews` en MVP.

---

## 3. Champs de provenance (obligatoires)

Sur chaque enregistrement syncé (`places`, `events`, `irve_stations`) :

| Champ | Description |
|---|---|
| `source_id` | `datatourisme` \| `openagenda` \| `data_culture` \| `merimee` \| `opendatasoft:*` \| `irve_pan` \| `osm` \| `partner_cms` |
| `external_id` | ID stable chez le producteur |
| `raw_ref` | FK `raw_payloads.id` ou URI blob |
| `source_updated_at` | `lastUpdate` / équivalent producteur |
| `synced_at` / `updated_at` | Horodatage cache local |
| `license` | Licence Ouverte 2.0, ODbL… |
| `attribution` | Producteur DT (`hasBeenCreatedBy`), OA, etc. |

**Badge UI** dérivé de `sources.badge` :

| Badge | Sources typiques |
|---|---|
| **OT** | DATAtourisme (SIT OT) |
| **Agenda** | OpenAgenda |
| **Partenaire** | `partner_cms` |
| (interne) | Mérimée / data.culture / IRVE / OSM — badge neutre ou libellé source si besoin légal |

Photos : stocker licence média ; **afficher seulement si licence claire** ; sinon placeholder UI (défaut Q10 — [integrations-soft-fail](integrations-soft-fail.md)).

---

## 4. Jobs de sync

> Spec détaillée (mapping, chips, dedup, périmètre) : [ingest-spec.md](ingest-spec.md).

### Périmètre Médoc (constante produit)

**Source de vérité :** allowlist **56 communes** ([perimeter-medoc.md](perimeter-medoc.md), CSV EPCI + Portes, **sans Eysines**).  
Triangle / bbox = **préfiltre API optionnel seulement** — jamais critère d’inclusion.  
Bbox rectangle englobante (préfiltre) : **NO** `45.58, -1.28` → **SE** `44.79, -0.61` (voir perimeter).  
Feed UI : **pas de bride 15 km** — near→far + pagination ; IRVE hint **3 km** (fiche).

### Ordre recommandé (pipeline nocturne + semi-réel)

| # | Job | Fréquence | Mode |
|---|---|---|---|
| 1 | **DATAtourisme** POI + events (geo_bounding / dept 33 + filtre bbox) | Quotidien nuit | Batch paginé (`page_size` ≤ 100, suivre `meta.next`) |
| 2 | **OpenAgenda** appoint — bbox préfiltre + allowlist communes (UIDs shortlist **optionnels**, non bloquants) ; **empty OK** | 2–6 h | Semi-réel, cache serveur ; **DT = source primaire** events |
| 3 | **IRVE PAN** snapshot CSV/GeoJSON | Quotidien (après màj nocturne PAN) | Download + upsert |
| 4 | **data.culture** établissements utiles Culture | Hebdo | Soft / best-effort |
| 5 | **Mérimée** monuments bbox — **branche optionnelle** patrimoine, **pas** cœur festif | Plus tard / soft | Batch lecture seule si activé |
| 6 | **OpenDataSoft / Huwise** (Data ES surf, jeux locaux) | Quotidien ou hebdo selon jeu | API Explore |
| 7 | **OSM appoint** (Overpass filtré amenity/sport/marketplace) | Hebdo, fair-use | Enrichissement, jamais source unique « officielle » |
| 8 | **Partner CMS** | Temps réel / webhook / poll court | Source de vérité festif |

**Hors phase 1 sync obligatoire :** PIGMA plages, BNAC vélo, GTFS — utiles produit mais pas bloquants pour les 4 écrans handoff.

### Idempotence

- Upsert sur `(source_id, external_id)`  
- `content_hash` sur payload → no-op si identique  
- Soft-delete : entités absentes du dernier run **complet** source → `is_active = false` (ne pas hard-delete ; garder raw)  
- `sync_runs` journalise chaque tentative ; retries idempotents

### Déduplication cross-sources

Priorité d’affichage (plus fort gagne le « canonical » listé) :

1. **Partner CMS** (si `partner_id` lié ou même geo+nom validé)  
2. **DATAtourisme**  
3. **OpenAgenda** (events)  
4. **data.culture / Mérimée**  
5. **OSM**

Stratégie MVP :

- `dedup_key` ≈ normaliser(`name`) + geohash ~100–150 m + type grossier  
- Matching automatique **conservateur** : fusion seulement si score élevé ; sinon doublons acceptés avec badges différents  
- Events : dedup `(starts_at ± 2h, geo, title normalize)` entre DT et OA  
- IRVE : clé PAN seule (pas de fusion OSM bornes en MVP)

### Quotas / résilience

- DT : ≤ ~1000 req/h, ≤ 10 req/s → sync batch, pas de proxy live par user  
- Overpass : cache + self-host si régulier  
- API app lit **uniquement Postgres** (sauf météo plus tard)

---

## 5. Endpoints API (4 écrans)

Base : `api/` AdonisJS. Geo feed : **PostGIS** `ORDER BY` distance / KNN serveur (near→far) + pagination `cursor` ; `ST_DWithin` éventuel = perf technique seulement (pas cut-off produit 15 km). `distance_km` optionnel. Affichage min piéton &lt; 2 km peut rester client.

### Écran 02a — Autour de moi (liste)

`GET /v1/feed/around`

| Query | Notes |
|---|---|
| `lat`, `lon` | Requis (ou `commune` fallback) |
| `radius_km` | **Optionnel** — préfiltre technique/perf seulement ; omis = pas de bride produit (pas de défaut 15) |
| `chip` | `tout` \| slugs |
| `sort` | Défaut produit = **partenaires d’abord** puis organique `nearest` (near→far) ; `favorites` = filtre IDs — voir [parcours](app-journey-brainstorm.md) |
| `limit`, `cursor` | Pagination serveur (ordre distance stable) |

**Réponse item :** `id`, `entity_type` (`place`\|`event`), `name`/`title`, `chip_slug`, `subtitle`, `lat`/`lon`, `distance_km` (optionnel, serveur), `media` (ou null), `badge`, `opening_or_when` (nullable), `booking_or_ticket_url` (nullable), `partner_boost` bool — **pas de rating**.

`GET /v1/feed/around/count` — total matching chip + origine (**pas** un count « dans 15 km » produit).

### Écran 02b — Empty Vide-greniers

Même feed avec `chip=vide-greniers` ; si `items=[]` :

```json
{ "items": [], "empty": { "chip": "vide-greniers", "cta": "suggest_add" } }
```

Pas d’endpoint séparé obligatoire — contrat empty dans le feed.

### Écran 03 — Fiche lieu

`GET /v1/places/:id`

Champs : place + amenities 0–n + URLs CTA + provenance/badge + `nearby_irve` optionnel (ou client appelle IRVE).

### Écran 04a / 04b — Fiche sortie / event

`GET /v1/events/:id` — détail event + CTAs conditionnels  

`GET /v1/places/:id/events?from=now` — « Prochains événements » (04a) ; empty array OK  

Si la « fiche sortie » est un **lieu festif** partenaire : `GET /v1/places/:id` avec `kind` adapté + events liés.

### IRVE hint

`GET /v1/irve/nearby?lat=&lon=&radius_km=3`  

→ `{ count, stations: [{ id, lat, lon, power_kw, operator_name }] }` — **statique**, pas `available`.

### Empty / erreurs

| Cas | Comportement |
|---|---|
| 0 items feed | `200` + `empty` + message chip |
| Place/event inconnu / inactif | `404` |
| Sync stale | Header ou champ `data_as_of` (dernier `sync_runs` ok) |
| Geo manquante user | Client : **point défaut Médoc** (pas d’écran CP avant feed) ; API accepte `lat`/`lon` ou `commune` (sheet header) — [parcours](app-journey-brainstorm.md) |

### API auth / CMS (MVP conception — hors lecture publique)

- Auth Apple / Google / magic link + sessions — [auth-explorer](auth-explorer.md) · [auth-contracts](auth-contracts.md)  
- Favoris cloud (compte) uniquement  
- CRUD Partner CMS (planifié MVP produit) — [partner-cms-spec](partner-cms-spec.md)

### Non-MVP API (ne pas builder maintenant)

- Search full-text avancée, tracking clics attribution, ratings, résa native, live IRVE.

---

## 6. MVP phase 1 vs plus tard

### Phase 1 (conception → sync + API lecture + auth + plan CMS)

| Inclus | Exclu / plus tard |
|---|---|
| Tables places / events / irve / sources / sync_runs / **raw jsonb** | Offers / QR attribution |
| Sync **DT primaire** (clé API) + **OA appoint** (allowlist, empty OK) + IRVE | Mérimée cœur festif (branche patrimoine soft / later) |
| Mapping chips + badges OT/Agenda/Partenaire | Notes / avis |
| Endpoints feed / place / event / irve | Résa native ; live IRVE |
| Soft empty states (y compris **0 partenaires** au launch) | Seed partenaires obligatoires |
| **Auth Google + Apple** + explorer sans compte | — |
| Favoris locaux (anon) + sync cloud (auth) | — |
| Table `partners` + schéma CMS / boost (plafond N) **planifiés MVP** | Self-serve facturation abo |
| PostGIS feed (`geom`, GiST, ST_DWithin) | OSM massif en hot path |
| Soft-fail Q6–10 — [integrations-soft-fail](integrations-soft-fail.md) | Data « parfaite » avant wiring |

### Plus tard

- Offers / QR attribution ; notifs week-end  
- Mérimée / data.culture enrichissement patrimoine (soft)  
- PIGMA plages, BNAC, GTFS, météo « quoi faire »  
- Dedup admin outillage ops  
- Multilingue FR/EN ; deep link app PNR  
- Objet S3 pour raw si volume dépasse jsonb

---

## 7. Questions ouvertes / défautés

### Figées ou défautées (2026-10-01 + soir Anthony)

1. ~~**Clé API DATAtourisme**~~ — **OK** : clé reçue ; stocker `DATATOURISME_API_KEY` hors git (Dokploy plus tard). Base `https://api.datatourisme.fr`. Quotas : ≤30 concurrentes, ≤10 req/s, ≤1000 req/h. **DT = primaire — brancher.**  
2. ~~**OpenAgenda (Q2)**~~ — **Appoint**. Sync = **bbox préfiltre** + **allowlist communes** ; UIDs **optionnels** ; **empty OK**. Inventaire : [openagenda-medoc.md](openagenda-medoc.md).  
3. ~~**Périmètre produit**~~ — **OK (Anthony)** : CSV **56 communes** EPCI Médoc (**pas Eysines**). Triangle/bbox = préfiltre. [perimeter-medoc.md](perimeter-medoc.md).  
4. ~~**PostGIS (Q3)**~~ — **Avec PostGIS** MVP (revisit 2026-10-02) — `geom` + GiST + `ST_DWithin` / order by distance. Ancien défaut « sans » trop faible pour autour + au plus près.  
5. ~~**Partner seeds (Q4)**~~ — **0 partenaires au launch** ; empty OK ; **CMS planifié MVP** (pas forever différé).  
6. ~~**Canonical Place vs Event-only (Q6)**~~ — **Event orphelin OK** ; Place dérivée optionnelle si geo+nom stables.  
7. ~~**Fusion chips (Q7)**~~ — **Séparer** Vide-greniers vs Marchés & fêtes au MVP ; réévaluer après densités. Soft-empty OK.  
8. ~~**Mérimée (Q8)**~~ — **Branche optionnelle** Culture/patrimoine ; wire later/soft ; **pas** cœur festif.  
9. ~~**Stockage raw (Q9)**~~ — **jsonb in-DB** (`raw_payloads`) préparé.  
10. ~~**Licence médias DT (Q10)**~~ — **Afficher seulement si licence claire** ; sinon placeholder.

Détail soft-fail / été : [integrations-soft-fail.md](integrations-soft-fail.md).

Checklist : [conception-checklist.md](conception-checklist.md).

---

## Décisions déjà figées (rappel)

- Pas Google Places / pas ★ MVP  
- CTA résa / billets / site **uniquement si URL**  
- Badges **OT · Agenda · Partenaire**  
- Distances feed **serveur** (PostGIS) ; display km ; min piéton seulement si &lt; 2 km  
- IRVE **statique** PAN (`ST_DWithin` 3 km)  
- API lit le **cache Postgres+PostGIS**, pas les sources en live user-path  
- Périmètre = **56 communes** allowlist (pas dept 33, pas Eysines)  
- OpenAgenda = appoint ; DT primaire (brancher clé)  
- MVP conception **avec PostGIS** (Q3 revisit 2026-10-02)  
- **0 partenaires** au launch ; **CMS partenaires planifié MVP**  
- **Auth Google + Apple dans MVP** + explorer sans compte  
- Soft-fail : data présente → afficher ; sinon empty (surtout été)  
- Conception d’abord : pas de Dokploy / pas de dev app tant que la checklist conception n’est pas bouclée  

---

*Document de conception durable — pas de migrations ni scaffold app. Mettre à jour après premier inventaire réel DT/OA bbox Médoc.*
