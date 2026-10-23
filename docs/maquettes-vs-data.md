# Maquettes v2 ↔ données ouvertes — Médoc Vibes

**Date :** 2026-09-30  
**Sources croisées :** [maquette-v2](maquette-v2.md), [écran HTML](#) — *capture Context Cursor only (`media/maquette-v2/medoc-vibes.dc.html`)*, [audit data](data-sources-audit.md), [contexte](project-context.md), [notes produit](product-notes.md).  
**Objectif :** figer ce que la maquette peut **promettre en MVP** sans Google Places / sans budget data — champ par champ.

Légende fiabilité : **OK** | **partial** | **weak** | **inventé-maquette**  
Légende reco : **keep** | **simplify** | **hide-if-empty** | **remove-from-MVP** | **partner-only**

---

## Synthèse avant détail

| Zone maquette | Réalité data Médoc | Action design |
|---|---|---|
| Marque / welcome / auth | Client + IdP | Garder (logos G/A provisoires OK) |
| Chips catégories | Mappables partiellement vers DT / OA / OSM | Garder ; renommer / fusionner si densités trop faibles |
| Liste reco + notes ★ | Notes / avis **absents** de l’open data | Retirer ★ du MVP ou partner-only |
| Photos | DT souvent NC ; droits flous | Placeholders → hide-if-empty / partner |
| Distance / « 6 min » | Client + lat/lon | Garder en km ou min (client) |
| Hint IRVE | PAN IRVE **OK** | Garder |
| Fiche resto inventée + « Ouvert » + « Réserver » | Lieu type inventé ; horaires weak ; résa = externe | Exemples réels OT ; CTA conditionnels |
| Guinguette + events + billets | Cœur différenciant = **CMS partenaires** | Afficher comme showcase partenaire, pas comme open data |

---

## 1. Welcome

| Élément UI (maquette) | Source(s) probables | Fiabilité Médoc | Recommandation |
|---|---|---|---|
| Logo / titre « Médoc Vibes » | Client-only (marque) | OK | keep |
| Tagline A / B (alternance jour) | Client-only (copy fixe) | OK | keep |
| CTA « Continuer avec Google » | Client + OAuth Google | OK (hors data) | keep — logos officiels avant prod |
| CTA « Continuer avec Apple » | Client + Sign in with Apple | OK | keep |
| « Explorer sans compte » | Client-only | OK | keep (parcours cœur sans auth) |
| Mentions « app 100 % locale, faite en Gironde » | Client-only | OK | keep |
| Contenu POI / events | — | — | Aucun fetch ici |

**Verdict écran :** aucun champ open-data. Pas de correctif data — seulement assets auth.

---

## 2. Autour de moi

| Élément UI (maquette) | Source(s) probables | Fiabilité Médoc | Recommandation |
|---|---|---|---|
| Header marque | Client-only | OK | keep |
| Sélecteur ville (Lacanau / Hourtin / Soulac / Pauillac) | Client (liste) + geo utilisateur ; communes INSEE / geo.api.gouv | OK (villes démo) | keep — **bouton header feed** (déjà en maquette 02a) ; MVP = géoloc → feed ; refus = **Saint-Laurent-Médoc** (HTML header encore Lacanau = écart démo) ; clic → sheet CP/ville allowlist — [parcours](app-journey-brainstorm.md) §7 |
| Icône search | Client-only | OK | keep — search full-text = cache local DT/OA/CMS |
| Bloc « Ce qui bouge autour de toi » | Copy client | OK | keep |
| Compteur « N plans à moins de 15 km » | Agrégat cache (DT + OA + CMS + OSM filtré) ; total matching chip + origine | **partial** (N inventé ; libellé 15 km = **écart**) | keep chiffre **réel** ; UI sans implication de cut-off 15 km (« N plans autour ») ; hide-if-empty si 0 |
| Chip **Tout** | Union filtres | OK | keep |
| Chip **Restos & bars** | DATAtourisme (`Restaurant`, FoodEstablishment…) + OSM amenity | **partial** | keep — bars nightlife = trous |
| Chip **Sorties** | DT `EntertainmentAndEvent` + OpenAgenda + **CMS partenaires** | **partial** → weak hors OT | keep — densifier via CMS |
| Chip **Culture** | DT lieux culturels + data.culture (Joconde / musées si utile) + Mérimée (patrimoine) + OA | **partial** (lieux OK ; expo live = partial) | keep — Mérimée = fiche patrimoine, pas « soirée » |
| Chip **Vide-greniers** | OA + DT events (si OT) + **CMS** | **weak** | keep comme différenciant ; **partner-only** pour densification ; empty state honnête |
| Chip **Marchés & fêtes** | DT FMA / marketplace + OA + OSM `amenity=marketplace` | **partial** | keep |
| Chip **Surf & côte** | Data ES (équipements) via ODS/Huwise + OSM + DT activités + PIGMA plages (appoint) | **partial** | keep — écoles commerciales souvent absentes |
| Hint « 2 bornes IRVE à &lt; 3 km » + lien Carte | **IRVE / PAN** (transport.data.gouv) + distance client | **OK** (statique) | keep — nombre dynamique ; pas promettre dispo temps réel MVP |
| Section « On te recommande » | Règle produit sur cache (distance, type, date, boost partenaire) | **partial** | keep — ranking éditorial léger, pas ML |
| Carte liste : **photo** | DT media (souvent NC) / CMS / placeholder | **weak** / inventé-maquette | hide-if-empty ; motif placeholder OK ; pas d’image sans droits |
| Carte : **tag** (RESTO & BAR, SORTIE…) | Mapping type → label UI | OK si mapping | keep |
| Carte : **nom** | DT / OA / OSM / CMS `name` | OK → partial | keep |
| Carte : **sous-titre** (Tapas · ville / Concert ce soir · ville) | DT description courte / OA title+location / CMS ; « ce soir » = règle dates | **partial** | simplify — 1 ligne factuelle (type · commune · horaire si connu) |
| Carte : **★ 4,7 (212)** | **Aucune** source open gratuite type Google | **inventé-maquette** | **remove-from-MVP** (ou partner-only plus tard) |
| Carte : **méta horaire** (« Dès 7h », « 8h–13h ») | DT openingHours / OA times / CMS | **partial** | hide-if-empty |
| Carte : **distance / temps** (« 6 min », « 12 min ») | Client (géoloc) + lat/lon source | OK si geo présent | keep — préférer **km** si mode marche ambigu ; min = ETA simple |
| Favori (cœur) | Client / compte | OK | keep |
| Nav Accueil / Autour / Favoris / Profil | Client-only | OK | keep — Favoris/Profil = local/auth |
| Exemples noms (Comptoir des Pins, Guinguette du Lac, École Océane…) | Fiction maquette | **inventé-maquette** | Remplacer en v2.1 par **POI réels** OT / OA / partenaires |

### Mapping chips → ontologies / filtres (proposition MVP)

| Chip UI | Filtres techniques (priorité) | Notes |
|---|---|---|
| Tout | bbox 15 km + types ci-dessous | Exclure hébergement lourd si hors scope festif |
| Restos & bars | DT : Restaurant / Bar / FastFood… ; OSM amenity restaurant\|bar\|cafe\|pub\|fast_food | Fusionner labels DT ; dédoublonner OSM↔DT par geo |
| Sorties | DT EntertainmentAndEvent (dates futures) ; OA agendas OT Médoc ; **CMS events** `type=sortie\|concert\|guinguette` | Sans CMS, liste souvent vide hors saison OT |
| Culture | DT musée / salle / patrimoine ; data.culture (établissements) ; Mérimée (monuments) en lecture seule ; OA culture | Ne pas mélanger « expo ce week-end » (event) et « château » (lieu) sans badge |
| Vide-greniers | OA / DT keywords + types brocante / vide-grenier ; CMS | Filtre texte fragile → CMS prioritaire |
| Marchés & fêtes | DT Foire / Marché / Fête ; OSM marketplace ; OA | Marchés hebdo souvent figés |
| Surf & côte | Data ES types aquatiques/surf ; DT SportsAndLeisureActivity ; OSM sport=surfing / beach ; PIGMA plages en sous-vue | Chip = lieux + écoles ; plages détails = fiche dédiée plus tard |

---

## 3. Fiche lieu (ex. « Le Comptoir des Pins »)

| Élément UI (maquette) | Source(s) probables | Fiabilité Médoc | Recommandation |
|---|---|---|---|
| Back / Favori / Share | Client-only | OK | keep |
| Photo hero | DT `hasRepresentation` / media ; OSM Wikimedia ; **CMS partenaire** | **weak** (souvent NC / droits) | hide-if-empty ; partner-only pour belle photo ; placeholder motif OK |
| Badge « RESTO & BAR » | Mapping type DT/OSM | OK | keep |
| Pastille distance « 6 min » | Client + geo | OK si coords | keep |
| Titre lieu | DT / OSM / CMS `name` | OK sur fiches OT | keep — **exemple maquette inventé** → remplacer par lieu réel Lacanau |
| Sous-titre « Bar à tapas · Vins du Médoc · Lacanau-Océan » | DT shortDescription / cuisine / commune ; CMS | **partial** | simplify — commune + 1 catégorie ; libellés marketing = partner-only |
| ★ 4,7 (212 avis) | Pas d’équivalent open | **inventé-maquette** | **remove-from-MVP** |
| « Ouvert jusqu'à 1h » | DT opening hours ; OSM opening_hours ; CMS | **weak** (bars surtout) | hide-if-empty ; ne jamais inventer « ouvert » |
| Texte descriptif long | DT description ; CMS | **partial** | keep si présent ; truncate ; partner enrichit |
| Chip amenity **Terrasse** | DT équipements / OSM outdoor_seating ; CMS tags | **partial** | hide-if-empty |
| Chip **Vins locaux** | Quasi jamais structuré en OD | **weak** / inventé | partner-only ou remove-from-MVP |
| Chip **DJ sets** | Non OD (sauf event lié) | **inventé-maquette** | partner-only |
| Chip **Accès PMR** | DT accessibility ; OSM wheelchair | **partial** | hide-if-empty |
| Hint IRVE « Borne à 300 m · 22 kW » | PAN IRVE + distance au POI | **OK** | keep — hide-if-empty si &gt; seuil |
| CTA **Réserver une table** | Lien externe partenaire / site / TheFork-like **hors OD** | **partner-only** | hide-if-empty (URL résa CMS) ; pas de faux bouton |
| CTA **Y aller** | Client → maps OS / Apple / deeplink lat-lon | OK | keep (action cœur) |

**Verdict :** la fiche « resto festif » de la maquette est un **idéal partenaire**, pas un rendu DATAtourisme brut. MVP open-data = nom, type, commune, geo, description courte, PMR si connu, IRVE proche, Y aller — sans ★ ni « Réserver » systématique.

---

## 4. Fiche sortie (ex. « La Guinguette du Lac »)

| Élément UI (maquette) | Source(s) probables | Fiabilité Médoc | Recommandation |
|---|---|---|---|
| Photo hero concert | CMS / OA image / DT media | **weak** | hide-if-empty ; partner-only pour densifier |
| Badge « SORTIE » | Type event / lieu festif | OK | keep |
| Distance « 4,2 km » | Client + geo | OK | keep (km plus honnête que min ici) |
| Titre guinguette | **CMS** (prioritaire) ; DT/OA si saisi OT | **weak** en OD seul → inventé-maquette en démo | **partner-only** pour catalogue dense ; OD en appoint |
| Sous-titre « Concerts · Guinguette · Hourtin » | CMS tags + commune | **partial** | keep si CMS |
| ★ 4,5 (140 avis) | Aucune OD | **inventé-maquette** | **remove-from-MVP** |
| « Ce soir dès 19h » | OA / DT next occurrence / CMS schedule | **partial** | hide-if-empty ; règle « ce soir » = date = aujourd’hui |
| Description marketing | CMS / DT | **partial** | partner enrichit |
| Chips Live / Buvette / Familles / Parking | CMS tags ; OSM parking nearby | **weak** hors CMS | hide-if-empty / partner-only |
| Bloc **Prochains événements** | OA + DT events liés lieu + **CMS** | **partial** | keep — empty state si aucun |
| Carte event : date (SAM 4 OCT) | OA/DT/CMS startDate | OK si event réel | keep |
| Titre event (« Les Pibales ») | OA/DT/CMS | inventé en maquette | keep structure ; contenu réel |
| Genre (« Rock · Folk ») | OA keywords / CMS | **partial** | hide-if-empty |
| Horaire + prix (« 20h · 12 € ») | OA/DT conditions ; CMS | **partial** | hide-if-empty (prix souvent manquant) |
| CTA **Billets** | URL billetterie externe (CMS / OA registration) | **partner-only** | hide-if-empty |
| CTA **J'y vais** (intérêt / rappel) | Client (favori event / notif plus tard) | OK | keep MVP local ; notif = post-MVP |

**Verdict :** écran **vitrine CMS partenaires**. Sans partenaires, risquer une liste vide ou trop institutionnelle (FMA OT) — à assumer en empty states, pas en fausses guinguettes.

---

## Notes transverses

### Notes / avis (★)

- Affichés partout dans la maquette → **aucun** flux gratuit fiable (Google Places écarté ; pas d’agrégat avis OT national).
- **Décision produit recommandée :** retirer notes et compteurs d’avis du MVP UI ; éventuellement « Coup de cœur Médoc Vibes » éditorial / partenaire plus tard.
- Ne pas scraper TripAdvisor / Google.

### Photos

- Placeholders hachurés = honnêtes pour la conception.
- DATAtourisme : médias fréquents **NC** ou droits non réutilisables tels quels → vérifier licence par fiche ; attribution producteur.
- OSM / Wikimedia : possible mais incomplet Médoc festif.
- **Règle UI :** pas de photo = motif / initiale / couleur catégorie ; jamais photo stock « fake » présentée comme le lieu.
- Partenaires CMS = source photo prioritaire pour fiches boostées.

### Distance / géoloc

- Coords : DT `geo`, OA location, OSM nodes, IRVE lat/lon, CMS.
- Calcul : **client-only** (haversine) ou API maison ; pas Nominatim massif (quotas).
- Maquette « 15 km » feed : **pas** une constante produit (clarif Anthony — pas de bride) ; IRVE « 3 km » = hint fiche OK.
- Affichage : **km** par défaut ; minutes marche seulement si &lt; ~2 km et mode piéton explicite (éviter « 18 min » voiture ambigu).

### data.culture / Mérimée / OpenDataSoft

- **Mérimée** : monuments historiques — utile chip Culture / patrimoine, **pas** restos ni guinguettes.
- **data.culture** : établissements / événements culture ministériels — appoint Culture, pas densification week-end festif.
- **OpenDataSoft / Huwise** : souvent la couche d’accès (Data ES, jeux locaux OT/Gironde, PIGMA selon portail) — pas une « base lieux » unique.

### Partner CMS uniquement (à ne pas attendre de l’OD)

- Guinguettes, soirées bar, concerts plage spontanés  
- Offres / apéro offert / codes attribution ([product-notes](product-notes.md))  
- URLs résa / billets / menus  
- Photos soignées, tags marketing (DJ, vins locaux, « QG surf »)  
- Boost « On te recommande » payant  
- Densification vide-greniers hors flux OT  

---

## Checklist « maquette à corriger » (avant dev)

1. **Retirer ★ et (N avis)** des cartes liste + fiches lieu/sortie (ou les marquer explicitement « partner only / hors MVP »).  
2. **Remplacer les lieux inventés** par 4–6 POI/events **réels** Médoc (OT / OA / partenaire) + empty states.  
3. **CTA « Réserver » / « Billets »** : style secondaire + visible seulement si `bookingUrl` / `ticketUrl` CMS.  
4. **Chips amenities** (Terrasse, DJ, Live…) : n’afficher que tags présents ; grille 4 cases → 0–4 dynamiques.  
5. **« Ouvert jusqu'à… » / « Ce soir dès… »** : hide-if-empty ; jamais de faux vert.  
6. **Photos** : garder le motif placeholder en design system ; documenter « pas de stock photo trompeuse ».  
7. **Distance** : unifier en **km** sur liste + fiches (ou min uniquement &lt; 2 km).  
8. **Compteur « 48 plans »** : indiquer « chiffre dynamique » dans la maquette (annotation), pas un hardcode.  
9. **Chip Vide-greniers** : annotation « densité CMS / saison » pour éviter surprise empty.  
10. **Fiche sortie** : annoter « contenu type partenaire » ; prévoir empty « Aucune date à venir — proposer un event ».  
11. **Logos Google / Apple** : remplacer pastilles « G » par assets brand compliance.  
12. **IRVE** : garder hint ; préciser en annotation « statique PAN, pas occupation live ».

---

## Décisions ouvertes (ne bloquent pas le correctif maquette)

- Auth obligatoire vs explorer sans compte (maquette = les deux — OK).  
- Fusionner « Sorties » et « Marchés & fêtes » si QA data montre &lt; N items — à trancher après premier sync bbox Médoc.  
- Afficher Mérimée dans Culture ou renvoyer vers PNR / « patrimoine » — frontière produit.

---

*Document de conception — pas de spec API. À mettre à jour après premier inventaire réel DT/OA bbox Médoc et premiers partenaires CMS.*
