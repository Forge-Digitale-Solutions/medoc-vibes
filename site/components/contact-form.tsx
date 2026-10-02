"use client";

import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "contact@medocvibes.fr";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ApiError = {
  ok?: boolean;
  message?: string;
};

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEmpty = !name.trim() && !email.trim() && !message.trim();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const payload = (await response.json().catch(() => ({}))) as ApiError;

      if (!response.ok || !payload.ok) {
        setStatus("error");
        setErrorMessage(
          payload.message ||
            "L’envoi a échoué. Réessayez ou utilisez l’adresse e-mail ci-dessous.",
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setCompany("");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Réseau indisponible. Réessayez ou écrivez à contact@medocvibes.fr.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="mt-10 border-2 border-forest bg-ground p-[clamp(24px,3vw,36px)]"
        role="status"
        aria-live="polite"
      >
        <p className="m-0 text-[13px] font-bold tracking-[1.4px] text-estuary uppercase">
          Message envoyé
        </p>
        <p className="mt-3 m-0 font-display text-[clamp(28px,4vw,40px)] leading-[1.1] font-normal uppercase text-forest">
          Merci, on vous répond vite
        </p>
        <p className="mt-4 m-0 max-w-[34em] text-base font-medium text-ink-soft">
          Votre message est bien arrivé. Réponse sous quelques jours ouvrés.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-lg border-2 border-forest bg-transparent px-5 text-[15px] font-extrabold text-forest transition-colors hover:bg-forest hover:text-ground"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-10 border-2 border-forest bg-ground p-[clamp(24px,3vw,36px)]"
      noValidate
    >
      <p className="m-0 text-[13px] font-bold tracking-[1.4px] text-ink-muted uppercase">
        Formulaire
      </p>
      <p className="mt-2 m-0 max-w-[34em] text-base font-medium text-ink-soft">
        Remplissez les champs ci-dessous — le message part vers{" "}
        <span className="font-semibold text-forest">{CONTACT_EMAIL}</span>.
      </p>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="contact-company">Société</label>
        <input
          id="contact-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[1.2px] text-ink-muted uppercase">
            Nom
          </span>
          <input
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "submitting"}
            className="h-12 rounded-lg border-2 border-forest bg-ground px-4 text-base font-medium text-forest outline-none focus:border-estuary disabled:opacity-60"
            placeholder="Votre nom"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[1.2px] text-ink-muted uppercase">
            E-mail
          </span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="h-12 rounded-lg border-2 border-forest bg-ground px-4 text-base font-medium text-forest outline-none focus:border-estuary disabled:opacity-60"
            placeholder="vous@exemple.fr"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-bold tracking-[1.2px] text-ink-muted uppercase">
            Message
          </span>
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "submitting"}
            className="min-h-[140px] resize-y rounded-lg border-2 border-forest bg-ground px-4 py-3 text-base font-medium text-forest outline-none focus:border-estuary disabled:opacity-60"
            placeholder="Votre question, idée de partenariat…"
          />
        </label>
      </div>

      {status === "error" && errorMessage ? (
        <p
          className="mt-5 m-0 border-2 border-[#8B3A3A] bg-[#F8EAEA] px-4 py-3 text-sm font-semibold text-[#5C1F1F]"
          role="alert"
        >
          {errorMessage}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
        </p>
      ) : null}

      {isEmpty && status === "idle" ? (
        <p className="mt-5 m-0 text-sm font-medium text-ink-muted">
          Les trois champs sont requis.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 cursor-pointer items-center rounded-lg bg-accent px-5 text-[15px] font-extrabold text-forest transition-colors hover:bg-[#9AD96E] disabled:cursor-wait disabled:opacity-70"
        >
          {status === "submitting" ? "Envoi…" : "Envoyer le message"}
        </button>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-sm font-semibold text-forest underline"
        >
          Ou ouvrir votre messagerie
        </a>
      </div>
    </form>
  );
}
