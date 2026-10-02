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

Le champ « Être prévenu » (bas de landing) et `/contact` envoient via **Web3Forms** depuis le **navigateur** (plan gratuit : les POST serveur sont refusés).

| Variable | Où | Requis |
|----------|-----|--------|
| **`WEB3FORMS_ACCESS_KEY`** | **Dokploy** → service **site** → Environment (runtime) | **Oui** |

**Pas** de repository secret GitHub pour cette clé. Les GitHub secrets restent réservés au webhook deploy (`DOKPLOY_SITE_DEPLOY_WEBHOOK`, Tailscale).

La clé est lue au runtime par le Server Component et passée au formulaire client — **pas** de `NEXT_PUBLIC_*` / rebuild pour changer la clé.

### Setup Anthony (une fois)

1. [web3forms.com](https://web3forms.com) → Create Access Key → e-mail **`contact@medocvibes.fr`**
2. Dokploy → Médoc Vibes → **site** → Environment :
   ```
   WEB3FORMS_ACCESS_KEY=<clé>
   ```
3. Redeploy le conteneur
4. Tester le waitlist sur https://medocvibes.fr/

Sans clé : message clair « Configurez WEB3FORMS_ACCESS_KEY… ».

## Dokploy

Image GHCR + Provider Docker. Dokploy injecte `PORT`. Dev local : port **43127**.
