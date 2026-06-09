import { Camera, ScanLine, LineChart } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Camera,
    title: "Fotografía",
    body: "Saca una foto al ticket o sube el PDF de la factura. Da igual el formato, el idioma o el comercio.",
  },
  {
    n: "02",
    icon: ScanLine,
    title: "La IA extrae",
    body: "En segundos detecta monto, fecha, proveedor y categoría con precisión. Sin teclear ni una cifra.",
  },
  {
    n: "03",
    icon: LineChart,
    title: "Visualiza",
    body: "Cada gasto aparece ordenado en tu dashboard: tendencias, categorías y oportunidades de ahorro.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mb-16 space-y-4 text-center" data-reveal>
        <p className="text-label-md font-semibold uppercase tracking-widest text-primary">
          Cómo funciona
        </p>
        <h2 className="font-display text-headline-md font-bold text-on-surface md:text-4xl">
          De una foto a la <span className="italic text-primary">claridad</span>,
          en tres pasos
        </h2>
      </div>

      <div
        className="relative grid gap-8 md:grid-cols-3"
        data-reveal-group
        data-reveal-step="140"
      >
        {/* línea conectora */}
        <div className="absolute left-0 right-0 top-9 hidden h-px bg-outline-variant/40 md:block" />

        {steps.map((step) => (
          <div
            key={step.n}
            className="relative flex flex-col items-center text-center"
            data-reveal
          >
            <div className="relative z-10 mb-6 flex size-18 items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface text-primary shadow-sm">
              <step.icon className="size-7" strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-primary font-display text-label-sm font-bold text-on-primary-fixed">
                {step.n.slice(1)}
              </span>
            </div>
            <h3 className="mb-2 font-display text-headline-sm font-bold text-on-surface">
              {step.title}
            </h3>
            <p className="max-w-xs text-body-md text-on-surface-variant">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
