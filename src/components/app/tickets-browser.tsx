"use client";

import { useMemo, useState } from "react";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Trash2,
  Receipt,
  RotateCcw,
} from "lucide-react";
import type { CategorySlug, Ticket, TicketStatus } from "@/lib/types";
import { categories, formatDate, amountLabel } from "@/lib/mock-data";
import {
  useUpdateTicket,
  useDeleteTicket,
  type TicketId,
} from "@/lib/tickets";
import { CategoryChip } from "./category-chip";
import { StatusBadge } from "./status-badge";
import { TicketCard } from "./ticket-card";
import { EmptyState } from "./empty-state";
import { ReviewSheet, type ReviewValues } from "./review-sheet";
import { cn } from "@/lib/utils";

type Sort = "fecha-desc" | "fecha-asc" | "monto-desc" | "monto-asc";
type View = "tabla" | "galeria";

const selectCls =
  "h-9 rounded-lg border border-outline-variant/60 bg-surface px-3 text-label-md text-on-surface outline-none focus:border-primary";

export function TicketsBrowser({ tickets }: { tickets: Ticket[] }) {
  // Los datos vienen en vivo de Convex (prop); las mutaciones persisten y la
  // query se re-renderiza sola. El estado local es sólo de la vista (filtros).
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [sort, setSort] = useState<Sort>("fecha-desc");
  const [view, setView] = useState<View>("tabla");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reviewing, setReviewing] = useState<Ticket | null>(null);

  const filtered = useMemo(() => {
    const list = tickets.filter((t) => {
      if (cat !== "all" && t.category !== cat) return false;
      if (status !== "all" && t.status !== status) return false;
      if (query && !t.vendor.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case "fecha-asc":
          return a.date.localeCompare(b.date);
        case "monto-desc":
          return b.amount - a.amount;
        case "monto-asc":
          return a.amount - b.amount;
        default:
          return b.date.localeCompare(a.date);
      }
    });
  }, [tickets, cat, status, query, sort]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // Confirmar desde el panel: persiste los cambios y marca "Verificado".
  const handleConfirm = async (id: string, values: ReviewValues) => {
    setReviewing(null);
    await updateTicket({
      id: id as TicketId,
      patch: { ...values, status: "verificado" },
    });
  };

  // Reintentar un ticket con error: lo deja "Listo para revisar" para editarlo.
  const handleRetry = async (id: string) => {
    await updateTicket({ id: id as TicketId, patch: { status: "listo" } });
  };

  // Borrar la selección actual.
  const handleDeleteSelected = async () => {
    const ids = [...selected];
    if (!ids.length) return;
    if (!confirm(`¿Borrar ${ids.length} ticket(s)? No se puede deshacer.`)) return;
    setSelected(new Set());
    await Promise.all(ids.map((id) => deleteTicket({ id: id as TicketId })));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proveedor…"
            className="h-9 w-full rounded-lg border border-outline-variant/60 bg-surface pl-9 pr-3 text-label-md text-on-surface outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className={selectCls}
            value={cat}
            onChange={(e) => setCat(e.target.value as CategorySlug | "all")}
            aria-label="Categoría"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus | "all")}
            aria-label="Estado"
          >
            <option value="all">Todos los estados</option>
            <option value="procesando">Procesando</option>
            <option value="listo">Listo para revisar</option>
            <option value="verificado">Verificado</option>
            <option value="pendiente">Pendiente</option>
            <option value="error">Error</option>
          </select>
          <select
            className={selectCls}
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Orden"
          >
            <option value="fecha-desc">Más recientes</option>
            <option value="fecha-asc">Más antiguos</option>
            <option value="monto-desc">Mayor importe</option>
            <option value="monto-asc">Menor importe</option>
          </select>

          <div className="flex overflow-hidden rounded-lg border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setView("tabla")}
              aria-label="Vista tabla"
              className={cn(
                "flex size-9 items-center justify-center",
                view === "tabla"
                  ? "bg-primary text-on-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              <TableIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("galeria")}
              aria-label="Vista galería"
              className={cn(
                "flex size-9 items-center justify-center",
                view === "galeria"
                  ? "bg-primary text-on-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container-low",
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de selección */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5">
          <span className="text-label-md font-semibold text-on-surface">
            {selected.size} seleccionados
          </span>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 px-3 py-1.5 text-label-sm font-semibold text-on-surface hover:bg-surface-container-low">
              <Download className="size-3.5" /> Exportar
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-label-sm font-semibold text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="size-3.5" /> Borrar
            </button>
          </div>
        </div>
      )}

      <p className="text-label-sm text-on-surface-variant">
        {filtered.length} {filtered.length === 1 ? "ticket" : "tickets"}
      </p>

      {/* Resultados */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Sin resultados"
          description="Prueba a cambiar los filtros o la búsqueda."
        />
      ) : view === "galeria" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/30 text-label-sm uppercase tracking-wide text-on-surface-variant">
                <th className="w-10 px-4 py-3"></th>
                <th className="px-2 py-3 font-medium">Proveedor</th>
                <th className="hidden px-2 py-3 font-medium sm:table-cell">
                  Categoría
                </th>
                <th className="hidden px-2 py-3 font-medium md:table-cell">Fecha</th>
                <th className="px-2 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Monto</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setReviewing(t)}
                  className="cursor-pointer border-b border-outline-variant/15 transition-colors last:border-0 hover:bg-surface-container-low"
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(t.id)}
                      onChange={() => toggle(t.id)}
                      className="size-4 accent-[#ed6f5c]"
                      aria-label={`Seleccionar ${t.vendor}`}
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-label-sm font-bold text-primary">
                        {t.vendor.charAt(0)}
                      </span>
                      <span className="font-medium text-on-surface">{t.vendor}</span>
                    </div>
                  </td>
                  <td className="hidden px-2 py-3 sm:table-cell">
                    <CategoryChip slug={t.category} />
                  </td>
                  <td className="hidden px-2 py-3 text-label-md text-on-surface-variant md:table-cell">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.status} />
                      {t.status === "error" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(t.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-outline-variant/50 px-2.5 py-0.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                        >
                          <RotateCcw className="size-3" /> Reintentar
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-display font-bold tabular-nums text-on-surface">
                    {amountLabel(t)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Panel de revisión */}
      <ReviewSheet
        ticket={reviewing}
        onClose={() => setReviewing(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
