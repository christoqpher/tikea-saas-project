"use client";

import { useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { useCheckout } from "@/lib/subscription";
import { cn } from "@/lib/utils";

/**
 * Botón "Mejorar a Pro": crea la sesión de Checkout en Stripe (vía acción de
 * Convex) y redirige a la página de pago segura.
 */
export function UpgradeButton({
  label = "Mejorar a Pro",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const checkout = useCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const { url } = await checkout({});
      window.location.href = url;
    } catch {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Crown className="size-4" />
        )}
        {loading ? "Redirigiendo a Stripe…" : label}
      </button>
      {error && (
        <p className="text-label-sm text-destructive">
          No se pudo iniciar el pago. Revisa tu conexión e inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
