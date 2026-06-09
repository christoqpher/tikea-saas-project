"use client";

import { useState } from "react";
import { Check, AlertTriangle, RotateCcw, Save } from "lucide-react";
import { categories } from "@/lib/mock-data";
import type { CategorySlug } from "@/lib/types";
import { ReceiptPlaceholder } from "./receipt-placeholder";
import { cn } from "@/lib/utils";

export interface ExtractedDraft {
  vendor: string;
  date: string;
  category: CategorySlug;
  amount: string;
  currency: string;
  tax: string;
  method: string;
  note: string;
}

export const sampleDraft: ExtractedDraft = {
  vendor: "Cartier",
  date: "2026-06-04",
  category: "joyeria",
  amount: "8450.00",
  currency: "MXN",
  tax: "1466.12",
  method: "Tarjeta",
  note: "",
};

const confidence: Record<string, number> = {
  vendor: 99,
  date: 97,
  category: 91,
  amount: 99,
  method: 88,
};

function Confidence({ value }: { value?: number }) {
  if (value == null) return null;
  const ok = value >= 95;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
        ok ? "bg-[#4f8a83]/15 text-[#3f6f69]" : "bg-accent/25 text-[#8a6d1f]",
      )}
      title={ok ? "Alta confianza" : "Revisa este campo"}
    >
      {ok ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
      {value}%
    </span>
  );
}

const inputCls =
  "h-10 w-full rounded-lg border border-outline-variant/60 bg-surface px-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  htmlFor,
  conf,
  children,
}: {
  label: string;
  htmlFor?: string;
  conf?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-label-sm font-medium text-on-surface-variant"
        >
          {label}
        </label>
        <Confidence value={conf} />
      </div>
      {children}
    </div>
  );
}

export function ExtractionReview({
  initial = sampleDraft,
  imageUrl,
  onSave,
  onDiscard,
  onSaveAnother,
}: {
  initial?: ExtractedDraft;
  imageUrl?: string | null;
  onSave?: (draft: ExtractedDraft) => void;
  onDiscard?: () => void;
  onSaveAnother?: (draft: ExtractedDraft) => void;
}) {
  const [draft, setDraft] = useState<ExtractedDraft>(initial);
  const set = (k: keyof ExtractedDraft, v: string) =>
    setDraft((d) => ({ ...d, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Imagen */}
        <div className="relative mx-auto h-72 w-56 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface lg:mx-0 lg:h-full lg:w-full">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={draft.vendor}
              className="h-full w-full object-cover"
            />
          ) : (
            <ReceiptPlaceholder />
          )}
          <span className="absolute bottom-2 left-2 rounded-full bg-[#4f8a83]/90 px-2 py-0.5 text-[10px] font-semibold text-white">
            Leído ✓
          </span>
        </div>

        {/* Formulario */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Proveedor" htmlFor="f-vendor" conf={confidence.vendor}>
              <input
                id="f-vendor"
                className={inputCls}
                value={draft.vendor}
                onChange={(e) => set("vendor", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Fecha" htmlFor="f-date" conf={confidence.date}>
            <input
              id="f-date"
              type="date"
              className={inputCls}
              value={draft.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </Field>

          <Field label="Categoría" htmlFor="f-cat" conf={confidence.category}>
            <select
              id="f-cat"
              className={inputCls}
              value={draft.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Monto" htmlFor="f-amount" conf={confidence.amount}>
            <div className="flex gap-2">
              <input
                id="f-amount"
                inputMode="decimal"
                className={cn(inputCls, "min-w-0 flex-1")}
                value={draft.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
              <select
                aria-label="Moneda"
                className={cn(inputCls, "w-20 shrink-0")}
                value={draft.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                <option>MXN</option>
                <option>EUR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </div>
          </Field>

          <Field label="IVA / Impuesto" htmlFor="f-tax">
            <input
              id="f-tax"
              inputMode="decimal"
              className={inputCls}
              value={draft.tax}
              onChange={(e) => set("tax", e.target.value)}
            />
          </Field>

          <Field label="Método de pago" htmlFor="f-method" conf={confidence.method}>
            <select
              id="f-method"
              className={inputCls}
              value={draft.method}
              onChange={(e) => set("method", e.target.value)}
            >
              <option>Tarjeta</option>
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Bizum</option>
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Field label="Notas" htmlFor="f-note">
              <textarea
                id="f-note"
                rows={2}
                placeholder="Añade una nota opcional…"
                className={cn(inputCls, "h-auto py-2")}
                value={draft.note}
                onChange={(e) => set("note", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/30 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onDiscard}
          className="rounded-full px-5 py-2.5 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          Descartar
        </button>
        <button
          type="button"
          onClick={() => onSaveAnother?.(draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
        >
          <RotateCcw className="size-4" />
          Guardar y subir otro
        </button>
        <button
          type="button"
          onClick={() => onSave?.(draft)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
        >
          <Save className="size-4" />
          Guardar ticket
        </button>
      </div>
    </div>
  );
}
