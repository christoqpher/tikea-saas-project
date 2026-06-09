import type { Ticket } from "./types";

// Genera un CSV (compatible con Excel) a partir de los tickets del usuario.
// Función Pro: se invoca sólo desde componentes que ya verifican el plan.

const HEADERS = [
  "Fecha",
  "Proveedor",
  "Categoría",
  "Importe",
  "Divisa",
  "Impuesto",
  "Método",
  "Estado",
  "Nota",
  "Etiquetas",
] as const;

/** Escapa un valor para CSV (comillas dobles si contiene coma, comilla o salto). */
function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ticketsToCsv(tickets: Ticket[]): string {
  const rows = tickets.map((t) => [
    t.date,
    t.vendor,
    t.category,
    t.amount,
    t.currency,
    t.tax,
    t.method,
    t.status,
    t.note ?? "",
    (t.tags ?? []).join(" · "),
  ]);
  return [HEADERS, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");
}

/** Dispara la descarga de un CSV en el navegador (BOM para acentos en Excel). */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([`﻿${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
