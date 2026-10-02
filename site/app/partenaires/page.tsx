import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Partenaires : Médoc Vibes",
  description:
    "L’espace partenaires Médoc Vibes arrive bientôt. Contactez-nous pour en savoir plus.",
};

export default function PartenairesPage() {
  return (
    <SiteChrome active="partenaires">
      <p className="mb-4 text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
        Partenaires
      </p>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-[1.1] font-normal uppercase">
        À venir
      </h1>
      <p className="mt-6 max-w-[36em] text-[clamp(17px,1.4vw,20px)] leading-relaxed font-medium text-ink-soft text-pretty">
        Les offres et le contenu partenaires ne sont pas encore publiés. Cette page sera mise à
        jour dès que les modalités seront prêtes.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link
          href="/contact"
          className="inline-flex h-14 items-center rounded-lg bg-forest px-6 text-[17px] font-extrabold text-ground no-underline transition-colors hover:bg-[#1E4A33]"
        >
          Nous contacter
          <span aria-hidden className="ml-2">
            →
          </span>
        </Link>
        <p className="m-0 text-sm font-medium text-ink-muted">
          E-mail :{" "}
          <a
            href="mailto:contact@medocvibes.fr"
            className="font-semibold text-forest underline"
          >
            contact@medocvibes.fr
          </a>
        </p>
      </div>
    </SiteChrome>
  );
}
