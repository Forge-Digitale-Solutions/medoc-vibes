import Link from "next/link";
import type { ReactNode } from "react";

type SiteChromeProps = {
  children: ReactNode;
  /** Accent nav link label when on that page */
  active?: "mentions" | "contact" | "partenaires" | "home";
};

export function SiteChrome({ children, active }: SiteChromeProps) {
  return (
    <div className="flex min-h-svh flex-col bg-ground text-forest">
      <header className="bg-forest text-ground">
        <nav className="mx-auto flex w-full max-w-[1312px] items-center gap-6 px-[clamp(20px,5vw,64px)] py-[22px] text-sm font-semibold">
          <Link
            href="/"
            className="font-display text-2xl leading-none font-normal text-ground uppercase no-underline"
          >
            Médoc <span className="text-accent">Vibes</span>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-5">
            <Link
              href="/#telecharger"
              className="text-ground no-underline hover:text-accent"
            >
              Télécharger
            </Link>
            <Link
              href="/contact"
              className={
                active === "contact"
                  ? "border-b-2 border-accent pb-0.5 text-ground no-underline"
                  : "text-ground no-underline hover:text-accent"
              }
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[720px] flex-1 px-[clamp(20px,5vw,64px)] py-[clamp(48px,8vw,88px)]">
        {children}
      </main>

      <SiteFooter active={active} />
    </div>
  );
}

export function SiteFooter({
  active,
}: {
  active?: SiteChromeProps["active"];
}) {
  const link = (href: string, label: string, key: typeof active) => (
    <Link
      href={href}
      className={
        active === key
          ? "border-b border-accent text-ground no-underline"
          : "text-mist no-underline hover:text-accent"
      }
    >
      {label}
    </Link>
  );

  return (
    <footer className="bg-forest px-0 py-10 pb-12 text-mist">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-6 px-[clamp(20px,5vw,64px)] text-sm leading-normal font-medium">
        <div className="flex flex-wrap items-baseline justify-between gap-5 gap-x-10">
          <Link
            href="/"
            className="font-display text-[28px] leading-none font-normal text-ground uppercase no-underline"
          >
            Médoc <span className="text-accent">Vibes</span>
          </Link>
          <div className="flex flex-wrap gap-5">
            {link("/partenaires", "Partenaires", "partenaires")}
            {link("/mentions-legales", "Mentions légales", "mentions")}
            {link("/contact", "Contact", "contact")}
          </div>
        </div>
        <p className="m-0 text-mist/80">
          Créé avec amour par{" "}
          <a
            href="https://forgedigitalesolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ground underline decoration-mist/40 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent"
          >
            Forge Digitale Solutions
          </a>
        </p>
      </div>
    </footer>
  );
}
