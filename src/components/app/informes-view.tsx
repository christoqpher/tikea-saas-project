"use client";

import { useMemo, useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import type { CategorySlug, Ticket } from "@/lib/types";
import {
  categories,
  categoryTotals,
  monthlyTrend,
  formatCurrency,
} from "@/lib/mock-data";
import { KpiCard } from "./kpi-card";
import { CategoryDonut } from "./category-donut";
import { TrendChart } from "./trend-chart";
import { RecentTickets } from "./recent-tickets";
import { CategoryChip } from "./category-chip";
import { cn } from "@/lib/utils";

type PeriodId = "3m" | "6m" | "12m" | "todo";

const PERIODS: { id: PeriodId; label: string; months: number | null }[] = [
  { id: "3m", label: "Últimos 3 meses", months: 3 },
  { id: "6m", label: "Últimos 6 meses", months: 6 },
  { id: "12m", label: "Último año", months: 12 },
  { id: "todo", label: "Todo el histórico", months: null },
];

const selectCls =
  "h-9 rounded-lg border border-outline-variant/60 bg-surface px-3 text-label-md text-on-surface outline-none focus:border-primary";

/** Clave "YYYY-MM" de una fecha. */
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Vista analítica de Informes: filtros (periodo · categoría · comercio) que
 * recalculan KPIs, donut, tendencia con comparativa mes a mes, una tabla de
 * desglose por categoría y los tickets recientes del conjunto filtrado.
 */
export function InformesView({ tickets }: { tickets: Ticket[] }) {
  const [period, setPeriod] = useState<PeriodId>("6m");
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [query, setQuery] = useState("");

  const periodDef = PERIODS.find((p) => p.id === period)!;

  // Fecha de inicio del periodo (null = sin límite inferior → "todo").
  const startISO = useMemo(() => {
    if (periodDef.months == null) return null;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (periodDef.months - 1), 1);
    return `${monthKey(start)}-01`;
  }, [periodDef.months]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (startISO && t.date < startISO) return false;
      if (cat !== "all" && t.category !== cat) return false;
      if (q && !t.vendor.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tickets, startISO, cat, query]);

  const totals = useMemo(() => categoryTotals(filtered), [filtered]);
  const grandTotal = useMemo(
    () => filtered.reduce((s, t) => s + t.amount, 0),
    [filtered],
  );
  const topCategory = totals[0];
  const avgTicket = filtered.length ? grandTotal / filtered.length : 0;

  // Nº de meses para la serie de tendencia. En "todo", desde el ticket más
  // antiguo del conjunto hasta hoy (mín. 2 para que la línea tenga sentido).
  const trendMonths = useMemo(() => {
    if (periodDef.months != null) return periodDef.months;
    if (!filtered.length) return 6;
    const oldest = filtered.reduce((m, t) => (t.date < m ? t.date : m), filtered[0].date);
    const od = new Date(oldest + "T00:00:00");
    const now = new Date();
    const months =
      (now.getFullYear() - od.getFullYear()) * 12 + (now.getMonth() - od.getMonth()) + 1;
    return Math.min(24, Math.max(2, months));
  }, [periodDef.months, filtered]);

  const trend = useMemo(() => monthlyTrend(filtered, trendMonths), [filtered, trendMonths]);

  // Comparativa del último mes con el anterior dentro de la serie.
  const lastMonth = trend[trend.length - 1]?.total ?? 0;
  const prevMonth = trend[trend.length - 2]?.total ?? 0;
  const momPct = prevMonth > 0 ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) : 0;

  const recent = useMemo(
    () => [...filtered].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [filtered],
  );

  const hasResults = filtered.length > 0;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col gap-3 print:hidden lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar comercio…"
            className="h-9 w-full rounded-lg border border-outline-variant/60 bg-surface pl-9 pr-3 text-label-md text-on-surface outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className={selectCls}
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodId)}
            aria-label="Periodo"
          >
            {PERIODS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
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
        </div>
      </div>

      {/* Panel tipo "ventana" (look del dashboard de la landing). */}
      <div
        className="overflow-hidden rounded-2xl border border-outline-variant/30 shadow-2xl glass"
        data-reveal="scale"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-highest/50 px-5 py-3">
          <span className="text-label-sm font-semibold text-on-surface-variant">
            Informe · {periodDef.label}
          </span>
          <span className="text-label-sm text-on-surface-variant">MXN $</span>
        </div>

        {!hasResults ? (
          <div className="p-12 text-center">
            <p className="font-display text-base font-bold text-on-surface">
              Sin datos para estos filtros
            </p>
            <p className="mt-1 text-label-md text-on-surface-variant">
              Prueba a ampliar el periodo o cambiar la categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 p-5 md:p-7">
            {/* KPIs del periodo filtrado */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard
                compact
                label="Total del periodo"
                value={formatCurrency(grandTotal)}
                sub={`${filtered.length} ${filtered.length === 1 ? "ticket" : "tickets"}`}
              />
              <KpiCard
                compact
                label="Media por ticket"
                value={formatCurrency(avgTicket)}
                sub="gasto promedio"
              />
              <KpiCard
                compact
                label="Categoría top"
                value={topCategory?.category.name ?? "—"}
                sub={topCategory ? `${topCategory.pct}% del gasto` : undefined}
              />
              <KpiCard
                compact
                label="Vs. mes anterior"
                value={`${momPct > 0 ? "+" : ""}${momPct}%`}
                sub={formatCurrency(lastMonth)}
                trend={momPct < 0 ? "down" : "up"}
              />
            </div>

            {/* Donut + tendencia */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                <p className="mb-5 text-label-md font-semibold text-on-surface">
                  Gasto por categoría
                </p>
                <CategoryDonut data={totals.slice(0, 5)} total={grandTotal} showAmounts={false} />
              </div>

              <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-label-md font-semibold text-on-surface">
                    Tendencia mensual
                  </p>
                  {momPct !== 0 && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-label-sm",
                        momPct < 0 ? "text-[#3f6f69]" : "text-primary",
                      )}
                    >
                      {momPct < 0 ? (
                        <TrendingDown className="size-3.5" />
                      ) : (
                        <TrendingUp className="size-3.5" />
                      )}
                      {momPct > 0 ? "+" : ""}
                      {momPct}% vs mes anterior
                    </span>
                  )}
                </div>
                <TrendChart points={trend} showAxis={false} />
              </div>
            </div>

            {/* Desglose por categoría (tabla) */}
            <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface">
              <div className="px-5 py-4">
                <p className="chart-title text-base text-on-surface">
                  Desglose por categoría
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-label-sm uppercase tracking-wide text-on-surface-variant">
                      <th className="px-5 py-3 font-medium">Categoría</th>
                      <th className="px-2 py-3 text-right font-medium">Tickets</th>
                      <th className="px-2 py-3 text-right font-medium">Total</th>
                      <th className="hidden px-2 py-3 text-right font-medium sm:table-cell">
                        Media
                      </th>
                      <th className="px-5 py-3 text-right font-medium">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totals.map((row) => (
                      <tr
                        key={row.category.slug}
                        className="border-b border-outline-variant/15 last:border-0"
                      >
                        <td className="px-5 py-3">
                          <CategoryChip slug={row.category.slug} />
                        </td>
                        <td className="px-2 py-3 text-right tabular-nums text-on-surface-variant">
                          {row.count}
                        </td>
                        <td className="px-2 py-3 text-right font-semibold tabular-nums text-on-surface">
                          {formatCurrency(row.total)}
                        </td>
                        <td className="hidden px-2 py-3 text-right tabular-nums text-on-surface-variant sm:table-cell">
                          {formatCurrency(row.total / row.count)}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                          {row.pct}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-outline-variant/30 text-on-surface">
                      <td className="px-5 py-3 font-display font-bold">Total</td>
                      <td className="px-2 py-3 text-right font-bold tabular-nums">
                        {filtered.length}
                      </td>
                      <td className="px-2 py-3 text-right font-display font-bold tabular-nums">
                        {formatCurrency(grandTotal)}
                      </td>
                      <td className="hidden px-2 py-3 text-right tabular-nums sm:table-cell">
                        {formatCurrency(avgTicket)}
                      </td>
                      <td className="px-5 py-3 text-right font-bold tabular-nums">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Tickets recientes del conjunto filtrado */}
            <RecentTickets tickets={recent} title="Tickets recientes" subtitle="category" />
          </div>
        )}
      </div>
    </div>
  );
}
