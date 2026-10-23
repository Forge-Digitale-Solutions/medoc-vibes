# Résumé — partage Gemini `T98N3zDwMmz4`

**Source :** [https://share.gemini.google/T98N3zDwMmz4](https://share.gemini.google/T98N3zDwMmz4)  
**URL canonique :** [https://gemini.google.com/share/ee10fa7a0044](https://gemini.google.com/share/ee10fa7a0044) (`skid=20aa7947-dbc7-434b-9945-1217202bc4ea`)  
**Titre page :** Évaluation des maquettes UI/UX  
**Dates conversation :** 19 septembre 2026 (~12:46, Gemini 3.8 Flash)  
**Publié :** 2 octobre 2026 ~09:32  
**Archivage :** 2026-10-02  
**Accès :** snapshot public accessible sans login (SPA ; curl seul = shell HTML, contenu extrait via Chrome headless / `innerText`)  
**Brut :** [internal/gemini-share/T98N3zDwMmz4-raw.txt](#) — *Context Cursor `internal/gemini-share/T98N3zDwMmz4-raw.txt` (hors git)*

---

## Contexte

Brainstorm très tôt : maquettes IA « LOOP » (Trade-Ideas / Image 2.5, fond jaune fluo, exemples Paris) → recentrage **Médoc** festif / loisirs, complémentaire à **Mon Médoc** (PNR). Conversation vocale/dictée ; Gemini produit 3 versions MD de synthèse destinées à « reprendre avec Claude ».

---

## Vision (retenue en substance)

- App locales **Médoc** : bons plans, sorties, restos/bars, loisirs (surf, pêche, vélo, œno).
- **Pas** un clone nature du PNR ; partenariat PNR plus tard (lien / bouton balades).
- Cible touristes + résidents ; peupler la data avant d’aller monétiser les commerçants.

---

## Features évoquées

| Thème | Contenu Gemini |
| --- | --- |
| Auth | Email/mdp, Google, Apple |
| Découverte | Géoloc « autour de moi », CP/ville, filtres catégories, favoris |
| Fiches | Lieu (resto) + lieu avec agenda événements / billetterie externe |
| Partenaires | Mini BO pour poster événements ; mise en avant payante |
| Preuve passage | QR/coupons, appel/résa traçable, UTM — exploratoire |
| Landing | `site/` marketing |

---

## Stack proposée (époque Gemini)

- Front : **Angular + Capacitor** (iOS/Android)
- Mono : `site/` · `ops/` · `web/` (PWA) · `api/` **AdonisJS** (Laravel écarté « too much »)
- Data : **Google Places** (cache-aside en base) + Yelp/Foursquare/OSM ; peuplement par CP Médoc × types

---

## Naming

Options : Spot · Spot Médoc · **Médoc Vibes** (plus « LOOP »). Non tranché ici ; **Médoc Vibes** acté ensuite (voir cadrage Claude).

---

## Idées encore pertinentes

- Ancrage Médoc + positionnement festif / loisir vs PNR nature.
- Univers : restos & bars, sorties, surf/nautique, vélo, pêche, œnotourisme, événements partenaires via petit BO.
- Monorepo `site/` + `ops/` + `api/` AdonisJS (la forme `web/` a évolué).
- Auth sociale + géoloc + filtres + favoris + CTA externes (résa / billets).
- Monétisation partenaires (mise en avant / abo) sans paiement in-app mobile au démarrage.
- Partenariat PNR envisageable plus tard.

## Idées écartées / déjà dépassées

- Nom / DA « LOOP » jaune fluo + lieux Paris (maquettes v1) → maquettes Médoc honnêtes.
- **Angular + Capacitor** / PWA `web/` → **natif** iOS/Android + landing Next (cadrage Claude / contexte actuel).
- **Google Places comme source stockable / cache** (+ Yelp/Foursquare) → **données ouvertes** (DATAtourisme primaire) ; Places hors cache ToS.
- Auth email+mdp comme socle → social + magic link / explorer sans compte.
- Preuve QR / coupon comme levier MVP → rejetée ensuite (fragile) ; problème d’attribution encore ouvert autrement.
- Catégorie « Nature » des maquettes LOOP → hors cœur pour éviter doublon PNR.
- Focus « services pratiques » (pharmacies, stations) → hors priorités produit actuelles.

---

## Croisement rapide

| Sujet | Gemini (sept. 19) | Claude `ff90ac33` / `project-context` |
| --- | --- | --- |
| Nom | Spot / Spot Médoc / Médoc Vibes | **Médoc Vibes** |
| Front mobile | Angular + Capacitor | Natif SwiftUI / Kotlin |
| Data | Google Places + cache DB | DATAtourisme + open data ; Places non stockable |
| Périmètre | CP Médoc (liste partielle) | Allowlist **56 communes** EPCI |
| Auth | Email + Google + Apple | Social + magic link **ou** explorer sans compte |
| Pubs | Non traité | Free = pubs ; connecté = sans pub |
| Preuve passage | QR / résa / UTM | Ouvert ; QR rejeté côté Claude |

Lien contexte vivant : [project-context.md](project-context.md) · cadrage Claude : [claude-share-ff90ac33.md](claude-share-ff90ac33.md).
