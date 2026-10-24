# Inventaire OpenAgenda — territoire Médoc

**Date :** 2026-10-01  
**Statut Q2 :** **figé (appoint)** — UIDs shortlist **optionnels, non bloquants**  
**Décision Anthony (2026-10-01) :** OpenAgenda = **appoint** ; sync via **bbox préfiltre** + **allowlist communes** ; **DATAtourisme = source primaire**. Pas besoin d’acter une liste blanche UIDs avant de poursuivre la conception.  
**Méthode inventaire :** recherche publique `GET https://openagenda.com/api/agendas?search=…` (+ détail events par UID). L’API clé `api.openagenda.com/v2` n’a pas été utilisée (clé publique non configurée ici).  
**Réf. produit :** [data-model-sync.md](data-model-sync.md) · [perimeter-medoc.md](perimeter-medoc.md) · [data-sources-audit.md](data-sources-audit.md) · [ingest-spec.md](ingest-spec.md)  
**Doc API OpenAgenda (LLM) :** [source officielle](https://developers.openagenda.com/llms-full.txt) (dump local non versionné)

---

## Verdict (honnête)

La couverture OpenAgenda du **Médoc Atlantique / littoral + estuaire** est **fine**.

| Attendu | Réalité observée |
|---|---|
| Agenda OT Médoc / Médoc Atlantique | **Introuvable** sur OpenAgenda (aucun slug `medoc-atlantique`, `ot-medoc`, `tourisme-medoc`, `pnr-medoc`…) |
| Agendas officiels communes côtières (Lacanau, Hourtin, Soulac, Pauillac, Lesparre, Vendays, Carcans…) | **Aucun agenda communal officiel OA** trouvé |
| Agenda dense « tout le Médoc » | **N’existe pas** en OA ; le site [medoc-agenda.fr](https://www.medoc-agenda.fr/) (CDC Médoc Atlantique + Cœur de Presqu’île) est une **plateforme à part**, pas OpenAgenda |
| Agenda OT sur medoc-atlantique.com | Page agenda OT active, **sans embed OpenAgenda** détecté |

**Conséquence MVP (figée) :** OpenAgenda n’est **pas** la source principale « sorties Médoc ». Appoint badge **Agenda** ; densification via **DATAtourisme** (primaire) ; CMS partenaires plus tard (0 au launch).

---

## Usage prévu dans Médoc Vibes

1. **Job sync #2 — OpenAgenda** (fréquence cible 2–6 h, semi-réel, cache Postgres)  
   - **Mode sync figé :** préfiltre **bbox** + rejet hors **allowlist 56 communes** ([perimeter-medoc.md](perimeter-medoc.md)).  
   - Shortlist UIDs (table ci-dessous) = **optimisation optionnelle**, pas un prérequis pour démarrer le job.  
   - Upsert `events` sur `(source_id=openagenda, external_id=event.uid)` ; soft-delete si absent du run complet.  
   - Dedup events vs DATAtourisme : `(starts_at ± 2h, geo, title normalize)`.

2. **Badge UI `Agenda`**  
   - `sources.badge = agenda` pour `source_id = openagenda`.  
   - Fiche 04b (Agenda seule) : pas de billets sans URL ; CTA **Y aller**.

3. **Chips** alimentées en appoint OA : `sorties`, `culture`, `vide-greniers`, `marches-fetes` (mapping keywords / titres) — **DT reste primaire**.

4. **Hors sync OA** : marchés hebdo OT, FMA, nightlife — plutôt DT / CMS / saisie.

**Clé API :** pour la prod (plus tard), `GET https://api.openagenda.com/v2/…` avec `oa_pk_…`. L'endpoint web a servi uniquement à l'inventaire. **Note API (2026-10-24) :** les events se lisent par agenda (`GET /v2/agendas/{uid}/events`) avec filtre géo `geo[northEast]/[southWest]` (bbox) + `adminLevel2[]=Gironde` ; la lecture transverse `GET /v2/events` (toutes agendas) nécessite une demande d'accès à support@openagenda.com. Voir [ingest-spec](ingest-spec.md) §4.

---

## Candidats (table)

Légende activité : totaux events indexés OA ; « futurs » = timings `gte` aujourd’hui (souvent 0 si timings mal renseignés — à croiser manuellement).

URL publique type : `https://openagenda.com/{slug}`

### A. Cœur Médoc / littoral — à prioriser pour validation

| Titre / organisateur | UID | URL | Activité approx. | Pertinence | Notes |
|---|---|---|---|---|---|
| **Agenda de la commune de Listrac Médoc** (mairie, officiel) | `38528117` | [agenda-mairie-de-listrac-medoc](https://openagenda.com/agenda-mairie-de-listrac-medoc) | ~86 events ; 0 futur daté visible | **must-have** (seul communal officiel « vrai Médoc ») | Commune viticole intérieure. Seul agenda **official=true** clairement ancré hors métropole. À acter en premier. |
| **Culture Lacanau** | `35827779` | [culture-lacanau](https://openagenda.com/culture-lacanau) | ~1 event (ex. spectacle danse Lacanau-Océan) | **nice** (à surveiller) | Titre prometteur pour Lacanau ville & océan, mais **quasi mort**. Pas must-have tant que volume ≈ 0. |
| **Chapelle de l'Hôpital de Grayan** | `75701621` | [chapelle-de-lhopital-de-grayan](https://openagenda.com/chapelle-de-lhopital-de-grayan) | ~22 events (concerts, expo, conférences) | **nice** | Site patrimonial **Grayan-et-l'Hôpital** (littoral nord). Agenda associatif / lieu, pas OT. |
| **Saint Christoly Médoc** (asso AESC) | `95639826` | [saint-christoly-medoc](https://openagenda.com/saint-christoly-medoc) | ~8 events (vide-greniers, médiévale, nuit des églises…) | **nice** (stale ?) | Estuaire / nord Médoc. Beaucoup d’events anciens ; utile si relancé. |
| **CHATEAU MALESCASSE** (Lamarque / Haut-Médoc) | `88936887` | [chateaumalescasse](https://openagenda.com/chateaumalescasse) | ~6 events (afterwork, portes ouvertes, marché de Noël) | **nice** | Partenaire œnotourisme potentiel ; pas une commune. |
| **Afterbeach** (campagne Afterbeach en Médoc) | `5010804` | [afterbeach](https://openagenda.com/afterbeach) | ~1 event saison 2026 (mer/jeu juin–sept.) | **nice** | Événement transversal châteaux Médoc — bon pour chip `sorties` si timings OK. Agenda mono-campagne. |
| **La culture en Médoc** | `27978118` | [la-culture-en-medoc](https://openagenda.com/la-culture-en-medoc) | ~12 events | **nice** / borderline | Mix Médoc + Bordeaux ; filtrer geo strictement. |
| **Musique au Cœur du Médoc** (plusieurs agendas) | `71965417`, `74876338`, `1768982` | [musique-au-coeur-du-medoc](https://openagenda.com/musique-au-coeur-du-medoc) · [macm](https://openagenda.com/macm) · [des-cuivres](https://openagenda.com/des-cuivres) | 2 / 3 / 1 events | **nice** (festival) | Programmation classique châteaux / Vertheuil. Choisir **un** UID après revue Anthony (éviter triplicatas). |
| **Académie musicale de Hourtin Médoc** | `45946385` | [academie-musicale-de-hourtin-medoc](https://openagenda.com/academie-musicale-de-hourtin-medoc) | ~4 events | **nice** | Hourtin — master classes ; volume faible. |
| **Festival Musical'océan** | `79185330` | [festival-musicalocean](https://openagenda.com/festival-musicalocean) | ~6 events | **nice** | Festival côtier (à confirmer lieux exacts à l’acte). |
| **Grand pique-nique du PNR Médoc** | `81366208` | [grand-pique-nique-du-parc-naturel-regional-medoc](https://openagenda.com/grand-pique-nique-du-parc-naturel-regional-medoc) | ~1 event | **skip** (one-shot) | Pas d’agenda PNR permanent. |
| **Estivales de Musique en Médoc** | `7963561` | [estivales-de-musique-en-medoc](https://openagenda.com/estivales-de-musique-en-medoc) | 0 event | **skip** | Vide. |
| **Caraïbos Lacanau Pro** | `52142725` | [caraibos-lacanau-pro](https://openagenda.com/caraibos-lacanau-pro) | 0 event | **skip** | Compétition surf — pas d’agenda vivant. |
| **Journées Européennes du Patrimoine à Lacanau** | `74161267` | [journees-europeennes-du-patrimoine-a-lacanau](https://openagenda.com/journees-europeennes-du-patrimoine-a-lacanau) | 0 event | **skip** | One-shot / vide. |
| **Mon agenda du médoc** | `9621034` | [monagendadumedoc](https://openagenda.com/monagendadumedoc) | 0 event | **skip** | Personnel / vide. |
| **Rock School Médoc** | `69552995` | [rockschoolmedoc](https://openagenda.com/rockschoolmedoc) | 0 event | **skip** | Vide. |
| **les cabanes de carcans** | `98083389` | [les-cabanes-de-carcans](https://openagenda.com/les-cabanes-de-carcans) | ~1 (dispos logements) | **skip** | Pas un agenda sorties. |
| **Invitation au Regard** (Soulac) | `25089933` | [invitation-au-regard](https://openagenda.com/invitation-au-regard) | 0 event | **skip** | Expo musée Soulac — agenda éteint. |
| **Animations 2024 Tour de l'Honneur** (Lesparre) | `62498527` | [animations-2024-tour-de-lhonneur](https://openagenda.com/animations-2024-tour-de-lhonneur) | ~1 event | **skip** | Année 2024 figée. |
| **Médoc Tournament Festival** | `11064044` | [medoc-tournament-festival](https://openagenda.com/medoc-tournament-festival) | ~1 event | **skip** / nice ponctuel | Margaux — édition sportive/festive isolée. |

### B. Frange Bordeaux Métropole (nom « Médoc », hors cœur produit)

Utile pour densifier les **4 Portes du Médoc** (dans l’allowlist 56). Toujours filtrer par commune allowlist pour éviter le bruit métropolitain hors CSV.

| Titre | UID | URL | Activité | Pertinence | Notes |
|---|---|---|---|---|---|
| Ville du Taillan-Médoc (officiel) | `82433240` | [ville-du-taillan-medoc](https://openagenda.com/ville-du-taillan-medoc) | ~660 / ~101 futurs | **nice** si bbox large | Réseau Bordeaux Métropole. Dense mais **pas** Médoc Atlantique. |
| Ludo-médiathèque du Taillan-Médoc | `29082449` | [le-taillan-medoc-ludo-mediatheque](https://openagenda.com/le-taillan-medoc-ludo-mediatheque) | ~454 / ~73 futurs | **nice** (sous-ensemble) ou skip si Taillan déjà sync | Redondance partielle avec la ville. |
| Ville de Saint-Aubin de Médoc | `38853347` | [ville-de-saint-aubin-de-medoc](https://openagenda.com/ville-de-saint-aubin-de-medoc) | ~166 / ~14 futurs | **nice** si bbox large | Cité dans l’audit sources ; bord métropole. |
| Agenda de Saint-Aubin de Médoc (non officiel) | `99558437` | [agenda-de-saint-aubin-de-medoc](https://openagenda.com/agenda-de-saint-aubin-de-medoc) | ~3 | **skip** | Doublon faible vs officiel. |
| Ville de Parempuyre | `10707949` | [ville-de-parempuyre](https://openagenda.com/ville-de-parempuyre) | ~120 / ~6 futurs | **nice**/skip | Métropole nord. |
| Ville de Blanquefort | `67583854` | [ville-de-blanquefort](https://openagenda.com/ville-de-blanquefort) | ~14 / ~7 futurs | **nice**/skip | Idem. |
| Blanquefort Médiathèque | `76950730` | [blanquefort-mediatheque](https://openagenda.com/blanquefort-mediatheque) | ~75 / ~8 futurs | **skip** sauf Culture élargie | |

### C. Département / nature (appoint geo-filtré)

| Titre | UID | URL | Activité | Pertinence | Notes |
|---|---|---|---|---|---|
| Les balades de Cistude Nature (officiel) | `72869717` | [les-balades-de-cistude-nature](https://openagenda.com/les-balades-de-cistude-nature) | ~172 / ~5 futurs | **nice** | Gironde entière — **importer seulement** events dans bbox Médoc. |
| Sorties Nature en Gironde | `53040963` | [sorties-nature-en-gironde](https://openagenda.com/sorties-nature-en-gironde) | ~8 | **skip**/nice | Moins dense que Cistude. |

---

## Absents notables (à traiter hors OA)

| Besoin | Constat | Piste |
|---|---|---|
| OT Médoc Atlantique | Pas d’agenda OA | DATAtourisme SIT OT + page [medoc-atlantique.com/agenda](https://www.medoc-atlantique.com/agenda/) ; **demander** à l’OT s’ils publient / peuvent créer un agenda OA |
| Agrégat CDC littoral | [medoc-agenda.fr](https://www.medoc-agenda.fr/) ≠ OpenAgenda | Source tierce (pas d’API OA) — ne pas scraper ; convention ou ignore MVP |
| Communes Lacanau, Soulac, Hourtin, Pauillac, Lesparre, Carcans, Vendays-Montalivet, Le Verdon | Pas d’agenda communal officiel OA | DT events + CMS partenaires + contact mairies/OT |
| PNR Médoc agenda permanent | Uniquement one-shot pique-nique | Contacter PNR pour UID futur |

---

## Recommandation shortlist UIDs (optionnelle — **non bloquante**)

La shortlist ci-dessous reste une **optimisation** possible pour limiter le bruit ; le sync MVP peut démarrer en **bbox + allowlist communes** sans UIDs actés.

### Candidats utiles si on affine plus tard

| Priorité | UID | Agenda |
|---|---|---|
| 1 | **`38528117`** | Commune Listrac Médoc |
| 2 | **`75701621`** | Chapelle Grayan (littoral nord) |
| 3 | **`88936887`** | Château Malescasse |
| 4 | **`5010804`** | Afterbeach (saison) |
| 5 | **`72869717`** | Cistude Nature (**filtre allowlist**) |
| 6 (Portes du Médoc dans allowlist) | **`38853347`** + **`82433240`** | Saint-Aubin + Taillan |

### Watchlist

`35827779` Culture Lacanau · `95639826` Saint-Christoly · `27978118` La culture en Médoc · un seul UID « Musique au Cœur du Médoc » · `45946385` Académie Hourtin · `79185330` Musical'océan

### Explicitement hors shortlist MVP (si utilisée)

Agendas vides / one-shot / hors sujet listés **skip** ci-dessus.

---

## Checklist Q2 — statut

- [x] **Périmètre produit** = allowlist 56 communes (EPCI, sans Eysines) ; bbox/triangle = préfiltre.  
- [x] **Rôle OA** = appoint ; DT primaire.  
- [x] **Sync** = bbox + allowlist ; UIDs shortlist optionnels non bloquants.  
- [ ] Contact OT Médoc Atlantique (création agenda OA vs rester DT) — hors chemin critique conception.  
- [ ] medoc-agenda.fr hors OA — hors scope MVP sauf décision ultérieure.  
- [ ] Clé publique OpenAgenda (`oa_pk_…`) — plus tard (Dokploy), pas maintenant.  
- [x] Q2 mise à jour dans [data-model-sync.md](data-model-sync.md) §7.

---

## Méthode & limites

- Recherches : `Médoc`, `Medoc`, communes côtières, OT/PNR/slugs dédiés.  
- Totaux events = index OA public ; **timings souvent vides** → le compteur « futurs » sous-estime parfois l’activité réelle.  
- Inventaire **statique au 2026-10-01** — à rejouer avant go-live.  
- Pas de git / pas d’implémentation sync dans ce livrable.

---

*Document de conception — Q2 figé (appoint). Shortlist UIDs = référence optionnelle.*
