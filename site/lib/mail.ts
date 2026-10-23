import { Resend } from "resend";

export const DEFAULT_CONTACT_TO = "contact@medocvibes.fr";
/** Works without domain verify; override with RESEND_FROM_EMAIL once medocvibes.fr is verified. */
export const DEFAULT_FROM = "Médoc Vibes <onboarding@resend.dev>";
export const SITE_URL = "https://medocvibes.fr";
const LOGO_URL = `${SITE_URL}/icon.png`;

/** Brand tokens from site/app/globals.css */
const BRAND = {
  forest: "#0F2A1D",
  forestMid: "#24443A",
  accent: "#86CF5E",
  ground: "#F5F6F1",
  mist: "#CFE3D2",
  inkSoft: "#26332B",
  inkMuted: "#3C4A41",
  estuary: "#2F7F86",
} as const;

export type SendMailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: "misconfigured" | "send_failed"; message: string };

function contactToAddress(): string {
  return process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO;
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
}

/** Reply-To for visitor-facing mails (confirmation). Not used on internal notify. */
export function visitorReplyToAddress(): string {
  return (
    process.env.RESEND_REPLY_TO?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    DEFAULT_CONTACT_TO
  );
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<SendMailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "misconfigured",
      message:
        "Configurez RESEND_API_KEY (Dokploy → env du service site). En attendant : contact@medocvibes.fr.",
    };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: [options.to],
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  if (error) {
    console.error("[mail] Resend error:", error);
    return {
      ok: false,
      error: "send_failed",
      message:
        "L'envoi a échoué. Réessayez plus tard ou écrivez à contact@medocvibes.fr.",
    };
  }

  return { ok: true, id: data?.id ?? null };
}

/** Internal notify → contact@. Reply-To = visitor (when provided). */
export async function sendNotifyEmail(options: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<SendMailResult> {
  return sendEmail({
    to: contactToAddress(),
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWaitlistConfirmation(email: string): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = "Tu es sur la liste Médoc Vibes";
  const text = [
    "Médoc Vibes",
    "",
    "Merci, tu es bien inscrit(e) sur la liste d'attente.",
    "",
    "On te prévient dès que l'app est dispo sur les stores.",
    "En attendant, le Médoc continue de vibrer : restos, sorties, marchés, côte.",
    "",
    `Ton e-mail : ${email}`,
    "",
    `Site : ${SITE_URL}`,
    `Une question ? Écris-nous : ${visitorReplyToAddress()}`,
    "",
    "À très vite,",
    "L'équipe Médoc Vibes",
  ].join("\n");

  const safeEmail = escapeHtml(email);
  const replyTo = escapeHtml(visitorReplyToAddress());

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.ground};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Merci, tu es sur la liste. On te prévient au lancement.
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.ground};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.mist};">
          <tr>
            <td style="background-color:${BRAND.forest};padding:28px 28px 24px 28px;text-align:center;">
              <img src="${LOGO_URL}" width="64" height="64" alt="Médoc Vibes" style="display:block;margin:0 auto 14px auto;border:0;border-radius:14px;" />
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;letter-spacing:0.02em;color:${BRAND.ground};font-weight:700;">
                Médoc Vibes
              </p>
              <p style="margin:10px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:${BRAND.accent};font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">
                Liste d'attente
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background-color:${BRAND.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px 28px;font-family:Arial,Helvetica,sans-serif;color:${BRAND.inkSoft};">
              <h1 style="margin:0 0 14px 0;font-size:22px;line-height:1.3;color:${BRAND.forest};font-weight:700;">
                Merci, tu es bien inscrit(e).
              </h1>
              <p style="margin:0 0 14px 0;font-size:16px;line-height:1.55;color:${BRAND.inkSoft};">
                On te prévient dès que l'app est dispo sur les stores.
              </p>
              <p style="margin:0 0 22px 0;font-size:16px;line-height:1.55;color:${BRAND.inkMuted};">
                En attendant, le Médoc continue de vibrer : restos, sorties, marchés, côte. On prépare ça pour toi.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.ground};border-radius:12px;border:1px solid ${BRAND.mist};">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:${BRAND.forestMid};">
                    Ton e-mail enregistré :<br />
                    <strong style="color:${BRAND.forest};font-size:15px;">${safeEmail}</strong>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px 0;">
                <tr>
                  <td align="center" style="border-radius:10px;background-color:${BRAND.forest};">
                    <a href="${SITE_URL}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:${BRAND.ground};text-decoration:none;border-radius:10px;">
                      Voir medocvibes.fr
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px 28px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 8px 0;font-size:14px;line-height:1.5;color:${BRAND.inkMuted};">
                Une question ? Réponds à cet e-mail ou écris à
                <a href="mailto:${replyTo}" style="color:${BRAND.estuary};text-decoration:underline;">${replyTo}</a>.
              </p>
              <p style="margin:0;font-size:14px;line-height:1.5;color:${BRAND.forest};font-weight:700;">
                À très vite,<br />L'équipe Médoc Vibes
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:${BRAND.forest};padding:18px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:${BRAND.mist};">
              Médoc Vibes · pinède, océan, soirées locales<br />
              <a href="${SITE_URL}" style="color:${BRAND.accent};text-decoration:none;">medocvibes.fr</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

/** Confirmation → visitor. From = RESEND_FROM_EMAIL. Reply-To = RESEND_REPLY_TO / contact@. */
export async function sendWaitlistConfirmation(options: {
  to: string;
}): Promise<SendMailResult> {
  const content = buildWaitlistConfirmation(options.to);
  return sendEmail({
    to: options.to,
    replyTo: visitorReplyToAddress(),
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
