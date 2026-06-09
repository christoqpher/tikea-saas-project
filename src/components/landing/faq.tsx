import { Plus } from "lucide-react";

const faqs = [
  {
    q: "¿Mis datos están seguros?",
    a: "Sí. Todo viaja y se almacena con cifrado AES-256 de extremo a extremo. Aplicamos privacidad por diseño y cumplimos el GDPR: tú decides qué se guarda y puedes borrarlo cuando quieras.",
  },
  {
    q: "¿Qué formatos de ticket acepta?",
    a: "Fotos (JPG, PNG, HEIC) y documentos PDF. Puedes subir desde el móvil o el escritorio; también facturas electrónicas en PDF.",
  },
  {
    q: "¿Funciona con facturas españolas y de otros países?",
    a: "Sí. Reconoce tickets y facturas en cualquier idioma, identifica el IVA y es compatible con el formato de facturación de la AEAT. Detecta y convierte automáticamente la divisa.",
  },
  {
    q: "¿Puedo exportar mis gastos a mi gestor?",
    a: "Con el plan Pro exportas todos tus tickets a CSV / Excel con un clic, listo para tu asesor o tu declaración.",
  },
  {
    q: "¿Necesito tarjeta para empezar?",
    a: "No. El plan Free es para siempre (hasta 10 tickets al mes) y no pide tarjeta. Solo la necesitas si decides pasar a Pro, y puedes cancelar cuando quieras.",
  },
  {
    q: "¿Qué tan precisa es la extracción?",
    a: "La precisión media de extracción es del 99,4%. Cuando hay dudas, te lo marcamos para que confirmes en un toque —nunca inventamos cifras.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-28">
      <div className="mb-12 text-center" data-reveal>
        <p className="text-label-md font-semibold uppercase tracking-widest text-primary">
          Preguntas frecuentes
        </p>
        <h2 className="mt-4 font-display text-headline-md font-bold text-on-surface md:text-4xl">
          Lo que sueles{" "}
          <span className="italic text-primary">preguntar</span>
        </h2>
      </div>

      <div className="space-y-3" data-reveal-group data-reveal-step="70">
        {faqs.map((item) => (
          <details
            key={item.q}
            data-reveal
            className="group rounded-2xl border border-outline-variant/30 bg-surface p-5 [&_summary]:list-none"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-label-md font-semibold text-on-surface">
              {item.q}
              <Plus className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="mt-3 text-body-md text-on-surface-variant">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
