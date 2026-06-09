"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileWarning, Plus, ArrowRight, Crown } from "lucide-react";
import type { CategorySlug, Currency, PaymentMethod } from "@/lib/types";
import { useCreateTicket, useProcessReceipt, useUploadReceipt } from "@/lib/tickets";
import { isLimitReached, PRO_PRICE_LABEL } from "@/lib/subscription";
import { Dropzone } from "./dropzone";
import { ProcessingCard } from "./processing-card";
import { ExtractionReview, type ExtractedDraft } from "./extraction-review";
import { UpgradeButton } from "./upgrade-button";

type Phase = "idle" | "processing" | "review" | "success" | "error";
interface QueueItem {
  file: File;
  name: string;
  url: string | null;
}

export function UploadFlow({
  variant = "page",
  onClose,
}: {
  variant?: "page" | "modal";
  onClose?: () => void;
}) {
  const router = useRouter();
  const createTicket = useCreateTicket();
  const uploadReceipt = useUploadReceipt();
  const processReceipt = useProcessReceipt();

  const [phase, setPhase] = useState<Phase>("idle");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState(0);
  const [draft, setDraft] = useState<ExtractedDraft | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Datos del archivo en curso que necesitamos al guardar el ticket.
  const currentKey = useRef<string | null>(null);
  const currentRawText = useRef<string>("");
  // Evita condiciones de carrera si el componente se desmonta a media subida.
  const aborted = useRef(false);

  useEffect(() => {
    // Al (re)montar, el flujo está activo: limpia una posible marca de aborto
    // dejada por un desmontaje previo (p. ej. el doble montaje de React Strict
    // Mode en dev, o al cerrar y reabrir el modal).
    aborted.current = false;
    return () => {
      aborted.current = true;
      queue.forEach((q) => q.url && URL.revokeObjectURL(q.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sube el archivo `i` a R2 y lo procesa (OCR + IA). Al terminar pasa a revisión.
  const processItem = async (items: QueueItem[], i: number) => {
    setIndex(i);
    setPhase("processing");
    setErrorMsg(null);
    const item = items[i];
    try {
      const key = await uploadReceipt(item.file);
      const result = await processReceipt({ key });
      if (aborted.current) return;
      currentKey.current = key;
      currentRawText.current = result.rawText;
      setDraft({
        vendor: result.vendor,
        date: result.date,
        category: result.category as CategorySlug,
        amount: String(result.amount),
        currency: result.currency,
        tax: String(result.tax),
        method: result.method,
        note: result.note,
      });
      setPhase("review");
    } catch (err) {
      if (aborted.current) return;
      setErrorMsg(err instanceof Error ? err.message : "No pudimos leer ese archivo");
      setPhase("error");
    }
  };

  const onFiles = (files: File[]) => {
    const valid = files.filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    if (!valid.length) {
      setErrorMsg("Asegúrate de subir una imagen (JPG, PNG, HEIC) o un PDF.");
      setPhase("error");
      return;
    }
    const items: QueueItem[] = valid.map((f) => ({
      file: f,
      name: f.name,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setQueue(items);
    setSaved(0);
    void processItem(items, 0);
  };

  const advance = () => {
    setDraft(null);
    currentKey.current = null;
    currentRawText.current = "";
    const next = index + 1;
    if (next < queue.length) void processItem(queue, next);
    else setPhase("success");
  };

  const handleSave = async (d: ExtractedDraft) => {
    try {
      await createTicket({
        vendor: d.vendor.trim() || "Sin proveedor",
        date: d.date,
        category: d.category,
        amount: Number(d.amount) || 0,
        currency: (d.currency as Currency) || "MXN",
        tax: Number(d.tax) || 0,
        method: (d.method as PaymentMethod) || "Tarjeta",
        status: "verificado",
        note: d.note.trim() || undefined,
        imageKey: currentKey.current ?? undefined,
        rawText: currentRawText.current || undefined,
      });
      setSaved((s) => s + 1);
      advance();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo guardar el ticket");
      setPhase("error");
    }
  };

  const reset = () => {
    queue.forEach((q) => q.url && URL.revokeObjectURL(q.url));
    setQueue([]);
    setIndex(0);
    setDraft(null);
    setErrorMsg(null);
    currentKey.current = null;
    currentRawText.current = "";
    setPhase("idle");
  };

  const goTo = (href: string) => {
    onClose?.();
    router.push(href);
  };

  const current = queue[index];
  const total = queue.length;

  return (
    <div className={variant === "page" ? "" : "max-h-[78vh] overflow-y-auto pr-1"}>
      {phase === "idle" && (
        <div className="space-y-4">
          <Dropzone onFiles={onFiles} compact={variant === "modal"} />
          <p className="text-center text-label-sm text-on-surface-variant">
            Tus archivos se procesan de forma privada y cifrada.
          </p>
        </div>
      )}

      {phase === "error" && isLimitReached(new Error(errorMsg ?? "")) ? (
        // Límite del plan Free alcanzado → invitamos a mejorar a Pro.
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Crown className="size-7" />
          </div>
          <div>
            <p className="font-display text-headline-sm font-bold text-on-surface">
              Llegaste al límite del plan Free
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              {(errorMsg ?? "").replace(/^LIMIT_REACHED:\s*/, "")}
            </p>
          </div>
          <UpgradeButton label={`Mejorar a Pro · ${PRO_PRICE_LABEL}`} />
          <button
            type="button"
            onClick={reset}
            className="text-label-md font-semibold text-on-surface-variant underline-offset-2 hover:underline"
          >
            Volver
          </button>
        </div>
      ) : phase === "error" ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <FileWarning className="size-7" />
          </div>
          <div>
            <p className="font-display text-headline-sm font-bold text-on-surface">
              No pudimos leer ese archivo
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              {errorMsg ?? "Asegúrate de subir una imagen (JPG, PNG, HEIC) o un PDF."}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {phase === "processing" && (
        <div className="space-y-4">
          {total > 1 && (
            <p className="text-label-sm font-medium text-on-surface-variant">
              Procesando {index + 1} de {total}
            </p>
          )}
          <ProcessingCard imageUrl={current?.url} fileName={current?.name} />
        </div>
      )}

      {phase === "review" && draft && (
        <div className="space-y-4">
          {total > 1 && (
            <p className="text-label-sm font-medium text-on-surface-variant">
              Revisando {index + 1} de {total}
            </p>
          )}
          <ExtractionReview
            initial={draft}
            imageUrl={current?.url}
            onSave={handleSave}
            onSaveAnother={handleSave}
            onDiscard={advance}
          />
        </div>
      )}

      {phase === "success" && (
        <div className="flex flex-col items-center gap-5 px-6 py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#4f8a83]/15 text-[#3f6f69]">
            <CheckCircle2 className="size-9" />
          </div>
          <div>
            <p className="font-display text-headline-sm font-bold text-on-surface">
              {saved > 1 ? `${saved} tickets guardados` : saved === 1 ? "Ticket guardado" : "Listo"}
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Ya están ordenados y categorizados en tu panel.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
            >
              <Plus className="size-4" />
              Subir otro
            </button>
            <button
              type="button"
              onClick={() => goTo("/app/tickets")}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
            >
              Ver tickets
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
