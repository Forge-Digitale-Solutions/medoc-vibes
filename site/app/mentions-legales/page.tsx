import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Mentions légales : Médoc Vibes",
  description: "Mentions légales du site Médoc Vibes.",
};

export default function MentionsLegalesPage() {
  return (
    <SiteChrome active="mentions">
      <p className="mb-4 text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
        Mentions légales
      </p>
      <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] leading-[1.1] font-normal uppercase">
        Mentions légales
      </h1>
      <p className="mt-4 text-sm font-medium text-ink-muted">
        Site vitrine en préparation. Certaines mentions restent à finaliser avant mise en ligne.
      </p>

      <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed font-medium text-ink-soft">
        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Éditeur
          </h2>
          <p className="m-0">
            Le site <strong>Médoc Vibes</strong> est édité par{" "}
            <strong>Forge Digitale Solutions</strong> (projet porté avec Anthony Marcelin).
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Forme juridique : [À compléter]</li>
            <li>Siège social : [À compléter]</li>
            <li>SIRET : [À compléter]</li>
            <li>RCS : [À compléter]</li>
            <li>Directeur de la publication : Anthony Marcelin (à confirmer)</li>
            <li>
              Contact : adresse e-mail de contact en cours de création (voir{" "}
              <a href="/contact" className="font-semibold text-forest underline">
                Contact
              </a>
              )
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Hébergement
          </h2>
          <p className="m-0">
            L&apos;hébergement de production est prévu via une infrastructure type Dokploy sur VPS
            (conteneurs). Le prestataire et les coordonnées d&apos;hébergement seront indiqués ici
            dès le déploiement public.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Hébergeur : [À compléter]</li>
            <li>Adresse : [À compléter]</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Propriété intellectuelle
          </h2>
          <p className="m-0">
            Textes, marques, éléments graphiques et code du site sont protégés. Toute reproduction
            non autorisée est interdite, sauf usage privé et citations courtes avec source.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Données personnelles
          </h2>
          <p className="m-0">
            Ce site vitrine ne collecte pour l&apos;instant aucune donnée via un backend de
            production. Le formulaire d&apos;alerte e-mail, s&apos;il est activé en local, reste un
            mock sans envoi serveur. Une politique de confidentialité complète sera publiée avant
            tout traitement réel (liste d&apos;attente, analytics, etc.).
          </p>
          <p className="m-0">
            Pour exercer vos droits (accès, rectification, effacement), contactez-nous via la page{" "}
            <a href="/contact" className="font-semibold text-forest underline">
              Contact
            </a>{" "}
            dès qu&apos;une adresse opérationnelle sera ouverte.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Responsabilité
          </h2>
          <p className="m-0">
            Médoc Vibes est une application touristique et de loisirs en conception. Les
            informations du site peuvent évoluer. Les contenus issus de sources ouvertes (offices
            de tourisme, agendas publics) seront indiqués dans l&apos;app ; l&apos;éditeur ne
            garantit pas l&apos;exhaustivité ni l&apos;actualité permanente des données tierces.
          </p>
        </section>
      </div>
    </SiteChrome>
  );
}
