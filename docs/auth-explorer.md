# Auth & explorer — parcours, providers et monétisation MVP

**Date :** 2026-10-01 (maj 2026-10-24 : Facebook retiré, magic link e-mail, favoris = compte requis)  
**Statut :** conception (pas d’implémentation)  
**Réf. :** [maquette-v2-data.md](maquette-v2-data.md) · [api-contracts.md](api-contracts.md) · [auth-contracts.md](auth-contracts.md) · [partner-cms-spec.md](partner-cms-spec.md) · [product-notes.md](product-notes.md) · [sources-plain.md](sources-plain.md)

---

## 1. Parcours Welcome — entrées MVP

| CTA | Rôle | MVP conception |
|---|---|---|
| **Continuer avec Google** | OAuth Google | **Inclus** |
| **Continuer avec Apple** | Sign in with Apple | **Inclus** |
| **Lien magique (e-mail)** | Magic link e-mail | **Inclus** — envoi lien one-shot, session serveur |
| **Explorer sans compte** | Découverte anonyme | **Conservé** — feed « Autour de moi » sans login |

Les CTA auth ne sont **pas** des stubs « bientôt » : les **3 méthodes** + Explorer font partie du Welcome MVP.

Taglines A/B et logos provisoires : voir handoff maquette. L’UI Welcome peut regrouper les providers (ex. « Continuer avec… ») sans changer le périmètre.

---

## 2. Providers actés (Anthony)

- **Apple, Google, magic link (e-mail)** = auth consommateur MVP.
- **Explorer sans compte** = entrée de premier plan — ne pas obliger le login pour découvrir.
- Endpoints lecture (`/v1/feed/around`, places, events, IRVE) restent **publics** pour l’anonyme.
- Favoris cloud, profil / historique des lieux visités = **compte requis** (pas de favori local anonyme : le favori pousse l’inscription et nourrit le KPI partenaires).
- CMS partenaire = comptes **métier séparés** (voir [partner-cms-spec](partner-cms-spec.md)) — ≠ OAuth consommateur.

---

## 3. Monétisation pubs — figé (Anthony confirmé)

| État | Règle produit MVP |
|---|---|
| **Non connecté** (Explorer) | **Pubs** dans le feed et/ou les fiches — **revenu** (chemin monétisation free) |
| **Connecté** (Apple / Google / magic link e-mail) | **Pas de pub** — cible produit MVP |

**Échange de valeur :** anonyme = découverte + pubs ; compte = UX propre (**pas de pub**), favoris sync, etc. — sans paiement in-app.

**Cible :** « pas de pub » une fois loggé. Soft transition (ex. densités ads réduites en build) seulement si contrainte technique SDK — **pas** une stance produit « encore un peu de pub ».

**Ce n’est pas** le boost partenaire (abo commerçant) — voir distinction §5 et [partner-cms-spec](partner-cms-spec.md).

---

## 4. Nav anonyme vs authentifié

| Capacité | Sans compte | Avec compte (Google / Apple / magic link) |
|---|---|---|
| Feed autour + filtres chips | Oui | Oui |
| Fiches lieu / sortie, CTA externes | Oui | Oui |
| Hint IRVE / détail bornes | Oui | Oui |
| **Pubs réseau (ads)** | **Oui** — feed et/ou fiches (revenu) | **Non** — cible MVP **pas de pub** |
| Favoris | **Aucun** (compte requis) | Sync cloud + multi-appareils |
| Prompt login | Sur CTA favori **ou** CTA « compte = sans pub » | — |
| Profil / historique des lieux visités | Non | **Oui** |
| Offres « montre l’écran » / codes attribution | Non | Si partenaires + offers |
| Offline minimal (carte favoris) | Non | Favoris syncés (dernier snapshot) |
| **Partner CMS** | **Non** | Compte **partenaire** distinct (pas le même compte conso) |

**Règle :** ne pas bloquer la découverte Médoc derrière un login. L’auth sert à **persister** (favoris) et à l’**échange monétisation** (**pas de pub** une fois connecté).

**Défaut nav non-auth :** browse feed + fiches + IRVE **avec pubs** ; pas de favoris ; pas de CMS.  
**Défaut nav auth :** même parcours **sans pubs réseau**, favoris cloud + profil / historique.

---

## 5. Pubs réseau vs boost partenaire (ne pas confondre)

| | **Ads (pubs réseau)** | **Boost / sponso partenaire** |
|---|---|---|
| Qui paie | Réseau pub / inventaire free users | Partenaire (abo mensuel hors app) |
| Qui voit | Utilisateurs **non connectés** uniquement (connecté = **pas de pub**) | Tout le monde — mise en avant d’un établissement |
| Où | Emplacements pub feed / fiche | Items feed + badge **Partenaire** |
| But | Revenu Anthony sur le free | Mise en avant commerçant payant |

Détail boost / plafonds : [partner-cms-spec.md](partner-cms-spec.md) §4.

---

## 6. Vie privée & géoloc (bref)

- Géoloc = permission OS à l’ouverture, usage **« autour de moi »** (tri near→far + pagination ; **pas** de bride 15 km). Refus / indispo → **Saint-Laurent-Médoc** (feed immédiat, pas d’écran ville/CP obligatoire) ; changement via bouton header → sheet CP / ville (allowlist). Détail : [app-journey-brainstorm](app-journey-brainstorm.md).
- Pubs : inventaire / SDK conforme store + mentions légales ; pas de tracking opaque hors cadre ads déclaré.
- Pas de check-in forcé ; check-in géofencé = opt-in plus tard ([product-notes](product-notes.md)).
- Pas de favori sans compte : les favoris n’existent qu’en cloud une fois connecté.
- Mentions légales / CGU / confidentialité : **page site/** avant store.

---

## 7. Scope MVP conception vs plus tard

| Inclus MVP conception | Plus tard |
|---|---|
| SDK Apple + Google + magic link e-mail, sessions, révocation | Notifs push, deep links marketing |
| Explorer + pubs réseau sur non-connecté | Personnalisation ads / médation avancée |
| **Connecté = pas de pub** (figé) | Premium payant / A/B hors besoin actuel |
| Favoris cloud pour comptes | Offres / QR attribution |
| — | Auth SSO partenaires OT avancée |

Auth **CMS partenaire** : comptes métier séparés — [partner-cms-spec.md](partner-cms-spec.md).

---

*Conception seule. Figé Anthony : Apple + Google + magic link (e-mail) + Explorer ; non-connecté = pub = revenu, sans favori ; connecté = **pas de pub**, favoris cloud + profil / historique.*
