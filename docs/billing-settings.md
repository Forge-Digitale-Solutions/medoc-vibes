# Billing settings partenaires : cadrage décisionnel

**Date :** 2026-10-24 (cadrage, sans implémentation)
**Statut :** conception décisionnelle, à valider par Anthony
**Réf. :** [handoff-ia.md](handoff-ia.md) · [partner-cms-spec.md](partner-cms-spec.md) · [project-context.md](project-context.md) · [data-model-sync.md](data-model-sync.md) · [ops-kpi.md](ops-kpi.md)

Ce document cadre les « billing settings », c'est à dire les réglages de facturation des abonnements partenaires (plans Essentiel / Premium). Il ne décrit ni un paiement utilisateur, ni une implémentation : il prépare la décision et le modèle de données, sans écrire de migration ni toucher au code.

---

## 1. Périmètre et définition

**« Billing settings »** = les réglages métier et ops du cycle de vie commercial d'un partenaire : à qui on facture, quel plan, quel montant, qui encaisse, quand suspendre, et comment ce statut se répercute sur le boost.

C'est le réglage **partenaire**, pas le paiement **utilisateur**. Rien ici ne touche au paiement in-app (inexistant au lancement) ni à l'inventaire ads.

| Est dans « billing settings » | N'est pas dans « billing settings » |
|---|---|
| Plan attribué (`essentiel` / `premium`) | Paiement utilisateur in-app |
| Émission et suivi de la facture | Pubs réseau (free users, `ads ≠ boost`) |
| Encaissement (manuel ou Stripe ops) | Surface d'édition CMS partenaire |
| Échéance, relance, suspension | Dashboard ops phase 1 (lecture seule) |
| Propagation `active` / `paused` vers le boost | Preuve / attribution CB |

**Décisions figées, non rouvertes ici** (rappel des sources) :

- Abonnement facturé **hors app** : facture / Stripe ops ou manuel. **Aucun paiement in-app** utilisateur ni partenaire au lancement CMS ([partner-cms-spec](partner-cms-spec.md) §6.3).
- Self-serve et facturation automatisée : **hors première vague** ([partner-cms-spec](partner-cms-spec.md) §7).
- **0 partenaire au launch** accepté ([handoff-ia](handoff-ia.md) §3, [data-model-sync](data-model-sync.md) §6).
- Dashboard ops phase 1 **lecture seule** et **exclut la facturation** ([ops-kpi](ops-kpi.md) §3, §5).
- **ads ≠ boost** : le boost ne remplace pas les pubs anonymes ([partner-cms-spec](partner-cms-spec.md) §4).
- Secrets **hors git** : valeurs chez Anthony / Dokploy / vault, noms seulement en doc ([handoff-ia](handoff-ia.md) §9).

---

## 2. Options de facturation

Trois options, de la plus manuelle à la plus automatisée. Aucune n'est implémentée aujourd'hui.

### Option A : manuel / facture (process humain)

| | |
|---|---|
| **Avantages** | Zéro intégration, zéro coût fixe, zéro dépendance tierce, contrôle total, adapté à 0 à quelques partenaires. |
| **Coûts** | Temps humain (facture, relances, suivi), pas d'historique structuré, tout à la main. |
| **Risques** | Oubli de relance, erreur manuelle, statut `active` / `paused` mis à jour à la main, ne passe pas à l'échelle. |
| **Prérequis** | Un outil de facture (PDF / tableur), une discipline de suivi des échéances, un humain référent. |

### Option B : Stripe Invoicing côté ops

Émission et suivi des factures dans Stripe, mais **pas de portail client** : le partenaire ne se connecte pas, ops garde la main.

| | |
|---|---|
| **Avantages** | Factures générées et envoyées, suivi `paid` / `open` / `overdue`, relances automatisables, historique propre, référence Stripe stable. |
| **Coûts** | Frais Stripe (paiement + module invoicing, ordre de grandeur à confirmer sur la grille en vigueur), temps de paramétrage, clé API et webhook à sécuriser. |
| **Risques** | Dépendance tierce, besoin d'un accès ops sécurisé, réconciliation Stripe vs table `partners`. |
| **Prérequis** | Compte Stripe, clé secret + webhook (hors git), un humain qui crée/émet la facture, colonnes de référence Stripe sur `partners`. |

### Option C : Stripe Customer Portal self-serve

Le partenaire gère seul son abonnement (carte, changement de plan) via le portail Stripe.

| | |
|---|---|
| **Avantages** | Onboarding self-serve, mise à jour carte autonome, changement de plan sans ops, zéro relance manuelle, scalable. |
| **Coûts** | Intégration la plus lourde : produits/prix, config Customer Portal, webhooks, mapping Stripe vers `partners.status` / `plan`, tests. |
| **Risques** | Complexité (échecs de paiement, dunning, prorata), dépendance la plus forte, effort démesuré à volume quasi nul. |
| **Prérequis** | Tout Option B + produits/prix configurés, Customer Portal activé, webhook de sync des statuts, souvent un lien d'auth partenaire. |

---

## 3. Recommandation MVP

**Démarrer en Stripe Invoicing (Option B), manuel en secours, Customer Portal self-serve plus tard.**

Décision Anthony (2026-10-24) : **Stripe dès le MVP**, pas de facture manuelle / tableur au départ. Les tarifs vivent **côté backend** (variables d'environnement / Stripe), jamais dans les builds front, pour éviter la taxe in-app Google / Apple.

- Ops phase 1 **lecture seule, hors facturation** : Stripe est l'outil d'encaissement, pas le dashboard.
- Aucun paiement in-app : on ne branche aucun checkout, seulement la couche « qui paie / qui est actif ».
- Self-serve (Customer Portal) reste **hors première vague**.

Chemin :

1. **MVP** : Stripe Invoicing côté ops (factures, suivi `paid` / `open` / `overdue`), via les colonnes `stripe_*` du §4.
2. **Secours** : facture manuelle pour les cas hors Stripe (exception).
3. **Plus tard** : Customer Portal self-serve, si volume réel.

---

## 4. Modèle de données minimal proposé pour `partners`

État actuel confirmé dans le code (migration `1769900000004_create_partners_table`) :

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | uuid | PK |
| `name` | string | not null |
| `slug` | string | not null, unique |
| `status` | string(32) | not null, default `draft` |
| `created_at` | timestamptz | not null |
| `updated_at` | timestamptz | nullable |

**Écart à signaler** : la spec ([partner-cms-spec](partner-cms-spec.md) §2) prévoit `plan` et `cms_enabled`, absents du schéma. Ce n'est pas une décision à rouvrir, c'est une colonne de retard à combler par migration additive.

### Champs requis par la spec (à ajouter)

| Colonne | Type | Nullabilité | Valeurs / défaut | Notes |
|---|---|---|---|---|
| `plan` | text (ou enum) | **nullable** | `essentiel` \| `premium` | Null tant que le partenaire n'a pas d'abonnement (draft). |
| `cms_enabled` | boolean | **not null, default `false`** | | Backward-safe : les lignes existantes restent à `false`. |

### Champs billing optionnels (préparés pour l'Option B/C, tous nullable)

| Colonne | Type | Notes |
|---|---|---|
| `billing_mode` | text nullable | `manual` \| `stripe` (défaut `manual` une fois facturé) |
| `stripe_customer_id` | text nullable, unique | Référence client Stripe, jamais une clé |
| `stripe_subscription_id` | text nullable | Référence abonnement Stripe |
| `billing_email` | text nullable | Optionnel (Stripe gère l'email de facturation) |
| `current_period_end` | timestamptz nullable | Échéance de la période courante |
| `billing_status` | text nullable | `active` \| `past_due` \| `canceled` (miroir Stripe) |

### Deux statuts distincts (important)

| Champ | Rôle | Valeurs |
|---|---|---|
| `status` | Visibilité produit / boost | `draft` \| `active` \| `paused` |
| `billing_status` | Encaissement (facultatif, miroir Stripe) | `active` \| `past_due` \| `canceled` |

`billing_status` ne pilote **pas** directement le boost : c'est `status` qui décide. Un `past_due` doit amener ops à passer `status = paused` (manuel au MVP, via webhook plus tard).

### Règles backward-safe (alignées [handoff-ia](handoff-ia.md) §8)

- Uniquement des `ADD COLUMN`, pas de drop / rename / changement de NOT NULL existant.
- Toute nouvelle colonne non nulle a un défaut ; les colonnes de facturation restent **nullable**.
- Aucun backfill obligatoire, aucun wipe : les lignes existantes (dont le seed `guinguette-du-lac` en `active`) restent valides.

---

## 5. Workflow ops

Qui fait quoi, du démarchage à la suspension.

| Étape | Qui | Action | Effet sur le produit |
|---|---|---|---|
| 1. Accord commercial | Anthony / Forge Digitale | Négocie le plan et le tarif (hors app) | Rien encore |
| 2. Création partenaire | Ops | Crée la ligne `partners` en `draft`, définit `plan` | Invisible dans le feed |
| 3. Onboarding CMS | Ops | Active `cms_enabled = true` une fois le compte métier prêt | Accès CMS ouvert |
| 4. Facturation / encaissement | Ops | **Stripe Invoicing** (factures, suivi `paid` / `open` / `overdue`), encaissement hors app | Rien automatique |
| 5. Activation | Ops | Passe `status = active` après premier encaissement | Badge Partenaire + éligible boost |
| 6. Suspension | Ops | Passe `status = paused` immédiat (pas de grace) ; CMS en delete-only | Sort du boost/badge ; plus de post/update CMS |
| 7. Reprise ou résiliation | Ops | `active` (reprise) ou retour `draft` / archivage | Réintégration ou retrait |

**Propagation `active` / `paused` au boost et au CMS :**

- Seuls les partenaires **`active`** sont éligibles au boost. La règle de slots N=3 et le slot Premium réservé ([partner-cms-spec](partner-cms-spec.md) §6) ne se calculent que sur ce pool.
- `paused` = exclu du pool boostable et du badge, sans supprimer la fiche (soft). `draft` = jamais exposé.
- **Non-paiement / abo inactif** (2026-10-24) : `status = paused` **immédiatement** (pas de grace). Le partenaire **conserve compte et contenu**, mais le CMS passe en **delete-only** : plus de POST / update, seulement supprimer.
- `cms_enabled` contrôle l'accès au CMS ; `status` contrôle la visibilité et le boost. Deux leviers indépendants.

Au MVP, ops crée / encaisse (via **Stripe Invoicing**) / suspend. Le dashboard ops phase 1 n'affiche pas la facturation, seulement `status` / `plan` ([ops-kpi](ops-kpi.md) §2.5).

---

## 6. Sécurité

**Ne doit jamais entrer dans git :**

- Clé secret Stripe (`sk_live_*`) et webhook signing secret.
- `DATABASE_URL` / identifiants DB `medoc_vibes`.
- Credentials Dokploy et tout token / secret.

**Où vivent les clés :**

- Clé Stripe + webhook secret : **Dokploy** (service `api` quand il existe) ou **vault Anthony**, jamais en clair, jamais dans un `.env` committé.
- Identifiants DB : **Dokploy / vault Anthony** (déjà acté, [handoff-ia](handoff-ia.md) §8).
- Dans la doc : **noms de variables seulement**, pas de valeurs ([handoff-ia](handoff-ia.md) §9).

**Risques :** une clé Stripe exposée = encaissement compromis ; un webhook secret exposé = statuts de paiement falsifiables. Les colonnes `stripe_customer_id` / `stripe_subscription_id` sont des **références**, pas des secrets, mais restent des données commerciales sensibles à protéger derrière l'auth ops.

---

## 7. Hors scope explicite et questions ouvertes

### Hors scope (figés, rappelés pour ne pas dériver)

- Paiement in-app (utilisateur ou partenaire).
- Self-serve onboarding + facturation automatisée (première vague).
- Facturation dans le dashboard ops phase 1.
- Attribution / preuve CB.
- Ads réseau (distinct du boost).
- Écrire la migration, le code ou le branchement Stripe : c'est l'étape suivante, pas ce document.

### Décisions actées (2026-10-24)

- **Outil** : Stripe Invoicing dès le MVP (pas de facture manuelle / tableur au départ). Manuel = secours.
- **Tarifs** : stockés **côté backend** (variables d'environnement / Stripe), jamais dans les builds front (éviter la taxe in-app Google / Apple).
- **Suspension** : pas de grace. Abo inactif = `status = paused` immédiat, boost + badge coupés, CMS en **delete-only**.
- **`billing_email`** : géré par Stripe, pas besoin de le distinguer côté `partners`.

### Questions restantes

1. **Modèle de prix** : fixe mensuel ou % (commission) plus tard, selon qu'Anthony arrive à tracker les users passés par l'app vers le partenaire (attribution).
2. **`plan` par défaut** : `null` (pas de plan) tant qu'aucun abo (défaut retenu, à confirmer).

---

## 8. Résumé exécutif

- Les « billing settings » = facturation **hors app** de l'abonnement partenaire (Essentiel / Premium), pas un paiement utilisateur.
- Décisions figées : facture / Stripe ops ou manuel, aucun paiement in-app, self-serve hors première vague, 0 partenaire au launch, ops lecture seule.
- Recommandation : **manuel/facture maintenant**, schéma prêt pour **Stripe Invoicing** ensuite, **Customer Portal self-serve** en dernier.
- Modèle : ajouter `plan` (nullable) et `cms_enabled` (bool default false) + colonnes `stripe_*` nullable, en migration additive sans wipe ni backfill.
- `status` (`active` / `paused`) pilote seul le boost (seuls les `active` sont boostables) ; les clés Stripe restent hors git, chez Dokploy / vault.

---

## Prochaines actions (à ne pas faire maintenant)

1. Rédiger la migration additive `partners` (`plan`, `cms_enabled`, colonnes billing nullable), backward-safe.
2. Brancher le filtre `status = active` dans le calcul de boost (règle N=3 / slot Premium réservé).
3. Préparer l'Option B Stripe Invoicing quand le volume le justifie (clé + webhook hors git, mapping Stripe vers `partners`).
4. Ajouter la vue lecture `partners` (`status` / `plan`) au dashboard ops, déjà prévue dans [ops-kpi](ops-kpi.md) §2.5.
5. Trancher avec Anthony les questions du §7 (tarifs, seuil, `paused` vs CMS, grace period).

---

*Cadrage décisionnel uniquement : pas de migration, pas de code, pas de secret. À valider par Anthony avant toute implémentation.*
