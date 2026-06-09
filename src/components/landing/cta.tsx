import { CreditCard, ShieldCheck, X } from "lucide-react";

const reassurance = [
  { icon: CreditCard, label: "Sin tarjeta" },
  { icon: X, label: "Cancela cuando quieras" },
  { icon: ShieldCheck, label: "Datos cifrados" },
];

export function CTA() {
  return (
    <section className="px-6 py-20 md:px-10 md:py-28">
      <div
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-outline-variant/30 bg-surface px-6 py-16 text-center md:px-10 md:py-20"
        data-reveal="scale"
      >
        {/* Resplandores */}
        <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="font-display text-display-lg font-extrabold leading-tight text-on-surface md:text-5xl">
            Empieza a dominar tus gastos{" "}
            <span className="italic text-primary">hoy</span>
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            Sube tu primer ticket y míralo convertirse en datos en segundos.
            Gratis, sin compromiso.
          </p>
          <div className="pt-2">
            <a
              href="/registro"
              className="inline-flex items-center justify-center rounded-full bg-primary px-10 py-4.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.03] active:scale-95"
            >
              Prueba gratis — sin tarjeta
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2">
            {reassurance.map((r) => (
              <span
                key={r.label}
                className="inline-flex items-center gap-2 text-label-sm text-on-surface-variant"
              >
                <r.icon className="size-4 text-primary" />
                {r.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
