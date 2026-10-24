# Spécification ingest : DATAtourisme + OpenAgenda

**Date :** 2026-10-24
**Statut :** conception (spec des jobs de sync, pas de code)
**Réf. :** [data-model-sync.md](data-model-sync.md) · [data-sources-audit.md](data-sources-audit.md) · [openagenda-medoc.md](openagenda-medoc.md) · [integrations-soft-fail.md](integrations-soft-fail.md) · [perimeter-medoc.md](perimeter-medoc.md) · [api-contracts.md](api-contracts.md)

> Objet : transformer les flux open data en `places` / `events` dans Postgres/PostGIS, pour que l'API serve un feed réel. **DATAtourisme = primaire** (POI + events), **OpenAgenda = appoint** (events). L'API lit uniquement le cache Postgres, jamais les sources en live sur le chemin user.

---

## 1. Objectif et périmètre

| Inclus | Hors de ce doc |
|---|---|
| Mapping DT (POI + events) et OA (events) vers le schéma | IRVE PAN (snapshot à part, déjà cadré [data-model-sync](data-model-sync.md) §2) |
| Mapping chips / kind, filtre périmètre, dedup, soft-delete, `sync_runs` | Mérimée, data.culture, OSM, Data ES (appoint plus tard) |
| Jobs nocturnes / semi-réel, idempotence | CMS partenaire (0 au launch, [partner-cms-spec](partner-cms-spec.md)) |

Sortie attendue : `places` et `events` peuplés, `sync_runs` journalisé, soft-delete correct. Empty OK partout (stance soft-fail).

---

## 2. Rappel du schéma cible (déjà en base)

Les migrations `places` / `events` existent déjà (colonnes, index, `geom` + trigger GiST). L'ingest remplit ces colonnes ; il ne crée rien.

| Colonne clé | Rôle ingest |
|---|---|
| `source_id` | `datatourisme` \| `openagenda` (FK `sources`, déjà seedé) |
| `external_id` | ID stable chez le producteur ; upsert sur `(source_id, external_id)` |
| `lat` / `lon` | **not null** ; l'ingest **rejette** l'entité sans geo |
| `geom` | maintenu automatiquement par trigger depuis lat/lon |
| `chip_slug` | **not null** ; résolu via mapping §5 |
| `is_active` | soft-delete : `false` si absent du dernier run complet |
| `license` / `attribution` | licence source + producteur |
| `media` | jsonb `[{url, license, attribution}]`, `[]` si droits flous |
| `dedup_key` | clé de fusion (voir §8) |
| `source_updated_at` | date côté producteur (`lastUpdate` DT, maj OA) |

`communes` (allowlist 56, seedée avec `insee_code`, `name`, `lat`, `lon`) = vérité d'inclusion.

---

## 3. DATAtourisme (primaire)

### 3.1 Accès, filtres, pagination

- `GET https://api.datatourisme.fr/v1/catalog` (tous POI) ; endpoints pré-filtrés `/placeOfInterest` (lieux) et `/entertainmentAndEvent` (Fêtes et Manifestations). Header `X-API-Key` (`DATATOURISME_API_KEY`, hors git).
- Réponse : `{ "objects": [...], "meta": { total, page, page_size, total_pages, next, previous } }`. Paginer via **`meta.next`** (URL) ; `page_size` ≤ **100** (défaut 20) ; l'accès direct `page` est limité aux 10k premiers résultats.
- Préfiltre géo : `geo_bounding=top_left_lat,top_left_lon,bottom_right_lat,bottom_right_lon` (bbox Médoc) + `filters=isLocatedAt.address.hasAddressCity.isPartOfDepartment.insee[in]=33`.
- Quotas : ~1000 req/h, ~10 req/s, 20–30 concurrentes.

**Noms de champs DT (confirmés via [docs](https://api.datatourisme.fr/v1/docs)) :** `uuid`, `label` (nom multilingue, ex. `label.@fr`), `type`, `isLocatedAt.geo`, `isLocatedAt.address` (`addressLocality`, `postalCode`, `hasAddressCity.isPartOfDepartment.insee`), `hasDescription`, `hasBeenCreatedBy`, `lastUpdate`, `hasContact.homepage`, `hasMainRepresentation`, `isEquippedWith`. Les sous-champs incertains (horaires, `phone`, `booking_url`, structure média, dates event) sont marqués « à confirmer » ci-dessous.

### 3.2 Mapping POI → `places`

| Colonne | Source DT | Règle |
|---|---|---|
| `source_id` | - | `datatourisme` |
| `external_id` | `uuid` | stable |
| `name` | `label.@fr` | not null |
| `chip_slug` | `type` | mapping §5 |
| `kind` | `type` | mapping §5 |
| `short_description` / `description` | `hasDescription` | truncate |
| `lat` / `lon` | `isLocatedAt.geo` | obligatoire, sinon rejet |
| `commune` | `isLocatedAt.address.addressLocality` | |
| `insee_code` | `isLocatedAt.address.hasAddressCity.isPartOfDepartment.insee` | résoudre vs allowlist |
| `opening_hours` | opening period (à confirmer) | normalisé jsonb |
| `amenities` | `isEquippedWith` (Wifi, CarPark…) | sinon `[]` |
| `media` | `hasMainRepresentation` (structure à confirmer) | §9 (licence) |
| `website_url` | `hasContact.homepage` | null si absent |
| `booking_url` / `phone` | `hasContact` (à confirmer) | null si absent |
| `license` | - | `Licence Ouverte 2.0` |
| `attribution` | `hasBeenCreatedBy` + date | producteur DT |
| `source_updated_at` | `lastUpdate` | |
| `synced_at` | - | `now` |
| `dedup_key` | - | §8 |

### 3.3 Mapping events DT → `events`

| Colonne | Source DT | Règle |
|---|---|---|
| `source_id` | - | `datatourisme` |
| `external_id` | `uuid` | |
| `title` | `label.@fr` | not null |
| `description` | `hasDescription` | |
| `chip_slug` | `type` | mapping §5 |
| `genre_or_keywords` | types / mots-clés | |
| `price_label` | conditions tarifaires (à confirmer) | hide-if-empty |
| `starts_at` / `ends_at` | dates event (à confirmer) | null si inconnu |
| `lat` / `lon`, `commune` / `insee_code` | lieu event | peut différer du Place |
| `ticket_url` / `registration_url` / `website_url` | liens billetterie (à confirmer) | hide-if-empty |
| `media`, `license`, `attribution`, `source_updated_at`, `synced_at`, `dedup_key` | - | idem POI |

---

## 4. OpenAgenda (appoint)

- Route **par agenda** : `GET https://api.openagenda.com/v2/agendas/{agendaUID}/events`, header `key: oa_pk_…` (clé publique, hors git). La lecture transverse `GET /v2/events` (toutes agendas) existe mais **nécessite une demande d'accès** à support@openagenda.com.
- **Sélection** : shortlist d'agendas UIDs ([openagenda-medoc](openagenda-medoc.md)) + filtre géo **`geo[northEast][lat/lng]` / `geo[southWest][lat/lng]`** (bbox Médoc) + `adminLevel2[]=Gironde` + rejet hors **allowlist 56 communes**.
- Pagination : curseur **`after`**, `size` ≤ **300**. Fréquence : **6 h** (semi-réel, cache Postgres).
- Events OA = **event-only** (`place_id` null par défaut, Q6 orphelin OK).

| Colonne | Source OA | Règle |
|---|---|---|
| `source_id` | - | `openagenda` |
| `external_id` | `uid` | entier |
| `title` | `title` (multilingue → `fr`) | not null |
| `description` | `longDescription` (fallback `description`) | markdown |
| `chip_slug` | `keywords` / titre | mapping §5 |
| `genre_or_keywords` | `keywords` (join fr) | |
| `price_label` | `conditions` | hide-if-empty |
| `starts_at` / `ends_at` | `timings[0].begin` / dernière `end` | null si timings vides |
| `lat` / `lon` | `location.latitude` / `location.longitude` (à confirmer via /lieux/structure) | obligatoire |
| `commune` / `insee_code` | `location.city` / `location.adminLevel4` | rejet si hors allowlist |
| `registration_url` | `registration` (entrée `link`) | hide-if-empty |
| `website_url` | `canonicalUrl` | |
| `media` | `image` (`base` + `filename`) | §9 |
| `license` | `rights.license` (Licence Ouverte le plus souvent) | |
| `attribution` | `rights.publisher` / `rights.licensor` | |

---

## 5. Mapping chips et kind

`chip_slug` est **not null** : toute entité doit résoudre un chip, sinon fallback (open question §12).

| Source / type | `chip_slug` | `kind` (place) | Notes |
|---|---|---|---|
| DT Restaurant / Bar / Food | `restos-bars` | `venue` | |
| DT EntertainmentAndEvent / OA sorties | `sorties` | - | events |
| DT musée / lieu culturel / Mérimée | `culture` | `heritage` (monuments) | |
| OA / DT keywords vide-grenier | `vide-greniers` | - | densité CMS prioritaire |
| DT FMA / marché / OA marché | `marches-fetes` | `venue` | |
| DT SportsAndLeisureActivity surf / Data ES | `surf-cote` | `sport` \| `beach` | |
| Plages (PIGMA / DT beach) | `surf-cote` | `beach` | plus tard |

Le tableau de référence reste [data-model-sync](data-model-sync.md) §1.3 ; ici on le rend exécutable. Affinage des règles après premières densités (Q7 : vide-greniers vs marches-fetes).

---

## 6. Filtre périmètre (vérité d'inclusion)

1. **bbox** = préfiltre technique seulement (jamais critère d'inclusion).
2. **allowlist 56 communes** = vérité : rejet si `commune` / `insee_code` hors CSV ([perimeter-medoc](perimeter-medoc.md)).
3. **lat/lon obligatoires** : rejet si absent (le feed ne liste que du géolocalisé).
4. Résolution `commune` → `insee_code` via la table `communes` (seedée).

---

## 7. Idempotence, soft-delete, journal

- **Upsert** sur `(source_id, external_id)`.
- **`content_hash`** (sur payload normalisé) → no-op si inchangé (évite réécritures inutiles).
- **Soft-delete** : entité absente du dernier run **complet** source → `is_active = false` (jamais de hard delete).
- **`sync_runs`** : `status` `running` \| `ok` \| `partial` \| `failed`, `stats` `{fetched, upserted, soft_deleted, skipped}`, `error_summary`.
- DT : batch nocturne. OA : 2–6 h. Retries idempotents.

---

## 8. Dédoublonnage

- **Intra-source** : `UNIQUE (source_id, external_id)`.
- **Cross-source events** (DT vs OA) : `(starts_at ± 2h, geo ~150 m, title normalisé)`.
- **`dedup_key`** : `normalize(nom/titre) + geohash ~100–150 m + type grossier` ; fusion automatique **conservatrice** (score élevé seulement).
- Priorité d'affichage : `partner_cms` > `datatourisme` > `openagenda` > autres.

---

## 9. Média et licence (Q10)

- Ne stocker une image que si **licence claire** ; sinon `media = []` (placeholder UI).
- `attribution` obligatoire (producteur DT, agenda OA).
- Pas de photo « fake » présentée comme le lieu.

---

## 10. Soft-fail et erreurs

- Empty OK : feed `200` + `items: []` + `empty`.
- Sync partiel : `status = partial`, l'API sert le cache restant.
- Jamais bloquer le shell app ni casser un run complet pour un item malformé (skip + compteur `skipped`).

---

## 11. Hors scope (rappel)

- IRVE PAN, Mérimée, data.culture, OSM, Data ES, GTFS : appoint plus tard, non requis pour les 4 écrans.
- CMS partenaire : source vérité festif, 0 au launch.

---

## 12. Décisions actées (2026-10-24) + questions restantes

- **Champs DT** : figés via [docs](https://api.datatourisme.fr/v1/docs) (§3.1). **Champs OA** : figés via [docs](https://developers.openagenda.com/evenements/structure) (§4).
- **OA** : shortlist d'agendas UIDs + filtre `geo` bbox + allowlist 56 communes. Lecture transverse `/v2/events` (toutes agendas) = option à demander plus tard.
- **Fréquence OA** : 6 h.
- **Events passés** : soft-delete à `ends_at < now - 24 h`.
- **Fallback chip** : event → `sorties`, lieu → `culture`.
- **`raw_payloads`** : activer dès le premier run.

### Questions restantes

1. Confirmer les sous-champs encore incertains (DT : horaires, `phone`, `booking_url`, structure `hasMainRepresentation`, dates event ; OA : `location.latitude` / `longitude`) sur un payload réel.

---

*Conception seule : pas de code, pas de migration, pas de secret. Précède l'écriture des jobs dans `api/app/services/`.*
