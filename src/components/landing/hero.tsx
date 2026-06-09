import { ShieldCheck, CreditCard, Zap } from "lucide-react";
import { ScanDemo } from "./scan-demo";

const trust = [
  { icon: CreditCard, label: "Sin tarjeta" },
  { icon: ShieldCheck, label: "Datos cifrados" },
  { icon: Zap, label: "Listo en 3 s" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
      {/* Rejilla técnica de fondo (estilo HydraDB), sin resplandores. */}
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Columna de copy */}
        <div
          className="space-y-7 text-center lg:text-left"
          data-reveal-group
          data-reveal-step="110"
        >
          <div
            className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-4 py-1.5 text-label-sm font-semibold uppercase tracking-widest text-primary"
            data-reveal
          >
            <span className="size-2 rounded-full bg-primary pulse-ai" />
            Controla tus gastos, sin esfuerzo
          </div>

          <h1
            className="font-display text-4xl font-extrabold leading-[1.05] text-on-surface sm:text-5xl md:text-[60px]"
            data-reveal
          >
            Fotografía un ticket.
            <br />
            Recupera el <span className="italic text-primary">control</span>.
          </h1>

          <p
            className="mx-auto max-w-xl text-body-lg font-light text-on-surface-variant lg:mx-0"
            data-reveal
          >
            Tikea lee tus tickets y facturas, extrae el monto, la fecha,
            el comercio y la categoría, y lo ordena todo en un dashboard claro.
            Cero captura manual.
          </p>

          <div
            className="flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start sm:justify-center"
            data-reveal
          >
            <a
              href="/registro"
              className="inline-flex items-center justify-center border-2 border-primary bg-primary px-8 py-3.5 text-label-md font-bold text-on-primary-fixed transition-all hover:bg-transparent hover:text-primary active:scale-95"
            >
              Prueba gratis — sin tarjeta
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center border border-outline-variant px-8 py-3.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Ver cómo funciona
            </a>
          </div>

          {/* Franja de confianza */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 lg:justify-start"
            data-reveal
          >
            {trust.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-2 text-label-sm text-on-surface-variant"
              >
                <t.icon className="size-4 text-primary" />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Demo interactiva */}
        <div className="flex justify-center lg:justify-end" data-reveal="right">
          <ScanDemo />
        </div>
      </div>
    </section>
  );
}
