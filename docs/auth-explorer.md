# Auth & explorer — parcours, providers et monétisation MVP

**Date :** 2026-10-01 (clarifs Anthony — 4 providers + pubs figées)  
**Statut :** conception (pas d’implémentation)  
**Réf. :** [maquette-v2-data.md](maquette-v2-data.md) · [api-contracts.md](api-contracts.md) · [partner-cms-spec.md](partner-cms-spec.md) · [product-notes.md](product-notes.md) · [sources-plain.md](sources-plain.md)

---

## 1. Parcours Welcome — entrées MVP

| CTA | Rôle | MVP conception |
|---|---|---|
| **Continuer avec Google** | OAuth Google | **Inclus** |
| **Continuer avec Apple** | Sign in with Apple | **Inclus** |
| **Continuer avec Facebook** | OAuth Facebook | **Inclus** |
| **Lien magique (e-mail)** | Magic link e-mail | **Inclus** — envoi lien one-shot, session serveur |
| **Explorer sans compte** | Découverte anonyme | **Conservé** — feed « Autour de moi » sans login |

Les CTA auth ne sont **pas** des stubs « bientôt » : les **4 méthodes** + Explorer font partie du Welcome MVP.

Taglines A/B et logos provisoires : voir handoff maquette. L’UI Welcome peut regrouper les providers (ex. « Continuer avec… ») sans changer le périmètre.

---

## 2. Providers actés (Anthony)

- **Google, Apple, Facebook, magic link (e-mail)** = auth consommateur MVP.
- **Explorer sans compte** = entrée de premier plan — ne pas obliger le login pour découvrir.
- Endpoints lecture (`/v1/feed/around`, places, events, IRVE) restent **publics** pour l’anonyme.
- Favoris cloud, profil enrichi = **compte requis**.
- CMS partenaire = comptes **métier séparés** (voir [partner-cms-spec](partner-cms-spec.md)) — ≠ OAuth consommateur.

---

## 3. Monétisation pubs — figé (Anthony confirmé)

| État | Règle produit MVP |
|---|---|
| **Non connecté** (Explorer) | **Pubs** dans le feed et/ou les fiches — **revenu** (chemin monétisation free) |
| **Connecté** (Google / Apple / Facebook / magic link) | **Pas de pub** — cible produit MVP |

**Échange de valeur :** anonyme = découverte + pubs ; compte = UX propre (**pas de pub**), favoris sync, etc. — sans paiement in-app.

**Cible :** « pas de pub » une fois loggé. Soft transition (ex. densités ads réduites en build) seulement si contrainte technique SDK — **pas** une stance produit « encore un peu de pub ».

**Ce n’est pas** le boost partenaire (abo commerçant) — voir distinction §5 et [partner-cms-spec](partner-cms-spec.md).

---

## 4. Nav anonyme vs authentifié

| Capacité | Sans compte | Avec compte (Google / Apple / FB / magic link) |
|---|---|---|
| Feed autour + filtres chips | Oui | Oui |
| Fiches lieu / sortie, CTA externes | Oui | Oui |
| Hint IRVE / détail bornes | Oui | Oui |
| **Pubs réseau (ads)** | **Oui** — feed et/ou fiches (revenu) | **Non** — cible MVP **pas de pub** |
| Favoris | **Local device** uniquement | Sync cloud + multi-appareils ; fusion des favoris locaux à la 1ʳᵉ sync |
| Prompt login | Sur « sync / sauvegarder » favoris **ou** CTA « compte = sans pub » | — |
| Profil / historique | Non | Optionnel léger |
| Offres « montre l’écran » / codes attribution | Non | Si partenaires + offers |
| Offline minimal (carte favoris) | Favoris locaux | Favoris syncés |
| **Partner CMS** | **Non** | Compte **partenaire** distinct (pas le même compte conso) |

**Règle :** ne pas bloquer la découverte Médoc derrière un login. L’auth sert à **persister** (favoris) et à l’**échange monétisation** (**pas de pub** une fois connecté).

**Défaut nav non-auth :** browse feed + fiches + IRVE **avec pubs** ; favoris locaux ; pas de CMS.  
**Défaut nav auth :** même parcours **sans pubs réseau**.

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
- Pas d’envoi de favoris locaux au serveur sans compte (sauf fusion post-login consentie).
- Mentions légales / CGU / confidentialité : **page site/** avant store.

---

## 7. Scope MVP conception vs plus tard

| Inclus MVP conception | Plus tard |
|---|---|
| SDK Google + Apple + Facebook + magic link e-mail, sessions, révocation | Notifs push, deep links marketing |
| Explorer + pubs réseau sur non-connecté | Personnalisation ads / médation avancée |
| **Connecté = pas de pub** (figé) | Premium payant / A/B hors besoin actuel |
| Favoris cloud pour comptes | Offres / QR attribution |
| — | Auth SSO partenaires OT avancée |

Auth **CMS partenaire** : comptes métier séparés — [partner-cms-spec.md](partner-cms-spec.md).

---

*Conception seule. Figé Anthony : 4 providers + Explorer ; non-connecté = pub = revenu ; connecté = **pas de pub**.*
