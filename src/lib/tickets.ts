"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import type { Ticket } from "./types";

/** Convierte un documento de Convex al tipo `Ticket` que usa la UI (`_id` → `id`). */
export function toTicket(doc: Doc<"tickets">): Ticket {
  return {
    id: doc._id,
    vendor: doc.vendor,
    date: doc.date,
    category: doc.category,
    amount: doc.amount,
    currency: doc.currency,
    tax: doc.tax,
    method: doc.method,
    status: doc.status,
    note: doc.note,
    tags: doc.tags,
  };
}

/**
 * Tickets del usuario autenticado en tiempo real.
 * `tickets` es `undefined` mientras carga (primer render), luego `Ticket[]`.
 */
export function useTickets(): { tickets: Ticket[] | undefined; isLoading: boolean } {
  const docs = useQuery(api.tickets.list);
  return { tickets: docs?.map(toTicket), isLoading: docs === undefined };
}

/** Usuario autenticado actual (o `null`/`undefined` mientras carga). */
export function useCurrentUser() {
  return useQuery(api.auth.getCurrentUser);
}

/** Hooks de mutación tipados. Devuelven la función lista para invocar. */
export function useCreateTicket() {
  return useMutation(api.tickets.create);
}

export function useUpdateTicket() {
  return useMutation(api.tickets.update);
}

export function useDeleteTicket() {
  return useMutation(api.tickets.remove);
}

/**
 * Sube un archivo a Cloudflare R2 y devuelve la `key` del objeto.
 * Internamente: firma la URL → PUT directo a R2 → sincroniza metadata en Convex.
 */
export function useUploadReceipt() {
  return useUploadFile(api.files);
}

/**
 * Procesa una imagen ya subida (por su `key`): OCR con LlamaParse + extracción
 * con OpenAI. Devuelve el borrador para revisión.
 */
export function useProcessReceipt() {
  return useAction(api.extraction.processReceipt);
}

/** URL firmada (temporal) de la imagen de un ticket, o `null`. */
export function useTicketImageUrl(id: TicketId | undefined) {
  return useQuery(api.files.getTicketImageUrl, id ? { id } : "skip");
}

export type TicketId = Id<"tickets">;
