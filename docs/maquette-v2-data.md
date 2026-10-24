# Maquette v2 — honnête data (handoff)

**Date :** 2026-09-30 (maj 2026-10-05 — défaut géoloc)  
**Board :** [board-honnete-data.png](#) — *capture Context Cursor only (`media/maquette-v2-data/board-honnete-data.png`)*  
**Source Claude Design :** [Medoc Vibes v2.dc.html](#) — *capture Context Cursor only (`media/maquette-v2-data/Medoc%20Vibes%20v2.dc.html`)*  
**Réf. conception :** [maquettes ↔ data](maquettes-vs-data.md) · [parcours](app-journey-brainstorm.md)

## Statut

**Validée pour handoff conception → dev** (correctifs légende + chip vide 02b inclus).  
**Écarts mineurs (2026-10-05) :** header 02a HTML = **Lacanau** (démo) vs défaut produit **Saint-Laurent-Médoc**. Compteur « &lt; 15 km » = libellé démo — **pas** de bride produit (near→far + pagination).

## Écrans

| # | Écran | Point data |
|---|---|---|
| 01 | Welcome | Auth ; taglines A/B ; logos provisoires |
| 02a | Autour de moi | Header : bouton position/ville — HTML = Lacanau (démo) ; **produit** = GPS ou **Saint-Laurent-Médoc** ; liste near→far paginée (**pas** cut-off 15 km) ; badges OT / Agenda / Partenaire ; sans ★ — [parcours](app-journey-brainstorm.md) §7 |
| 02b | Empty Vide-greniers | Chip sélectionnée visible ; CTA ajouter |
| 03 | Fiche lieu OD pauvre | Y aller seul ; 0–n amenities ; **km user↔POI toujours** (+ min si &lt; 2 km) |
| 04a | Fiche sortie Partenaire | Events + Billets si URL ; Site |
| 04b | Fiche sortie Agenda seule | Pas de billets ; Y aller |

## Règles figées UI↔data

- Pas de notes / avis MVP  
- CTA résa / billets / site **conditionnels**  
- Fiche : **km user↔POI toujours** ; minutes piéton en plus si &lt; 2 km  
- Photos placeholder « droits à vérifier »  
- IRVE hint PAN (pas live)  
- Sources badgeées OT · Agenda · Partenaire  
