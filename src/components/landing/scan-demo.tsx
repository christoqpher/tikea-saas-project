"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, Sparkles, Upload } from "lucide-react";

type Phase = "scanning" | "done";

const TARGET = 399;

const fields = [
  { k: "Proveedor", v: "Zara", coral: false },
  { k: "Fecha", v: "12 may 2026", coral: false },
  { k: "Categoría", v: "Ropa", coral: true },
];

export function ScanDemo() {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [amount, setAmount] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Reproduce la "extracción" en cada run (montaje o nueva imagen).
  useEffect(() => {
    setPhase("scanning");
    setAmount(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("done");
      setAmount(TARGET);
      return;
    }
    const t = setTimeout(() => {
      setPhase("done");
      const start = performance.now();
      const dur = 1100;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setAmount(Math.round(TARGET * eased));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 1900);
    return () => {
      clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [runId]);

  // Limpia el objectURL al cambiar/desmontar.
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const onFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setRunId((n) => n + 1);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      {/* halo */}
      <div className="absolute -inset-2 -z-10 rounded-[32px] bg-gradient-to-br from-primary/25 to-primary-container/20 opacity-60 blur-2xl" />

      <div className="overflow-hidden rounded-[24px] border border-outline-variant/30 shadow-2xl glass">
        {/* barra superior */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-highest/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-label-sm font-semibold text-on-surface">
              Tikea · Escáner
            </span>
          </div>
          <span className="rounded-full border border-outline-variant/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
            Demo
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-4 p-5">
          {/* ticket */}
          <div className="relative h-44 w-32 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Ticket subido"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col gap-2 p-3">
                <div className="mx-auto mb-1 size-6 rounded-full bg-on-surface/10" />
                <div className="h-1.5 w-3/4 rounded bg-on-surface/15" />
                <div className="h-1.5 w-full rounded bg-on-surface/10" />
                <div className="h-1.5 w-5/6 rounded bg-on-surface/10" />
                <div className="h-1.5 w-2/3 rounded bg-on-surface/10" />
                <div className="mt-auto flex items-center justify-between">
                  <div className="h-2 w-1/3 rounded bg-on-surface/15" />
                  <div className="h-3 w-1/3 rounded bg-primary/40" />
                </div>
              </div>
            )}
            {phase === "scanning" && <div className="scan-line" />}
          </div>

          {/* campos extraídos */}
          <div className="flex flex-col">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {phase === "scanning" ? (
                <span className="shimmer-text">Analizando ticket…</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-primary">
                  <Check className="size-3.5" /> Datos extraídos
                </span>
              )}
            </p>

            <div className="space-y-1.5">
              {fields.map((f, i) =>
                phase === "scanning" ? (
                  <div key={f.k} className="flex items-center justify-between py-1">
                    <span className="text-label-sm text-on-surface-variant">
                      {f.k}
                    </span>
                    <span className="h-3 w-16 animate-pulse rounded bg-on-surface/15" />
                  </div>
                ) : (
                  <div
                    key={f.k}
                    className="field-in flex items-center justify-between border-b border-outline-variant/20 py-1"
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    <span className="text-label-sm text-on-surface-variant">
                      {f.k}
                    </span>
                    <span
                      className={`text-label-md font-semibold ${
                        f.coral ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {f.v}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-auto pt-3">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">
                Monto
              </p>
              <p className="font-display text-3xl font-extrabold tabular-nums text-primary">
                {phase === "scanning"
                  ? "—"
                  : `$${amount.toLocaleString("es-MX")}.00`}
              </p>
            </div>
          </div>
        </div>

        {/* dropzone real */}
        <label
          className="flex cursor-pointer items-center gap-3 border-t border-dashed border-outline-variant/40 bg-surface-container-low/60 px-5 py-3 transition-colors hover:bg-primary/5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onFile(e.dataTransfer.files?.[0]);
          }}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {imageUrl ? <Camera className="size-4" /> : <Upload className="size-4" />}
          </span>
          <span className="text-label-sm text-on-surface-variant">
            <b className="text-on-surface">Prueba con tu ticket</b> — arrástralo o
            tócalo aquí
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? undefined)}
          />
        </label>
      </div>
    </div>
  );
}
