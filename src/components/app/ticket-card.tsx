import Link from "next/link";
import type { Ticket } from "@/lib/types";
import { formatDate, amountLabel, getCategory } from "@/lib/mock-data";
import { CategoryChip } from "./category-chip";
import { StatusBadge } from "./status-badge";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const cat = getCategory(ticket.category);
  return (
    <Link
      href={`/app/tickets/${ticket.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface transition-all hover:-translate-y-1 hover:border-primary/40"
    >
      <div
        className="relative flex h-32 items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}0a)`,
        }}
      >
        <span
          className="font-display text-4xl font-extrabold"
          style={{ color: cat.color }}
        >
          {ticket.vendor.charAt(0)}
        </span>
        <span className="absolute right-3 top-3">
          <StatusBadge status={ticket.status} />
        </span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base font-bold text-on-surface">
            {ticket.vendor}
          </p>
          <span className="font-display font-bold tabular-nums text-on-surface">
            {amountLabel(ticket)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <CategoryChip slug={ticket.category} />
          <span className="text-label-sm text-on-surface-variant">
            {formatDate(ticket.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}
