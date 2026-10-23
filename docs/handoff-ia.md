# Médoc Vibes — handoff IA / reprise projet

> **Entrée unique pour une autre IA (ou un humain sans historique Cursor).**  
> Lire ce fichier d'abord, puis ouvrir uniquement les docs liées au ticket.  
> **Secrets hors git** : mots de passe DB, clés API, webhooks — chez Anthony / Dokploy / vault GitHub Secrets. Ne jamais committer de credentials.

**Date de rédaction :** 2026-10-23 (pack versionné dans ce repo)  
**Repo source de vérité :** https://github.com/Forge-Digitale-Solutions/medoc-vibes  
**Prod landing :** https://medocvibes.fr  
**FigJam conception :** https://www.figma.com/board/JwcGzdNFMIn1MRnA3WLWwa  

Les autres fichiers sous `docs/` sont du détail lié — ne pas les dupliquer. Captures media lourdes (LocalWandering, Dokploy…) : **Context Cursor only**, non versionnées ici.

---

## 1. Pitch produit + périmètre

**Médoc Vibes** = app touristique **festive / loisir** pour profiter du Médoc : arriver, explorer (avec ou sans compte), voir **autour de soi**, filtrer (restos, sorties, culture, loisirs locaux).

- **Complémentaire** à l’app Parc naturel régional Médoc (« Mon Médoc » = nature / balades). Vibes = **manger, boire, sortir, activités**.
- Priorité #1 : **ancrage Médoc** (surf, pêche, guinguettes, vides-greniers…) — pas un clone générique Paris.
- Périmètre geo **figé** : allowlist **56 communes** EPCI Médoc (sans Eysines). Triangle/bbox = préfiltre technique seulement — jamais critère d’inclusion.  
  Détail : [perimeter-medoc.md](perimeter-medoc.md) · CSV [data/medoc-communes-codes-postaux.csv](../data/medoc-communes-codes-postaux.csv)

Contexte court : [project-context.md](project-context.md)

PLACEHOLDER_CONTINUE