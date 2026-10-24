# Partner CMS — mini-spec headless

**Date :** 2026-10-01 (Anthony — paliers Essentiel/Premium + plafond boost N=3)  
**Statut :** conception — **planifié dans le MVP produit** (pas « post-MVP forever »)  
**Réf. :** [product-notes.md](product-notes.md) · [data-model-sync.md](data-model-sync.md) · [auth-explorer.md](auth-explorer.md) · [maquette-v2-data.md](maquette-v2-data.md) · [api-contracts.md](api-contracts.md) · [ops-kpi.md](ops-kpi.md) · [project-context.md](project-context.md)

---

## 1. Intention produit

Les partenaires (restos, bars, guinguettes, OT…) paient un **abonnement mensuel** (hors app) et accèdent à un **petit CMS headless** pour gérer leur présence dans Médoc Vibes :

- **CRUD fiche lieu** liée (`place_id`) : description, horaires, phone, media, URLs
- **CRUD événements** rattachés : dates, chip, prix, ticket/registration/website URLs, photos
- **URLs & photos** avec licence / droits clairs

Source sync : `partner_cms` → badge UI **Partenaire** · priorité dedup haute ([data-model-sync](data-model-sync.md) §3–4).

**Stance Anthony :** le mini-CMS n’est **pas** reporté indéfiniment — le concevoir et le planifier dans le périmètre MVP produit (livraison possible en vague proche du launch app, même si **0 partenaires** au jour J).

---

## 2. Capacités cibles (schéma logique)

| Zone | Contenu éditable |
|---|---|
| Place liée | CRUD enrichissement : description, media, phone, booking/website, opening_hours — pas de création libre hors périmètre / hors `partner_id` |
| Events | CRUD : title, dates, chip, price_label, geo ou héritage lieu, ticket/registration/website URLs, media |
| Compte Partner | `name`, `slug`, `status` (`draft`\|`active`\|`paused`), `plan` (`essentiel`\|`premium`), `cms_enabled` |

**Droits :** un compte partenaire n’édite **que** ses `place_id` / `event` liés (`partner_id`). Pas d’admin global dans le CMS partenaire. Compte CMS ≠ compte utilisateur app (Google / Apple / Facebook / magic link) — voir [auth-explorer](auth-explorer.md).

---

## 3. Launch data vs produit CMS

| Décision | Détail |
|---|---|
| **0 partenaires** au launch data (défaut Q4) | Table `partners` vide OK ; empty states feed |
| Empty states | Feed / chips sans contenu Partenaire — UI déjà prévue (02b) |
| Seed | Optionnel ; pas bloquant premier sync OD |
| **CMS headless** | **Planifié MVP** — API CRUD + UI web légère dans la roadmap produit |
| Auth partenaire | Comptes métier dédiés (email magique / password ops) — hors OAuth consommateur |

L’app lit le cache OD (+ contenu CMS dès qu’un partenaire est `active`). Badge Partenaire seulement si `partner_id` / source `partner_cms`.

---

## 4. Deux monétisations distinctes (ne pas mélanger)

| | **Ads réseau (free users)** | **Boost / sponso partenaire** |
|---|---|---|
| Qui paie | Inventaire publicitaire (réseau ads) | Partenaire via **abonnement** hors app |
| Qui voit | Surtout les **non connectés** — connecté = **pas de pub** ([auth-explorer](auth-explorer.md) §3) | Tous les users — highlight d’un établissement |
| Objet | Emplacements pub génériques | Fiche / event partenaire mis en avant |
| Badge | Pub / label ads conforme | Badge **Partenaire** obligatoire |
| Doc | [auth-explorer.md](auth-explorer.md) | Ce fichier §5 |

**Ads ≠ boost.** Les pubs free users ne remplacent pas l’abo commerçant ; le boost ne remplace pas les pubs anonymes.

---

## 5. Paliers partenaire — Essentiel vs Premium (figé)

Deux plans abo hors app (`partners.plan`) :

| Plan | Intention | Boost |
|---|---|---|
| **Essentiel** | Présence CMS + badge Partenaire + éligible boost | Participe aux slots boost « ouverts » |
| **Premium** | Même chose + **priorité** sur 1 slot réservé | Remplit d’abord le slot Premium réservé |

Tarifs / features CMS détaillées (quota médias, multi-lieux…) = hors scope cette mini-spec — le différenciateur feed figé ici = **règle de slots** §6.

Sans partenaire `active` : aucun boost ; empty states OK (Q4).

---

## 6. Boost, badge, sponsoring — règles figées

Aligné maquette 02a / 04a et [product-notes](product-notes.md). Objectif : mise en avant **lisible**, **plafonnée**, **sans dark patterns**.

### 6.1 Plafond N=3 (Anthony confirmé)

Max **3** items `partner_boost` dans une page feed (même rayon / chip). Au-delà : rotation équitable parmi les éligibles non affichés.

### 6.2 Remplissage des 3 slots (figé)

Dans le pool d’items partenaires **éligibles** (abo `active`, dans rayon/chip, boostable) :

| Slot | Règle |
|---|---|
| **1 slot réservé Premium** | Si ≥1 Premium éligible → **obligatoirement** 1 item Premium dans les 3 |
| **2 slots restants** | Essentiel **ou** Premium (remplir Premium si plus d’éligibles Premium) |
| **Aucun Premium éligible** | Les 3 slots se remplissent avec Essentiel ; s’il n’y en a pas assez → moins de 3 boosts, puis **organique** |
| **Moins de 3 boostables au total** | Afficher ce qu’il y a ; le reste = organique — ne pas inventer de slots vides « pub partenaire » |

**Ordre d’affichage proposé :** d’abord le Premium réservé (si présent), puis les autres boosts (Premium restants / Essentiel), puis organique. Ne pas masquer le reste du Médoc.

Rotation : si plusieurs Premium (ou Essentiel) pour le même rôle de slot → rotation équitable (round-robin / seed session), pas toujours le même.

### 6.3 Badge, transparence, interdits

| Levier | Règle |
|---|---|
| **Badge Partenaire** | Chip source OT · Agenda · **Partenaire** — toujours visible quand applicable (Essentiel comme Premium) |
| **Transparence** | Label / badge Partenaire obligatoire sur item boosté ; pas de faux « recommandé pour vous » opaque |
| **Interdit** | Pubs plein écran bloquantes *partenaire*, autoplay sonore, faux compteurs, CTA trompeurs, boost sans abo `active` |
| **Attribution clics** | Itinéraire / appeler / site / réserver + UTM — vague ultérieure ; pas de preuve CB MVP |

**Paiement partenaire :** abonnement **hors app** (facture / Stripe ops ou manuel). **Aucun paiement in-app** utilisateur ni partenaire au lancement CMS.

Rappel ads free users : [auth-explorer.md](auth-explorer.md) — non-connecté = pubs ; connecté = **pas de pub**. Ads ≠ ces slots boost.

Sans partenaires : `partner_boost` toujours false ; règles ci-dessus déjà câblées côté API/UI.

---

## 7. Hors scope immédiat (mais pas « never »)

| Hors 1ʳᵉ vague CMS | Plus tard |
|---|---|
| Onboarding self-serve + facturation abo automatisée | Idem |
| Différenciation CMS riche Premium (multi-lieux, médias illimités…) | Affiner après 1ers abos |
| Table `offers` / QR / codes attribution | Attribution avancée |
| Rating / avis | — |
| Réservation native | Liens externes seulement |
| Dashboard ops riche | Voir §8 + [ops-kpi.md](ops-kpi.md) |

---

## 8. Lien avec ops Next.js (KPI)

`ops/` = dashboard **interne** (équipe), **lecture seule** d’abord :

- Santé sync (`sync_runs`, compteurs DT/OA/IRVE)
- Compteurs feed / empty chips
- Liste partenaires `status` / `plan` (**Essentiel** vs **Premium**)
- **Boosts actifs / plafond N=3** + indicateur « slot Premium réservé rempli ? »
- (Plus tard) inventaire ads / fill rate — hors CMS partenaire

Le CMS partenaire **n’est pas** le dashboard ops. Curation manuelle ops ponctuelle = process humain de secours, pas substitut au CMS commerçant.

---

*Conception seule — pas de scaffold CMS ni Dokploy. Plafond boost N=3 + 1 slot Premium réservé = figé Anthony. Ads free users → auth-explorer.*
