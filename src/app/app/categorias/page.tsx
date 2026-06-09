"use client";

import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { categoryTotals, formatCurrency } from "@/lib/mock-data";
import { useTickets } from "@/lib/tickets";
import { PageHeader } from "@/components/app/page-header";
import { UploadButton } from "@/components/app/upload-button";
import { EmptyState } from "@/components/app/empty-state";
import { categoryIcons } from "@/components/app/category-chip";

export default function CategoriasPage() {
  const { tickets, isLoading } = useTickets();
  const data = tickets ?? [];
  const totals = categoryTotals(data);
  const grandTotal = totals.reduce((s, c) => s + c.total, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Categorías"
        description="Cómo se reparte tu gasto."
        actions={
          totals.length > 0 ? (
            <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low">
              <Plus className="size-4" /> Nueva categoría
            </button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface"
            />
          ))}
        </div>
      ) : totals.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="Sin categorías todavía"
          description="Cuando subas tickets, aquí verás cómo se reparte tu gasto por categoría."
          action={<UploadButton label="Subir ticket" />}
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {totals.map((c) => {
            const Icon = categoryIcons[c.category.slug];
            return (
              <Link
                key={c.category.slug}
                href="/app/tickets"
                className="group rounded-2xl border border-outline-variant/30 bg-surface p-5 transition-all hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{
                      background: `${c.category.color}1a`,
                      color: c.category.color,
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-label-sm font-semibold text-on-surface-variant">
                    {c.count} {c.count === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
                <p className="font-display text-base font-bold text-on-surface">
                  {c.category.name}
                </p>
                <p className="mt-1 font-display text-xl font-extrabold tabular-nums text-on-surface">
                  {formatCurrency(c.total)}
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((c.total / grandTotal) * 100)}%`,
                      background: c.category.color,
                    }}
                  />
                </div>
                <p className="mt-2 text-label-sm text-on-surface-variant">
                  {Math.round((c.total / grandTotal) * 100)}% del gasto total
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
