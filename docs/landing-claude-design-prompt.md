# Landing Médoc Vibes — prompt Claude Design (anti AI-slop)

**Usage :** coller tel quel dans Claude Design.  
**Suite :** board validé → implémenter dans `site/` (Next). Pas de code landing avant board.

## Prompt (à coller)

```
Design a marketing landing page for Médoc Vibes — a tourist/leisure mobile app for the Médoc (Gironde, France). Complementary to the PNR Médoc nature app: we are festive / food / nightlife / local life, not hiking.

BRAND (non-negotiable)
- Name: Médoc Vibes — hero-level brand signal on first viewport (not a tiny nav wordmark).
- Fonts: Anton (display) + Archivo (body). No Inter, Roboto, Arial, system-ui as primary.
- Palette: deep forest #0F2A1D, accent green #86CF5E, light ground #F5F6F1. No purple gradients, no neon glow, no glassmorphism blobs.
- Tone: young, local, alive — pinède → océan, not “discover amazing places near you”.

TAGLINES (alternate A/B conceptually; pick one for the board, note the other)
- A: Manger, sortir, bouger. Le Médoc qui vit, près de toi.
- B: Profite du Médoc, de la pinède à l'océan.

ANTI AI-SLOP (hard reject / restart if violated)
Refuse the generic “AI product landing” look. If after removing the logo this could be any local-discovery app anywhere, start over.
Forbidden:
- Purple-on-white / indigo mesh gradients
- Soft cream #F4F1EA + terracotta + serif “editorial” cliché
- Broadsheet hairline columns, dense newspaper layout
- Floating badges, promo stickers, pill clusters, stat strips (“10k+ users”, fake ratings)
- Cards in the hero; card grids of inventés “features” with generic icons
- Stock “happy friends toasting on a generic beach” that isn’t Médoc
- Rounded-full pill CTAs stacked in chrome-y app-store mock clutter
- Glow, multi-layer soft shadows, emoji as decoration
- Fake places, fake reviews, fake ★, invented café names

REAL PLACE NAMES ONLY (or none)
Allowed toponyms / anchors if needed: Lacanau, Hourtin, Soulac-sur-Mer, Pauillac, Le Verdon / Pointe de Grave, Médoc — never invent a venue. Prefer atmosphere (océan, pinède, guinguette, marché, vide-grenier, surf) over fake POI cards. Prefer 0 place names over invented ones.

FIRST VIEWPORT (hero budget)
One composition, edge-to-edge visual plane (full-bleed Médoc atmosphere — ocean / forest / festive night vibe — not an inset rounded media card).
Only: brand Médoc Vibes · one headline (tagline) · one short supporting line · one CTA group (App Store / Google Play placeholders OK, plus “Explorer” feel) · one dominant image/plane.
No stats, schedules, address blocks, partner logos strip, or secondary marketing in the fold.
No detached labels or chips overlaid on the hero media.

SECTIONS (one job each; after the fold)
1) What it is — festif / loisir Médoc vs nature PNR (complement, not clone).
2) What’s on the map — restos & bars, sorties, marchés & fêtes, vides-greniers, surf & côte, hint bornes VE — as a tight visual rhythm, not a feature-card wall.
3) Honest data — sourced from open tourism/agenda data; empty states OK; no fake reviews.
4) Account value — explore without account (ads) vs signed-in (no ads); Google / Apple / Facebook / magic link — keep light, no auth mockoverkill.
5) Partners teaser — Essentiel / Premium boost (don’t invent partner names).
6) Final CTA — download / waitlist tone; keep Médoc.

MOTION (required — out of the ordinary, not noisy)
Ship 3 intentional motions minimum, tied to Médoc feel e.g.:
- slow drift / parallax on the hero atmospheric plane (pinède ↔ light)
- staggered reveal of section titles with slight offset (not bounce-everywhere)
- one signature micro-interaction on primary CTA or a “wave / tide” line under the brand
Avoid: endless floating particles, random Lottie clutter, scroll-jacking.

LAYOUT / RESPONSIVE
Desktop + mobile. One strong composition, not a dashboard. Prefer full-bleed photography / illustration planes over card mosaics. French UI copy only.

OUTPUT
A single landing board (desktop + mobile frames). Visual direction must pass the brand test: remove nav → still unmistakably Médoc Vibes / Médoc, not a SaaS template.
```

## One-liner de renfort (si Claude dérive)

> Anti AI-slop : refuse le look générique « local discovery SaaS ». Si ça pourrait être la landing de n’importe quelle app ailleurs qu’en Médoc, recommence. Zéro lieux inventés, zéro stats fake, zéro purple mesh.

## Suite

1. Coller le prompt → board Claude Design  
2. Coller le board ici (ou zip / PNG) pour validation  
3. Implémentation `site/` seulement après OK
