# Deploy workflow — site Médoc Vibes (prod)

Scope **site only** (`site/`, `https://medocvibes.fr/`). API / ops / app : hors scope.

Modèle **atasoif** : Dokploy ne build **pas** le site. CI pousse une image GHCR ; Dokploy tire `:latest`.

## Flux

```
dev / main  →  CI Site GHCR (build site/Dockerfile)  →  push ghcr.io/.../medoc-vibes-site:latest
                                                              ↓
                                              Notify: POST DOKPLOY_SITE_DEPLOY_WEBHOOK (HTTPS public)
                                                              ↓
                                              Dokploy Provider Docker (pull + deploy)
```

| Branche | Rôle |
|---------|------|
| `dev` | Développement (+ build/push image pour valider) |
| `main` | Production (même image `:latest` ; Dokploy tire après notify) |

Repo : https://github.com/Forge-Digitale-Solutions/medoc-vibes  
Réf. panel : [dokploy-atasoif-reference.md](./dokploy-atasoif-reference.md)

## Humains — promouvoir / déployer

1. Travaille sur `dev` ; merge vers `main` quand prêt.
2. La GitHub Action **Site GHCR** build `site/Dockerfile` et pousse :
   - `ghcr.io/forge-digitale-solutions/medoc-vibes-site:latest`
   - tags sha (traçabilité)
3. Le job **Notify Dokploy** fait un `POST` curl vers le secret `DOKPLOY_SITE_DEPLOY_WEBHOOK` (URL HTTPS publique Dokploy).
4. Dokploy service **site** :
   - **Provider = Docker** (pas GitHub / pas Nixpacks / pas « Build type Dockerfile »)
   - **Docker Image** = `ghcr.io/forge-digitale-solutions/medoc-vibes-site:latest`
   - **Port domaine** = **80** (conteneur)
5. Vérifier `https://medocvibes.fr/` (smoke manuel OK).

Ne **jamais** force-push `main`.

## CI — prioritaire

Fichier : `.github/workflows/site-ghcr.yml`

| | |
|---|---|
| Trigger | push `dev` / `main` (paths `site/**` ou le workflow) + `workflow_dispatch` |
| Build | `site/Dockerfile` (Next standalone, Node 22, **PORT=80**) |
| Registry | GHCR via `GITHUB_TOKEN` (`packages: write`) |
| Tags | `:latest` + sha |
| Dokploy | job **Notify Dokploy** — `curl -X POST` vers `${{ secrets.DOKPLOY_SITE_DEPLOY_WEBHOOK }}` |

**Pas de Tailscale** pour le site Médoc : le webhook est l’URL HTTPS publique Dokploy. Les secrets `TS_OAUTH_*` / `TS_AUTHKEY` ne sont **pas** requis pour ce workflow.

### Permissions / secrets

| Élément | Requis ? | Détail |
|---------|----------|--------|
| `packages: write` (workflow) | Oui | Push image GHCR |
| Package GHCR lisible par Dokploy | Oui | Public, ou registry org `ghcr` déjà dans Dokploy |
| `DOKPLOY_SITE_DEPLOY_WEBHOOK` | **Oui** | URL HTTPS publique Dokploy `/api/deploy/<token>` (host `dokploy.drannocserver.com`) |
| `TS_OAUTH_*` / `TS_AUTHKEY` | **Non** | Inutiles pour Médoc site CI (webhook public) |

Note : atasoif-v2 / spawnzone peuvent encore joindre Tailscale pour leurs propres déploiements privés. Médoc site CI s’en écarte volontairement : Notify = curl seul.

## Health-check / rollback — TODO (non bloquant)

Pas de rollback git automatique pour l’instant — ça ne doit **pas** bloquer le flux Docker `:latest`.

- Smoke manuel : `curl -I https://medocvibes.fr/` → HTTP 200
- Rollback prod : retagger / republier une image saine en `:latest`, ou Redeploy Dokploy sur un tag sha connu
- (Plus tard) Action health optionnelle post-deploy, sans `git revert` sur `main`

## Hors scope

- API / ops / apps mobiles
- Nixpacks comme modèle de prod (palliatif seulement si image absente)
