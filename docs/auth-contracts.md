# Auth & favoris : contrats API (v1)

**Date :** 2026-10-24
**Statut :** conception (contrats, pas d'implémentation)
**Réf. :** [auth-explorer.md](auth-explorer.md) · [api-contracts.md](api-contracts.md) · [app-journey-brainstorm.md](app-journey-brainstorm.md) · [data-model-sync.md](data-model-sync.md) · [partner-cms-spec.md](partner-cms-spec.md)

> Complète [api-contracts.md](api-contracts.md) (lecture seule) pour la partie écriture auth + favoris. Décisions actées : **Apple + Google + magic link (e-mail)**, Facebook retiré, **favoris = compte requis** (pas de favori local anonyme), connecté = pas de pub, anonyme = pubs.

---

## 1. Périmètre

| Inclus | Hors scope / plus tard |
|---|---|
| Auth consommateur : Apple, Google, magic link (e-mail) + Explorer sans compte | Mots de passe classiques (hash, reset, politique mdp) |
| Sessions serveur (token opaque) | Facebook (retiré) |
| Favoris cloud (compte requis) : liste / ajout / retrait | Deep link universel magic link (MVP = même device only) |
| Profil minimal (`me`) | Historique des lieux visités, offres / codes attribution |
| | CMS partenaire + auth ops (comptes métier séparés) |

Rappel : les endpoints **lecture** (`feed`, fiches, IRVE) restent publics pour l'anonyme. L'auth ne concerne que la persistance (favoris, profil) et l'échange monétisation (pas de pub).

---

## 2. Modèle de données minimal

### `users`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `email` | text null | magic link : obligatoire ; OAuth : si fourni |
| `provider` | text (enum) | `apple` \| `google` \| `magic` |
| `provider_sub` | text null | `sub` stable Apple / Google |
| `name` | text null | display name |
| `avatar_url` | text null | |
| `status` | text (enum) | `active` \| `suspended` |
| `created_at`, `updated_at` | timestamptz | |

Contraintes : `UNIQUE (provider, provider_sub)` pour l'OAuth ; `UNIQUE (email)` pour magic link (normalisé lowercase, non nul).

### `sessions`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `token_hash` | text | hash du token opaque (jamais en clair) |
| `expires_at` | timestamptz | |
| `created_at` | timestamptz | |
| `revoked_at` | timestamptz null | |

Le token est opaque (ex. `oat_...`), stocké **hashé** en base ; le client le garde en secure storage (Keychain / Keystore).

### `favorites`

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `entity_type` | text (enum) | `place` \| `event` |
| `entity_id` | uuid | |
| `created_at` | timestamptz | |

Contrainte : `UNIQUE (user_id, entity_type, entity_id)`.

---

## 3. Endpoints auth

Base : `/v1/auth`. Tout en JSON.

### 3.1 Magic link (e-mail)

| Endpoint | Body | Réponse |
|---|---|---|
| `POST /v1/auth/magic-link/request` | `{ "email": "..." }` | `202` neutre (ne révèle pas si l'email existe) |
| `POST /v1/auth/magic-link/verify` | `{ "token": "..." }` | `200` session + user ; `401` si expiré / invalide |

- `request` : génère un token one-shot à durée courte (ex. 15 min), envoie le lien par **Resend** (clé sur le service `api`, hors git).
- `verify` : échange le token contre une session.
- **Même device only MVP** : le lien rouvre l'app sur le même device (custom scheme / app link), pas de deep link universel.

### 3.2 OAuth Apple / Google (natif)

Le client fait le flux OAuth/SIWA **nativement** (SDK Apple / Google), puis envoie le jeton à l'API qui le vérifie.

| Endpoint | Body | Notes |
|---|---|---|
| `POST /v1/auth/oauth/apple` | `{ "id_token": "...", "authorization_code": "?", "name": "?" }` | Vérifie via JWKS Apple ; échange le `authorization_code` (refresh) si fourni |
| `POST /v1/auth/oauth/google` | `{ "id_token": "..." }` | Vérifie via Google (tokeninfo / JWKS) |

Réponse `200` → session + user (upsert si nouveau, `UNIQUE (provider, provider_sub)`). Récupérer `email` au moment de l'OAuth quand le provider le fournit (scope email), pour la BDD et les éventuels envois e-mail ; `email` reste optionnel.

### 3.3 Session / profil

| Endpoint | Notes |
|---|---|
| `GET /v1/auth/me` | Bearer token. `200` user (id, email, name, avatar_url, provider) ; `401` si absente / expirée |
| `POST /v1/auth/logout` | Révoque la session courante (`revoked_at`) |

Session : **30 jours**, renouvelée à l'activité (sliding). Pas de rotation OAuth serveur MVP : session 30 j + re-login silencieux via SDK.

---

## 4. Endpoints favoris

Base : `/v1/favorites`. **Compte requis** (`401` sinon). Aucun favori local anonyme.

| Endpoint | Body / Notes |
|---|---|
| `GET /v1/favorites` | Liste résolue : id, entity_type, entity_id + résumé place/event si dispo. Pagination `cursor` optionnelle |
| `POST /v1/favorites` | `{ "entity_type": "place", "entity_id": "..." }` → `201` ; idempotent (`200` si déjà présent) |
| `DELETE /v1/favorites/{entity_type}/{entity_id}` | `204` ; `404` si absent |

Comportement anonyme : un CTA favori sans compte → le client invite à créer un compte (login), aucune écriture locale.

---

## 5. Formes de réponse / erreurs

Session + user (ex. magic link) :

```json
{
  "session": { "token": "oat_...", "expires_at": "2026-11-24T00:00:00Z" },
  "user": {
    "id": "8f3c…",
    "email": "commerce@guinguette.fr",
    "name": "La Guinguette du Lac",
    "avatar_url": null,
    "provider": "magic"
  }
}
```

| HTTP | Quand |
|---|---|
| `400` | Body invalide (email malformé, entity_type inconnu, entity_id manquant) |
| `401` | Auth requise (favoris sans session, token expiré / révoqué) |
| `404` | Favori absent à la suppression, `me` sur session inconnue |
| `409` | Conflit (favori déjà présent si on choisit la non-idempotence) |

---

## 6. Hors scope / plus tard

- Mots de passe classiques : abandonné au profit du magic link.
- Facebook : retiré.
- Deep link universel magic link (MVP = même device only).
- Historique des lieux visités (table de suivi + endpoint, post-MVP).
- Offres « montre l'écran » / codes attribution.
- Auth ops ([ops-kpi.md](ops-kpi.md) §4) et auth CMS partenaire (comptes métier séparés, [partner-cms-spec.md](partner-cms-spec.md)).

---

## 7. Décisions actées (2026-10-24) + questions restantes

- **Token magic link** : 15 min. **Session** : 30 jours, renouvelée à l'activité (sliding).
- **Refresh OAuth** : pas de rotation serveur MVP ; session 30 j + re-login silencieux via SDK.
- **`email` OAuth** : optionnel, mais récupéré au moment de l'OAuth quand le provider le fournit (scope email), pour la BDD et les éventuels envois e-mail.
- **Suppression favori** : par `(entity_type, entity_id)`.
- **Resend côté API** : clé dédiée sur le service `api` (même compte Resend).

### Décision (2026-10-24)

- **Historique des lieux visités** : lieux **physiquement visités**, détectés via **geofence** (opt-in). Connecté only (BDD). **Post-MVP** (le check-in géofencé est déjà noté « opt-in plus tard » dans [product-notes](product-notes.md)).

---

*Conception seule : pas de code, pas de migration, pas de secret. À valider avant d'implémenter l'auth dans AdonisJS.*
