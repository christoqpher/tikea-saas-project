"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Crown, Check, Loader2, CheckCircle2, Info } from "lucide-react";
import { usePlan, usePortal, PRO_PRICE_LABEL } from "@/lib/subscription";
import { UpgradeButton } from "./upgrade-button";
import { cn } from "@/lib/utils";

const PRO_PERKS = [
  "Tickets ilimitados al mes",
  "Dashboard completo con informes",
  "Exportar a CSV / Excel",
];

export function BillingSection() {
  const plan = usePlan();
  const portal = usePortal();
  const params = useSearchParams();
  const upgrade = params.get("upgrade");
  const [loadingPortal, setLoadingPortal] = useState(false);

  const isPro = plan?.plan === "pro";
  const used = plan?.usedThisMonth ?? 0;
  const limit = plan?.monthlyLimit ?? 10;

  const openPortal = async () => {
    setLoadingPortal(true);
    try {
      const { url } = await portal({});
      window.location.href = url;
    } catch {
      setLoadingPortal(false);
    }
  };

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Crown className="size-5" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-on-surface">
            Plan y facturación
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Gestiona tu suscripción y desbloquea funciones Pro.
          </p>
        </div>
      </div>

      {/* Avisos tras volver de Stripe */}
      {upgrade === "success" && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#4f8a83]/30 bg-[#4f8a83]/10 px-4 py-3 text-[#3f6f69]">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="text-body-md font-medium">
            ¡Pago confirmado! Tu plan Pro se activa en unos segundos.
          </p>
        </div>
      )}
      {upgrade === "cancel" && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-on-surface-variant">
          <Info className="size-5 shrink-0" />
          <p className="text-body-md">
            Cancelaste el pago. Puedes mejorar a Pro cuando quieras.
          </p>
        </div>
      )}

      {/* Estado del plan actual */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
        <div className="flex items-center gap-2">
          <span className="text-body-md text-on-surface-variant">Plan actual:</span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-sm font-bold",
              isPro
                ? "bg-primary/15 text-primary"
                : "bg-surface-container-low text-on-surface-variant",
            )}
          >
            {isPro && <Crown className="size-3.5" />}
            {plan === undefined ? "…" : isPro ? "Pro" : "Free"}
          </span>
        </div>
        {!isPro && plan !== undefined && (
          <span className="text-label-sm text-on-surface-variant">
            {used} de {limit} tickets este mes
          </span>
        )}
      </div>

      {/* Free: barra de uso + perks + upgrade. Pro: estado + portal. */}
      {plan !== undefined && !isPro && (
        <div className="mt-4 space-y-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(100, (used / Math.max(1, limit)) * 100)}%` }}
            />
          </div>

          <ul className="space-y-2">
            {PRO_PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-2.5 text-body-md text-on-surface"
              >
                <Check className="size-4 shrink-0 text-primary" strokeWidth={2.4} />
                {perk}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <UpgradeButton label={`Mejorar a Pro · ${PRO_PRICE_LABEL}`} />
          </div>
        </div>
      )}

      {plan !== undefined && isPro && (
        <div className="mt-4 space-y-4">
          <p className="text-body-md text-on-surface">
            Tienes <span className="font-bold text-primary">tickets ilimitados</span>{" "}
            y todas las funciones desbloqueadas. ✨
          </p>
          {plan.currentPeriodEnd && (
            <p className="text-label-sm text-on-surface-variant">
              {plan.status === "active" ? "Se renueva el " : "Acceso hasta el "}
              {new Date(plan.currentPeriodEnd * 1000).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          )}
          <button
            type="button"
            onClick={openPortal}
            disabled={loadingPortal}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-5 py-2.5 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-60"
          >
            {loadingPortal && <Loader2 className="size-4 animate-spin" />}
            Gestionar suscripción
          </button>
        </div>
      )}
    </section>
  );
}
