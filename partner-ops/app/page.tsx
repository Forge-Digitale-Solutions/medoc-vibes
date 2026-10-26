type PartnerPlan = "essentiel" | "premium";

const planLabels: Record<PartnerPlan, string> = {
  essentiel: "Essentiel",
  premium: "Premium",
};

/** Remplacer par la session /v1/partner/me après auth métier. */
const partner = {
  name: "Établissement démo",
  plan: "essentiel" as PartnerPlan,
};

const sections = [
  {
    title: "Ma fiche",
    description: "Description, horaires, médias et liens de réservation.",
    status: "À brancher sur l’API partenaire",
  },
  {
    title: "Mes événements",
    description: "Créer et mettre à jour les sorties rattachées à votre lieu.",
    status: "À brancher sur l’API partenaire",
  },
  {
    title: "Abonnement",
    description: "Plan Essentiel ou Premium, facturation Stripe.",
    status: "Stripe — spec billing-settings",
  },
  {
    title: "Performances",
    description: "Vues, clics CTA et impressions boost.",
    status: "KPI — post-branchement",
  },
];

export default function PartnerHome() {
  return (
    <div className="min-h-screen bg-[#0f1a14] text-[#e8f0ea]">
      <header className="border-b border-white/10 px-6 py-5 sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[#7cb892]">Médoc Vibes</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Espace partenaire
        </h1>
        <p className="mt-3 text-xl font-medium tracking-tight text-white/95 sm:text-2xl">
          {partner.name}
        </p>
        <p className="mt-1 text-sm text-[#7cb892]">
          Offre actuelle · {planLabels[partner.plan]}
        </p>
      </header>
      <main className="mx-auto grid max-w-5xl gap-4 px-6 py-10 sm:grid-cols-2 sm:px-10">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="text-lg font-medium tracking-tight">{section.title}</h2>
            <p className="mt-2 text-sm text-white/55">{section.description}</p>
            <p className="mt-4 text-xs text-[#7cb892]">{section.status}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
