import { PageHeader } from "@/components/app/page-header";
import { UploadFlow } from "@/components/app/upload-flow";
import { ShieldCheck, Zap, Languages } from "lucide-react";

const perks = [
  { icon: Zap, title: "Extracción en segundos", body: "Monto, fecha, proveedor y categoría, sin teclear." },
  { icon: Languages, title: "Cualquier idioma", body: "Tickets de París a Tokio, con conversión de divisa." },
  { icon: ShieldCheck, title: "Privado y cifrado", body: "Tus documentos solo los ves tú." },
];

export default function SubirPage() {
  return (
    <>
      <PageHeader
        title="Subir ticket"
        description="Sube una foto o un PDF y deja que la IA lo lea por ti."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="rounded-3xl border border-outline-variant/30 bg-surface p-6 sm:p-8">
          <UploadFlow variant="page" />
        </div>

        <aside className="space-y-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-outline-variant/30 bg-surface p-5"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="size-5" strokeWidth={1.6} />
              </div>
              <p className="font-display text-base font-bold text-on-surface">
                {p.title}
              </p>
              <p className="mt-1 text-body-md text-on-surface-variant">{p.body}</p>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
