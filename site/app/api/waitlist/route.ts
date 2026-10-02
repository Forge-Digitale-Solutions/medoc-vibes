import { NextResponse } from "next/server";

export const runtime = "nodejs";

const NOTIFY_TO = "contact@medocvibes.fr";
const MAX_EMAIL = 254;

type WaitlistBody = {
  email?: unknown;
  /** Honeypot — must stay empty */
  website?: unknown;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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
  formData.set(
    "subject",
    `[Médoc Vibes] Nouvel e-mail landing / waitlist : ${email}`,
  );
  formData.set("from_name", "Médoc Vibes landing");
  formData.set("email", email);
  formData.set(
    "message",
    [
      "Inscription waitlist (bas de landing medocvibes.fr)",
      `E-mail : ${email}`,
      `Notifier : ${NOTIFY_TO}`,
      `Date : ${new Date().toISOString()}`,
    ].join("\n"),
  );

  let upstream: Response;
  try {
    upstream = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    console.error("[waitlist] Web3Forms network error:", err);
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
    console.error("[waitlist] Web3Forms error:", payload);
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
