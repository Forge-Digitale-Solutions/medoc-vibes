import { HeroPlane } from "./hero-plane";
import { Reveal } from "./reveal";
import { StoreBadge } from "./store-badge";
import { TideLine } from "./tide-line";
import { WaitlistForm } from "./waitlist-form";
import { TAGLINES, type TaglineKey } from "@/lib/tagline";

const CATS = [
  { label: "Restos & bars", desc: "Terrasses, apéritifs, tables du soir." },
  { label: "Sorties", desc: "Concerts, guinguettes, soirées d’été." },
  { label: "Marchés & fêtes", desc: "Marchés hebdomadaires et fêtes de village." },
  { label: "Vides-greniers", desc: "Brocantes et bonnes affaires du dimanche." },
  { label: "Surf & côte", desc: "Écoles, spots et loisirs de plage, de Lacanau à Soulac." },
] as const;

type LandingPageProps = {
  tagline: TaglineKey;
};

export function LandingPage({ tagline }: LandingPageProps) {
  return (
    <main className="overflow-hidden">
      <header className="flex min-h-[min(100svh,960px)] flex-col bg-forest text-ground">
        <nav className="mx-auto flex w-full max-w-[1312px] items-center gap-6 px-[clamp(20px,5vw,64px)] pt-[22px] text-sm font-semibold">
          <div className="flex flex-1 items-center gap-2 text-mist">
            <span className="text-accent" aria-hidden>
              ●
            </span>
            Médoc, Gironde
          </div>
          <a
            href="#telecharger"
            className="border-b-2 border-accent pb-0.5 text-ground no-underline hover:text-accent"
          >
            Télécharger
          </a>
        </nav>

        <div className="mx-auto flex w-full max-w-[1312px] flex-1 flex-col px-[clamp(20px,5vw,64px)] pt-[clamp(40px,7vh,88px)]">
          <h1
            aria-label="Médoc Vibes"
            className="m-0 flex flex-wrap gap-x-[0.18em] font-display text-[clamp(88px,15.4vw,250px)] leading-[0.84] font-normal tracking-[-0.01em] uppercase"
          >
            <Reveal as="span" delay={0} dx={-24}>
              Médoc
            </Reveal>
            <Reveal as="span" delay={0.11} dx={24} className="text-accent">
              Vibes
            </Reveal>
          </h1>

          <Reveal delay={0.22}>
            <TideLine color="#86CF5E" className="my-[clamp(18px,2.4vw,30px)] mb-[clamp(28px,4vw,52px)]" />
          </Reveal>

          <div className="flex flex-wrap items-end justify-between gap-8 gap-x-16">
            <Reveal delay={0.33} className="max-w-[640px] min-w-0 flex-1 basis-[440px]">
              <p className="m-0 font-extrabold text-[clamp(28px,3.3vw,48px)] leading-[1.08] tracking-[-0.02em] text-balance">
                {TAGLINES[tagline]}
              </p>
              <p className="mt-[18px] mb-0 max-w-[500px] text-[clamp(16px,1.3vw,19px)] leading-normal font-medium text-mist text-pretty">
                Tables, sorties, marchés et spots de surf alentour, issus des agendas locaux.
              </p>
            </Reveal>

            <Reveal delay={0.44}>
              <div id="telecharger" className="flex flex-wrap gap-3">
                <StoreBadge store="apple" variant="light" />
                <StoreBadge store="google" variant="light" />
              </div>
            </Reveal>
          </div>
        </div>

        <div
          aria-hidden
          className="relative mt-[clamp(40px,6vh,72px)] h-[clamp(150px,24vh,250px)] shrink-0"
        >
          <HeroPlane />
        </div>
      </header>

      <section className="bg-ground py-[clamp(80px,10vw,150px)]">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-[clamp(40px,5vw,72px)] px-[clamp(20px,5vw,64px)]">
          <div className="text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
            01 · Le concept
          </div>
          <h2 className="m-0 flex flex-col font-display text-[clamp(52px,7.6vw,124px)] leading-[0.92] font-normal uppercase">
            <Reveal as="span" delay={0} dx={-20}>
              Le Médoc qui vit,
            </Reveal>
            <Reveal
              as="span"
              delay={0.11}
              dx={20}
              className="mt-[0.08em] self-start bg-accent px-[0.12em]"
            >
              près de toi.
            </Reveal>
          </h2>
          <Reveal
            delay={0.22}
            as="p"
            className="m-0 max-w-[720px] text-[clamp(19px,1.6vw,23px)] leading-[1.45] font-medium text-ink-soft text-pretty"
          >
            Médoc Vibes, c’est l’app festif et loisir du Médoc : où manger, où sortir, les marchés,
            les vides-greniers, le surf et la côte.
          </Reveal>
        </div>
      </section>

      <section id="carte" className="bg-forest py-[clamp(80px,10vw,150px)] text-ground">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-[clamp(40px,5vw,64px)] px-[clamp(20px,5vw,64px)]">
          <div className="text-[13px] font-bold tracking-[1.6px] text-sage uppercase">
            02 · Sur la carte
          </div>
          <h2 className="m-0 flex flex-col font-display text-[clamp(44px,6vw,96px)] leading-[0.95] font-normal uppercase">
            <Reveal as="span" delay={0} dx={-20}>
              Tout ce qui anime
            </Reveal>
            <Reveal as="span" delay={0.11} dx={20} className="text-accent">
              le Médoc, sur une carte.
            </Reveal>
          </h2>
          <div className="flex flex-col border-t-2 border-ground">
            {CATS.map((c, i) => (
              <Reveal
                key={c.label}
                delay={Math.min(i, 3) * 0.11}
                className="group mx-[-16px] grid grid-cols-1 items-center gap-2 border-b-2 border-forest-mid px-4 py-[clamp(14px,1.8vw,22px)] transition-colors duration-300 md:grid-cols-[minmax(0,1fr)_minmax(200px,340px)] md:gap-x-10 hover:bg-accent hover:text-forest"
              >
                <div className="min-w-0 font-display text-[clamp(36px,6.2vw,96px)] leading-[0.95] font-normal uppercase">
                  {c.label}
                </div>
                <div className="text-[clamp(15px,1.3vw,18px)] leading-normal font-medium text-pretty md:text-right">
                  {c.desc}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.11} className="flex items-center gap-2.5 text-[15px] font-medium text-sage">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-accent">
              <path
                fill="currentColor"
                d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.2l3.6 2.16A1 1 0 0 0 22 16.2V7.8a1 1 0 0 0-1.4-.92L17 9V6a2 2 0 0 0-2-2h-2V2H7zm0 4h8v12H5V6h2zm12 5.5v3l2 1.2V8.3l-2 1.2z"
              />
            </svg>
            Et les bornes de recharge à proximité.
          </Reveal>
        </div>
      </section>

      <section className="bg-estuary py-[clamp(80px,10vw,150px)] text-white">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-[clamp(40px,5vw,64px)] px-[clamp(20px,5vw,64px)]">
          <div className="text-[13px] font-bold tracking-[1.6px] uppercase">03 · Des données fiables</div>
          <h2 className="m-0 flex flex-col font-display text-[clamp(48px,7vw,112px)] leading-[0.92] font-normal uppercase">
            <Reveal as="span" delay={0} dx={-20}>
              Aucun faux avis.
            </Reveal>
            <Reveal as="span" delay={0.11} dx={20} className="text-forest">
              Aucune note inventée.
            </Reveal>
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-10 gap-x-14">
            <Reveal delay={0.11} className="flex flex-col gap-2.5">
              <div className="text-xl font-extrabold">Des sources publiques</div>
              <p className="m-0 text-[17px] leading-normal font-medium text-pretty">
                Fiches des offices de tourisme (DATAtourisme) et agendas publics (OpenAgenda).
              </p>
            </Reveal>
            <Reveal delay={0.22} className="flex flex-col gap-2.5">
              <div className="text-xl font-extrabold">Rien d&apos;inventé</div>
              <p className="m-0 text-[17px] leading-normal font-medium text-pretty">
                Horaire inconnu : rien d&apos;affiché. Pas de lien de réservation : pas de bouton «
                Réserver ».
              </p>
            </Reveal>
            <Reveal delay={0.33} className="flex flex-col gap-2.5">
              <div className="text-xl font-extrabold">Les périodes calmes, assumées</div>
              <p className="m-0 text-[17px] leading-normal font-medium text-pretty">
                Hors saison, l&apos;application l&apos;indique clairement au lieu de remplir les
                listes.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ground py-[clamp(80px,10vw,150px)]">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-[clamp(40px,5vw,64px)] px-[clamp(20px,5vw,64px)]">
          <div className="text-[13px] font-bold tracking-[1.6px] text-ink-muted uppercase">
            04 · Compte
          </div>
          <h2 className="m-0 flex flex-col font-display text-[clamp(48px,7vw,112px)] leading-[0.92] font-normal uppercase">
            <Reveal as="span" delay={0} dx={-20}>
              Compte facultatif.
            </Reveal>
            <Reveal as="span" delay={0.11} dx={20}>
              Exploration libre.
            </Reveal>
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))]">
            <Reveal
              delay={0.11}
              className="flex flex-col gap-3 border-2 border-forest p-[clamp(28px,3vw,44px)]"
            >
              <div className="font-display text-[clamp(34px,3.4vw,52px)] leading-none font-normal uppercase">
                Sans compte
              </div>
              <p className="m-0 text-lg leading-normal font-medium text-ink-soft">
                Accès complet et gratuit, avec publicité.
              </p>
            </Reveal>
            <Reveal
              delay={0.22}
              className="flex flex-col gap-3 border-2 border-forest bg-accent p-[clamp(28px,3vw,44px)]"
            >
              <div className="font-display text-[clamp(34px,3.4vw,52px)] leading-none font-normal uppercase">
                Avec compte
              </div>
              <p className="m-0 text-lg leading-normal font-semibold">
                Sans publicité. Favoris synchronisés entre appareils.
              </p>
            </Reveal>
          </div>
          <Reveal
            delay={0.22}
            className="flex flex-wrap items-baseline gap-x-3.5 gap-y-2 text-[17px] font-semibold"
          >
            <span className="text-ink-muted">Connexion :</span>
            <span className="font-extrabold">Google · Apple · Facebook · lien magique par e-mail</span>
          </Reveal>
        </div>
      </section>

      <section className="bg-accent pt-[clamp(80px,10vw,150px)] text-forest">
        <div className="mx-auto flex max-w-[1312px] flex-col gap-[clamp(32px,4vw,52px)] px-[clamp(20px,5vw,64px)]">
          <h2 className="m-0 flex flex-col font-display text-[clamp(64px,11vw,184px)] leading-[0.88] font-normal uppercase">
            <Reveal as="span" delay={0} dx={-24}>
              Rendez-vous
            </Reveal>
            <Reveal as="span" delay={0.11} dx={24}>
              dans le Médoc.
            </Reveal>
          </h2>
          <div className="flex flex-wrap items-end justify-between gap-8 gap-x-16">
            <Reveal delay={0.22} className="flex flex-wrap gap-3">
              <StoreBadge store="apple" variant="dark" />
              <StoreBadge store="google" variant="dark" />
            </Reveal>
            <Reveal delay={0.33}>
              <WaitlistForm />
            </Reveal>
          </div>
        </div>
        <TideLine color="#0F2A1D" className="mt-[clamp(64px,8vw,110px)]" />
      </section>

      <footer className="bg-forest px-0 py-10 pb-12 text-mist">
        <div className="mx-auto flex max-w-[1312px] flex-wrap items-baseline justify-between gap-5 gap-x-10 px-[clamp(20px,5vw,64px)] text-sm leading-normal font-medium">
          <div className="font-display text-[28px] leading-none font-normal text-ground uppercase">
            Médoc <span className="text-accent">Vibes</span>
          </div>
          <div className="flex gap-5">
            <a href="#mentions" className="text-mist no-underline hover:text-accent">
              Mentions légales
            </a>
            <a href="mailto:hello@medocvibes.fr" className="text-mist no-underline hover:text-accent">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
