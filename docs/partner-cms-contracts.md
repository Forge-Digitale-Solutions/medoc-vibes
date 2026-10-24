# Partner CMS : contrats & surface web (v1)

**Date :** 2026-10-24
**Statut :** conception (spec technique, pas d'implémentation)
**Réf. :** [partner-cms-spec.md](partner-cms-spec.md) · [auth-contracts.md](auth-contracts.md) · [billing-settings.md](billing-settings.md) · [data-model-sync.md](data-model-sync.md) · [ops-kpi.md](ops-kpi.md) · [api-contracts.md](api-contracts.md)

> Le CMS partenaire est une **application web dédiée**, hors app mobile (iOS SwiftUI / Android natif), séparée de `site/` (landing) et `ops/` (dashboard interne lecture seule). Le partenaire s'y connecte avec un **compte métier** pour gérer sa fiche, payer son abonnement Stripe et voir ses KPI.

---

## 1. Périmètre et positionnement

| Oui | Non |
|---|---|
| Dashboard web avec connexion (compte métier) | Dans l'app mobile (le CMS n'est pas dans iOS / Android) |
| Gérer sa fiche lieu + ses events | Dashboard ops (interne, lecture seule, [ops-kpi](ops-kpi.md)) |
| Payer son abonnement Stripe | Comptes utilisateur app (Google / Apple / magic link) |
| Voir ses KPI (vues, clics, boost) | Paiement in-app |

Rappel : comptes métier ≠ comptes utilisateur app ([partner-cms-spec](partner-cms-spec.md) §2). Un partenaire n'édite **que** ses `place_id` / `event` liés (`partner_id`).

---

## 2. Surface et stack

- **App Next.js dédiée** dans le monorepo (workspace `partner/`), même pattern que `site/` et `ops/`.
- Consomme l'API AdonisJS (`/v1/partner/*`) pour l'écriture ; pas de backend séparé.
- Auth métier : **email + mot de passe ops**, distinct de l'auth app mobile.

---

## 3. Modèle de données

### `partners` (rappel, voir [billing-settings](billing-settings.md) §4)

`id`, `name`, `slug`, `status` (`draft` / `active` / `paused`), `plan` (`essentiel` / `premium`), `cms_enabled`, + colonnes Stripe nullable (`stripe_customer_id`, `stripe_subscription_id`, `billing_status`, `current_period_end`).

### `partner_users` (comptes métier, additif)

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `partner_id` | uuid FK → partners | un compte appartient à un partenaire |
| `email` | text not null, unique | login |
| `status` | text (enum) | `active` / `invited` / `revoked` |
| `created_at`, `updated_at` | timestamptz | |

MVP : **un compte unique par partenaire** (pas de rôles), créé par ops à l'onboarding (email + mot de passe initial). Multi-utilisateurs / rôles = plus tard.

### KPI / attribution (minimal MVP, post-MVP pour le complet)

- MVP : compteurs simples (vues fiche, clics CTA, impressions boost) stockés dans une table `partner_events` (ou agrégats).
- Attribution complète (preuve qu'un user est passé par l'app, % commission) : post-MVP, lié à [product-notes](product-notes.md).

---

## 4. Auth métier

- Login **email + mot de passe ops** (hash + reset), distinct de l'auth app mobile (Apple / Google / magic link). Pas de magic link métier.
- Session serveur **dédiée** aux comptes métier (distincte des sessions utilisateur app).
- Ops crée le compte et fournit le mot de passe initial à l'onboarding ; reset = ops (ou « oubli » plus tard).

---

## 5. Capacités du dashboard (écrans)

| Écran | Contenu | Droits |
|---|---|---|
| **Ma fiche** | Lire / éditer sa place : description, horaires, media, phone, URLs | `POST` / `PATCH` ; **delete-only si abo inactif** |
| **Mes événements** | CRUD events liés : dates, chip, prix, billetterie | idem |
| **Mon abonnement** | Plan, échéance, statut Stripe, bouton « payer » (lien Stripe hébergé / facture), historique | paiement via Stripe |
| **Mes KPI** | Vues fiche, clics CTA (itinéraire / appeler / site / réserver), impressions boost | lecture |

**Règle de suspension** (décision 2026-10-24, [billing-settings](billing-settings.md) §5) : abo inactif → `status = paused` immédiat, boost + badge coupés, CMS en **delete-only** (plus de POST / update, seulement supprimer).

---

## 6. Endpoints API (proposition, `/v1/partner/*`)

| Endpoint | Rôle |
|---|---|
| `POST /v1/partner/auth/login` | email + mot de passe → session métier |
| `POST /v1/partner/auth/logout` | révoque la session métier |
| `GET /v1/partner/me` | compte + partenaire lié |
| `GET /v1/partner/place` | sa fiche |
| `PATCH /v1/partner/place` | édition fiche (delete-only si `status != active`) |
| `POST / PATCH / DELETE /v1/partner/events` | CRUD events |
| `GET /v1/partner/subscription` | statut Stripe (plan, échéance, `billing_status`) |
| `POST /v1/partner/subscription/checkout` | renvoie un lien de paiement Stripe hébergé |
| `GET /v1/partner/kpi` | compteurs fiche / clics / boost |

Règles : scoping `partner_id` strict ; `cms_enabled = true` requis ; `delete-only` si `status != active`.

---

## 7. Sécurité

- Comptes métier séparés, session dédiée, scoping `partner_id` obligatoire.
- Clés Stripe **côté backend uniquement** (jamais dans le front, jamais en git), comme [billing-settings](billing-settings.md) §6.
- Le paiement est un **lien Stripe hébergé** : la carte ne transite jamais par notre backend.

---

## 8. Hors scope / plus tard

- Self-serve complet : Customer Portal, changement de plan / carte autonome ([billing-settings](billing-settings.md) §3).
- Multi-utilisateurs / rôles (owner / editor / viewer).
- Attribution complète (preuve CB, % commission).
- Dashboard ops riche (c'est [ops-kpi](ops-kpi.md), pas le CMS partenaire).

---

## 9. Décisions actées (2026-10-24)

- **Auth métier** : email + mot de passe ops (hash + reset), distinct de l'app mobile.
- **Surface** : app Next.js dédiée `partner/`.
- **KPI MVP** : vues fiche + clics CTA + impressions boost.
- **Comptes** : un compte unique par partenaire (pas de rôles MVP).
- **Stack Android** : Kotlin / Jetpack Compose (inchangé) ; iOS = SwiftUI.

Multi-utilisateurs / rôles, self-serve Stripe complet et attribution = plus tard.

---

*Conception seule : pas de code, pas de migration, pas de secret. Complète [partner-cms-spec.md](partner-cms-spec.md) (fonctionnel) par la partie technique web.*
