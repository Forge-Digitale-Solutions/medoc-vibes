import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NOTIFY_TO = "contact@medocvibes.fr";
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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();
  if (!accessKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "misconfigured",
        message:
          "Configurez WEB3FORMS_ACCESS_KEY (Dokploy → env du service site). En attendant : contact@medocvibes.fr.",
      },
      { status: 503 },
    );
  }

  const formData = new FormData();
  formData.set("access_key", accessKey);
  formData.set("to", NOTIFY_TO);
  formData.set("subject", `[Médoc Vibes] Message contact de ${name}`);
  formData.set("from_name", "Médoc Vibes /contact");
  formData.set("name", name);
  formData.set("email", email);
  formData.set("message", message);

  let upstream: Response;
  try {
    upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error("[contact] Web3Forms network error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "send_failed",
        message:
          "L’envoi a échoué. Réessayez ou écrivez à contact@medocvibes.fr.",
      },
      { status: 502 },
    );
  }

  const payload = (await upstream.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!upstream.ok || !payload.success) {
    console.error("[contact] Web3Forms error:", payload);
    return NextResponse.json(
      {
        ok: false,
        error: "send_failed",
        message:
          payload.message ||
          "L’envoi a échoué. Réessayez ou écrivez à contact@medocvibes.fr.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
