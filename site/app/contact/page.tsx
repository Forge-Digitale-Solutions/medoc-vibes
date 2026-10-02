import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SiteChrome } from "@/components/site-chrome";

const CONTACT_EMAIL = "contact@medocvibes.fr";

export const metadata: Metadata = {
  title: "Contact : Médoc Vibes",
  description: "Contacter l’équipe Médoc Vibes à contact@medocvibes.fr.",
};

export default function ContactPage() {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY?.trim() ?? "";

  return (
    <SiteChrome active="contact">
      <p className="mb-4 text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
        Contact
      </p>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-[1.1] font-normal uppercase">
        Écrire à Médoc Vibes
      </h1>
      <p className="mt-6 max-w-[34em] text-[clamp(17px,1.4vw,20px)] leading-relaxed font-medium text-ink-soft text-pretty">
        Une question sur l&apos;app, un resto du Médoc, un partenariat ? Envoyez un message
        via le formulaire — ou écrivez directement à{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-semibold text-forest underline"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <ContactForm accessKey={accessKey} />

      <div className="mt-10 border-2 border-forest bg-forest p-[clamp(24px,3vw,36px)] text-ground">
        <p className="m-0 text-[13px] font-bold tracking-[1.4px] text-sage uppercase">
          E-mail direct
        </p>
        <p className="mt-3 font-display text-[clamp(28px,4vw,44px)] leading-[1.1] font-normal lowercase">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-ground no-underline hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-4 m-0 text-base font-medium text-mist">
          Réponse sous quelques jours ouvrés.
        </p>
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
