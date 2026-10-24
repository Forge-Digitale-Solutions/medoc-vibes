# Médoc Vibes — brainstorm parcours app

**Date :** 2026-10-02 (maj 2026-10-05 — Q3/Q4/Q5 actées Anthony ; clarif rayon)  
**Statut :** **clarif Anthony actée** (géoloc → feed ; fallback **Saint-Laurent-Médoc** ; **pas de bride 15 km** ; tri near→far + pagination ; partenaires d’abord ; bouton CP/ville ; magic link **même device** MVP).  
**Réf. :** [maquette-v2-data](maquette-v2-data.md) · [maquettes-vs-data](maquettes-vs-data.md) · [auth-explorer](auth-explorer.md) · [data-model-sync](data-model-sync.md) · [partner-cms-spec](partner-cms-spec.md) · [api-contracts](api-contracts.md) · [sources-plain](sources-plain.md)

---

## 1. Parcours écrans / flux

```
Welcome
  ├─ Auth (Google / Apple / magic link e-mail) → sans pubs
  └─ Explorer sans compte → pubs réseau
        ↓
   Permission géoloc OS (à l’ouverture)
  ├─ Autorise → origine = position GPS
  └─ Refuse / indispo → origine = **Saint-Laurent-Médoc** (point défaut figé)
        ↓
   Feed « Autour » (immédiat — pas d’écran ville/CP avant)
  · chips univers (tout, restos-bars, sorties…)
  · **pas de cut-off produit à 15 km** — un lieu à 16 km n’est **pas** exclu
  · ordre : **partenaires d’abord** puis organique **du plus près au plus loin** + **pagination** (scroll / pages)
  · tri Favoris si besoin (filtre IDs)
  · header : bouton position actuelle → sheet CP / ville
        ↓
   Fiche lieu / event
  · distance **km** user ↔ POI (toujours)
  · CTA : Y aller · Billets/Site/Réserver (si URL) · Favori
```

| Étape | Écran | Décision produit (Anthony) |
|---|---|---|
| **Welcome** | 01 | Apple + Google + magic link + Explorer — [auth-explorer](auth-explorer.md). Pas de login obligatoire. |
| **Géoloc** | permission OS | Demande à l’ouverture. **Pas** d’écran localisation dédié avant le feed. |
| **Autorise** | → feed | Origine = GPS ; feed « autour » au plus près. |
| **Refuse / indispo** | → feed | Origine = **Saint-Laurent-Médoc** (allowlist). Pas de saisie ville/CP obligatoire pour continuer. |
| **Feed** | 02a / 02b | Chips = filtres univers. Liste paginée near→far. Compteur maquette « &lt; 15 km » = **écart** (pas de bride produit). Badges OT / Agenda / Partenaire. |
| **Tri + pagination** | sur feed | **Tri** organique = toujours **distance croissante** (near→far). **Pagination** serveur (`cursor` / pages suivantes au scroll). **Pas** de cut-off produit à 15 km. |
| **Ordre liste** | sur feed | **Partenaires en premier** (slots boost, plafond N=3) **puis** organique **du plus près au plus loin**, dans la sélection chip / univers. Tri **Favoris** = filtre IDs (cloud). |
| **Changer de lieu** | bouton header feed | Petit bouton position actuelle (haut) → sheet / saisie **code postal ou ville** (allowlist). Déjà en maquette — voir §7. |
| **Fiche** | 03 / 04a / 04b | OD pauvre OK ; CTA conditionnels ; pas de ★. **Toujours afficher le kilométrage** user ↔ POI (depuis l’origine feed : GPS / Saint-Laurent-Médoc / commune choisie) ; minutes piéton en plus si &lt; ~2 km. |
| **Actions** | fiche / carte | Y aller (maps OS) · favori · liens externes. Pas de résa native MVP. |

**Règle nav :** découverte Médoc jamais bloquée derrière un compte **ni** derrière une saisie ville/CP. Auth = persistance favoris + **pas de pub**.

### Origine géographique (résumé)

| Cas | Origine feed | UI |
|---|---|---|
| Géoloc OK | Lat/lon device | Bouton header = libellé type « Autour de moi » / commune résolue |
| Géoloc refusée / indispo | **Saint-Laurent-Médoc** (figé) — coords à tirer de l’allowlist / centroïde commune (CSV n’a pas lat/lon aujourd’hui) | Bouton header = « Saint-Laurent-Médoc » ; clic → CP/ville |
| User a choisi CP / ville | Centroïde commune allowlist | Bouton header = nom commune choisie |

---

## 2. États UI (empty / loading / error / offline / géoloc refusée)

| État | Comportement |
|---|---|---|
| **Loading feed** | Skeleton liste + compteur « … » ; pas de faux chiffres hardcodés. |
| **Empty chip** | `200` + `empty` (ex. vide-greniers) · message + CTA `suggest_add` / changer de chip — déjà maquette 02b. |
| **Empty « Favoris »** | Message « Aucun favori » + CTA explorer / chip Tout. Anonyme = pas de favori (CTA connexion) ; connecté = cloud vide. |
| **Empty partenaires (boost)** | Normal au launch (0 partenaires) — liste = organique seul ; message soft si on filtre « partenaires only » (non MVP). |
| **Error réseau / API** | Banner + retry ; conserver dernier feed en cache si dispo. |
| **Offline** | Favoris syncés (auth, dernier snapshot) ; anonyme = pas de favori ; feed live indispo → message clair. |
| **Géoloc refusée / indispo** | **Ne pas bloquer** : feed immédiat avec **Saint-Laurent-Médoc**. Pas d’écran ville/CP obligatoire. User peut changer via bouton header. |
| **Ville / CP hors allowlist** | Message « Hors périmètre Médoc » + suggestions communes proches de la liste (dans la sheet). |
| **Sync stale** | Afficher `data_as_of` discret si &gt; seuil (ex. 48 h) — pas bloquant. |

---

## 3. Favoris : compte requis (pas de favori local anonyme)

Aligné [auth-explorer](auth-explorer.md) §4 :

| | Sans compte | Avec compte |
|---|---|---|
| Favoris | **Aucun** (le CTA favori invite à créer un compte) | **Cloud** (`favorites`) + sync multi-appareils |
| Sync | — | Cloud, multi-appareils |
| Tri « Favoris » | Non disponible | Filtre sur IDs cloud |
| Prompt login | Sur CTA favori **ou** CTA « compte = sans pub » | — |

Pas de favori local device : le favori devient un levier d’inscription, ce qui alimente aussi le KPI partenaires.

---

## 4. Pubs vs connecté

| État | Pubs réseau | Boost partenaire |
|---|---|---|
| **Explorer (anon)** | **Oui** — feed et/ou fiches (revenu) | Oui si partenaires actifs (plafond N=3) — **en premier** dans la sélection |
| **Connecté** | **Non** (cible MVP) | Oui — ads ≠ boost |

Détail : [auth-explorer](auth-explorer.md) §3–5 · [partner-cms-spec](partner-cms-spec.md) §4–6.

---

## 5. Base lieux + PostGIS (MVP)

### Décision

| Zone | Acté |
|---|---|
| Base lieux | **Toute** la base lieux = **PostgreSQL** (+ **PostGIS**) |
| Geo queries | `ORDER BY` distance / KNN **serveur** + index **GiST** ; pagination `cursor` |
| Rayon technique | **Pas** de bride produit 15 km. Un `ST_DWithin` éventuel = **limite technique perf** (plus large ou **absente** MVP) — jamais présenté comme règle produit. |
| Infra | Image Postgres **avec PostGIS** (Dokploy plus tard) |

**Pourquoi :** cœur produit = « autour + du plus près au plus loin » (+ partenaires d’abord) avec scroll paginé. Bbox + tri client trop faible.

### Changements schéma / queries

| Zone | Changement |
|---|---|
| Extension | `CREATE EXTENSION IF NOT EXISTS postgis` |
| `places`, `events`, `irve_stations` | Colonne `geom geography(Point, 4326)` depuis `lat`/`lon` |
| Index | GiST sur `geom` |
| Sync upsert | lat/lon → `geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography` |
| `GET /v1/feed/around` | order distance · **partenaires boostés en tête** (plafond N) puis organique near→far · **pagination `cursor`** (pas de cut-off 15 km produit) |
| Count | Même univers (chip + origine) — **pas** un count « dans 15 km » produit |
| IRVE nearby | `ST_DWithin` rayon **3 km** (hint fiche — distinct du feed) |
| Conservé | Allowlist 56 communes = vérité d’inclusion sync ; bbox = préfiltre ingest |

---

## 6. Questions produit — actées

### Actées (Anthony — clarification FR)

| # | Question | Décision |
|---|---|---|
| **Q1** | Ordre Partenaires | **Partenaires en premier**, puis organique **du plus près au plus loin**, dans la sélection (chip / univers). Pas un feed « uniquement partenaires ». |
| **Q2** | Ville / CP | **Bouton / sheet sur le feed** (header position). **Pas** d’écran dédié obligatoire avant le feed. Refus géoloc → point défaut (Q5). |
| **Q3** | Magic link | **Même device only** MVP — pas de deep link universel iOS/Android. Validé Anthony 2026-10-05. |
| **Q4** | « Rayon » / portée feed | **Pas de bride dure à 15 km** — un lieu à 16 km n’est **pas** exclu. Produit = tri **du plus près au plus loin** + **pagination** (scroll / `cursor`). Pas de sélecteur 5/15/30. Le « 15 km » maquette = libellé démo / écart, **pas** un cut-off. Rayon PostGIS éventuel = perf technique seulement (plus large ou absent MVP). |
| **Q5** | Point défaut si géoloc refusée | **Saint-Laurent-Médoc** (pas Lacanau). Figé. Coords : à tirer du centroïde allowlist / geo.api pour cette commune (CSV allowlist = nom + CP seulement aujourd’hui). |

Plus de Q parcours ouvertes sur ce brainstorm.

---

## 7. Maquettes — bouton position / CP

| Source | Présent ? | Détail |
|---|---|---|
| [maquette-v2-data](maquette-v2-data.md) écran **02a** | **Oui** | Header feed : `location_on` + libellé ville + `expand_more` — [HTML v2](#) — *capture Context Cursor only (`media/maquette-v2-data/Medoc%20Vibes%20v2.dc.html`)* L74 montre encore **Lacanau** (démo) → **écart** vs défaut produit **Saint-Laurent-Médoc** |
| [maquettes-vs-data](maquettes-vs-data.md) §2 | **Oui** | Sélecteur ville démo (Lacanau / Hourtin / Soulac / Pauillac) — keep comme exemples ; MVP = géoloc + fallback **Saint-Laurent-Médoc** + sheet CP/ville allowlist |
| Sheet saisie CP / ville explicite | **Partiel** | UI montre le **bouton** ; le sheet de saisie CP/ville n’est pas détaillé écran par écran → **écart mineur maquette** (comportement produit acté, UI sheet à préciser au build / FigJam) |

**Verdict maquette :** bouton position/ville OK. À aligner au prochain pass maquette / FigJam : header défaut = **Saint-Laurent-Médoc** ; sheet CP/ville ; libellé « Autour de moi » si géoloc OK ; compteur sans implication de cut-off 15 km.

---

*Conception seule — pas de code app. FigJam « feed autour » : partenaires-first · tri near→far · pagination · pas de bride 15 km · fallback Saint-Laurent-Médoc.*
