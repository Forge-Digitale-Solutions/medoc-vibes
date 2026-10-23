# Remotes — Médoc Vibes

Deux remotes complémentaires : **Origin (tmp)** pour le travail Cloud Agent immédiat, **GitHub FDS** pour le dépôt public durable de l’orga.

## Origin (temporaire)

| | |
|---|---|
| URL | `https://origin.cursor.com/git/anthonymarcelin/tmp-f5b9fd656b625c96.git` |
| Rôle | Remote Cloud Agent / New Project (nom temporaire `tmp-…`) |
| Branche landing | `cursor/landing-site-25d2` (worktree `/workspace/.worktrees/landing-site`) |
| Contenu | Scaffold monorepo + landing `site/` |

Origin reste utile tant que les agents Cursor poussent dessus. Ce n’est **pas** le remote « boîte » définitif.

## GitHub (Forge Digitale Solutions)

| | |
|---|---|
| Org | `Forge-Digitale-Solutions` |
| Repo | `medoc-vibes` |
| Visibilité | Public |
| Description | Médoc Vibes — tourist/leisure app monorepo (api/ops/site/ios/android) |
| URL | `https://github.com/Forge-Digitale-Solutions/medoc-vibes` |
| HEAD / défaut | `dev` |
| `dev` (développement) | `7b809f9350b9229d8fe885af520b634f53182663` (`fix(site): activate contact@medocvibes.fr mailto`) |
| `main` (prod) | `7db69411c30ff736e2648527e9410607b0bdeac4` (merge PR #2 `dev` → `main`) |

**Statut (2026-10-02)** : **OK** — landing Next (`site/`) + mailto contact poussés sur `dev`, merge prod via [PR #2](https://github.com/Forge-Digitale-Solutions/medoc-vibes/pull/2). Dokploy déploie depuis `main`.

### Politique de branches (Anthony)

| Branche | Rôle |
|---|---|
| `dev` | Développement / travail actif (défaut) |
| `main` | Production (Dokploy auto-deploy) |

Flux : travail sur `dev` → merge `dev` → `main` pour déclencher la prod.

## Ajouter le remote `github` en local (Anthony)

```bash
git remote add github https://github.com/Forge-Digitale-Solutions/medoc-vibes.git

git remote -v
```

Fetch / push :

```bash
git fetch github
git checkout -B dev github/dev
git push -u github dev
# promotion prod (PR ou merge)
gh pr create --base main --head dev
gh pr merge --merge
```

Convention de remotes :

- `origin` → Origin tmp (agents Cursor)
- `github` → FDS (source of truth publique / partage équipe)

## Sync Origin ↔ GitHub

Sans force-push destructif sur `main`.

1. **Depuis le worktree landing vers GitHub `dev`** :

```bash
cd /workspace/.worktrees/landing-site
git fetch github
git rebase github/dev   # si besoin
git push github HEAD:dev
# puis merge PR vers main pour prod
```

2. **Règle** : source of truth publique = **GitHub `dev`** (travail) et **`main`** (prod). Origin = miroir / scratch agents. Pas de `push --force` sur `main` sauf décision explicite.

## Checklist

- [x] Repo public FDS créé (`medoc-vibes`)
- [x] Branche par défaut = `dev`
- [x] Landing `site/` sur `dev` + merge `main` (2026-10-02)
- [x] Contact mailto `contact@medocvibes.fr` en prod (contenu `main`)
- [ ] Remote `github` ajouté en local (machine Anthony)
- [ ] SSO org autorisé sur le PAT / compte utilisés par CI et agents

## Infra (OVH / Dokploy)

| | |
|---|---|
| VPS hostname | `vps-babe5c20.vps.ovh.net` |
| IP | `178.32.16.231` |
| Dokploy | [http://178.32.16.231:3000/](http://178.32.16.231:3000/) |
| DNS connus | `spawnzone.fr` + `www` → cette IP |

Routage / TLS / domaines : **Dokploy** (pas de reverse-proxy manuel côté apps).

### Service **site** (observé 2026-10-02)

| | |
|---|---|
| Domaines | `medocvibes.fr` + `www` (HTTPS, port 3000) |
| GitHub | **pas connecté** (account / repo / branch vides) |
| Build path | `/` (à corriger → **`site/`** pour le monorepo) |
| Autodeploy | OFF |
| Deployments | 0 |
| Builder | Nixpacks |

**Action Anthony** : brancher le service sur GitHub `Forge-Digitale-Solutions/medoc-vibes`, branche **`main`**, build path **`site/`**, activer **autodeploy**, puis lancer un premier deploy. Le code landing + mailto est déjà sur `main` (`7db6941`).
