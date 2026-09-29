const kpis = [
  { label: "Lieux indexés", value: "—", hint: "Branchement API à venir" },
  { label: "Événements (7 j)", value: "—", hint: "Agenda week-end" },
  { label: "Clics partenaires", value: "—", hint: "Itinéraire / réserver" },
  { label: "Comptes actifs", value: "—", hint: "Auth API" },
]

export default function OpsHome() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-[#e8f0ea]">
      <header className="border-b border-white/10 px-6 py-5 sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[#7cb892]">Médoc Vibes</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Ops — KPI</h1>
        <p className="mt-2 max-w-xl text-sm text-white/60">
          Tableau de bord léger pour suivre lieux, agenda et attribution partenaires. Données mock
          tant que l’API n’expose pas les métriques.
        </p>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-2 sm:px-10">
        {kpis.map((kpi) => (
          <section
            key={kpi.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-white/50">{kpi.label}</p>
            <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight">{kpi.value}</p>
            <p className="mt-2 text-xs text-[#7cb892]">{kpi.hint}</p>
          </section>
        ))}
      </main>
    </div>
  )
}
