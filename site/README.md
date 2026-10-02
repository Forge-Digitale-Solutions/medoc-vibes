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

## Waitlist / contact (Web3Forms)

Le champ « Être prévenu » (bas de landing) et le formulaire `/contact` passent par des routes API serveur qui POST vers [Web3Forms](https://web3forms.com) — **la clé n’est pas publique**.

| Variable | Où | Requis |
|----------|-----|--------|
| **`WEB3FORMS_ACCESS_KEY`** | Dokploy → service **site** → Environment (runtime) | **Oui** |

### Setup Anthony (une fois)

1. Aller sur [web3forms.com](https://web3forms.com) → Create Access Key  
2. Associer l’e-mail **`contact@medocvibes.fr`**  
3. Copier la access key  
4. Dokploy → projet Médoc Vibes → service **site** → **Environment** → ajouter :
   ```
   WEB3FORMS_ACCESS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
5. **Redeploy** le service (pas besoin de rebuild GHCR : env runtime lue par Node)  
6. Tester le champ waitlist sur https://medocvibes.fr/ → e-mail reçu sur `contact@medocvibes.fr`

Sans clé : l’UI reste OK, l’API répond **503** avec le message « Configurez WEB3FORMS_ACCESS_KEY… ».

> Pas de `NEXT_PUBLIC_*` pour cette clé (volontairement serveur-only).  
> Pas de secret GitHub Actions requis pour l’envoi.

## Dokploy

Image GHCR + Provider Docker (voir doc Project). Dokploy injecte `PORT` : ne pas hardcoder le port public. Le port **43127** est uniquement pour le dev local.
