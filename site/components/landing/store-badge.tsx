import Image from "next/image";

type StoreBadgeProps = {
  store: "apple" | "google";
  variant?: "light" | "dark";
};

export function StoreBadge({ store, variant = "light" }: StoreBadgeProps) {
  const light = variant === "light";
  const label = store === "apple" ? "Télécharger dans" : "Disponible sur";
  const name = store === "apple" ? "l'App Store" : "Google Play";
  const src = store === "apple" ? "/store/apple.svg" : "/store/google-play.svg";
  const aria = `${name}, bientôt disponible`;

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label={aria}
        title="Bientôt disponible"
        className={`flex h-[58px] cursor-not-allowed items-center gap-3 rounded-lg py-0 pr-5 pl-3 opacity-90 ${
          light ? "bg-ground text-forest" : "bg-forest text-ground"
        }`}
      >
        <span
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md ${
            light ? "bg-forest/5" : "bg-ground/10"
          }`}
        >
          <Image
            src={src}
            alt=""
            width={22}
            height={22}
            className={light || store === "google" ? "" : "brightness-0 invert"}
            unoptimized
          />
        </span>
        <span className="flex flex-col gap-0.5 text-left">
          <span className="text-[11px] leading-none font-semibold">{label}</span>
          <span className="text-lg leading-none font-extrabold">{name}</span>
        </span>
      </button>
      <span
        className={`pointer-events-none absolute -top-2 -right-2 z-10 rounded px-1.5 py-0.5 text-[10px] leading-none font-extrabold tracking-wide uppercase shadow-sm ${
          light
            ? "bg-accent text-forest ring-1 ring-forest/15"
            : "bg-forest text-accent ring-1 ring-ground/20"
        }`}
      >
        Bientôt disponible
      </span>
    </span>
  );
}
