"use client";

import { useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "ok" | "error";

/**
 * Waitlist bas de landing → POST /api/waitlist → Web3Forms
 * (clé serveur WEB3FORMS_ACCESS_KEY, non exposée au client).
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!ok) {
      setStatus("error");
      setErrorMessage("Indiquez une adresse e-mail valide.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, website }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setErrorMessage(
          payload.message ||
            "L’envoi a échoué. Réessayez ou écrivez à contact@medocvibes.fr.",
        );
        return;
      }

      setStatus("ok");
      setEmail("");
      setWebsite("");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Réseau indisponible. Réessayez ou écrivez à contact@medocvibes.fr.",
      );
    }
  }

  return (
    <div className="relative flex max-w-[480px] min-w-0 flex-1 flex-col gap-2.5 basis-[360px]">
      <label htmlFor="mv-mail" className="text-[15px] font-bold">
        Pas encore sur les stores ? Être prévenu du lancement.
      </label>
      <form
        onSubmit={onSubmit}
        className="flex overflow-hidden rounded-lg border-2 border-forest bg-ground"
      >
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
          <label htmlFor="mv-website">Site web</label>
          <input
            id="mv-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <input
          id="mv-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="adresse@email.fr"
          value={email}
          disabled={status === "submitting"}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle" && status !== "submitting") setStatus("idle");
          }}
          className="h-[54px] min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-forest outline-none placeholder:text-[#4A5A50] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="cursor-pointer border-0 bg-forest px-5 text-[15px] font-extrabold text-ground disabled:cursor-wait disabled:opacity-70"
        >
          {status === "submitting" ? "Envoi…" : "Être prévenu"}
        </button>
      </form>
      {status === "ok" && (
        <p className="text-sm font-semibold" role="status">
          Merci. On vous prévient au lancement.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-sm font-semibold text-[#5a2018]" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "idle" && !email.trim() && (
        <p className="text-sm font-medium text-ink-muted">
          Entrez votre e-mail pour être notifié.
        </p>
      )}
    </div>
  );
}
