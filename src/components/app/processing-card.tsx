import { ReceiptPlaceholder } from "./receipt-placeholder";

const skeletonFields = ["Proveedor", "Fecha", "Categoría", "Método"];

export function ProcessingCard({
  imageUrl,
  fileName,
}: {
  imageUrl?: string | null;
  fileName?: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
      {/* Imagen con línea de escaneo */}
      <div className="relative mx-auto h-64 w-48 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface sm:mx-0">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={fileName || "Ticket"}
            className="h-full w-full object-cover"
          />
        ) : (
          <ReceiptPlaceholder />
        )}
        <div className="scan-line" />
      </div>

      {/* Campos en skeleton */}
      <div className="flex flex-col">
        <p className="mb-4 inline-flex items-center gap-2 text-label-md font-semibold">
          <span className="shimmer-text">Analizando ticket…</span>
        </p>

        <div className="space-y-3">
          {skeletonFields.map((f) => (
            <div key={f} className="flex items-center justify-between gap-4">
              <span className="text-label-sm text-on-surface-variant">{f}</span>
              <span className="h-3.5 w-28 animate-pulse rounded bg-on-surface/15" />
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 border-t border-outline-variant/20 pt-3">
            <span className="text-label-sm text-on-surface-variant">Monto</span>
            <span className="h-6 w-32 animate-pulse rounded bg-primary/25" />
          </div>
        </div>

        <p className="mt-6 text-label-sm text-on-surface-variant">
          {fileName ? (
            <>
              Leyendo <span className="font-medium text-on-surface">{fileName}</span>{" "}
              con IA…
            </>
          ) : (
            "Extrayendo datos con IA…"
          )}
        </p>
      </div>
    </div>
  );
}
