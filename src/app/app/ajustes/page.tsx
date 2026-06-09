import { Suspense } from "react";
import { Download, Trash2, Globe, Coins, Tags } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { BillingSection } from "@/components/app/billing-section";
import { currencies } from "@/lib/mock-data";

const selectCls =
  "h-10 w-full max-w-xs rounded-lg border border-outline-variant/60 bg-surface px-3 text-body-md text-on-surface outline-none focus:border-primary";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Globe;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-on-surface">
            {title}
          </h2>
          {description && (
            <p className="text-body-md text-on-surface-variant">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AjustesPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Ajustes" description="Configura tu experiencia." />

      <div className="grid gap-5">
        <Suspense
          fallback={
            <div className="h-48 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface" />
          }
        >
          <BillingSection />
        </Suspense>

        <Section
          icon={Coins}
          title="Preferencias"
          description="Moneda e idioma por defecto."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Moneda
              </span>
              <select className={selectCls} defaultValue="MXN">
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Idioma
              </span>
              <select className={selectCls} defaultValue="es">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>
        </Section>

        <Section
          icon={Tags}
          title="Categorías"
          description="Gestiona las categorías de tus gastos."
        >
          <Link
            href="/app/categorias"
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            Gestionar categorías
          </Link>
        </Section>

        <Section
          icon={Download}
          title="Tus datos"
          description="Exporta o elimina tu información cuando quieras."
        >
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
              <Download className="size-4" /> Exportar todo (Excel)
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-5 py-2.5 text-label-md font-semibold text-destructive transition-colors hover:bg-destructive/5">
              <Trash2 className="size-4" /> Borrar mis datos
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
