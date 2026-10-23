# Médoc Vibes — contrats API lecture (v1)

**Date :** 2026-10-01 (maj 2026-10-05 — feed sans bride 15 km)  
**Statut :** conception (lecture seule, 4 écrans handoff)  
**YAML machine-readable :** [openapi-v1.yaml](openapi-v1.yaml)  
**Sources :** [data-model-sync.md](data-model-sync.md) §5 · [maquette-v2-data.md](maquette-v2-data.md) · [maquettes-vs-data.md](maquettes-vs-data.md) · [perimeter-medoc.md](perimeter-medoc.md) · [parcours](app-journey-brainstorm.md)

**Hors scope :** auth, favoris cloud, CMS partenaire CRUD, ratings, live IRVE, Dokploy.

---

## Principes transverses

| Règle | Contrat |
|---|---|
| Pas de notes / avis | **Aucun** champ `rating`, `stars`, `reviews_count` |
| CTA conditionnels | URLs nullables ; le client **n’affiche** le bouton que si URL non nulle |
| Badges source | `badge`: `ot` \| `agenda` \| `partenaire` \| `autre` (UI : OT · Agenda · Partenaire) |
| Distances | Tri feed **serveur** (near→far). **Fiche** : toujours afficher le **km** user ↔ POI (client haversine depuis origine + `lat`/`lon`) ; min piéton si &lt; ~2 km. Pas de `eta_min` API |
| Portée feed | **Pas de cut-off produit à 15 km** — un lieu à 16 km n’est pas exclu. Ordre = partenaires d’abord puis distance + **pagination `cursor`** |
| IRVE hint | Défaut **3 km** (fiche / nearby — distinct du feed) |
| Périmètre | Items syncés = allowlist **56 communes** ; `commune` query = fallback geo user, pas filtre d’inclusion serveur |
| Fraîcheur | Champ `data_as_of` (ISO timestamptz) = dernier `sync_runs` ok pertinent |
| Hide-if-empty | Champs optionnels absents ou `null` → UI masque (horaires, prix, media, amenities, CTA) |

Base path : `/v1` (AdonisJS `api/`). Content-Type : `application/json`.

---

## Enums

```text
ChipSlug     = tout | restos-bars | sorties | culture | vide-greniers | marches-fetes | surf-cote
EntityType   = place | event
Badge        = ot | agenda | partenaire | autre
PlaceKind    = poi | venue | heritage | beach | sport
```

---

## Erreurs

| HTTP | Quand | Body (schéma `Error`) |
|---|---|---|
| `400` | Query invalide (lat/lon hors plage, `radius_km` ≤ 0 si fourni, chip inconnu, `commune` sans geo et sans lat/lon) | `{ "error": { "code": "bad_request", "message": "…" } }` |
| `404` | Place / event inconnu, soft-deleted (`is_active=false`), ou hors périmètre exposé | `{ "error": { "code": "not_found", "message": "…" } }` |
| `200` + empty | Feed / events liés à 0 items | **Pas une erreur** — voir `empty` |

Pas de `5xx` contractuel en conception (infra plus tard).

---

## GET `/v1/feed/around`

**Écran :** 02a Autour de moi · 02b empty Vide-greniers (même endpoint).

### Query

| Param | Type | Requis | Notes |
|---|---|---|---|
| `lat` | number | * | WGS84. Client : GPS, **Saint-Laurent-Médoc** (défaut refus géoloc), ou centroïde après sheet CP/ville — [parcours](app-journey-brainstorm.md) |
| `lon` | number | * | Idem |
| `commune` | string | non | Nom commune allowlist (ex. `Saint-Laurent-Médoc`) via bouton header → sheet. Résolu serveur → centroïde ; si lat/lon **et** commune : lat/lon gagnent |
| `radius_km` | number | non | **Optionnel — technique / perf seulement.** Pas de défaut produit 15. Si omis : **pas** de bride distance (allowlist + order distance). Si fourni : préfiltre PostGIS éventuel (valeur large recommandée) — **jamais** cut-off produit 15 km |
| `chip` | ChipSlug | non | Défaut `tout` |
| `limit` | integer | non | Défaut `50`, max `100` — page courante |
| `cursor` | string | non | Pagination opaque (`next_cursor`) — scroll / pages suivantes ; ordre stable near→far |

### Réponse `200` — `FeedAroundResponse`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "query": {
    "lat": 45.15,
    "lon": -0.82,
    "radius_km": null,
    "chip": "tout",
    "commune": "Saint-Laurent-Médoc"
  },
  "items": [
    {
      "id": "8f3c…",
      "entity_type": "place",
      "name": "…",
      "title": null,
      "chip_slug": "restos-bars",
      "subtitle": "Bar · Lacanau-Océan",
      "lat": 44.97,
      "lon": -1.08,
      "media": { "url": "https://…", "license": "…", "attribution": "…" },
      "badge": "ot",
      "opening_or_when": "Dès 19h",
      "booking_or_ticket_url": null,
      "partner_boost": false
    },
    {
      "id": "a21b…",
      "entity_type": "event",
      "name": null,
      "title": "Marché nocturne",
      "chip_slug": "marches-fetes",
      "subtitle": "Ce soir · Soulac-sur-Mer",
      "lat": 45.51,
      "lon": -1.12,
      "media": null,
      "badge": "agenda",
      "opening_or_when": "18h–22h",
      "booking_or_ticket_url": null,
      "partner_boost": false
    }
  ],
  "next_cursor": null,
  "empty": null
}
```

### Item feed — `FeedItem`

| Champ | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `entity_type` | `place` \| `event` | Route fiche : places vs events |
| `name` | string \| null | Rempli si `place` |
| `title` | string \| null | Rempli si `event` |
| `chip_slug` | ChipSlug (≠ `tout`) | Chip principale carte |
| `subtitle` | string | 1 ligne factuelle (type · commune · quand) |
| `lat`, `lon` | number | Obligatoires dans ce feed (sinon exclus) |
| `media` | MediaRef \| null | Placeholder UI si null / droits douteux |
| `badge` | Badge | OT / Agenda / Partenaire / autre |
| `opening_or_when` | string \| null | Hide-if-empty |
| `booking_or_ticket_url` | string \| null | Place→booking ; event→ticket ; hide CTA si null |
| `partner_boost` | boolean | Ranking éditorial léger |

**Ordre `items` :** partenaires boostés en tête (plafond N) puis organique **distance croissante**. Pages suivantes via `next_cursor` (même ordre).

**Absent volontairement :** `rating`, `eta_min`. `distance_km` non requis MVP (client peut calculer).

### Empty state (02b)

Si `items=[]` :

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "query": { "lat": 45.15, "lon": -0.82, "radius_km": null, "chip": "vide-greniers", "commune": "Saint-Laurent-Médoc" },
  "items": [],
  "next_cursor": null,
  "empty": {
    "chip": "vide-greniers",
    "message": "Aucun vide-grenier à proximité pour le moment.",
    "cta": "suggest_add"
  }
}
```

`cta` valeurs prévues MVP : `suggest_add` (proposer un ajout) · `change_chip` (optionnel UI). Pas d’endpoint séparé pour l’empty.

---

## GET `/v1/feed/around/count`

**Écran :** 02a compteur « N plans » (libellé maquette « à moins de 15 km » = **écart** — pas de bride produit).

### Query

Mêmes paramètres que le feed : `lat`, `lon`, `commune`, `radius_km` (optionnel technique), `chip` — **sans** `limit`/`cursor`.

### Réponse `200` — `FeedCountResponse`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "count": 23,
  "radius_km": null,
  "chip": "tout"
}
```

`count` = total items matching chip + origine (allowlist), **sans** cut-off produit 15 km. Chiffre **réel**, jamais hardcodé. UI : préférer « N plans autour » plutôt que « &lt; 15 km ».

---

## GET `/v1/places/{id}`

**Écran :** 03 Fiche lieu (OD pauvre) · aussi lieu festif partenaire (04a shell).

### Path

| Param | Type |
|---|---|
| `id` | uuid |

### Query (optionnel)

| Param | Notes |
|---|---|
| `include_irve` | `true`\|`false` — défaut `true`. Si true, embed `nearby_irve` (rayon 3 km autour du lieu) |

### Réponse `200` — `PlaceDetail`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "place": {
    "id": "8f3c…",
    "kind": "venue",
    "name": "…",
    "chip_slug": "restos-bars",
    "short_description": "…",
    "description": "…",
    "lat": 44.97,
    "lon": -1.08,
    "commune": "Lacanau",
    "insee_code": "33214",
    "opening_hours": "Mar–Dim 19h–1h",
    "amenities": ["terrasse", "pmr"],
    "media": [],
    "booking_url": null,
    "website_url": "https://…",
    "phone": null,
    "badge": "ot",
    "attribution": "…",
    "license": "Licence Ouverte 2.0",
    "partner_id": null
  },
  "nearby_irve": {
    "count": 2,
    "radius_km": 3,
    "stations": [
      { "id": "…", "lat": 44.972, "lon": -1.075, "power_kw": 22, "operator_name": "…" }
    ]
  },
  "ctas": {
    "go": true,
    "book": false,
    "website": true
  }
}
```

### Règles CTA (`ctas` dérivé serveur pour clarté UI)

| CTA | Visible si |
|---|---|
| **Y aller** (`go`) | toujours `true` si lat/lon présents |
| **Réserver** (`book`) | `booking_url != null` |
| **Site** (`website`) | `website_url != null` |

`amenities` : tableau 0–n de slugs connus ; vide OK.  
`nearby_irve` : **statique** PAN ; pas de `available_now`. Client peut aussi appeler `GET /v1/irve/nearby` avec lat/lon du lieu.

`404` si id inconnu / inactif.

---

## GET `/v1/events/{id}`

**Écran :** 04a / 04b fiche event (billets conditionnels vs Y aller seul).

### Réponse `200` — `EventDetail`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "event": {
    "id": "a21b…",
    "title": "Les Pibales",
    "description": "…",
    "genre_or_keywords": "Rock · Folk",
    "chip_slug": "sorties",
    "starts_at": "2026-10-04T18:00:00Z",
    "ends_at": "2026-10-04T23:00:00Z",
    "price_label": "12 €",
    "lat": 45.18,
    "lon": -1.05,
    "commune": "Hourtin",
    "place_id": "c90e…",
    "media": null,
    "ticket_url": "https://…",
    "registration_url": null,
    "website_url": null,
    "badge": "partenaire",
    "attribution": "…",
    "license": null,
    "partner_id": "…"
  },
  "place_summary": {
    "id": "c90e…",
    "name": "La Guinguette du Lac",
    "commune": "Hourtin"
  },
  "ctas": {
    "go": true,
    "tickets": true,
    "website": false
  }
}
```

| CTA | Visible si |
|---|---|
| **Y aller** (`go`) | lat/lon présents (04b : CTA cœur si pas de billets) |
| **Billets** (`tickets`) | `ticket_url` ou `registration_url` non null |
| **Site** (`website`) | `website_url != null` |

`place_summary` : null si event orphelin (Q ouverte Place dérivée).  
`price_label`, `genre_or_keywords`, horaires : hide-if-empty.  
`404` si inconnu / inactif / passé hors fenêtre d’exposition (politique d’exposition : events futurs + en cours ; détails passés hors MVP lecture).

---

## GET `/v1/places/{id}/events`

**Écran :** 04a bloc « Prochains événements ».

### Query

| Param | Type | Notes |
|---|---|---|
| `from` | string | Défaut `now` (ISO ou littéral `now`) |
| `limit` | integer | Défaut `20`, max `50` |

### Réponse `200` — `PlaceEventsResponse`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "place_id": "c90e…",
  "items": [
    {
      "id": "a21b…",
      "title": "Les Pibales",
      "starts_at": "2026-10-04T18:00:00Z",
      "ends_at": "2026-10-04T23:00:00Z",
      "genre_or_keywords": "Rock · Folk",
      "price_label": "12 €",
      "ticket_url": "https://…",
      "badge": "partenaire"
    }
  ],
  "empty": null
}
```

Si aucun event à venir :

```json
{
  "data_as_of": "…",
  "place_id": "c90e…",
  "items": [],
  "empty": {
    "message": "Aucune date à venir.",
    "cta": "suggest_add"
  }
}
```

`404` si place inconnue. Empty array = **200**, pas 404.

---

## GET `/v1/irve/nearby`

**Écran :** hint IRVE (02a / 03).

### Query

| Param | Type | Requis | Notes |
|---|---|---|
| `lat` | number | oui | |
| `lon` | number | oui | |
| `radius_km` | number | non | Défaut `3` |

### Réponse `200` — `IrveNearbyResponse`

```json
{
  "data_as_of": "2026-10-01T03:12:00Z",
  "count": 2,
  "radius_km": 3,
  "stations": [
    {
      "id": "…",
      "lat": 44.972,
      "lon": -1.075,
      "power_kw": 22,
      "operator_name": "…",
      "address": null
    }
  ]
}
```

**Pas** de champ `available` / `available_now`. Snapshot PAN. Distance affichée = client. `count=0` → hide hint UI.

---

## Mapping écrans → endpoints

| Écran | Calls |
|---|---|
| 01 Welcome | Aucun |
| 02a Autour de moi | `GET /v1/feed/around` + `…/count` ; optionnel `GET /v1/irve/nearby` |
| 02b Empty Vide-greniers | `GET /v1/feed/around?chip=vide-greniers` → `empty` |
| 03 Fiche lieu | `GET /v1/places/:id` (± IRVE embed ou call séparé) |
| 04a Sortie partenaire | `GET /v1/places/:id` + `GET /v1/places/:id/events` et/ou `GET /v1/events/:id` |
| 04b Agenda seule | `GET /v1/events/:id` (billets absents → Y aller) |

---

## Non-MVP (ne pas spécifier / builder)

- Auth Google/Apple, favoris sync, search full-text avancée  
- CRUD CMS partenaire, tracking attribution clics  
- Ratings / reviews  
- IRVE live occupation  
- Endpoints write (`POST`/`PATCH`)  

---

*Conception durable — pas d’implémentation Adonis tant que la checklist conception n’est pas bouclée.*
