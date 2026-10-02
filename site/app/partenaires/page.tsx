import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Partenaires : Médoc Vibes",
  description:
    "Plans Essentiel et Premium pour les restos, bars et lieux du Médoc qui veulent une fiche dans l’app.",
};

export default function PartenairesPage() {
  return (
    <SiteChrome active="partenaires">
      <p className="mb-4 text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
        Partenaires
      </p>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-[1.1] font-normal uppercase">
        Votre lieu dans Médoc Vibes
      </h1>
      <p className="mt-6 max-w-[36em] text-[clamp(17px,1.4vw,20px)] leading-relaxed font-medium text-ink-soft text-pretty">
        Restos, bars, guinguettes, marchés, écoles de surf, comités des fêtes : un abonnement
        mensuel (hors app) donne accès à un petit espace pour tenir à jour votre fiche et vos
        dates.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-0 border-2 border-forest md:grid-cols-2">
        <div className="flex flex-col gap-3 border-b-2 border-forest p-[clamp(24px,3vw,36px)] md:border-r-2 md:border-b-0">
          <h2 className="m-0 font-display text-[clamp(32px,3.5vw,48px)] leading-none font-normal uppercase">
            Essentiel
          </h2>
          <p className="m-0 text-base leading-relaxed font-medium text-ink-soft">
            Fiche complète et à jour (horaires, liens, dates, photos), badge Partenaire, et
            éligibilité aux mises en avant dans le fil « autour de moi ».
          </p>
        </div>
        <div className="flex flex-col gap-3 bg-accent p-[clamp(24px,3vw,36px)]">
          <h2 className="m-0 font-display text-[clamp(32px,3.5vw,48px)] leading-none font-normal uppercase">
            Premium boost
          </h2>
          <p className="m-0 text-base leading-relaxed font-semibold text-forest">
            Même base qu&apos;Essentiel, plus une priorité sur un slot de mise en avant réservé
            Premium quand vous êtes éligible près des visiteurs.
          </p>
        </div>
      </div>

      <section className="mt-12 flex flex-col gap-4">
        <h2 className="m-0 font-display text-[clamp(28px,3vw,40px)] leading-[1.1] font-normal uppercase">
          Mise en avant plafonnée
        </h2>
        <p className="m-0 max-w-[36em] text-base leading-relaxed font-medium text-ink-soft">
          Au plus <strong>3</strong> fiches partenaires boostées dans une même vue du fil. Parmi
          elles, <strong>1 slot</strong> est réservé au plan Premium s&apos;il y a un Premium
          éligible. Le reste du Médoc (open data, agenda) reste visible : pas de page pleine de
          pubs partenaires.
        </p>
        <p className="m-0 max-w-[36em] text-base leading-relaxed font-medium text-ink-soft">
          Les tarifs ne sont pas encore affichés. Paiement hors app. Au lancement, zéro partenaire
          actif est possible : l&apos;app fonctionne quand même avec les données ouvertes.
        </p>
      </section>

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
          E-mail public bientôt : contact@medocvibes.fr
        </p>
      </div>
    </SiteChrome>
  );
}
