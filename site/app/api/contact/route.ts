import { NextResponse } from "next/server";
import { isValidEmail, sendNotifyEmail } from "@/lib/mail";

export const runtime = "nodejs";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown;
};

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json", message: "Requête invalide." },
      { status: 400 },
    );
  }

  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asTrimmedString(body.name, MAX_NAME);
  const email = asTrimmedString(body.email, MAX_EMAIL);
  const message = asTrimmedString(body.message, MAX_MESSAGE);

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation",
        message: "Vérifiez le nom, l’e-mail et le message.",
      },
      { status: 400 },
    );
  }

  const result = await sendNotifyEmail({
    subject: `[Médoc Vibes] Message contact de ${name}`,
    replyTo: email,
    text: [
      "Nouveau message via /contact (medocvibes.fr)",
      `Nom : ${name}`,
      `E-mail : ${email}`,
      "",
      "Message :",
      message,
    ].join("\n"),
    html: `<p><strong>Message contact</strong></p>
<p>Nom : ${name}<br/>E-mail : <a href="mailto:${email}">${email}</a></p>
<p>${message.replace(/\n/g, "<br/>")}</p>`,
  });

  if (!result.ok) {
    const status = result.error === "misconfigured" ? 503 : 502;
    return NextResponse.json(
      { ok: false, error: result.error, message: result.message },
      { status },
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
