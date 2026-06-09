"use client";

import { BarChart3 } from "lucide-react";
import { useTickets } from "@/lib/tickets";
import { PageHeader } from "@/components/app/page-header";
import { UploadButton } from "@/components/app/upload-button";
import { ExportMenu } from "@/components/app/export-menu";
import { InformesView } from "@/components/app/informes-view";
import { EmptyState } from "@/components/app/empty-state";

export default function InformesPage() {
  const { tickets, isLoading } = useTickets();
  const data = tickets ?? [];
  const hasData = data.length > 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Informes"
        description="Filtra, analiza y exporta tu gasto para tu gestor."
        actions={hasData ? <ExportMenu tickets={data} /> : undefined}
      />

      {isLoading ? (
        <div className="mt-4 h-96 animate-pulse rounded-2xl border border-outline-variant/30 bg-surface" />
      ) : !hasData ? (
        <EmptyState
          icon={BarChart3}
          title="Aún no hay datos que mostrar"
          description="Sube algunos tickets para empezar a ver tu análisis de gastos aquí."
          action={<UploadButton label="Subir ticket" />}
          className="mt-4"
        />
      ) : (
        <div className="mt-4">
          <InformesView tickets={data} />
        </div>
      )}
    </div>
  );
}
