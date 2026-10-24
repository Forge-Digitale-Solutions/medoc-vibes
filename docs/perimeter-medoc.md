# Périmètre Médoc

**Statut :** figé (Anthony, 2026-10-01)  
**Source de vérité = allowlist des 56 communes** ([`data/medoc-communes-codes-postaux.csv`](../data/medoc-communes-codes-postaux.csv)).  
Aucune exception : toute commune du CSV est dans le périmètre produit ; aucune commune hors CSV n’y entre.

Triangle / bbox = **préfiltre API optionnel seulement** (jamais un critère d’inclusion/exclusion).

Repo GitHub : `data/medoc-communes-codes-postaux.csv` — [PR #1](https://github.com/Forge-Digitale-Solutions/medoc-vibes/pull/1).

## Définition officielle retenue

**Union des EPCI couvrant le Médoc + les 4 communes « Portes du Médoc »** (ex-porte métropolitaine), soit **56 communes** :

| Bloc | EPCI / statut | Code SIREN | Nb |
|---|---|---:|---:|
| Nord Atlantique | CC Médoc Atlantique | `200070720` | 14 |
| Cœur de Presqu'île | CC Médoc Cœur de Presqu'île | `200069995` | 18 |
| Estuaire | CC Médoc Estuaire | `243301447` | 10 |
| Médullienne | CC Médullienne | `243301389` | 10 |
| Portes du Médoc | Bordeaux Métropole (villes portes historiques) | `243300316` | 4 |

**Portes du Médoc (4)** : Blanquefort, Parempuyre, Le Taillan-Médoc, Saint-Aubin-de-Médoc.

Équivalent géographique : **arrondissement Lesparre-Médoc (INSEE `334`, 49 communes)**  
\+ **7 communes médocaines de l’arrondissement de Bordeaux**  
(Macau, Ludon-Médoc, Le Pian-Médoc + les 4 Portes) → **56**.

### Hors périmètre (volontairement)

- **Eysines** : canton « Les Portes du Médoc » et ville associée au PNR, mais **pas** membre d’un EPCI Médoc ni des 4 Portes historiques retenues.
- **CC de l’Estuaire** (rive droite / Blaye) : homonyme, hors Médoc.
- **Vensac** : **incluse** (membre CC Médoc Atlantique) même si absente du classement PNR Médoc.

### Sources

- [geo.api.gouv.fr](https://geo.api.gouv.fr) — communes par EPCI (`/epcis/{siren}/communes`) et codes postaux officiels.
- [BANATIC](https://www.banatic.interieur.gouv.fr) — composition EPCI (SIREN ci-dessus).
- [INSEE COG / arrondissement Lesparre-Médoc (`334`)](https://www.insee.fr/fr/metadonnees/geographie/arrondissement/334-lesparre-medoc) — 49 communes (COG 2025 vérifié).
- PNR Médoc : 51 communes classées (= 52 EPCI − Vensac) ; les Portes sont des partenaires métropolitains, pas le socle allowlist.

## Codes postaux

- Colonne `code_postal` = **unique CP officiel** renvoyé par geo.api.gouv.fr pour la commune (aucune commune du set n’a plusieurs CP).
- **16 CP** distincts au total.
- **Filtrer par nom de commune**, jamais par CP seul : `33160`, `33290`, `33320`, `33680` débordent hors Médoc (localités voisines).

## Triangle / bbox (préfiltre API optionnel)

Sommets historiques (WGS84) — **ne remplacent pas** l’allowlist :

| Sommet | Lat | Lon | Notes |
|---|---:|---:|---|
| **SO** (point Anthony) | 44.8012222 | -1.2565556 | `44°48'04.4"N 1°15'23.6"W` |
| Pointe de Grave | 45.5670552 | -1.0658053 | Le Verdon-sur-Mer |
| Blanquefort | 44.9088982 | -0.6300363 | Blanquefort |

Ordre polygone : SO → Pointe de Grave → Blanquefort → SO.

Ce triangle **n’englobe pas** toutes les communes allowlist (ex. Saint-Christoly-Médoc, Pauillac, Soulac hors polygone au test 2026-10-01). À élargir seulement si un préfiltre géométrique plus fidèle est utile.

### Bbox rectangle englobante

Marge légère :

| Coin | Lat | Lon |
|---|---:|---:|
| NO | 45.58 | -1.28 |
| SE | 44.79 | -0.61 |

## Diff vs liste précédente (56)

Recherche 2026-10-01 : **0 commune ajoutée, 0 retirée**.  
Le CSV antérieur couvrait déjà l’union EPCI + Portes ; il a été régénéré depuis geo.api.gouv.fr (même set, ordre alpha par zone).
