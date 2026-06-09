import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  sub,
  trend = "none",
  icon: Icon,
  compact = false,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "none";
  icon?: LucideIcon;
  /** Tamaño reducido (padding y valor) para el look "showcase" de la landing. */
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-outline-variant/30 bg-surface",
        compact ? "p-5" : "p-6",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
          {label}
        </p>
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        )}
      </div>
      <p
        className={cn(
          "font-display font-extrabold text-on-surface",
          compact ? "mt-2 text-2xl" : "mt-3 text-3xl",
        )}
      >
        {value}
      </p>
      {sub && (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1 text-label-sm",
            trend === "up" && "text-primary",
            trend === "down" && "text-[#3f6f69]",
            trend === "none" && "text-on-surface-variant",
          )}
        >
          {trend === "up" && <TrendingUp className="size-3.5" />}
          {trend === "down" && <TrendingDown className="size-3.5" />}
          {sub}
        </p>
      )}
    </div>
  );
}
