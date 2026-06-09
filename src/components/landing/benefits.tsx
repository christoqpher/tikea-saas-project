import {
  FolderCheck,
  Clock,
  FileSpreadsheet,
  Globe,
  Lock,
  MessagesSquare,
} from "lucide-react";

const benefits = [
  {
    icon: FolderCheck,
    title: "Nunca pierdas una factura",
    body: "Cada ticket queda guardado, legible y buscable. Se acabó el cajón de papeles y las fotos perdidas en el carrete.",
  },
  {
    icon: Clock,
    title: "Ahorra horas cada mes",
    body: "Olvídate de teclear importes uno a uno. Lo que antes era una tarde de hoja de cálculo ahora son segundos.",
  },
  {
    icon: FileSpreadsheet,
    title: "Listo para tu gestor e impuestos",
    body: "Exporta a Excel o PDF con el IVA desglosado. Tu asesor recibe todo ordenado y deducible.",
  },
  {
    icon: Globe,
    title: "Multi-moneda y multi-idioma",
    body: "Compra en París, Tokio o Nueva York. Reconoce tickets en cualquier idioma y convierte la divisa por ti.",
  },
  {
    icon: Lock,
    title: "Tus datos, solo tuyos",
    body: "Cifrado de extremo a extremo y privacidad por diseño. Tú decides qué se guarda y qué se exporta.",
  },
  {
    icon: MessagesSquare,
    title: "Pregúntale a tu dinero",
    body: "“¿Cuánto llevo en restaurantes este mes?” El asistente responde con datos reales de tus gastos.",
  },
];

export function Benefits() {
  return (
    <section
      id="caracteristicas"
      className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mb-14 max-w-2xl space-y-4" data-reveal>
        <p className="text-label-md font-semibold uppercase tracking-widest text-primary">
          Por qué Tikea
        </p>
        <h2 className="font-display text-headline-md font-bold text-on-surface md:text-4xl">
          Pensado para quien no tiene tiempo que{" "}
          <span className="italic text-primary">perder</span>
        </h2>
      </div>

      <div
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        data-reveal-group
        data-reveal-step="80"
      >
        {benefits.map((b) => (
          <div
            key={b.title}
            className="group rounded-[20px] border border-outline-variant/30 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            data-reveal
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary-fixed">
              <b.icon className="size-6" strokeWidth={1.6} />
            </div>
            <h3 className="mb-2 font-display text-headline-sm font-bold text-on-surface">
              {b.title}
            </h3>
            <p className="text-body-md text-on-surface-variant">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
