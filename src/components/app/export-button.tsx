"use client";

import Link from "next/link";
import { Download, Lock } from "lucide-react";
import type { Ticket } from "@/lib/types";
import { usePlan } from "@/lib/subscription";
import { ticketsToCsv, downloadCsv } from "@/lib/export-csv";

/**
 * Exporta los tickets a CSV. Función Pro: para usuarios Free el botón aparece
 * bloqueado y enlaza a Ajustes para mejorar el plan.
 */
export function ExportButton({ tickets }: { tickets: Ticket[] }) {
  const plan = usePlan();
  const isPro = plan?.plan === "pro";

  if (!isPro) {
    return (
      <Link
        href="/app/ajustes"
        title="Exportar a CSV es una función Pro"
        className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
      >
        <Lock className="size-4" /> Exportar CSV
      </Link>
    );
  }

  const handleExport = () => {
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`tickets-${today}.csv`, ticketsToCsv(tickets));
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
    >
      <Download className="size-4" /> Exportar CSV
    </button>
  );
}
