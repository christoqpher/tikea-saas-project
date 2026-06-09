import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    priceSuffix: "",
    period: "para siempre",
    desc: "Para empezar a ordenar tus tickets hoy mismo.",
    cta: "Empieza gratis",
    href: "/registro",
    featured: false,
    features: [
      "10 tickets al mes",
      "Extracción automática con IA (OCR)",
      "Categorización automática",
      "Dashboard básico",
    ],
  },
  {
    name: "Pro",
    price: "$199",
    priceSuffix: "MXN",
    period: "/ mes",
    desc: "Para quien gestiona sus gastos en serio.",
    cta: "Mejorar a Pro",
    href: "/registro",
    featured: true,
    features: [
      "Todo lo de Free, y además:",
      "Tickets ilimitados",
      "Dashboard completo con informes",
      "Exportar a CSV / Excel",
      "Gestiona o cancela cuando quieras",
    ],
  },
];

export function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <div className="mb-14 text-center" data-reveal>
        <p className="text-label-md font-semibold uppercase tracking-widest text-primary">
          Precios
        </p>
        <h2 className="mt-4 font-display text-headline-md font-bold text-on-surface md:text-4xl">
          Empieza gratis. Mejora cuando lo{" "}
          <span className="italic text-primary">necesites</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-body-md text-on-surface-variant">
          Sin tarjeta para empezar. Cancela cuando quieras.
        </p>
      </div>

      <div
        className="mx-auto grid max-w-3xl items-stretch gap-6 sm:grid-cols-2"
        data-reveal-group
        data-reveal-step="120"
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            data-reveal
            className={`relative flex flex-col p-8 ${
              plan.featured
                ? "border-2 border-primary bg-primary/[0.06] shadow-2xl sm:-mt-4 sm:mb-4"
                : "border border-outline-variant/30 bg-surface"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 bg-primary px-4 py-1 text-label-sm font-bold text-on-primary-fixed">
                <Crown className="size-3.5" />
                Recomendado
              </span>
            )}
            <h3 className="font-display text-headline-sm font-bold text-on-surface">
              {plan.name}
            </h3>
            <p className="mt-2 text-body-md text-on-surface-variant">
              {plan.desc}
            </p>
            <div className="mt-6 flex items-end gap-1.5">
              <span className="font-display text-4xl font-extrabold text-on-surface">
                {plan.price}
              </span>
              {plan.priceSuffix && (
                <span className="mb-1.5 text-label-md font-semibold text-on-surface-variant">
                  {plan.priceSuffix}
                </span>
              )}
              {plan.period && (
                <span className="mb-1.5 text-label-md text-on-surface-variant">
                  {plan.period}
                </span>
              )}
            </div>

            <a
              href={plan.href}
              className={`mt-7 w-full px-6 py-3.5 text-center text-label-md font-bold transition-all hover:scale-[1.02] active:scale-95 ${
                plan.featured
                  ? "bg-primary text-on-primary-fixed"
                  : "border border-outline-variant/50 text-on-surface hover:bg-surface-container-low"
              }`}
            >
              {plan.cta}
            </a>

            <ul className="mt-8 space-y-3">
              {plan.features.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-start gap-3 text-body-md ${
                    plan.featured && i === 0
                      ? "font-semibold text-on-surface"
                      : "text-on-surface"
                  }`}
                >
                  {!(plan.featured && i === 0) && (
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  )}
                  <span className={plan.featured && i === 0 ? "pl-8" : ""}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
