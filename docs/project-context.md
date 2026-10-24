# Médoc Vibes — contexte projet

> **Reprise projet / autre IA :** lire d’abord **[handoff-ia.md](handoff-ia.md)** (entrée unique fonctionnelle + technique). Carte repo : [repo-map.md](repo-map.md).

## Produit

App **touristique** pour profiter du Médoc : arriver, explorer (avec ou sans compte), voir autour de soi, filtrer (restos, sorties, culture, loisirs locaux).

**Complémentaire** à l’app Parc naturel régional Médoc (plutôt sorties nature). Médoc Vibes = côté **festif / loisir** (manger, boire, sortir, activités). Partenariat avec l’app PNR envisageable.

Priorité #1 : **ancrage Médoc** (écoles de surf, zones de pêche, etc.) — pas un clone générique Paris.

Direction UI handoff : [maquette v2 honnête data](maquette-v2-data.md). Historique : [v2](maquette-v2.md), [v1 LOOP](maquette-loop-v1.md).

## Parcours cœur

1. Welcome : **Google / Apple / magic link (e-mail)** (**même device only** MVP) **ou** Explorer sans compte
2. Permission géoloc OS → feed immédiat (**autorise** = GPS ; **refuse** = **Saint-Laurent-Médoc** — pas d’écran ville/CP avant)
3. Feed : chips univers ; **partenaires d’abord** puis organique **du plus près au plus loin** + **pagination** (pas de bride 15 km) ; favoris si besoin ; bouton header position → sheet CP / ville
4. Fiches lieu / événement → **km user↔POI** + action (itinéraire, favoris, lien résa/billets externes)

Brainstorm détaillé : [app-journey-brainstorm.md](app-journey-brainstorm.md). Auth & pubs : [auth-explorer.md](auth-explorer.md). Sources en FR simple : [sources-plain.md](sources-plain.md).

## Univers / contenus (cible)

Fil conducteur : **ce qui fait vivre le Médoc** (vie locale + tourisme loisir).

- Restos & bars  
- Sorties festives / culture  
- **Vides-greniers**, marchés, fêtes de village, guinguettes  
- Loisirs Médoc : surf, pêche, etc.  
- Bonus : **bornes de recharge VE**  
- Événements partenaires (via petit CMS)

## Données & contraintes budget

- **Pas de budget data** → sources ouvertes ; Google APIs de côté.
- **Socle data acté (intention)** :
  - DATAtourisme (**primaire** POI + events)
  - data.culture
  - Mérimée
  - OpenDataSoft / Huwise
  - OpenAgenda (**appoint** ; bbox + allowlist communes)
- **Périmètre geo figé :** allowlist **56 communes** EPCI Médoc (sans Eysines) — [perimeter-medoc.md](perimeter-medoc.md) ; triangle/bbox = préfiltre seulement.
- Soft-fail été : brancher tôt, empty OK — [integrations-soft-fail.md](integrations-soft-fail.md).
- Compléments déjà audités : data.gouv / PAN (IRVE, vélo, GTFS), OSM en appoint — voir [audit](data-sources-audit.md).
- Photos / vie locale spontanée : souvent le trou → partenaires + curation (0 partenaires au launch OK).

## Business model (figé conception)

- **Non connecté = pubs réseau** → revenu (free users).
- **Connecté = pas de pub** (cible MVP) — échange de valeur vs compte.
- Partenaires (restos, bars…) : **abonnement mensuel** — plans **Essentiel** / **Premium** → badge + **boost** plafonné **N=3** (1 slot réservé Premium si éligible ; ≠ ads free).
- Accès **petit CMS headless** planifié MVP produit ; **0 partenaires au launch** OK.
- Problème ouvert : **preuve / attribution** qu’un client est passé par l’app (voir [product-notes](product-notes.md)).

Détail : [auth-explorer.md](auth-explorer.md) · [partner-cms-spec.md](partner-cms-spec.md).

## Stack (direction)

- Monorepo : `api/` AdonisJS, `ops/` Next.js KPI, `site/` landing Next, `ios/` SwiftUI, `android/` Kotlin/Compose, `packages/shared`.
- Deploy : Dokploy (containers) — site prod OK ; **Postgres partagée infra créée** (`infra-postgis` / PostGIS 3.4, DB `medoc_vibes`) — **credentials Dokploy chez Anthony / vault — pas dans le git** ; brancher `DATABASE_URL` sur le service **api** quand il existe (Q3 MVP — `ST_DWithin` / order by distance / GiST).
- Scaffold poussé : branche `cursor/medoc-vibes-monorepo-b008` sur Origin tmp `anthonymarcelin/tmp-f5b9fd656b625c96`.
- **GitHub** : https://github.com/Forge-Digitale-Solutions/medoc-vibes — `dev` = dev (défaut), `main` = prod.

## Phase actuelle

**Landing prod + conception app + scaffold API** — site live (Resend waitlist) ; DB Dokploy partagée créée (PostGIS `medoc_vibes`) ; API Adonis + feed around **sur `main`** (PR #15), **pas encore** de service Dokploy api. Sync OD = stub. Pas de `DATABASE_URL` en clair dans ce doc. Handoff : [handoff-ia.md](handoff-ia.md). Checklist : [conception-checklist.md](conception-checklist.md). Parcours : [app-journey-brainstorm.md](app-journey-brainstorm.md). Modèle data : [data-model-sync.md](data-model-sync.md) (**PostGIS** MVP).

## Historique

[Cadrage partage Claude](claude-share-ff90ac33.md) — Angular/Capacitor écarté au profit du natif.

### Historique Gemini

Brainstorm du **19 sept. 2026** (maquettes « LOOP » → recentrage Médoc festif) : [gemini-share-T98N3zDwMmz4.md](gemini-share-T98N3zDwMmz4.md). Utile pour la genèse (complémentarité PNR, monorepo Adonis, partenaires) ; **obsolète** sur Places-en-cache, Angular/Capacitor, naming Spot/LOOP.
