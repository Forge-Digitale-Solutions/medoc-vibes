# Intégrations — soft-fail & défauts Q6–10

**Date :** 2026-10-01 (soir — feedback Anthony ; conservé / renforcé)  
**Statut :** conception — défauts pour ne **pas** bloquer sur data parfaite  
**Réf. :** [data-model-sync.md](data-model-sync.md) §7 · [data-sources-audit.md](data-sources-audit.md) · [sources-plain.md](sources-plain.md) · [perimeter-medoc.md](perimeter-medoc.md)

---

## Principe (surtout été / saison haute)

**Brancher tôt, afficher si présent, soft-empty sinon.**  
Ne pas attendre densités parfaites, inventaires UIDs complets, ni licences média impeccables pour valider le parcours. L’été amplifie les empty chips (vide-greniers, sorties) : empty states maquette = comportement nominal, pas un échec produit.

Conserver ce principe même avec auth / pubs / CMS en parallèle — la data ouverte reste **best-effort branché**.

---

## Sources — rôles & wiring

| Source | Rôle | Wiring MVP conception | Si vide / KO |
|---|---|---|---|
| **DATAtourisme (DT)** | **Primaire** POI + events | Brancher avec `DATATOURISME_API_KEY` ; sync batch bbox + allowlist | Soft-empty feed / chip ; `data_as_of` stale OK |
| **OpenAgenda (OA)** | **Appoint** events | Brancher + filtre allowlist communes ; UIDs shortlist **optionnels** | Empty OK — ne pas bloquer sur UIDs |
| **IRVE PAN** | Bonus bornes | Snapshot quotidien | Hint « 0 borne » / masquer bloc |
| **Mérimée** | Branche **optionnelle** Culture / patrimoine | Wire **plus tard** ou soft ; **pas** le cœur festif | Absente du feed festif par défaut |
| **data.culture** | Enrichissement Culture | Soft / hebdo si temps | Skip job OK |
| **Partner CMS** | Source vérité festif partenaire | Schéma + boost prêts ; 0 partenaires launch OK | Badge/boost absents |

Explications grand public : [sources-plain.md](sources-plain.md).

---

## Défauts Q6–10 (figés conception)

| # | Sujet | Défaut |
|---|---|---|
| **Q6** | Canonical Place vs Event-only | **Event orphelin OK** ; Place dérivée **optionnelle** si geo+nom stables. Afficher l’event dans le feed même sans Place DT. |
| **Q7** | Fusion chips | **Garder séparés** Vide-greniers vs Marchés & fêtes au MVP ; réévaluer après densités sync. Empty chip = soft-empty. |
| **Q8** | Mérimée × Culture | **Hors cœur festif** ; branche patrimoine optionnelle (wire later / soft). Ne pas mélanger dans Sorties. |
| **Q9** | Stockage raw | **`raw_payloads.payload` jsonb in-DB** préparé dès le schéma. Objet S3 = option infra plus tard si volume. |
| **Q10** | Licence médias DT | **Afficher seulement si licence claire** ; sinon **placeholder** UI (pas d’image douteuse). |

---

## Comportements UI / API

- Feed / chips : `200` + `items: []` + `empty` (message chip) — jamais bloquer le shell app.
- Media : placeholder si licence floue ou absente.
- Sync partiel : status `partial` sur `sync_runs` ; l’API sert le cache restant.
- Été : prioriser DT + OA + IRVE branchés ; Culture/Mérimée/ODS = best-effort.
- Pubs / boost : indépendants du soft-fail data — une chip vide peut quand même montrer un emplacement ads (**non-auth seulement** ; connecté = **pas de pub**) ; un boost partenaire n’apparaît que si contenu `active`.

---

*Complète [data-model-sync.md](data-model-sync.md) §7. Conception seule. Soft-fail été = stance conservée.*
