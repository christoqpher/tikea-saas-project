"use client";

import { useEffect, useState } from "react";
import { X, Check, Sparkles, ImageIcon } from "lucide-react";
import type { CategorySlug, PaymentMethod, Ticket } from "@/lib/types";
import { categories } from "@/lib/mock-data";
import { StatusBadge } from "./status-badge";
import { cn } from "@/lib/utils";

export interface ReviewValues {
  vendor: string;
  amount: number;
  date: string;
  category: CategorySlug;
  method: PaymentMethod;
}

const inputCls =
  "h-10 w-full rounded-lg border border-outline-variant/60 bg-surface px-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

const methods: PaymentMethod[] = ["Tarjeta", "Transferencia", "Efectivo"];

export function ReviewSheet({
  ticket,
  onClose,
  onConfirm,
}: {
  ticket: Ticket | null;
  onClose: () => void;
  onConfirm: (id: string, values: ReviewValues) => void;
}) {
  const [vendor, setVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState<CategorySlug>("moda");
  const [method, setMethod] = useState<PaymentMethod>("Tarjeta");

  // Rellena el formulario con lo que "extrajo la IA" al abrir un ticket.
  useEffect(() => {
    if (!ticket) return;
    setVendor(ticket.vendor);
    setAmount(ticket.amount ? String(ticket.amount) : "");
    setDate(ticket.date);
    setCategory(ticket.category);
    setMethod(ticket.method);
  }, [ticket]);

  useEffect(() => {
    if (!ticket) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [ticket, onClose]);

  if (!ticket) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Revisar ticket"
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(21,20,15,0.45)" }}
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full animate-[fade-up_.35s_cubic-bezier(.22,1,.36,1)] flex-col overflow-hidden rounded-t-3xl border border-outline-variant/30 bg-background shadow-2xl sm:max-h-[88vh] sm:max-w-3xl sm:rounded-3xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-on-surface">
                Revisar ticket
              </p>
              <p className="text-label-sm text-on-surface-variant">
                Revisa lo que extrajo la IA y confirma
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 sm:grid-cols-2">
          {/* Foto del ticket — placeholder listo para la subida real */}
          <div className="space-y-3">
            <div className="mx-auto flex aspect-[3/4] w-full max-w-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container text-on-surface-variant sm:max-w-none">
              <ImageIcon className="size-10" strokeWidth={1.5} />
              <span className="text-label-sm font-medium">Foto del ticket</span>
            </div>
            <div className="flex justify-center">
              <StatusBadge status={ticket.status} />
            </div>
          </div>

          {/* Campos editables */}
          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Proveedor
              </span>
              <input
                className={inputCls}
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Monto
              </span>
              <input
                type="number"
                inputMode="decimal"
                className={inputCls}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Fecha
              </span>
              <input
                type="date"
                className={inputCls}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Categoría
              </span>
              <select
                className={inputCls}
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-label-sm font-medium text-on-surface-variant">
                Método de pago
              </span>
              <select
                className={inputCls}
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              >
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 border-t border-outline-variant/30 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(ticket.id, {
                vendor,
                amount: Number(amount) || 0,
                date,
                category,
                method,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
          >
            <Check className="size-4" />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
