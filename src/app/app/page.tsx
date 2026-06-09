"use client";

import { Receipt, TrendingUp } from "lucide-react";
import {
  dashboardStats,
  categoryTotals,
  monthlyTrend,
  formatCurrency,
} from "@/lib/mock-data";
import { useTickets, useCurrentUser } from "@/lib/tickets";
import { PageHeader } from "@/components/app/page-header";
import { PlanBanner } from "@/components/app/plan-banner";
import { UploadButton } from "@/components/app/upload-button";
import { KpiCard } from "@/components/app/kpi-card";
import { CategoryDonut } from "@/components/app/category-donut";
import { TrendChart } from "@/components/app/trend-chart";
import { RecentTickets } from "@/components/app/recent-tickets";
import { EmptyState } from "@/components/app/empty-state";

export default function DashboardPage() {
  const { tickets, isLoading } = useTickets();
  const user = useCurrentUser();
  // Primer nombre del usuario para el saludo (si ya cargó).
  const firstName = user?.name?.trim().split(/\s+/)[0];
  const data = tickets ?? [];
  const hasTickets = data.length > 0;

  const stats = dashboardStats(data);
  const totalsByCategory = categoryTotals(data);
  const topCategory = totalsByCategory[0];
  const grandTotal = totalsByCategory.reduce((s, c) => s + c.total, 0);
  const pendientes = data.filter((t) => t.status === "pendiente").length;

  const trend = monthlyTrend(data);
  const trendPct =
    trend[0].total > 0
      ? Math.round(
          ((trend[trend.length - 1].total - trend[0].total) / trend[0].total) *
            100,
        )
      : 0;

  const recent = [...data]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      <PlanBanner />

      <PageHeader
        title={`Hola de nuevo${firstName ? `, ${firstName}` : ""}`}
        description="Tu resumen de gastos · junio 2026"
        actions={hasTickets ? <UploadButton /> : undefined}
      />

      {isLoading ? (
        <div className="mt-4 h-40 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface" />
      ) : !hasTickets ? (
        <EmptyState
          icon={Receipt}
          title="Aún no tienes tickets"
          description="Sube el primero para ver tu resumen aquí."
          action={<UploadButton label="Subir ticket" />}
          className="mt-4"
        />
      ) : (
        <>
          {/* 1) Fila de 4 KPIs (4 escritorio · 2x2 tablet · 1 móvil) */}
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            data-reveal-group
            data-reveal-step="70"
          >
            <div data-reveal>
              <KpiCard
                label="Gasto del mes"
                value={formatCurrency(stats.monthTotal)}
                sub={`${stats.changePct}% vs. mayo`}
                trend={stats.changePct < 0 ? "down" : "up"}
              />
            </div>
            <div data-reveal>
              <KpiCard
                label="Tickets"
                value={String(data.length)}
                sub="en tu historial"
              />
            </div>
            <div data-reveal>
              <KpiCard
                label="Categoría top"
                value={topCategory?.category.name ?? "—"}
                sub={topCategory ? `${topCategory.pct}% del gasto` : undefined}
              />
            </div>
            <div data-reveal>
              <KpiCard
                label="Pendientes"
                value={String(pendientes)}
                sub={pendientes > 0 ? "por revisar" : "todo al día"}
                trend={pendientes > 0 ? "up" : "down"}
              />
            </div>
          </div>

          {/* 2) Donut de categorías + línea de tendencia mensual */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              className="rounded-2xl border border-outline-variant/30 bg-surface p-6"
              data-reveal
            >
              <p className="chart-title mb-5 text-base text-on-surface">
                Gasto por categoría
              </p>
              <CategoryDonut
                data={totalsByCategory.slice(0, 5)}
                total={grandTotal}
              />
            </div>

            <div
              className="rounded-2xl border border-outline-variant/30 bg-surface p-6"
              data-reveal
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="chart-title text-base text-on-surface">
                  Tendencia mensual
                </p>
                {trendPct !== 0 && (
                  <span className="inline-flex items-center gap-1 text-label-sm text-primary">
                    <TrendingUp className="size-3.5" />
                    {trendPct > 0 ? "+" : ""}
                    {trendPct}% en 6 meses
                  </span>
                )}
              </div>
              <TrendChart points={trend} />
            </div>
          </div>

          {/* 3) Tickets recientes a lo ancho */}
          <div className="mt-6" data-reveal>
            <RecentTickets tickets={recent} title="Tickets recientes" />
          </div>
        </>
      )}
    </>
  );
}
