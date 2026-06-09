"use client";

import Link from "next/link";
import { Download, Lock, Printer } from "lucide-react";
import type { Ticket } from "@/lib/types";
import { usePlan } from "@/lib/subscription";
import { ticketsToCsv, downloadCsv } from "@/lib/export-csv";

const btnCls =
  "inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low";

/**
 * Exporta el conjunto de tickets que recibe (ya filtrado por Informes) en dos
 * formatos: CSV (descarga) y PDF (diálogo de impresión del navegador → "Guardar
 * como PDF"). Función Pro: para usuarios Free aparece bloqueado y enlaza a
 * Ajustes. Reemplaza al `ExportButton` simple en la pantalla de Informes.
 */
export function ExportMenu({ tickets }: { tickets: Ticket[] }) {
  const plan = usePlan();
  const isPro = plan?.plan === "pro";

  if (!isPro) {
    return (
      <Link
        href="/app/ajustes"
        title="Exportar es una función Pro"
        className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
      >
        <Lock className="size-4" /> Exportar
      </Link>
    );
  }

  const exportCsv = () => {
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`informe-${today}.csv`, ticketsToCsv(tickets));
  };

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={exportCsv} className={btnCls}>
        <Download className="size-4" /> CSV
      </button>
      <button type="button" onClick={() => window.print()} className={btnCls}>
        <Printer className="size-4" /> PDF
      </button>
    </div>
  );
}
