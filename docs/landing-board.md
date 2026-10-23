# Landing Médoc Vibes — board Claude Design

**Zip source :** `Me_doc_Vibes_landing_d004.zip`  
**Media :** [landing-claude-design/](#) — *capture Context Cursor only (`media/landing-claude-design/`)*

## Structure media

| Chemin | Contenu |
|--------|---------|
| [html/Medoc Vibes Landing.dc.html](#) — *capture Context Cursor only (`media/landing-claude-design/html/Medoc%20Vibes%20Landing.dc.html`)* | **Source d’implémentation** — landing complète |
| [html/Medoc Vibes Landing Board.dc.html](#) — *capture Context Cursor only (`media/landing-claude-design/html/Medoc%20Vibes%20Landing%20Board.dc.html`)* | Cadre desktop 1440 + mobile 390 + notes motion |
| [board/landing-board-final.png](#) — *capture Context Cursor only (`media/landing-claude-design/board/landing-board-final.png`)* | Export PNG = **maquette app v2** (pas la landing) |
| [html/Medoc Vibes v2.dc.html](#) — *capture Context Cursor only (`media/landing-claude-design/html/Medoc%20Vibes%20v2.dc.html`)* | App maquette v2 (réf. produit, hors scope landing) |
| [assets/hero-atmosphere.png](#) — *capture Context Cursor only (`media/landing-claude-design/assets/hero-atmosphere.png`)* | Upload zip = board **LOOP Paris v1** (hors charte) — **ne pas utiliser** |
| [impl/](#) — *capture Context Cursor only (`media/landing-claude-design/impl/`)* | Screenshots de l’implémentation Next |

## Frames (Landing Board)

- **Desktop** 1440 × 900 — iframe live de la landing
- **Mobile** 390 × 844 — même page en viewport téléphone

## Direction visuelle

- Anton (display) + Archivo (body)
- Palette `#0F2A1D` / `#86CF5E` / `#F5F6F1` (+ accent estuaire `#2F7F86` section data)
- Hero : marque géante **Médoc** + **Vibes** (vert), plan SVG pinède → houles full-bleed en bas
- Pas de cards dans le hero ; pas de stats / lieux inventés

## Copy clé (board)

| Zone | Texte |
|------|--------|
| Tagline A (board) | *Manger, sortir, bouger. Le Médoc qui vit, à deux pas.* |
| Tagline B (alt.) | *Profiter du Médoc, de la pinède à l'océan.* (`?t=B`) |
| Support hero | Tables, sorties, marchés et spots de surf alentour, issus des agendas locaux. |
| Concept | Médoc Vibes seul (festif / loisir / vie locale) — **pas de PNR** tant que partenariat non acté |
| Carte | Restos & bars · Sorties · Marchés & fêtes · Vides-greniers · Surf & côte (+ hint bornes VE) |
| Data | Aucun faux avis / aucune note inventée |
| Compte | Sans compte (pubs) · Avec compte (sans pubs) |
| CTA final | *Rendez-vous dans le Médoc.* + waitlist e-mail |
| Footer | Marque + mentions + contact (pas de liste de villes) |

**PNR mention deferred until partnership talk** — ne pas remettre le contraste Parc / Médoc Vibes ni le footer PNR avant discussion partenariat.

**Retiré landing (feedback Anthony) :** section Partenaires (nav + Essentiel/Premium) ; bandeau empty-state « Peu d’annonces… » ; CTA Explorer ; toponymes footer.

**Pages séparées :** [`/partenaires`](http://127.0.0.1:43127/partenaires) · [`/mentions-legales`](http://127.0.0.1:43127/mentions-legales) · [`/contact`](http://127.0.0.1:43127/contact) (e-mail placeholder, pas encore créée).

### Mentions légales (statut)

| Champ | Statut |
|-------|--------|
| Éditeur | Anthony Marcelin, EI, nom commercial Forge Digitale Solutions |
| Forme juridique | Entrepreneur individuel |
| Siège social | 33112 Saint-Laurent-Médoc (ville seule ; pas de rue publique) |
| SIRET | 100 857 838 00013 |
| Immatriculation | RNE n° 100 857 838 (EI ; pas de RCS société) |
| Directeur de publication | Anthony Marcelin |
| Contact | Placeholder OK : `contact@medocvibes.fr` |
| Hébergeur | OVH SAS, VPS, 2 rue Kellermann, 59100 Roubaix |
| Données personnelles | Avertir (waitlist/contact) + usage produit Médoc Vibes uniquement ; pas de revente |
| Placeholders `[À compléter]` | **Aucun restant** |

Source éditeur : API Recherche d'entreprises (data.gouv) SIREN `100857838` — Basic Memory MCP toujours en erreur côté cloud agent (`namespaceStatus=error`, auth timeout) malgré reconnexion Anthony ; données croisées Saint-Laurent-Médoc cohérentes.

## Motions (board → impl)

1. Parallax pinède + 2 houles (vitesses distinctes) + dérive lente  
2. Ligne de marée sous la marque (et pied de page)  
3. Titres révélés ligne par ligne (offset G/D)  

**Retiré (feedback Anthony) :** CTA « Explorer sans compte » — pas d’app à ouvrir sur la landing marketing.

Respect `prefers-reduced-motion`.

## Écarts anti-slop / charte

| Point | Note |
|-------|------|
| Tagline A board vs charte | Board : « à deux pas » · Charte figée : « près de toi » — **implémentation suit le board** ; alternance A/B jour sur deux reste la règle produit |
| Tagline B | Board « Profiter… » (infinitif) · Charte « Profite… » |
| PNG export zip | Board app v2, pas un export landing — s’appuyer sur le `.dc.html` Landing |
| `hero-atmosphere.png` | Relique LOOP Paris — ignorée |
| Prix partenaires | Non affichés (volontaire) |
| Badges stores (board) | Cadres pointillés « LOGO » seulement — **aucun SVG Apple/Google dans le zip** |
| SVG livrés | Marques SVG ajoutées sous [assets/store/](#) — *capture Context Cursor only (`media/landing-claude-design/assets/store/`)* (`apple.svg`, `google-play.svg`) + copie `site/public/store/` — pastille « Bientôt disponible », boutons disabled (pas de liens store) |

## Implémentation

Next.js dans `site/` du monorepo (worktree `cursor/landing-site-25d2`, branche `cursor/landing-site-25d2`). Hébergement : VPS OVH (Dokploy = orchestration, plus tard). Mentions : voir tableau ci-dessus.
