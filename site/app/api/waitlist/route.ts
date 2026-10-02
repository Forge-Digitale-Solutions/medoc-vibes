import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Intentionally not a Web3Forms proxy.
 * Free Web3Forms blocks server IPs (« Pro plan is required »).
 * The landing WaitlistForm POSTs from the browser; Dokploy env
 * `WEB3FORMS_ACCESS_KEY` is injected at request time via RSC props.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "use_client",
      message:
        "Utilisez le formulaire waitlist de la landing (envoi Web3Forms côté navigateur).",
    },
    { status: 405 },
  );
}
