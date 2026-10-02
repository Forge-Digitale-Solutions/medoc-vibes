import { Resend } from "resend";

export const DEFAULT_CONTACT_TO = "contact@medocvibes.fr";
/** Works without domain verify; override with RESEND_FROM_EMAIL once medocvibes.fr is verified. */
export const DEFAULT_FROM = "Médoc Vibes <onboarding@resend.dev>";

export type SendMailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: "misconfigured" | "send_failed"; message: string };

export async function sendNotifyEmail(options: {
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

  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO;
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
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
        "L’envoi a échoué. Réessayez plus tard ou écrivez à contact@medocvibes.fr.",
    };
  }

  return { ok: true, id: data?.id ?? null };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
