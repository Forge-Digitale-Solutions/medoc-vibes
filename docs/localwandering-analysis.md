# Analyse produit — Locals Wandering (inspiration Médoc Vibes)

**Date :** 2026-10-20  
**Demande :** Anthony — inspiration « LocalWandering », share Gemini, avant toute suite produit  
**Statut :** analyse seule (pas d’implémentation)  
**Share :** [https://share.google/aimode/Yj81tluPwvieAeo29](https://share.google/aimode/Yj81tluPwvieAeo29)  
**Site :** [localswandering.com](https://www.localswandering.com/)  
**Réf. Médoc actées :** [project-context](project-context.md) · [app-journey-brainstorm](app-journey-brainstorm.md) · [maquette-v2-data](maquette-v2-data.md) · [maquettes-vs-data](maquettes-vs-data.md) · [data-model-sync](data-model-sync.md) · [conception-checklist](conception-checklist.md) · [auth-explorer](auth-explorer.md) · [partner-cms-spec](partner-cms-spec.md)

---

## Accès sources (ce qu’on a pu / pas pu lire)

| Source | Résultat |
|---|---|
| Share Google AI Mode (WebFetch / VM) | **Inaccessible** — page shell « AI Mode is not currently available on your device or account » ; aucun texte LocalWandering / Médoc dans le dump |
| Share Google AI Mode (navigateur Chrome) | **Accessible** — conversation FR complète lue + capturée ([media](#) — *capture Context Cursor only (`media/google-ai-mode-share-content.webp`)* · extrait brut [internal](#) — *Context Cursor `internal/gemini-share-locals-wandering-extract.md` (hors git)*) |
| Site `localswandering.com` | **Accessible** depuis la VM (homepage, About, Join, blog) — **pas** de 403 ici |
| Accès France (Anthony + Gemini) | **Bloqué côté Anthony** ; Gemini décrit un geoblock IP pays (plugin Brilliant Directories « Block Website Traffic by Country ») — contournable VPN US |
| App Store / Play Store | **Aucune** app native « Locals Wandering » / « LocalWandering » trouvée — plateforme **web** (directory + magazine) |
| Product Hunt / articles | Homonyme **LocalWander** (Brésil, 2015, chat concierge hôtels) ≠ ce produit — **ne pas confondre** |

**Nom :** Anthony dit « LocalWandering » ; le produit réel est **Locals Wandering™** (`localswandering.com`, Ozarks / Arkansas). Gemini dans le share utilise bien « Locals Wandering ».

---

## 1. Qu’est-ce que Locals Wandering

### Positionnement

Directory / magazine **small-town USA** (cœur actuel : **Mountain View, Arkansas** / Ozarks), pas un guide France. Promesse : ouvrir sur **où tu es**, pas sur ce qui trend ; hidden gems, trails, folklore, commerces locaux, day trips, boucles moto (en construction).

Taglines visibles : *« Discover the Best Local Spots – Wherever You Wander »* · *« Real Locals, Real Reviews, Real Adventures! »*

### Features visibles (site)

| Zone | Contenu |
|---|---|
| Découverte | Géo / recherche nom · catégorie · City Pages ; carte centrée Mountain View au départ |
| Contenu | Listings business, trails, events, blog éditorial (légendes, outdoor), « Hot Spots », Food & Dining, Places to Stay, Services, Things To Do |
| Communauté | Inscription « Wander » pour accès plein ; avis, photos, tips |
| Business | « + List Your Business » ; plans ~**30–40 $/mois** (ou annuel) ; free pour les 10 premiers / ZIP ; badges Verified ; Click-to-Call premium ; coupons ; QR ; placement search |
| Sponsoring | Bannière *« Our Stories are made possible by our Sponsors »* sous articles |
| Roadmap annoncée | Scavenger hunts, homes for sale/rent, national network, motorcycle loops |
| Stack | **Brilliant Directories** (empreinte « demo » / plugin geo-block) — UX annuaire web desktop-first |
| Mobile | **Pas** d’app native App Store / Play — web only |

### Business model (observé)

B2B directory + sponsoring d’articles / featured listings. Pas de modèle « Explorer = pubs réseau / compte = sans pub » comme Médoc Vibes. Pas de PostGIS / allowlist communes — périmètre US progressif (ville par ville).

---

## 2. Ce que Gemini a proposé / extrait (fidèle au share)

Conversation FR : proximité **medocvibes.fr** ↔ **Locals Wandering** (Médoc vs Ozarks). Gemini dit « parallèle parfait » puis liste à prendre / à éviter.

### À prendre (selon Gemini)

1. **Storytelling comme produit d’appel** — articles légendes / histoire (ex. blockhaus, Cordouan, pinède) qui ramènent vers fiches restos/sorties ; section type « Histoires & Légendes du Médoc ».
2. **Sponsoring d’article** — mention sponsors sous contenu éditorial ; ex. école de surf parraine « 5 meilleurs couchers de soleil ».
3. **Événements niche** — focus micro-events fédérateurs (surf local, voitures collection, dégustations privées) en plus de DT / OpenAgenda.
4. **« Label Local »** — figures locales (surfeur, chef guinguette) partagent coups de cœur pour humaniser la data OD.
5. **Sponsoring d’itinéraires** — vendre l’étape recommandée d’une balade à un château / resto.

### À ne surtout pas prendre (selon Gemini)

1. **Modèle annuaire web** Brilliant Directories (listes denses desktop) — rester sur UX **mobile / carte**.
2. **Geo-blocking IP pays (403)** — erreur pour un produit touristique ; Médoc Vibes doit rester **accessible mondialement** (touristes DE/UK/NL qui planifient avant l’arrivée).

### Erreurs / approximations Gemini à corriger

| Affirmation Gemini | Réalité Médoc Vibes actée |
|---|---|
| « Freemium In-App Ads vs **version payante** sans pub » | **Faux** — Explorer = pubs ; **compte gratuit** (Google/Apple/FB/magic link) = pas de pub ; abo = **partenaires B2B**, pas paywall user ([auth-explorer](auth-explorer.md)) |
| Parallèle « exactement la même chose » | Partiel — même *genre* (guide local géo) ; LW = annuaire+blog US ; MV = app native festif/loisir + OD + boost partenaires |
| Impératif blog / itinéraires / Label Local tout de suite | Idées utiles, **hors** parcours MVP déjà figé |

Captures : [good-practices](#) — *capture Context Cursor only (`media/gemini-analysis-good-practices.webp`)* · [éviter](#) — *capture Context Cursor only (`media/gemini-analysis-avoid.webp`)* · [tableau](#) — *capture Context Cursor only (`media/gemini-analysis-comparison-table.webp`)*.

---

## 3. Points inspirants pour Médoc Vibes

| Idée | Pourquoi ça résonne | Lien décisions actuelles |
|---|---|---|
| Ancrage **territoire** fort (pas clone Paris) | Aligné priorité #1 Médoc | [project-context](project-context.md) |
| Ouverture sur **où je suis** | Aligné géoloc → feed immédiat | [app-journey-brainstorm](app-journey-brainstorm.md) |
| Commerces qui **paient pour être vus** | Proche abo Essentiel/Premium + boost N=3 | [partner-cms-spec](partner-cms-spec.md) |
| Contenu **niche / vie locale** (pas seulement OT) | Vides-greniers, guinguettes, surf — déjà cible | [maquettes-vs-data](maquettes-vs-data.md) · [product-notes](product-notes.md) |
| Storytelling / éditorial | Complément SEO & différenciation vs annuaire froid | **Pas** dans MVP écrans ; idée **plus tard** (landing / blog / CMS) |
| Sponsoring natif sous contenu | Complément pubs réseau + abo | À évaluer **après** launch ; ne pas mélanger avec boost feed |
| Micro-events fédérateurs | Densifie chips Sorties / vide-greniers faibles en OD | Via **CMS partenaires** + curation — déjà prévu |

---

## 4. Ce qu’on ne doit pas copier

| Zone | Pourquoi |
|---|---|
| **Marque / copy / assets** Locals Wandering | Marque US distincte ; pas de clone UI/naming |
| **Brilliant Directories** / UX annuaire desktop | Hors stack (Adonis + natif iOS/Android) ; UX actée = feed mobile near→far |
| **Geo-block France / hors-USA** | Contredit tourisme inbound ; Anthony est déjà bloqué — leçon négative |
| **Avis ★ + UGC photos MVP** | Explicitement **retirés** du MVP (pas de source OD fiable) — [maquettes-vs-data](maquettes-vs-data.md) |
| **Hébergements, real estate, classifieds, QR business, scavenger hunts** | Hors scope festif/loisir Médoc |
| **Inscription obligatoire pour explorer** | Contredit **Explorer sans compte** |
| **Chat « amis locaux »** (LocalWander Brésil) | Autre produit ; ops humains hors budget |
| **Boucles moto / trails nature comme cœur** | Frontière PNR (« Mon Médoc ») — ne pas dupliquer |
| **« Version payante sans pub »** | Gemini se trompe ; monétisation user = compte gratuit sans pub |

---

## 5. Alignements / écarts vs décisions actées

| Décision Médoc Vibes | Locals Wandering | Verdict |
|---|---|---|
| Géoloc → feed ; refus = **Saint-Laurent-Médoc** ; bouton CP/ville | Géo + search + City Pages ; défaut Mountain View | **Aligné** sur « autour de moi » ; défaut commune = même pattern |
| Pas de bride 15 km ; near→far + pagination ; PostGIS | Directory / search BD — pas ce modèle | MV **plus avancé** côté geo feed ; ne pas reculer vers listes annuaire |
| Partenaires d’abord (boost N=3) | Featured / top placement payant | **Aligné** en intention ; garder plafond N + distinction ads≠boost |
| Allowlist **56 communes** EPCI | Expansion US ville par ville | **Garder** périmètre figé — pas de « national » |
| Auth Explorer + 4 providers ; pubs si anon | Member login pour full access ; newsletter agressive | **Garder** Explorer libre ; pas de mur login |
| Data OD (DT primaire, OA appoint) + soft-fail | Contenu communautaire + listings payants | **Garder** OD ; UGC/avis = plus tard |
| Pas de ★ MVP | Avis locaux mis en avant | **Écart** — ne pas réintroduire ★ |
| CMS partenaire planifié, 0 partenaires launch OK | Business listings dès le départ | Aligné sur **capacité** CMS ; launch vide OK |
| Accessible hors Médoc (touristes) | IP hors USA bloqués | **Ne pas** reproduire le geoblock |
| Complémentarité PNR | Folklore + trails outdoor | Garder frontière nature vs festif |

---

## 6. Recommandations concrètes

### Garder (déjà acté — ne pas rouvrir)

- Parcours géoloc → feed · Saint-Laurent-Médoc · partenaires d’abord · PostGIS · allowlist 56 · Explorer + pubs · pas de ★ · CTA conditionnels · CMS boost N=3.

### Adapter (inspiration utile, hors chemin critique MVP)

| Reco | Stance |
|---|---|
| Storytelling / « Histoires du Médoc » | **Ignorer pour l’app MVP** ; optionnel **landing / blog** ou pages CMS plus tard — ne pas alourdir schéma `places`/`events` |
| Sponsoring d’article | **Ignorer MVP** ; piste monétisation B2B **post-launch** (≠ boost feed, ≠ pubs réseau) |
| Focus événements niche | **Adapter** via CMS partenaires + chips déjà prévues (vide-greniers, sorties, surf) — pas de nouvelle surface UI |
| « Label Local » / coups de cœur de figures | **Ignorer MVP** (proche avis/curation humaine) ; éventuel badge éditorial ops plus tard, pas UGC ouvert |
| Sponsoring d’itinéraires | **Ignorer MVP** — pas d’itinéraires natifs actés ; PNR = balades nature |

### Ignorer

- Annuaire Brilliant Directories · geoblock · avis/photos communautaires MVP · real estate / classifieds · app web-only · paywall « Wander register » · LocalWander chat Brésil · moto loops comme feature cœur.

### Point d’attention Anthony (accès France)

Le blocage FR est un **choix produit LW** (IP country), pas une preuve de qualité. Pour tester LW : VPN US. Pour Médoc Vibes : **rester ouvert mondialement** (Gemini a raison sur ce point).

---

## 7. Verdict court

Locals Wandering valide l’intuition « **guide local géo + commerces qui paient + vie de territoire** », mais c’est un **annuaire web US + magazine**, pas le blueprint de Médoc Vibes. Les décisions déjà actées (feed mobile PostGIS, Explorer, OD, boost plafonné, pas de ★) sont **plus adaptées** au Médoc festif. Retenir surtout : **ne pas geobloquer**, **ne pas devenir un annuaire desktop**, et traiter storytelling / sponsoring éditorial comme **pistes post-MVP**, pas comme pivot conception.

---

*Analyse 2026-10-20 — sources : share AI Mode (navigateur), site Locals Wandering, docs conception Médoc Vibes.*
