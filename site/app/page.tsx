export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#14301f] text-[#f3f7f1]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,184,146,0.35),_transparent_55%),linear-gradient(160deg,#0d2217_0%,#1a3d28_45%,#0f281c_100%)]"
      />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#9fd4b0]">
          Médoc Vibes
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Manger, boire, sortir — ancré dans le Médoc.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          Landing placeholder. L’app mobile listera restos, soirées, surf, pêche et bons plans
          locaux autour de toi. Complémentaire à l’app Parc naturel régional.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="http://localhost:3333"
            className="rounded-full bg-[#7cb892] px-5 py-2.5 text-sm font-medium text-[#0d2217] transition hover:bg-[#93c9a4]"
          >
            API locale
          </a>
          <a
            href="http://localhost:4311"
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:border-white/40"
          >
            Dashboard ops
          </a>
        </div>
      </div>
    </main>
  )
}
