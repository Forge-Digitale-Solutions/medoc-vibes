import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Contact : Médoc Vibes",
  description: "Contacter l’équipe Médoc Vibes (adresse e-mail bientôt disponible).",
};

export default function ContactPage() {
  return (
    <SiteChrome active="contact">
      <p className="mb-4 text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
        Contact
      </p>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-[1.1] font-normal uppercase">
        Écrire à Médoc Vibes
      </h1>
      <p className="mt-6 max-w-[34em] text-[clamp(17px,1.4vw,20px)] leading-relaxed font-medium text-ink-soft text-pretty">
        Une question sur l&apos;app, un resto du Médoc, un partenariat ? L&apos;adresse e-mail
        publique n&apos;est pas encore ouverte.
      </p>

      <div className="mt-10 border-2 border-forest bg-forest p-[clamp(24px,3vw,36px)] text-ground">
        <p className="m-0 text-[13px] font-bold tracking-[1.4px] text-sage uppercase">
          Adresse à venir
        </p>
        <p className="mt-3 font-display text-[clamp(28px,4vw,44px)] leading-[1.1] font-normal lowercase">
          contact@medocvibes.fr
        </p>
        <p className="mt-4 m-0 text-base font-medium text-mist">
          Placeholder. Pas encore créée. Le lien mailto sera activé dès que la boîte existera.
        </p>
        <span
          role="link"
          aria-disabled="true"
          className="mt-6 inline-flex h-12 cursor-not-allowed items-center rounded-lg bg-accent/40 px-5 text-[15px] font-extrabold text-forest/70"
        >
          Envoyer un e-mail (bientôt)
        </span>
      </div>

      <p className="mt-10 text-sm font-medium text-ink-muted">
        Commerçants : voir aussi{" "}
        <a href="/partenaires" className="font-semibold text-forest underline">
          Partenaires
        </a>
        .
      </p>
    </SiteChrome>
  );
}
