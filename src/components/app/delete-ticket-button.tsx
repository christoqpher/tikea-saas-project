"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useDeleteTicket, type TicketId } from "@/lib/tickets";

/** Botón de borrado de un ticket: elimina en Convex y vuelve al listado. */
export function DeleteTicketButton({ id }: { id: TicketId }) {
  const router = useRouter();
  const remove = useDeleteTicket();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (busy) return;
    if (!confirm("¿Borrar este ticket? Esta acción no se puede deshacer.")) return;
    setBusy(true);
    try {
      await remove({ id });
      router.push("/app/tickets");
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label="Borrar"
      className="inline-flex size-10 items-center justify-center rounded-full border border-destructive/40 text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}
