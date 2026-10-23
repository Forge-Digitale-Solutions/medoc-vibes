# Contact / waitlist notify — Resend

## Solution

**Resend** serveur (`POST /api/waitlist` + `/api/contact`) → notif `contact@medocvibes.fr` + confirmation HTML au visiteur (waitlist seulement).

| Variable | Rôle |
|---|---|
| **`RESEND_API_KEY`** | Secret Dokploy app **site** uniquement |
| `RESEND_FROM_EMAIL` | From (prod : `Médoc Vibes <noreply@medocvibes.fr>`) |
| `CONTACT_TO_EMAIL` | To notif interne (défaut `contact@medocvibes.fr`) |
| `RESEND_REPLY_TO` | Reply-To des mails **visiteur** (confirmation). Défaut = `CONTACT_TO_EMAIL` / `contact@medocvibes.fr`. Posé Dokploy : `contact@medocvibes.fr`. |

GitHub secrets : **non** pour Resend (seulement webhook deploy).

## Flux waitlist

| Mail | To | From | Reply-To |
|---|---|---|---|
| Notif interne | `CONTACT_TO` / contact@ | `RESEND_FROM_EMAIL` | e-mail du **visiteur** |
| Confirmation visiteur | e-mail du visiteur | `RESEND_FROM_EMAIL` | `RESEND_REPLY_TO` → contact@ |

Si la confirmation échoue après une notif OK : log serveur, réponse client toujours `{ ok: true }`.

Template confirmation : HTML inline dans `site/lib/mail.ts` (`buildWaitlistConfirmation` / `sendWaitlistConfirmation`), couleurs landing (forest `#0F2A1D`, accent `#86CF5E`, ground `#F5F6F1`), logo `https://medocvibes.fr/icon.png`. Pas de tiret cadratin dans le copy.

## Statut

- Notif Resend en prod (PR #12 et suivantes)
- FROM prod : `Médoc Vibes <noreply@medocvibes.fr>`
- `RESEND_REPLY_TO=contact@medocvibes.fr` posé Dokploy (lu par le code confirmation)
- Pas de clé dans le HTML

## Anthony

1. Vérifier boîte `contact@` (+ spam) pour les notifs
2. Tester une inscription waitlist : confirmation reçue côté visiteur, Reply-To = contact@
3. Rien à mettre dans GitHub Actions pour Resend
