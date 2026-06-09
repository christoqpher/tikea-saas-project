"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadButton({
  variant = "primary",
  label = "Subir ticket",
  className,
}: {
  variant?: "primary" | "ghost";
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href="/app/subir"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-label-md font-bold transition-all active:scale-95",
        variant === "primary"
          ? "bg-primary text-on-primary-fixed hover:scale-[1.02]"
          : "border border-outline-variant/50 text-on-surface hover:bg-surface-container-low",
        className,
      )}
    >
      <Plus className="size-4" />
      {label}
    </Link>
  );
}
