import {
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { TicketStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeConfig {
  label: string;
  icon: LucideIcon;
  cls: string;
  spin?: boolean;
}

const config: Record<TicketStatus, BadgeConfig> = {
  verificado: {
    label: "Verificado",
    icon: CheckCircle2,
    cls: "bg-[#4f8a83]/15 text-[#3f6f69]",
  },
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    cls: "bg-accent/20 text-[#8a6d1f]",
  },
  procesando: {
    label: "Analizando…",
    icon: Loader2,
    cls: "bg-[#5b6b8a]/15 text-[#46556f]",
    spin: true,
  },
  listo: {
    label: "Listo para revisar",
    icon: Sparkles,
    cls: "bg-[#e9b94a]/25 text-[#8a6d1f] ring-1 ring-inset ring-[#e9b94a]/60",
  },
  error: {
    label: "No se pudo leer",
    icon: AlertCircle,
    cls: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-sm font-medium",
        c.cls,
        className,
      )}
    >
      <Icon className={cn("size-3.5", c.spin && "animate-spin")} />
      {c.label}
    </span>
  );
}
