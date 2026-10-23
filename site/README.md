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
SVG : `public/store/apple.svg`, `public/store/google-play.svg`.

## Waitlist / contact (Resend)

Le champ « Être prévenu » et `/contact` passent par des routes API serveur → [Resend](https://resend.com). **La clé n’est jamais exposée au navigateur.**

| Variable | Où | Requis |
|----------|-----|--------|
| **`RESEND_API_KEY`** | Dokploy → service **site** → Environment | **Oui** (`re_…`) |
| `CONTACT_TO_EMAIL` | Idem | Non (défaut `contact@medocvibes.fr`) |
| `RESEND_FROM_EMAIL` | Idem | Non (défaut `Médoc Vibes <onboarding@resend.dev>`) |
| `RESEND_REPLY_TO` | Idem | Non (défaut = `CONTACT_TO_EMAIL` / `contact@medocvibes.fr`) |

**Pas** de repository secret GitHub pour cette clé (seulement le webhook deploy).

### Flux waitlist

1. **Notif interne** → To `CONTACT_TO_EMAIL`, From `RESEND_FROM_EMAIL`, Reply-To = e-mail du visiteur (réponse directe OK).
2. **Confirmation visiteur** → To = e-mail du visiteur, From `RESEND_FROM_EMAIL`, Reply-To = `RESEND_REPLY_TO` (sinon contact@). Si la confirmation échoue, l’API reste **200** tant que la notif interne a réussi (log serveur seulement).

### Setup

1. [resend.com/api-keys](https://resend.com/api-keys) → Create API Key  
2. Dokploy → Médoc Vibes → **site** → Environment :
   ```
   RESEND_API_KEY=re_xxxxxxxxx
   RESEND_FROM_EMAIL=Médoc Vibes <noreply@medocvibes.fr>
   RESEND_REPLY_TO=contact@medocvibes.fr
   ```
3. Redeploy le conteneur  

Sans clé : API **503** + message « Configurez RESEND_API_KEY… ».

## Dokploy

Image GHCR + Provider Docker. Dev local : port **43127**.
