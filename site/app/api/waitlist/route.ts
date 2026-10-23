import { NextResponse } from "next/server";
import {
  isValidEmail,
  sendNotifyEmail,
  sendWaitlistConfirmation,
} from "@/lib/mail";

export const runtime = "nodejs";

const MAX_EMAIL = 254;

type WaitlistBody = {
  email?: unknown;
  /** Honeypot - must stay empty */
  website?: unknown;
};

export async function POST(request: Request) {
  let body: WaitlistBody;
  try {
    body = (await request.json()) as WaitlistBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Requête invalide." },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().slice(0, MAX_EMAIL) : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation",
        message: "Indiquez une adresse e-mail valide.",
      },
      { status: 400 },
    );
  }

  const result = await sendNotifyEmail({
    subject: `[Médoc Vibes] Nouvel e-mail landing / waitlist : ${email}`,
    replyTo: email,
    text: [
      "Inscription waitlist (bas de landing medocvibes.fr)",
      `E-mail : ${email}`,
      `Notifier : contact@medocvibes.fr`,
      `Date : ${new Date().toISOString()}`,
    ].join("\n"),
    html: `<p><strong>Inscription waitlist</strong> (landing medocvibes.fr)</p>
<p>E-mail : <a href="mailto:${email}">${email}</a></p>
<p>Date : ${new Date().toISOString()}</p>`,
  });

  if (!result.ok) {
    const status = result.error === "misconfigured" ? 503 : 502;
    return NextResponse.json(
      { ok: false, error: result.error, message: result.message },
      { status },
    );
  }

  const confirmation = await sendWaitlistConfirmation({ to: email });
  if (!confirmation.ok) {
    console.error(
      "[waitlist] confirmation email failed (notify ok):",
      confirmation.error,
      confirmation.message,
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
