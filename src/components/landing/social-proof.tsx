import { ShieldCheck, Lock, FileCheck2, Star } from "lucide-react";

const metrics = [
  { count: 50000, prefix: "+", suffix: "", decimals: 0, value: "+50.000", label: "tickets procesados" },
  { count: 12, prefix: "", suffix: "", decimals: 0, value: "12", label: "países" },
  { count: 4.9, prefix: "", suffix: "★", decimals: 1, value: "4,9★", label: "valoración media" },
  { count: 99.4, prefix: "", suffix: "%", decimals: 1, value: "99,4%", label: "precisión de extracción" },
];

const testimonials = [
  {
    quote:
      "Dejé de perder tardes cuadrando facturas. Fotografío el ticket y al instante está categorizado. Es magia para alguien que viaja constantemente.",
    name: "Valeria M.",
    role: "Autónoma",
  },
  {
    quote:
      "Mi gestor por fin recibe todo ordenado y con el IVA desglosado. He recuperado deducciones que antes se me escapaban.",
    name: "Andrés R.",
    role: "Diseñador freelance",
  },
  {
    quote:
      "Detectó dos suscripciones duplicadas el primer mes. Se pagó solo. La privacidad fue lo que me hizo confiar.",
    name: "Camila S.",
    role: "Madre de familia",
  },
];

const security = [
  { icon: Lock, label: "Cifrado AES-256 de extremo a extremo" },
  { icon: ShieldCheck, label: "Privado por diseño · cumple GDPR" },
  { icon: FileCheck2, label: "Compatible con facturas ES (AEAT)" },
];

export function SocialProof() {
  return (
    <section className="bg-surface-container-lowest/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Métricas */}
        <div
          className="mb-16 grid grid-cols-2 gap-6 border-y border-outline-variant/30 py-10 md:grid-cols-4"
          data-reveal-group
          data-reveal-step="90"
        >
          {metrics.map((m) => (
            <div key={m.label} className="text-center" data-reveal>
              <p
                className="font-display text-3xl font-extrabold text-on-surface md:text-4xl"
                data-count={m.count}
                data-decimals={m.decimals}
                data-prefix={m.prefix}
                data-suffix={m.suffix}
              >
                {m.value}
              </p>
              <p className="mt-1 text-label-sm uppercase tracking-wide text-on-surface-variant">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div className="mb-14 text-center" data-reveal>
          <h2 className="font-display text-headline-md font-bold text-on-surface md:text-4xl">
            Quienes ya tienen el{" "}
            <span className="italic text-primary">control</span>
          </h2>
        </div>
        <div
          className="grid gap-6 md:grid-cols-3"
          data-reveal-group
          data-reveal-step="120"
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-[20px] border border-outline-variant/30 bg-surface p-7"
              data-reveal
            >
              <div className="mb-4 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-body-md text-on-surface">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-display font-bold text-primary">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-label-md font-semibold text-on-surface">
                    {t.name}
                  </span>
                  <span className="block text-label-sm text-on-surface-variant">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Franja de seguridad */}
        <div
          className="mt-12 flex flex-col flex-wrap items-center justify-center gap-x-10 gap-y-3 rounded-2xl border border-outline-variant/30 bg-surface px-6 py-5 sm:flex-row"
          data-reveal
        >
          {security.map((s) => (
            <span
              key={s.label}
              className="inline-flex items-center gap-2 text-label-sm font-medium text-on-surface-variant"
            >
              <s.icon className="size-4 text-primary" />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
