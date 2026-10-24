# Audit sources de données ouvertes — Médoc Vibes

**Date :** 2026-09-29  
**Périmètre :** app touristique Médoc (festif / loisir), **sans APIs Google payantes**.  
**Principe :** sources officielles FR / open data en priorité ; « complet Médoc » est rare — on le dit.

---

## Stacks primaires (à ancrer dès le MVP)

### DATAtourisme (ADN Tourisme)

| | |
|---|---|
| **Quoi** | Agrégat national des SIT (offices de tourisme) : POI, events, hébergements, restos, activités, itinéraires (~530k POI). |
| **Gratuit ?** | Oui — Licence Ouverte 2.0 + CGU ; attribution producteur (`hasBeenCreatedBy`) + date de maj. |
| **Accès** | **API REST** `https://api.datatourisme.fr/v1` — clé via formulaire sur [utiliser-les-données](https://www.datatourisme.fr/utiliser-les-donnees/) (`X-API-Key` ou `api_key`). Endpoints utiles : `/catalog`, `/entertainmentAndEvent`, `/placeOfInterest`, `/tour`, `/product`. Filtres géo : `geo_bounding` / `geo_distance`, département INSEE `33`, types ontologie. |
| **Quotas (doc API, 2026)** | ~1000 req/h ; ~10 req/s prolongé ; 20–30 concurrentes ; `page_size` max **100**. Au-delà de 10k résultats : suivre les liens `meta.next`. |
| **Alt. hors temps réel** | Plateforme **Diffuseur** (flux SPARQL / download local) ; exports CSV quotidiens sur **data.gouv** ; Explore (CSV / iframe). |
| **Fiabilité** | Bonne côté infra nationale ; **qualité = ce que les OT Médoc / Gironde poussent** dans leur SIT. Photos, horaires bars, guinguettes spontanées : souvent absents. |
| **Médoc** | Couverture **partielle** : châteaux, campings classés, restos référencés OT, FMA officielles OK-ish ; nightlife / micro-events / écoles de surf « non OT » = trous. |

### data.gouv.fr + transport.data.gouv.fr (PAN)

| | |
|---|---|
| **Quoi** | Catalogue national + Point d’Accès National mobilité (GTFS, IRVE, aménagements cyclables…). |
| **Gratuit ?** | Oui (Licence Ouverte / ODbL selon jeu). |
| **Accès** | Téléchargement fichiers + **API data.gouv** (catalogue) ; jeux PAN souvent CSV/GeoJSON/GTFS sans clé. |
| **Usage Médoc Vibes** | IRVE, GTFS Cars Régionaux 33, BNAC (vélo), exports DATAtourisme plats, baignade (rapportages), zones réglementaires CACEM. |

### OSM / Overpass (complément géo)

| | |
|---|---|
| **Quoi** | Bars, restos, plages, cycleways, `amenity=bicycle_rental`, surf spots informels, bornes… |
| **Gratuit ?** | Oui (ODbL — share-alike + attribution). |
| **Accès** | Overpass `https://overpass-api.de/api/interpreter` ; extracts Geofabrik Nouvelle-Aquitaine pour import batch. |
| **Quotas fair-use** | Public Overpass : ordre de grandeur **&lt;10k req/j et &lt;1 Go/j** pour usage ponctuel ; usage applicatif régulier → diviser ≈100, cacher, ou **self-host**. Nominatim public : **max 1 req/s**, User-Agent identifié — pas pour reverse géocodage massif (préférer `geo.api.gouv.fr` / cache). |
| **Médoc** | Littoral / pistes souvent mieux tags que villages intérieurs ; **pas une source « officielle tourisme »** — à croiser, pas à vendre comme exhaustif. |

### Bbox / filtre géographique utile (approx. Médoc)

- Bounding box indicative : `45.55,-1.25` (NO) → `44.70,-0.55` (SE) — à affiner avec communes / EPCI (Médoc Atlantique, Médoc Cœur de Presqu’île, Estuaire, Haute Gironde selon produit).  
- Département INSEE : `33` + filtre commune / geo.

---

## Évaluations par type de contenu

Légende verdict : **OK MVP** | **partial** | **weak** | **not viable**

---

### 1. Agenda events (« ce soir / ce week-end »)

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : DATAtourisme `EntertainmentAndEvent` + OpenAgenda lecture. |
| **Fiable ?** | DATAtourisme : fiable si OT à jour. OpenAgenda : fiable tech, **couverture Médoc hétérogène** (agendas communaux ponctuels, ex. Saint-Aubin — bord métropole, pas cœur Médoc festif). |
| **Complet Médoc ?** | **Non.** Fêtes OT / concerts « officiels » partiels ; guinguettes, soirées bar, concerts plage spontané = hors flux. |
| **Accès** | DATAtourisme `/entertainmentAndEvent` + filtre dates / geo (clé API, quotas ci-dessus). OpenAgenda `GET https://api.openagenda.com/v2/agendas/{uid}/events` — clé publique `oa_pk_` en header `key` ; pas de quota public dur documenté → **cacher côté serveur**. Repérer les UID OT Médoc Atlantique / communes. |
| **Verdict** | **partial** — bon socle « agenda institutionnel » ; différenciant produit = **CMS partenaires** + convention OT pour combler le week-end. |

---

### 2. Restaurants / bars / food places

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : DATAtourisme (`Restaurant`, etc.) + OSM (`amenity=restaurant|cafe|bar|fast_food|pub`). |
| **Fiable ?** | OT : fiches souvent correctes mais **incomplètes** (surtout bars). OSM : variable, pas d’horaires fiables. |
| **Complet Médoc ?** | **Non** — loin d’un Places. Nightlife Soulac / Lacanau / Pauillac mal couverte sans partenaires. |
| **Accès** | DATAtourisme `/catalog` filtre type + geo. Overpass tags amenity. Pas d’API « avis / popularité » gratuite équivalente Google. |
| **Verdict** | **partial** — annuaire MVP possible ; **photos, menus, « ouvert maintenant »** = partenaires / CMS, pas open data. |

---

### 3. Culture venues / concerts

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : DATAtourisme (musées, salles, FMA) + OpenAgenda + OSM (`tourism=museum`, `amenity=theatre`, `leisure=…`). |
| **Fiable ?** | Lieux culturels « durs » OK ; programmation live = dépend agendas. |
| **Complet Médoc ?** | Lieux : **correct**. Concerts / scènes estivales : **partiel**. |
| **Accès** | Idem §1 + types PlaceOfInterest culturels. |
| **Verdict** | **partial** (lieux **OK MVP** si on accepte liste OT ; programmation = partial). |

---

### 4. Marchés, guinguettes, fêtes de village

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Partiel : FMA DATAtourisme + OpenAgenda ; marchés parfois en OSM (`amenity=marketplace`) ou jeux locaux data.gouv / OT. |
| **Fiable ?** | Marchés hebdo : souvent figés / peu mis à jour. Guinguettes : **quasi absentes** des flux nationaux. |
| **Complet Médoc ?** | **Fin** — cœur différenciant Médoc Vibes mal servi par l’open data seul. |
| **Accès** | DATAtourisme events + saisie CMS ; scrapes interdits / fragiles → éviter. |
| **Verdict** | **weak** pour guinguettes ; **partial** pour marchés/fêtes si OT alimente. **Priorité CMS partenaires.** |

---

### 5. Surf spots / écoles de surf

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui pour **localisation** : **Data ES** (ministère Sports) — spots / sites nautiques déclarés ; OSM ; éventuellement DATAtourisme activités. Conditions mer : **Open-Meteo Marine** (vagues) — pas un « surf report » pro. |
| **Fiable ?** | Data ES : officiel, màj quotidienne, mais nomenclature équipement ≠ guide surf. Conditions : modèle météo, pas webcam/spot forecast dédié. |
| **Complet Médoc ?** | Spots Lacanau / Carcans / Soulac / Montalivet : **partiel mais utilisable**. Écoles commerciales : **incomplet** sans OT/OSM/partenaires. |
| **Accès** | Data ES API ODS : `https://equipements.sports.gouv.fr/api/explore/v2.1` — Licence Ouverte, souvent sans clé pour lecture catalogue. Filtrer Gironde + types aquatiques / surf. Open-Meteo Marine : HTTP GET, pas de clé (voir §13 pour licence commerciale). |
| **Verdict** | **partial** — carte spots + écoles déclarées = MVP possible ; **conditions « go / no-go » surf** = weak sans source dédiée (payante ou communautaire). |

---

### 6. Zones / réglementations pêche *(prudence légale)*

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui pour **couches indicatives** : CACEM zones réglementaires (data.gouv), géoservices OFB / AMP, docs préfecture Gironde (PDF), Réseau Littorea. Hub’Eau « Poisson » = **pêche scientifique**, pas loisir. |
| **Fiable ?** | **Non comme source de vérité juridique.** CACEM le dit explicitement : tracés = interprétation ; **seuls les textes font foi**. Régles Gironde (tailles, quotas, zones C, filets, RNN Hourtin, estuaire…) évoluent ; **RecFishing** obligatoire pour certaines espèces sensibles en Atlantique (enregistrement / déclaration) — hors scope « carte zones » simple. |
| **Complet Médoc ?** | Couverture réglementaire **non automatisable proprement** pour un MVP « où pêcher ». |
| **Accès** | Jeu CACEM data.gouv (CSV / GeoPackage) ; WFS OFB réglementation ; liens officiels `gironde.gouv.fr` / pecheapied-loisir. **Pas d’API « règles pêche loisir Médoc » clé en main.** |
| **Verdict** | **not viable** comme feature normative dans l’app. **Acceptable** uniquement en **liens vers sources officielles** + disclaimer fort (« ne remplace pas la réglementation / marées / sanitaires »). |

---

### 7. Pistes cyclables / location vélo

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : **Base Nationale des Aménagements Cyclables** (Geovelo / OSM → schéma national) sur transport.data.gouv ; Overpass ; DATAtourisme itinéraires `Tour` si présents. |
| **Fiable ?** | Très bon pour **linéaire** (voie verte Médoc, Vélodyssée segments). Locations : OSM `amenity=bicycle_rental` / shops — **spotty**. |
| **Complet Médoc ?** | Réseau : **bon**. Loueurs / consignes : **partiel**. |
| **Accès** | Download GeoJSON/Parquet BNAC ; filtre bbox Médoc côté serveur. Overpass en appoint (fair-use). |
| **Verdict** | **OK MVP** pour carte / itinéraires ; **partial** pour location. |

---

### 8. Plages (infos pratiques)

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui — **fort atout régional** : **PIGMA / GIP Littoral — « Plages de Nouvelle-Aquitaine »** (open data + API/flux) : surveillance, accessibilité, stationnement, caractéristiques. Qualité sanitaire : baignades.sante.gouv + jeux rapportage data.gouv (**peu d’API live**). |
| **Fiable ?** | Données Plages : conçues pour réutilisation, màj saisonnière / quotidienne selon champs (parkings temps réel sur certains sites Lacanau–Carcans–Porge…). Drapeaux **temps réel** : pas toujours dans le même flux → souvent com’ OT / Mes Plages Océanes. |
| **Complet Médoc ?** | Littoral océan Médoc Atlantique : **parmi les meilleurs jeux open data du produit**. Estuaire / petites plages : plus mince. |
| **Accès** | [PIGMA — Plages NA](https://www.pigma.org/portail/fr/jeux-de-donnees/plages-de-nouvelle-aquitaine/info) ; croiser OSM `natural=beach`. Marées prédictives **SHOM API = payant** ; vignettes SHOM gratuites (iframe) ou alternatives communautaires (à auditer licence) — **ne pas vendre SHOM gratuit**. |
| **Verdict** | **OK MVP** (infos pratiques / surveillance saison) ; temps réel drapeaux / marées = **partial**. |

---

### 9. Châteaux — portes ouvertes / dégustations / events

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui via DATAtourisme (domaines, FMA, produits visite) si saisis par OT / châteaux. |
| **Fiable ?** | Fiches château souvent présentes ; **agenda dégustation / open day** très inégal. |
| **Complet Médoc ?** | Catalogue domaines : **partiel à correct**. Calendrier œnotouristique live : **fin**. |
| **Accès** | DATAtourisme search/filtre type + geo Médoc ; events liés. Complément CMS partenaires châteaux. |
| **Verdict** | **partial** — OK pour « lieux » ; **weak** pour « ce week-end dégustation » sans partenaires. |

---

### 10. Hébergement léger (campings, aires)

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : DATAtourisme (`Camping`, `AireDeCampingCar`, etc.). |
| **Fiable ?** | Campings classés / OT : correct. Aires sauvages / gratuites : sous-représentées (OSM `tourism=caravan_site` appoint). |
| **Complet Médoc ?** | **Partiel** (bonne base camping littoral / intérieur OT ; pas Booking-like). |
| **Accès** | API DATAtourisme + geo_bounding Médoc. |
| **Verdict** | **partial** (utilisable en MVP « light stay »). |

---

### 11. Bornes IRVE (recharge VE)

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui — **Base nationale IRVE** (statique) : consolidation data.gouv → **PAN transport.data.gouv** (bêta dédoublonnée, màj nocturne). Dynamique (dispo temps réel) : en consolidation PAN, couverture opérateurs **inégale**. |
| **Fiable ?** | Statique (localisation, puissance, opérateur) : **bonne** pour MVP. Temps réel : ne pas promettre 100 %. |
| **Complet Médoc ?** | Suffisant pour une carte bornes ; densité moindre hors axes / villages. |
| **Accès** | [transport.data.gouv — IRVE](https://transport.data.gouv.fr/datasets?type=charging-stations) CSV/GeoJSON ; filtre lat/lon Médoc. Licence Ouverte. |
| **Verdict** | **OK MVP** (statique) ; dynamique = **partial**. |

---

### 12. Navettes saisonnières / transport local

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | Oui : **GTFS Cars Régionaux 33 / NA Mobilités** sur transport.data.gouv (réseau interurbain Gironde, ~90 lignes). TBM = métropole, hors cœur Médoc. |
| **Fiable ?** | GTFS théorique : bon pour lignes régulières. **Navettes plage / saisonnières / estivales** souvent absentes ou tardives dans le GTFS. |
| **Complet Médoc ?** | Lignes cars Médoc : **utilisable**. Navettes OT / communes été : **weak** sans collecte manuelle / partenaire. |
| **Accès** | Dataset PAN « Réseau interurbain — Gironde (33) » ; zip GTFS (aussi miroir PIGMA). Licence ODbL typique PAN. Pas d’API routing officielle gratuite obligatoire — parser GTFS ou moteur open-source (OpenTripPlanner) self-host. |
| **Verdict** | **partial** (OK MVP cars réguliers ; navettes saison = à traiter à part). |

---

### 13. Météo / entrées « quoi faire aujourd’hui »

| Critère | Évaluation |
|---|---|
| **Gratuit ?** | **Open-Meteo** : gratuit **non commercial** (10k calls/j, 5k/h, 600/min, CC BY 4.0) — modèle Météo-France AROME/ARPEGE exposé aussi via leur endpoint. **Usage commercial** → abonnement Open-Meteo **ou** [portail API Météo-France](https://portail-api.meteofrance.fr) (compte, souscription, JWT / apikey — offres « gratuites » limitées selon API). |
| **Fiable ?** | Suffisant pour « pluie / vent / T° / vagues » → règles métier locales (« plage », « vélo », « resto terrasse »). |
| **Complet Médoc ?** | Oui pour météo point ; « quoi faire » = **règles produit** sur vos POI/events, pas une API magique. |
| **Accès** | `api.open-meteo.com` / marine ; ou APIs MF officielles. Croiser agenda (§1) + plages (§8). |
| **Verdict** | **OK MVP** technique ; **attention licence** si l’app est commerciale (préférer MF portail ou plan payant Open-Meteo). |

---

## Synthèse honnête Médoc

| Domaine | Verdict | Commentaire court |
|---|---|---|
| Agenda ce soir / week-end | **partial** | DT + OA insuffisants seuls → CMS |
| Restos / bars | **partial** | Annuaire OK ; festif faible |
| Culture / concerts | **partial** | Lieux OK ; prog partielle |
| Marchés / guinguettes | **weak** | Différenciant à produire |
| Surf | **partial** | Spots Data ES ; conditions limited |
| Pêche réglementaire | **not viable** | Liens + disclaimer seulement |
| Vélo | **OK MVP** | BNAC / OSM |
| Plages | **OK MVP** | PIGMA = pépite locale |
| Châteaux events | **partial** | Lieux > calendrier |
| Campings / aires | **partial** | DT correct |
| IRVE | **OK MVP** | PAN |
| Transport / navettes | **partial** | GTFS cars ; navettes été faibles |
| Météo / « today » | **OK MVP** | + caveat commercial |

**Solides pour un MVP open-data :** plages (PIGMA), IRVE, aménagements cyclables, météo, couche POI DATAtourisme (filtre Médoc), GTFS cars.

**Faibles / à combler hors open data :** guinguettes, bars, agenda week-end dense, dégustations château live, écoles surf commerciales, navettes saisonnières, **toute affirmation réglementaire pêche**.

---

## Recommandations d’architecture data (sans code)

1. **Socle batch + cache** : sync nocturne DATAtourisme (bbox Médoc) + IRVE + BNAC + Plages PIGMA + GTFS → Postgres ; API app lit le cache (respect quotas).  
2. **Temps semi-réel** : OpenAgenda (agendas UID sélectionnés) + météo ; TTL court.  
3. **Couche éditoriale** : CMS partenaires = source de vérité pour events festifs / guinguettes / offres.  
4. **OSM** : enrichissement géo, jamais seule source « officielle ».  
5. **Juridique** : attribution Licence Ouverte / ODbL ; pas de Google Places ; pêche = deep links officiels uniquement.

---

## Références clés

- [DATAtourisme — utiliser les données](https://www.datatourisme.fr/utiliser-les-donnees/)  
- [API DATAtourisme docs](https://api.datatourisme.fr/v1/docs?lang=fr)  
- [OpenAgenda developers](https://developers.openagenda.com/)  
- [transport.data.gouv.fr](https://transport.data.gouv.fr/)  
- [PIGMA Plages Nouvelle-Aquitaine](https://www.pigma.org/portail/fr/jeux-de-donnees/plages-de-nouvelle-aquitaine/info)  
- [Data ES / équipements sportifs](https://equipements.sports.gouv.fr/)  
- [Open-Meteo pricing / terms](https://open-meteo.com/en/pricing)  
- [SHOM — API marée non gratuite](https://shom-support.zendesk.com/hc/fr/articles/34441313411997)  
- [CACEM zones réglementaires — data.gouv](https://www.data.gouv.fr/datasets/zones-reglementaires-cacem)

---

*Document durable pour Médoc Vibes — à réviser si quotas DATAtourisme / consolidation IRVE PAN évoluent, ou après inventaire réel des agendas OpenAgenda OT Médoc.*
