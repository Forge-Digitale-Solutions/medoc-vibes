import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Mentions légales : Médoc Vibes",
  description: "Mentions légales et informations sur les données personnelles du site Médoc Vibes.",
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
        Informations légales du site vitrine Médoc Vibes.
      </p>

      <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed font-medium text-ink-soft">
        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Éditeur
          </h2>
          <p className="m-0">
            Le site <strong>Médoc Vibes</strong> est édité par Anthony Marcelin, entrepreneur
            individuel, sous le nom commercial <strong>Forge Digitale Solutions</strong>.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Forme juridique : entrepreneur individuel</li>
            <li>Siège social : 6 rue Saint-Julien, 33112 Saint-Laurent-Médoc</li>
            <li>SIRET : 100 857 838 00013</li>
            <li>Immatriculation : RNE n° 100 857 838</li>
            <li>Directeur de la publication : Anthony Marcelin</li>
            <li>
              Contact :{" "}
              <a href="/contact" className="font-semibold text-forest underline">
                contact@medocvibes.fr
              </a>{" "}
              (adresse en cours de création)
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-3xl leading-none font-normal uppercase text-forest">
            Hébergement
          </h2>
          <p className="m-0">
            Le site et les services associés sont hébergés sur un serveur privé virtuel (VPS) fourni
            par OVH.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Hébergeur : OVH SAS</li>
            <li>Adresse : 2 rue Kellermann, 59100 Roubaix, France</li>
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
            Les données personnelles collectées via ce site (par exemple une adresse e-mail pour la
            liste d&apos;attente ou un message de contact) le sont uniquement pour vous avertir du
            lancement ou vous répondre, et pour le fonctionnement du produit Médoc Vibes (site et
            application).
          </p>
          <p className="m-0">
            Elles ne sont ni revendues, ni cédées à des tiers à des fins commerciales, ni utilisées
            hors du produit Médoc Vibes.
          </p>
          <p className="m-0">
            Tant qu&apos;aucun formulaire de production n&apos;est branché, aucune donnée n&apos;est
            envoyée à un serveur : le champ d&apos;alerte e-mail éventuel reste un mock local.
          </p>
          <p className="m-0">
            Pour exercer vos droits (accès, rectification, effacement, opposition), écrivez à{" "}
            <a href="/contact" className="font-semibold text-forest underline">
              contact@medocvibes.fr
            </a>{" "}
            dès que la boîte sera opérationnelle. Vous pouvez aussi saisir la CNIL
            (www.cnil.fr).
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
