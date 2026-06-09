"use client";

import { Crown } from "lucide-react";
import { usePlan } from "@/lib/subscription";
import { UpgradeButton } from "./upgrade-button";

/**
 * Banner del dashboard para usuarios Free: muestra el uso del mes e invita a
 * mejorar a Pro. No se renderiza para usuarios Pro.
 */
export function PlanBanner() {
  const plan = usePlan();
  if (!plan || plan.plan === "pro") return null;

  const used = plan.usedThisMonth;
  const limit = plan.monthlyLimit ?? 10;
  const reached = used >= limit;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/[0.06] px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Crown className="size-5" />
        </span>
        <div>
          <p className="font-display text-base font-bold text-on-surface">
            Plan Free · {used}/{limit} tickets este mes
          </p>
          <p className="text-body-md text-on-surface-variant">
            {reached
              ? "Llegaste al límite. Mejora a Pro para tickets ilimitados."
              : "Mejora a Pro para tickets ilimitados, informes y export CSV."}
          </p>
        </div>
      </div>
      <UpgradeButton />
    </div>
  );
}
