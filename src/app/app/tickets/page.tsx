"use client";

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { UploadButton } from "@/components/app/upload-button";
import { ExportButton } from "@/components/app/export-button";
import { TicketsBrowser } from "@/components/app/tickets-browser";
import { EmptyState } from "@/components/app/empty-state";
import { useTickets } from "@/lib/tickets";

export default function TicketsPage() {
  const { tickets, isLoading } = useTickets();
  const data = tickets ?? [];

  return (
    <>
      <PageHeader
        title="Tickets"
        description="Todos tus tickets y facturas, ordenados."
        actions={
          data.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <ExportButton tickets={data} />
              <UploadButton />
            </div>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="mt-4 h-64 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface" />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Aún no tienes tickets"
          description="Sube la foto de tu primer ticket y deja que la IA extraiga los datos por ti."
          action={<UploadButton label="Subir ticket" />}
          className="mt-4"
        />
      ) : (
        <TicketsBrowser tickets={data} />
      )}
    </>
  );
}
