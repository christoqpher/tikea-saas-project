import type { CategoryTotal } from "@/lib/types";
import { formatCurrency, formatCompactCurrency } from "@/lib/mock-data";

export function CategoryDonut({
  data,
  total,
  showAmounts = true,
}: {
  data: CategoryTotal[];
  total: number;
  /** Muestra el monto en pesos junto al % en la leyenda (look detallado del
   *  dashboard). Desactívalo para el look "showcase" de la landing (solo %). */
  showAmounts?: boolean;
}) {
  const sum = data.reduce((s, d) => s + d.total, 0) || 1;
  let acc = 0;
  const stops = data
    .map((d) => {
      const start = (acc / sum) * 100;
      acc += d.total;
      const end = (acc / sum) * 100;
      return `${d.category.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div
        className="relative size-40 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[20%] flex flex-col items-center justify-center rounded-full bg-surface text-center">
          <span className="font-display text-xl font-extrabold text-on-surface">
            {formatCompactCurrency(total)}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-on-surface-variant">
            total
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-2.5 self-stretch">
        {data.map((d) => (
          <li
            key={d.category.slug}
            className="flex items-center justify-between gap-3 text-label-md"
          >
            <span className="inline-flex items-center gap-2 text-on-surface">
              <span
                className="size-2.5 rounded-full"
                style={{ background: d.category.color }}
              />
              {d.category.name}
            </span>
            <span className="inline-flex items-center gap-2">
              {showAmounts && (
                <span className="tabular-nums text-on-surface-variant">
                  {formatCurrency(d.total)}
                </span>
              )}
              <span className="w-9 text-right text-label-sm font-semibold tabular-nums text-on-surface-variant">
                {d.pct}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
