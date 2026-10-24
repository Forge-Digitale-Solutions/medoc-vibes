# Checklist conception — avant tout développement

**Date :** 2026-10-01 (maj 2026-10-05 — Q4/Q5 parcours Anthony)  
**Statut :** conception livrables hors « plus tard » done ; **parcours géoloc / feed aligné Anthony** (Q1–Q5 actées). Landing prod déjà live.  
**Règle historique :** rester en conception jusqu’au bouclage des livrables hors « plus tard » — **atteint** le 2026-10-02 ; reopen ciblé parcours / PostGIS puis clarif géoloc.  
**Réf. :** [project-context.md](project-context.md) · [data-model-sync.md](data-model-sync.md) · [app-journey-brainstorm.md](app-journey-brainstorm.md) · [diagrams.md](diagrams.md) · [FigJam](https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa) · [conventions.md](conventions.md)

---

## Décisions figées / défautées (rappel)

| # | Décision | Statut |
|---|---|---|
| Q1 | Clé DATAtourisme reçue (secret hors git) | done |
| Périmètre | Allowlist 56 communes CSV (EPCI, sans Eysines) ; triangle/bbox = préfiltre | done |
| Q2 | OpenAgenda appoint ; sync bbox + allowlist ; UIDs optionnels ; DT primaire | done |
| Q3 | **Avec PostGIS** MVP — `ST_DWithin` / order by distance / index GiST (revisit 2026-10-02 ; ex-défaut « sans » trop faible pour autour + au plus près) | done |
| Q4 | **0 partenaires** au launch ; empty states OK (défauté) | done |
| Auth | **Google + Apple + Facebook + magic link** + Explorer sans compte | done |
| Pubs | **Non-connecté = pubs (revenu)** ; **connecté = pas de pub** (cible MVP) | done |
| Soft-fail | Brancher tôt / empty OK / Q6–10 défautés | done |
| CMS | Mini-CMS + boost **N=3** + paliers Essentiel/Premium (1 slot Premium réservé) ; ads ≠ boost | done |
| Parcours | Géoloc → feed ; refus = **Saint-Laurent-Médoc** ; partenaires d’abord ; bouton CP/ville sur feed (Q1/Q2 actées) | done — [app-journey-brainstorm.md](app-journey-brainstorm.md) |
| Portée feed (parcours Q4) | **Pas de bride 15 km** ; tri near→far + pagination `cursor` ; pas de sélecteur 5/15/30 ; rayon PostGIS éventuel = perf technique seulement | done — Anthony 2026-10-05 (clarif) |
| Point défaut (parcours Q5) | **Saint-Laurent-Médoc** (pas Lacanau) ; coords à tirer du centroïde allowlist | done — Anthony 2026-10-05 |
| Magic link (parcours Q3) | **Même device only** MVP — pas de deep link universel | done — Anthony 2026-10-05 · [app-journey-brainstorm.md](app-journey-brainstorm.md) §6 |

---

## Livrables conception

| Item | Statut | Notes / cible |
|---|---|---|
| Auth explorer — 4 providers + Explorer + pubs | done | [auth-explorer.md](auth-explorer.md) |
| Partner CMS — mini-spec + boost vs ads | done | [partner-cms-spec.md](partner-cms-spec.md) |
| Soft-fail intégrations / Q6–10 | done | [integrations-soft-fail.md](integrations-soft-fail.md) |
| Sources FR simple | done | [sources-plain.md](sources-plain.md) |
| Ops KPI — périmètre dashboard léger | done | [ops-kpi.md](ops-kpi.md) |
| Glossaire PNR | done | [glossary-pnr.md](glossary-pnr.md) |
| Infra / Dokploy | todo *(plus tard)* | Explicitement **après** conception |
| Diagrammes (flux sync, écrans, data) | done | [diagrams.md](diagrams.md) · [FigJam](https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa) — noter `geom` PostGIS sur ERD |
| Parcours app brainstorm | done | [app-journey-brainstorm.md](app-journey-brainstorm.md) |

---

## Déjà livré (conception)

| Item | Doc |
|---|---|
| Contexte produit / stack | [project-context.md](project-context.md) |
| Audit sources data | [data-sources-audit.md](data-sources-audit.md) |
| Modèle data + plan sync | [data-model-sync.md](data-model-sync.md) |
| Périmètre 56 communes + CSV | [perimeter-medoc.md](perimeter-medoc.md) |
| Inventaire OpenAgenda | [openagenda-medoc.md](openagenda-medoc.md) · [doc LLM API](https://developers.openagenda.com/llms-full.txt) (dump local non versionné) |
| Diagrammes FigJam | [diagrams.md](diagrams.md) · [board](https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa) |
| Maquettes v2 honnêtes data | [maquette-v2-data.md](maquette-v2-data.md) · [maquettes-vs-data.md](maquettes-vs-data.md) |
| Notes produit / remotes | [product-notes.md](product-notes.md) · [remotes.md](remotes.md) |
| Contrats OpenAPI lecture | [api-contracts.md](api-contracts.md) · [openapi-v1.yaml](openapi-v1.yaml) |
| Auth + monétisation pubs | [auth-explorer.md](auth-explorer.md) |
| Partner CMS + boost | [partner-cms-spec.md](partner-cms-spec.md) |
| Soft-fail / défauts data | [integrations-soft-fail.md](integrations-soft-fail.md) |
| Sources plain language | [sources-plain.md](sources-plain.md) |
| Ops KPI | [ops-kpi.md](ops-kpi.md) |
| Glossaire PNR | [glossary-pnr.md](glossary-pnr.md) |
| Parcours app + Q3 PostGIS | [app-journey-brainstorm.md](app-journey-brainstorm.md) |

---

## Ordre suggéré (suite)

1. ~~Diagrammes si Figma OK~~ → **done** ([FigJam](https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa) — ERD, architecture sync+API, pipeline sync, feed « autour »)  
2. ~~Parcours app + revisit Q3~~ → **done** ([app-journey-brainstorm.md](app-journey-brainstorm.md) — **Avec PostGIS**)  
3. ~~Clarif géoloc Anthony (Q1/Q2)~~ → **done** (partenaires d’abord ; fallback Médoc ; bouton CP/ville sur feed)  
4. ~~Portée feed + point défaut (parcours Q4/Q5)~~ → **done** (pas de bride 15 km + pagination near→far ; Saint-Laurent-Médoc)  
5. ~~Magic link (parcours Q3)~~ → **done** (**même device only** MVP)  
6. **Dev API / app** (Adonis, Postgres+PostGIS, sync DATAtourisme + OpenAgenda appoint, clients)  
7. Infra Dokploy pour API/app *(quand besoin)* — image Postgres **PostGIS**

---

*Conception livrables hors « plus tard » : done (2026-10-02). Parcours géoloc Anthony Q1–Q5 + PostGIS : done (2026-10-05).*
