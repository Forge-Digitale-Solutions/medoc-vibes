# Conventions projet — Médoc Vibes

Préférences **projet** utiles au handoff (extrait). Secrets et notes perso restent hors git (Dokploy / vault Anthony / Context Cursor).

## Git / branches

- Branches feat depuis **`dev` à jour** → PR / merge sur **`dev`**.
- Merge **`dev` → `main`** seulement quand OK pour la prod (déclenche Site GHCR).
- Un push sur `dev` **ne déploie pas**. Jamais de WIP direct sur `main`.
- **Conventional Commits EN** ; **pas** de co-authored sur commits / PR.
- Force-push `main` : **jamais**.

## Deploy

- Site : Docker → GHCR `:latest` → webhook Dokploy public (`dokploy.drannocserver.com`). Pas Tailscale CI pour ce flux.
- Doc : [deploy-workflow.md](deploy-workflow.md).
- Health-check / rollback site auto : TODO non bloquant (smoke manuel / republish `:latest`).
- API Dokploy : même règle branches ; **pas de migrate auto destructif** au deploy (pas de reset/seed/drop qui wipe la BDD). Migrations de **schéma** additives / backward-safe OK (users + données prod intactes).
- DB : `medoc_vibes` sur `infra-postgis`. Credentials : vault Anthony / Dokploy — **jamais** dans le git.

## Waitlist / mails

- Resend serveur (`RESEND_API_KEY` Dokploy site), pas Web3Forms ni SMTP OVH.
- From `noreply@` OK. Confirmation visiteur : Reply-To = `RESEND_REPLY_TO` sinon `CONTACT_TO`. Notif interne contact@ : Reply-To = e-mail du visiteur.

## Copy FR

- Pas de tiret cadratin (—) ; préférer virgule, point ou tiret court.

## Feed lieux

- Tri distance croissante + pagination ; pas de bride rayon dure qui exclut les plus loin.
