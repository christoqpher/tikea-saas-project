import type { CategoryTotal } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";
import { categoryIcons } from "./category-chip";

/**
 * Lista de barras horizontales de gasto por categoría.
 * Mismo estilo que el "Ranking por categoría" de Informes.
 */
export function CategoryBars({ data }: { data: CategoryTotal[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <ul className="space-y-4">
      {data.map((c) => {
        const Icon = categoryIcons[c.category.slug];
        return (
          <li key={c.category.slug}>
            <div className="mb-1.5 flex items-center justify-between text-label-md">
              <span className="inline-flex items-center gap-2 text-on-surface">
                <Icon className="size-4" style={{ color: c.category.color }} />
                {c.category.name}
              </span>
              <span className="font-semibold tabular-nums text-on-surface">
                {formatCurrency(c.total)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(c.total / max) * 100}%`,
                  background: c.category.color,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
