# Résumé — partage Claude `ff90ac33`

**Source :** [https://claude.ai/share/ff90ac33-32c4-4555-adc5-95fd8aab8c83](https://claude.ai/share/ff90ac33-32c4-4555-adc5-95fd8aab8c83)  
**Titre page :** Claude conversation shared by Anthony  
**Dates :** 19–20 septembre 2026  
**Accès :** snapshot public accessible (pas de login) ; fichiers joints masqués dans le partage (« Files hidden when shared »)  
**Récupération :** contenu extrait via rendu navigateur / DOM de la page share (API `chat_snapshots` bloquée par Cloudflare côté curl)

---

## Contexte

Brainstorm / conception d’une app Médoc autour des sorties, lieux et expériences (pas un simple annuaire). L’utilisateur apporte un cadrage et des maquettes (non visibles dans le snapshot). Claude challenge le cadrage initial (CGU Google Places, saisonnalité, naming « Spot », monorepo trop large) puis itère sur positionnement, stack, business partenaires et sources de données.

Fil conducteur : être **complémentaire** à l’app **Mon Médoc** (PNR : balades, prestataires labellisés, producteurs, agenda parc, alertes baignade/incendies) — Médoc Vibes couvrirait le côté **marchand / profiter** (manger, boire, sortir, pratiquer).

---

## Idées produit

- **Valeur défendable proposée :** agenda local (« ce soir / ce week-end », ~20 min) plutôt qu’un annuaire de lieux face à Google Maps ; l’écran événements comme accueil ; les fiches lieux portent surtout les événements.
- **Quatre univers :** Manger & boire ; Vins (châteaux, dégustations, caves) ; Activités (surf, pêche, nautique, vélos…) ; Sorties (concerts, fêtes, marchés nocturnes).
- **Modèle de données évoqué :** Lieu (permanent), Événement (daté), Expérience (offre réservable) — réservation MVP = lien externe / appel.
- **Cible ouverte :** touristes saisonniers (PWA/QR, pic été) vs résidents (contenu hors saison) — question posée, pas tranchée explicitement dans le chat ; l’utilisateur impose ensuite **store uniquement**.
- **Acquisition :** landing `site/` vers les stores ; QR chez prestataires partenaires.
- **Partenaires :** mini BO pour poster des événements ponctuels sur leur fiche ; mise en avant via abo ou commission ; parcours « Ajouter mon établissement » (SIRET → API Recherche d’entreprises).
- **Preuve de passage :** offre validée sur place (QR usage unique / code) — puis **rejetée** par l’utilisateur (pas de paiement in-app, QR trop fragile pour la com).

---

## Décisions

Décisions **actées dans le dialogue** (user + Claude) :

| Sujet | Décision |
| --- | --- |
| Nom | « Médoc Vibes » préféré à « Spot » (saturé) |
| Distribution | **App stores uniquement** (pas PWA comme canal principal) |
| Front | **Angular** acté ; **Capacitor** en fin pour builds iOS/Android |
| Structure repo | `site/` (landing marketing → stores) **séparé** ; `web` reste `web` ; + `ops/`, `api/` (AdonisJS confirmé), `packages/shared/` |
| Positionnement | Complémentaire à Mon Médoc (lien « Balades → Mon Médoc » évoqué) |
| Paiement in-app | **Aucun** ; argent uniquement côté établissements, hors app mobile |
| Monétisation | Abonnement fixe (mise en avant, offres, stats) ; publication d’événements **gratuite** ; commission / Stripe Connect **reportée / abandonnée** pour le MVP |
| Légal display | Libellé « Sponsorisé » sur mises en avant payées (art. L111-7) |
| Source lieux | **DATAtourisme** (Licence Ouverte) + OSM/Overpass en appoint ; Google Places **pas** comme cache/source stockable |
| Photos DT | Descriptions OK à stocker ; photos souvent **CC BY-NC-ND** → **pas d’affichage commercial** sans convention OT ou photo partenaire |
| Sync DT | Job API nocturne (pas CSV seul) ; upsert sur URI ; ne pas écraser fiches revendiquées ; synchro complète hebdo pour dépublications |
| Google | Stocker `place_id` OK ; affichage via **Places UI Kit** chargé à la demande ; user : **rester en gratuit** (quota plafonné ~300 req/jour + alerte budget 1 €) |
| OpenAgenda | **Gardé** en complément (API officielle + filtre d’agendas exclus dans `ops/`) |
| Autres sources listées | data.culture / Mérimée / Huwise : jugées hors scope ou peu utiles pour le cœur festif |
| Contenu manquant | Bars/boîtes/guides : via `ops/` et revendication partenaire ; établissement intéressé → parcours d’ajout |

---

## Ouvertures

Points **non tranchés** ou **prochaines étapes** dans le chat :

- Cible prioritaire touristes vs résidents (toujours structurante).
- Demander **clé API DATAtourisme** ; contacter **OT Médoc Atlantique** (convention photos).
- Tester Places UI Kit dans **WebView Capacitor** ; confirmer palier Essentials vs Pro pour les photos.
- Rédiger un **doc de cadrage** (positionnement, sources, business, architecture) puis **modèle de données** (Lieu, Événement, Partenaire, Média, Abonnement) — reporté à « demain » (20 sept.), puis reprise partielle le 20 sur Google `place_id` / UI Kit.
- Détail commission % / tracker venues : abandonné faute de preuve sans transaction in-app.
- Fichiers de cadrage/maquettes d’origine : **non inclus** dans le snapshot partagé.

---

## Limites de cette synthèse

- Contenu strictement issu du snapshot public ; pas d’invention au-delà.
- Pièces jointes du chat d’origine masquées → cadrage/maquettes initiaux non relus ici.
- Une réponse Claude a été **interrompue** (comptage Sirene) ; l’utilisateur a dit « Non c’est bon ».
