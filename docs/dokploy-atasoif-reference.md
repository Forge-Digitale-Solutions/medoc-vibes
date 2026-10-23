# Dokploy — référence **À ta soif** (atasoif) pour Médoc Vibes

Lecture seule du panel [Dokploy](http://178.32.16.231:3000/) le **2026-10-02** (compte agent `atasoif-dokploy@agentmail.to`). Aucune config prod modifiée.

## Verdict

**À ta soif ne build pas sur Dokploy.** Le service `site` (et `api`) utilise le **Provider Docker** : Dokploy **tire une image déjà construite** depuis **GHCR**.

Ce n’est **pas** Nixpacks. Ce n’est **pas** non plus « Build type = Dockerfile » (clone Git + `docker build` dans Dokploy).

| Concept Dokploy | Valeur atasoif `site` | À ne pas confondre avec |
|---|---|---|
| **Provider** (onglet *General* → *Provider*) | **Docker** (`sourceType: docker`) | GitHub / Git |
| **Docker Image** | `ghcr.io/anthonymarcelin/atasoif-site:latest` | — |
| Champ `buildType` en base | `nixpacks` (défaut restant) | **Ignoré** tant que Provider = Docker (section *Build* masquée) |
| Champ `dockerfile` | `Dockerfile` (défaut restant) | **Non utilisé** en mode Docker image |

Pattern voisin sur le même VPS : **spawnzone** `site` = aussi Provider Docker + image `ghcr.io/forge-digitale-solutions/spawnzone/site:<sha>`.

Contre-exemple (autre style FDS) : projet **Forge Digitale Solutions** / `site` = Provider **GitHub** + Build type **Dockerfile** (build dans Dokploy). Ce n’est **pas** le modèle atasoif.

---

## Projet **À ta soif**

| | |
|---|---|
| Nom panel | `À ta soif` |
| `projectId` | `nJWR1M2JWM2XMg2h4iEh_` |
| Environnement | `production` |

### Service `site` (landing)

| Réglage | Valeur observée |
|---|---|
| Nom / appName | `site` / `ta-soif-site-o2awyh` |
| Description | Landing page |
| Statut | `done` |
| **Provider** | **Docker** |
| **Docker Image** | `ghcr.io/anthonymarcelin/atasoif-site:latest` |
| Username / Password / Registry URL (app) | vides (auth via Registry org si besoin) |
| GitHub / branche / build path | non branché (`owner`/`repository`/`branch` null) |
| Autodeploy | **ON** (`autoDeploy: true`, `triggerType: push`) |
| Env app | vide |
| Domaines | `atasoif.fr`, `www.atasoif.fr` |
| HTTPS | Oui (Let's Encrypt) |
| **Port domaine** (port conteneur exposé à Traefik) | **80** |
| Déploiements | plusieurs `done` |

### Service `api` (pour contexte, hors scope landing Médoc)

| Réglage | Valeur observée |
|---|---|
| Provider | **Docker** |
| Docker Image | `ghcr.io/anthonymarcelin/atasoif-api:latest` |
| Domaine | `api.atasoif.fr` → port **3000** |
| Commande | `node` + `bin/server.js` |
| Autodeploy | ON |
| Env | nombreuses clés boot (DB, mail, catalog…) — **ne pas recopier** |

Registry org déjà présent dans Dokploy : nom **`ghcr`**, préfixe `ghcr.io/forge-digitale-solutions`, URL `ghcr.io` (utile pour images privées FDS ; atasoif tire aujourd’hui sous `ghcr.io/anthonymarcelin/...`).

---

## Comparaison **medoc vibes** / service **site**

| | **À ta soif** `site` | **medoc vibes** `site` |
|---|---|---|
| Provider | **Docker** (image GHCR) | **GitHub** |
| Build | aucun (pull image) | **Nixpacks** |
| Image / repo | `ghcr.io/anthonymarcelin/atasoif-site:latest` | `Forge-Digitale-Solutions/medoc-vibes` |
| Branche | — | `main` |
| Build path | — | `site/` |
| Autodeploy | ON | ON |
| Domaines | atasoif.fr + www | medocvibes.fr + www |
| Port domaine | **80** | **3000** |
| HTTPS | Let's Encrypt | Let's Encrypt |
| Statut (2026-10-02) | `done` | **`error`** (1 deploy fail, commit `7db6941` / merge PR #2) |
| Env | vide | vide (API) |
| Dockerfile `site/` sur GitHub `main`/`dev` | N/A (image prébuild) | **Absent** (404) ; seul `api/Dockerfile` public. Dockerfile local (`b9542db`) hors GitHub → bascule Docker **pas encore safe** |

---

## Ce que Médoc Vibes doit recopier

1. **Méthode de déploiement cible = Provider Docker + image GHCR**, comme atasoif / spawnzone — pas rester sur Nixpacks long terme.
2. Prérequis **avant** bascule (sinon deploy cassé) :
   - `site/Dockerfile` (et pipeline CI) qui pousse une image, ex. `ghcr.io/forge-digitale-solutions/medoc-vibes/site:<tag>` ou `:latest`
   - image accessible via le registry Dokploy `ghcr` (ou image publique)
3. Aligner le **port domaine** Dokploy sur le port exposé par l’image (atasoif landing = **80** ; Next `next start` classique = **3000**).
4. Garder domaines `medocvibes.fr` / `www` + Let's Encrypt ; autodeploy ON une fois l’image pipeline en place.
5. **Ne pas basculer maintenant** : pas de Dockerfile `site/` sur `main`, pas d’image GHCR Médoc Vibes observée, dernier deploy Nixpacks en **error**.

Tant que l’image n’existe pas : corriger Nixpacks (Node 20, path `site/`) reste un palliatif — ce n’est **pas** le modèle atasoif.

---

## Click-path Dokploy (UI) — bascule comme atasoif

**Ne pas exécuter** tant que l’image GHCR n’existe pas.

1. Ouvrir [Dokploy](http://178.32.16.231:3000/) → projet **medoc vibes** → application **site**.
2. Onglet **General** → carte **Provider** (« Select the source of your code »).
3. Choisir l’onglet / tab **Docker** (pas Github, pas Build type Dockerfile).
4. Renseigner :
   - **Docker Image** — ex. `ghcr.io/forge-digitale-solutions/medoc-vibes/site:latest`
   - **Registry URL** / **Username** / **Password** — laisser vides si le Registry org `ghcr` suffit ; sinon credentials GHCR.
5. **Save** (toast attendu : « Docker Provider Saved »).
6. Onglet **Domains** : vérifier **Port** = port du process dans l’image.
7. Déclencher un **Deploy** manuel pour valider.

### Si quelqu’un propose « Build type = Dockerfile » (autre modèle)

Chemin **différent** (utilisé par le site Forge Digitale Solutions, **pas** atasoif) :

1. Provider reste **Github** (repo + branche + build path).
2. Onglet **Build** → Build type **Dockerfile**.
3. Champs : **Docker File** (chemin), **Docker Context Path**, optionnel **Docker Build Stage**.

Pour coller à atasoif, préférer **Provider → Docker** (image prébuild), pas ce chemin.

---

## Captures panel (2026-10-02)

Confirmées UI par [Inspect Dokploy atasoif](bc-056c5a34-eb2b-5bd1-b53f-6dcd58d746cf) (lecture seule ; Nixpacks remis sans Save après ouverture de l’option Dockerfile).

| Capture | Contenu |
|---|---|
| [atasoif-site-general-docker](#) — *capture Context Cursor only (`media/atasoif-site-general-docker.webp`)* | Provider **Docker**, image `ghcr.io/anthonymarcelin/atasoif-site:latest` |
| [atasoif-site-domains](#) — *capture Context Cursor only (`media/atasoif-site-domains.webp`)* | Domaines port **80** |
| [atasoif-api-general-docker](#) — *capture Context Cursor only (`media/atasoif-api-general-docker.webp`)* | API aussi Provider Docker |
| [medoc-vibes-site-buildtype-nixpacks](#) — *capture Context Cursor only (`media/medoc-vibes-site-buildtype-nixpacks.webp`)* | Médoc : Build Type **Nixpacks** sélectionné |
| [medoc-vibes-dockerfile-option](#) — *capture Context Cursor only (`media/medoc-vibes-dockerfile-option.webp`)* | Champs **Docker File** / **Docker Context Path** / **Docker Build Stage** (autre modèle) |

Libellés Build Type visibles : Dockerfile · Railpack (New) · **Nixpacks** · Heroku Buildpacks · Paketo Buildpacks · Static.  
Provider Docker = icône baleine (6ᵉ onglet Provider), pas le radio Dockerfile.

---

## Sécurité / lecture seule

- Inspection API + panel ; aucun save / redeploy / delete effectué sur atasoif ni medoc vibes.
- Secrets (env API atasoif, tokens registry) **non documentés** ici.
