"use client";

import { useRef, useState } from "react";
import { UploadCloud, Camera, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dropzone({
  onFiles,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed text-center transition-all duration-300",
        over
          ? "border-primary bg-primary/5 ai-glow-border"
          : "border-outline-variant/50 bg-surface hover:border-primary/50 hover:bg-primary/[0.03]",
        compact ? "gap-3 p-8" : "gap-5 p-12 sm:p-16",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105",
          compact ? "size-12" : "size-16",
        )}
      >
        <UploadCloud className={compact ? "size-6" : "size-8"} strokeWidth={1.5} />
      </div>

      <div className="space-y-1.5">
        <p
          className={cn(
            "font-display font-bold text-on-surface",
            compact ? "text-base" : "text-headline-sm",
          )}
        >
          Arrastra tus tickets aquí
        </p>
        <p className="text-body-md text-on-surface-variant">
          o{" "}
          <span className="font-semibold text-primary underline-offset-2 group-hover:underline">
            explora tus archivos
          </span>
        </p>
      </div>

      {!compact && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-label-sm text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4" /> JPG · PNG · PDF · HEIC
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Camera className="size-4" /> o usa la cámara
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </div>
  );
}
