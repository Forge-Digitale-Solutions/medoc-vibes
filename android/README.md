# Kotlin / Compose — Médoc Vibes (Android)

Placeholder pour l’app native Android (Kotlin + Jetpack Compose).

## Cible

Même parcours cœur que l’iOS : auth, géoloc, filtres, fiches lieu/événement.

## Structure minimale

```
android/
  README.md
  settings.gradle.kts       ← stub
  app/src/main/java/com/medocvibes/app/MainActivity.kt  ← stub
```

## Notes

Pas de Gradle wrapper complet ici (évite un monolithe Android non bootable headless).
Ouvrir / créer le projet avec Android Studio (Empty Activity + Compose).

- Package : `com.medocvibes.app`
- Min SDK : 26+
- API : `http://10.0.2.2:3333` (émulateur → host) ou URL Dokploy
- Types : `packages/shared`
