import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil, Download, ShieldCheck } from "lucide-react";
import { getCategory, formatDate, formatCurrency } from "@/lib/mock-data";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { CategoryChip } from "@/components/app/category-chip";
import { StatusBadge } from "@/components/app/status-badge";
import { ReceiptPlaceholder } from "@/components/app/receipt-placeholder";
import { DeleteTicketButton } from "@/components/app/delete-ticket-button";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await fetchAuthQuery(api.tickets.get, {
    id: id as Id<"tickets">,
  });
  if (!ticket) notFound();

  // URL firmada de la imagen original (si el ticket se creó subiendo una foto).
  const imageUrl = await fetchAuthQuery(api.files.getTicketImageUrl, {
    id: id as Id<"tickets">,
  });

  const cat = getCategory(ticket.category);
  const base = ticket.amount - ticket.tax;

  const rows = [
    { k: "Proveedor", v: ticket.vendor },
    { k: "Fecha", v: formatDate(ticket.date) },
    { k: "Método de pago", v: ticket.method },
    { k: "Base imponible", v: formatCurrency(base, ticket.currency) },
    { k: "IVA / Impuesto", v: formatCurrency(ticket.tax, ticket.currency) },
  ];

  return (
    <>
      <Link
        href="/app/tickets"
        className="mb-6 inline-flex items-center gap-2 text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Tickets
      </Link>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span
              className="flex size-12 items-center justify-center rounded-2xl font-display text-2xl font-extrabold"
              style={{ background: `${cat.color}1a`, color: cat.color }}
            >
              {ticket.vendor.charAt(0)}
            </span>
            <div>
              <h1 className="font-display text-headline-md font-extrabold tracking-tight text-on-surface">
                {ticket.vendor}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <CategoryChip slug={ticket.category} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
            <Pencil className="size-4" /> Editar
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
            <Download className="size-4" /> Exportar
          </button>
          <DeleteTicketButton id={ticket._id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Imagen */}
        <div className="space-y-4">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`Ticket de ${ticket.vendor}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <ReceiptPlaceholder />
            )}
          </div>
          <p className="flex items-center justify-center gap-2 text-label-sm text-on-surface-variant">
            <ShieldCheck className="size-4 text-primary" /> Documento cifrado y privado
          </p>
        </div>

        {/* Datos */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
            <div className="mb-4 flex items-end justify-between">
              <p className="font-display text-base font-bold text-on-surface">
                Datos extraídos
              </p>
              <span className="font-display text-3xl font-extrabold tabular-nums text-primary">
                {formatCurrency(ticket.amount, ticket.currency)}
              </span>
            </div>
            <dl className="divide-y divide-outline-variant/20">
              {rows.map((r) => (
                <div key={r.k} className="flex items-center justify-between py-3">
                  <dt className="text-label-md text-on-surface-variant">{r.k}</dt>
                  <dd className="text-label-md font-semibold text-on-surface">
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {(ticket.note || ticket.tags?.length) && (
            <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
              <p className="mb-3 font-display text-base font-bold text-on-surface">
                Notas y etiquetas
              </p>
              {ticket.note && (
                <p className="text-body-md text-on-surface-variant">{ticket.note}</p>
              )}
              {ticket.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          <p className="text-label-sm text-on-surface-variant">
            Añadido el {formatDate(ticket.date)} · ID {ticket._id}
          </p>
        </div>
      </div>
    </>
  );
}
