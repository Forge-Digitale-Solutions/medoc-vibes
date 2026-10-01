# Site : landing Médoc Vibes

Landing marketing Next.js (App Router, TypeScript, Tailwind). Fidèle au board Claude Design ; charte Anton + Archivo, palette forêt / accent / sol clair.

## Lancer en local

```bash
cd site
npm install
npm run dev
```

Dev server : **http://127.0.0.1:43127**

Tagline A/B : alternance automatique selon le jour UTC, override `?t=A` ou `?t=B`.

## Stores

Badges App Store / Google Play : boutons **désactivés** + pastille « Bientôt disponible ».  
SVG : `public/store/apple.svg`, `public/store/google-play.svg` (copie store Project : `media/landing-claude-design/assets/store/`).

## Dokploy (plus tard)

Déployer `site/` comme service Node/Next séparé (même stack monorepo que `api/` / `ops/`).  
Dokploy injecte `PORT` : ne pas hardcoder le port public. Le port **43127** est uniquement pour le dev local.
