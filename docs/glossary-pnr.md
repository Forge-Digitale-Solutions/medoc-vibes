# Glossaire produit — Médoc Vibes vs Parc naturel régional Médoc

**Date :** 2026-10-01  
**Statut :** conception  
**Réf. :** [project-context.md](project-context.md) · [product-notes.md](product-notes.md) · [data-model-sync.md](data-model-sync.md) · [perimeter-medoc.md](perimeter-medoc.md)

---

## 1. Deux apps, deux intentions

| | **Médoc Vibes** | **App PNR Médoc (« Mon Médoc »)** |
|---|---|---|
| Porteur | Forge Digitale / projet Vibes | Parc naturel régional Médoc |
| Promesse | Tourisme **festif / loisir** : manger, boire, sortir, activités ancrées Médoc | Nature, patrimoine, vie du parc, **alertes** |
| Public | Visiteurs & locaux qui veulent « quoi faire ce soir / ce week-end » | Usagers du territoire parc (balades, infos PNR) |
| Données cœur | DATAtourisme, OpenAgenda (appoint), IRVE, futurs partenaires | Contenus / missions PNR (hors scope Vibes) |

**Complémentaires**, pas concurrentes. Priorité Vibes : ancrage Médoc (surf, pêche, guinguettes, marchés…) — pas un clone générique ni un clone PNR.

---

## 2. Frontière produit (ne pas franchir)

### Médoc Vibes = festif / loisir

- Restos & bars, sorties, culture festive, vides-greniers, marchés & fêtes
- Loisirs Médoc : surf, côte, spots liés à la vie locale
- Bonus : bornes IRVE (statique)
- Events partenaires (CMS — planifié MVP produit ; 0 au launch OK)

### PNR / Mon Médoc = nature / patrimoine / alertes

- Balades nature, sentiers, patrimoine naturel
- Alertes parc (sécurité, fermetures, risques…)
- Contenus institutionnels PNR

### Règles

1. **Ne pas dupliquer** les features PNR (balades nature dédiées, alertes parc, catalogues patrimoine parc).
2. Mérimée / patrimoine dans Vibes : au mieux **appoint Culture** ou renvoi — question ouverte ([data-model-sync](data-model-sync.md) §7.8) ; défaut prudent = ne pas concurrencer Mon Médoc.
3. Plages / accessibilité nature : **lien / complément** PNR plutôt que feature native Vibes ([product-notes](product-notes.md)).

---

## 3. Partenariat futur (pas phase 1)

Si accord avec le PNR :

| Levier | Description |
|---|---|
| Deep link croisé | Depuis Vibes → écran / contenu Mon Médoc (et réciproque) |
| Rubrique UI | « Aussi sur Mon Médoc » (lien externe / universal link) |
| Pas de miroir data | Vibes **ne réplique pas** le catalogue nature/alertes PNR |

Phase 1 : aucune intégration technique requise — seulement cette frontière documentée.

---

## 4. Termes clés Médoc Vibes

### Place

Lieu géolocalisé (POI, venue, plage, sport…) affiché dans le feed « autour de moi » et en fiche lieu. Champs cœur : nom, chip, lat/lon, commune, CTA conditionnels, provenance/badge. Voir [data-model-sync](data-model-sync.md) §1.

### Event

Occurrence temporelle (sortie, marché, fête, vide-grenier, concert). Peut être liée à une `Place` (`place_id`) ou orpheline. Fiches 04a (partenaire) / 04b (agenda seule).

### Chip

Filtre UI du feed (`chip_slug`) : `tout`, `restos-bars`, `sorties`, `culture`, `vide-greniers`, `marches-fetes`, `surf-cote`. **≠** ontologie source — mapping via `chip_mappings`. Une entité a une chip principale (+ secondaires possibles).

### Badge OT / Agenda / Partenaire

Provenance affichée sur la carte / fiche, dérivée de `sources.badge` :

| Badge | Sens produit | Sources typiques |
|---|---|---|
| **OT** | Fiche issue du SIT office de tourisme (DATAtourisme) | `datatourisme` |
| **Agenda** | Event / contenu OpenAgenda | `openagenda` |
| **Partenaire** | Contenu édité via CMS abo | `partner_cms` |
| autre | Neutre / légal (IRVE, OSM, Mérimée…) | selon source |

Pas de confusion avec les chips (univers) : badge = **qui fournit**, chip = **quel filtre**.

### Allowlist

Liste figée des **56 communes** EPCI Médoc (+ Portes, **sans Eysines**) — seule vérité d’inclusion geo produit. CSV / [perimeter-medoc.md](perimeter-medoc.md). Une fiche hors allowlist n’entre pas dans le cache exposé.

### Bbox

Rectangle englobant (préfiltre API sync, ex. NO `45.58, -1.28` → SE `44.79, -0.61`). **Jamais** critère d’inclusion final — seulement accélérateur avant filtre allowlist.

### Triangle

Zone grossière « triangle Médoc » évoquée en cadrage : même statut que bbox = **préfiltre optionnel**, pas la vérité produit. La vérité reste l’allowlist communes.

### Autres termes utiles

| Terme | Sens court |
|---|---|
| `sync_runs` | Journal d’une exécution de job d’import source |
| `partner_boost` | Bool feed : remonter un item partenaire abo (≠ ads free) ; max **3** / page ; **1 slot réservé Premium + 1 slot réservé Essentiel** |
| IRVE | Borne recharge VE (snapshot PAN, pas live) |
| Explorer sans compte | Parcours anonyme + **pubs** ([auth-explorer](auth-explorer.md)) |
| Connecté | Compte Google/Apple/FB/magic link → **pas de pub** (MVP) |
| Mon Médoc | Nom usuel de l’app grand public du PNR Médoc (hors repo Vibes) |
| Sources plain | Explications FR simple des sources data — [sources-plain.md](sources-plain.md) |

---

## 5. Vocabulaire à éviter côté Vibes

- Se présenter comme « l’app du Parc » ou « l’app officielle PNR »
- Promettre alertes incendie / fermetures sentiers / balades balisées PNR
- Dupliquer une carte nature exhaustive « type Mon Médoc »

Formulation OK : *« Médoc Vibes pour sortir et profiter ; pour la nature et les alertes du parc, voir Mon Médoc. »*

---

*Conception seule — pas d’intégration deep link ni d’accord juridique dans ce livrable.*
