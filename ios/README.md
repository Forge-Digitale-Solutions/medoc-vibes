# SwiftUI — Médoc Vibes (iOS)

Placeholder pour l’app native iOS (SwiftUI).

## Cible

- Auth Google / Apple
- Géoloc « autour de moi »
- Filtres univers (restos, sorties, culture, surf, etc.)
- Fiches lieu / événement → itinéraire, favoris, liens externes

## Structure prévue

```
ios/
  README.md                 ← ce fichier
  MedocVibes/               ← Xcode project (à créer sur macOS)
    MedocVibesApp.swift
    Features/
    Shared/
```

## Notes

Le scaffold Xcode complet n’est pas généré ici (environnement headless sans macOS).
Créer le projet Xcode localement :

```bash
# Sur macOS avec Xcode
# File → New → Project → App (SwiftUI, iOS 17+)
# Bundle ID suggéré : com.medocvibes.app
```

API : pointer vers `http://localhost:3333` (sim) ou l’URL Dokploy.
Types partagés : `packages/shared`.
