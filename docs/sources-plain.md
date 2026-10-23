# Sources de données — en français simple

**Date :** 2026-10-01  
**Statut :** conception — glossaire grand public / non-tech  
**Pour qui :** Anthony, partenaires, qui veut comprendre sans jargon  
**Réf. tech :** [data-sources-audit.md](data-sources-audit.md) · [data-model-sync.md](data-model-sync.md) · [integrations-soft-fail.md](integrations-soft-fail.md) · [glossary-pnr.md](glossary-pnr.md)

---

## En une phrase

Médoc Vibes **récupère** des infos déjà publiées ailleurs (offices de tourisme, agendas, patrimoine…), les **filtre au Médoc** (56 communes), et les **montre** dans l’app. Si une source est vide ou en panne, l’app **continue** avec le reste (soft-fail).

---

## Ce que l’utilisateur voit vs ce qu’il y a derrière

| L’utilisateur voit | Derrière (technique) |
|---|---|
| Une carte resto / plage / activité | Une **fiche lieu** (Place) venant surtout de **DATAtourisme** |
| Une sortie, un marché, un concert | Un **événement** (Event) — DATAtourisme et/ou **OpenAgenda** |
| Badge **OT** | Contenu office de tourisme via DATAtourisme |
| Badge **Agenda** | Contenu **OpenAgenda** |
| Badge **Partenaire** | Fiche / event saisi dans le **petit CMS** (abo commerçant) |
| Photo du lieu | Média fourni par la source (souvent DT) — seulement si la **licence** est claire ; sinon image de remplacement |
| « Aucun résultat » sur un filtre | Soft-empty : la source n’a rien (ou rien de saison) pour ce filtre — **normal**, surtout hors saison / été creux sur certains chips |
| Pub dans le feed / fiche | Seulement si **pas connecté** — c’est le modèle free ; une fois loggé → **pas de pub** |
| Bornes de recharge | Snapshot **IRVE** (données nationales), pas le GPS live de chaque borne |

---

## Les sources, expliquées simplement

### DATAtourisme (DT) — la source principale

- **C’est quoi :** le gros catalogue touristique français (offices de tourisme, SIT).
- **À quoi ça sert chez nous :** restos, activités, beaucoup d’événements « officiels » OT.
- **Ce que tu vois :** fiches avec badge **OT**, photos parfois, horaires / contacts si fournis.
- **Si ça manque :** feed plus vide sur certains filtres — on n’attend pas la perfection pour lancer (voir soft-fail).

### OpenAgenda (OA) — l’appoint agenda

- **C’est quoi :** des agendas d’événements publiés par des organisateurs / collectivités.
- **À quoi ça sert :** compléter les sorties, marchés, fêtes quand DT ne couvre pas tout.
- **Ce que tu vois :** badge **Agenda** sur certains events.
- **Si ça manque :** pas grave — OA est **appoint**, pas le socle. Empty OK.

### Mérimée — patrimoine (optionnel)

- **C’est quoi :** inventaire du patrimoine bâti (monuments, etc.).
- **À quoi ça sert chez nous :** éventuelle branche **Culture / patrimoine**, pas le cœur festif.
- **Ce que tu vois (si branché) :** fiches plutôt « monument / patrimoine », pas la guinguette du soir.
- **Défaut :** **hors cœur festif** — on peut brancher plus tard sans bloquer l’été.

### data.culture / OpenDataSoft — enrichissement

- **C’est quoi :** autres jeux de données culture / open data.
- **À quoi ça sert :** enrichir si le temps le permet (best-effort).
- **Si KO :** on skip — l’app tourne quand même.

### IRVE — bornes électriques (bonus)

- **C’est quoi :** fichier national des bornes de recharge.
- **Ce que tu vois :** hint / liste de bornes près de toi (pas du « live » seconde par seconde).

### Partner CMS — ce que le commerçant saisit

- **C’est quoi :** le petit back-office partenaire (abo).
- **Ce que tu vois :** badge **Partenaire**, parfois mise en avant (**boost**) plafonnée.
- **Au lancement :** **0 partenaires** possible — empty states prévus.

---

## Mots techniques utiles (version courte)

| Mot | Sens simple |
|---|---|
| **Raw payloads** | La « copie brute » de ce que la source a renvoyé, gardée en base pour debug / rejeu — **l’utilisateur ne la voit jamais** |
| **Médias DT** | Photos / fichiers venant de DATAtourisme ; on n’affiche que si le droit d’usage est clair |
| **Allowlist** | Liste des **56 communes** Médoc acceptées — hors liste = hors app |
| **Bbox / triangle** | Grand rectangle / zone grossière pour **accélérer** le téléchargement — la vérité reste la liste des communes |
| **Soft-fail / soft-empty** | Une source manque → on montre le reste + message vide, **sans planter** l’app |
| **Sync** | Job qui met à jour le cache local à partir des sources |

Plus de vocabulaire produit / PNR : [glossary-pnr.md](glossary-pnr.md).  
Comportement été / panne source : [integrations-soft-fail.md](integrations-soft-fail.md).

---

*Document grand public. Les détails API / schémas restent dans l’audit et le data-model.*
