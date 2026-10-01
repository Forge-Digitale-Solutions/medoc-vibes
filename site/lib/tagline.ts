export type TaglineKey = "A" | "B";

export const TAGLINES = {
  A: "Manger, sortir, bouger. Le Médoc qui vit, à deux pas.",
  B: "Profiter du Médoc, de la pinède à l'océan.",
} as const;

/** Board default A; product rule = alternate day; `?t=A|B` overrides. */
export function resolveTagline(param: string | undefined, now = new Date()): TaglineKey {
  if (param === "A" || param === "B") return param;
  const start = Date.UTC(now.getUTCFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start) / 86_400_000);
  return day % 2 === 0 ? "A" : "B";
}
