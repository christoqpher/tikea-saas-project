import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Ticket } from "@/lib/types";
import { formatDate, amountLabel, getCategory } from "@/lib/mock-data";
import { CategoryChip } from "./category-chip";

export function RecentTickets({
  tickets,
  title = "Tickets recientes",
  href = "/app/tickets",
  subtitle = "date",
}: {
  tickets: Ticket[];
  title?: string;
  href?: string;
  /** Texto secundario bajo el comercio: la fecha (look del dashboard) o el
   *  nombre de la categoría con look "showcase" de la landing (sin chip). */
  subtitle?: "date" | "category";
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface">
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-display text-base font-bold text-on-surface">{title}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline"
        >
          Ver todos <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <ul className="divide-y divide-outline-variant/20">
        {tickets.map((t) => (
          <li key={t.id}>
            <Link
              href={`/app/tickets/${t.id}`}
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-container-low"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-label-md font-bold text-primary">
                {t.vendor.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-label-md font-semibold text-on-surface">
                  {t.vendor}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  {subtitle === "category"
                    ? getCategory(t.category).name
                    : formatDate(t.date)}
                </p>
              </div>
              {subtitle === "date" && (
                <div className="hidden lg:block">
                  <CategoryChip slug={t.category} />
                </div>
              )}
              <span className="shrink-0 text-right font-display font-bold tabular-nums text-on-surface">
                {amountLabel(t)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
