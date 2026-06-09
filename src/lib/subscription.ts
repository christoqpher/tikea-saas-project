"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export interface PlanInfo {
  plan: "free" | "pro";
  status: string | null;
  currentPeriodEnd: number | null;
  usedThisMonth: number;
  monthlyLimit: number | null; // null = ilimitado (Pro)
}

/** Plan y uso del usuario autenticado. `undefined` mientras carga. */
export function usePlan(): PlanInfo | undefined {
  return useQuery(api.subscriptions.getMyPlan);
}

/** Acción para iniciar el Checkout de Stripe (devuelve la URL a la que redirigir). */
export function useCheckout() {
  return useAction(api.stripe.createCheckoutSession);
}

/** Acción para abrir el portal de cliente de Stripe (gestionar/cancelar). */
export function usePortal() {
  return useAction(api.stripe.createPortalSession);
}

/** ¿El error de `tickets.create` es el límite mensual del plan gratis? */
export function isLimitReached(err: unknown): boolean {
  return err instanceof Error && err.message.includes("LIMIT_REACHED");
}

/** Precio del plan Pro para mostrar en la UI (el cobro real lo define Stripe). */
export const PRO_PRICE_LABEL = "$199 MXN / mes";
