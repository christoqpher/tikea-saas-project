import type { MonthlyPoint } from "@/lib/types";

const W = 300;
const H = 120;
const PAD_X = 10;
const TOP = 12;
const BOTTOM = 108;

/** Etiqueta compacta para el eje Y: $40k · $1,620 · $0. */
function axisLabel(v: number): string {
  if (v >= 1000) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v)}`;
}

export function TrendChart({
  points,
  showAxis = true,
}: {
  points: MonthlyPoint[];
  /** Eje Y con etiquetas ($40k…$0) y líneas guía. Desactívalo para el look
   *  "showcase" de la landing (línea limpia, solo meses). */
  showAxis?: boolean;
}) {
  const max = Math.max(...points.map((p) => p.total), 1);
  const step = (W - PAD_X * 2) / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = PAD_X + i * step;
    const y = BOTTOM - (p.total / max) * (BOTTOM - TOP);
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as const;
  });

  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${coords[coords.length - 1][0]},${H} L${coords[0][0]},${H} Z`;

  // Marcas del eje Y (de arriba hacia abajo).
  const ticks = [1, 2 / 3, 1 / 3, 0].map((f) => ({
    value: max * f,
    y: BOTTOM - f * (BOTTOM - TOP),
  }));

  return (
    <div className="flex gap-2">
      {/* Eje Y (solo en el look detallado) */}
      {showAxis && (
        <div className="relative h-40 w-12 shrink-0">
          {ticks.map((t, i) => (
            <span
              key={i}
              style={{ top: `${(t.y / H) * 100}%` }}
              className="absolute right-0 -translate-y-1/2 text-[10px] tabular-nums text-on-surface-variant"
            >
              {axisLabel(t.value)}
            </span>
          ))}
        </div>
      )}

      {/* Gráfica */}
      <div className="min-w-0 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff571a" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#ff571a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Líneas guía horizontales (solo en el look detallado) */}
          {showAxis &&
            ticks.map((t, i) => (
              <line
                key={i}
                x1="0"
                x2={W}
                y1={t.y}
                y2={t.y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="0.75"
              />
            ))}

          <path d={area} fill="url(#trend-area)" />
          <path
            d={line}
            fill="none"
            stroke="#ff571a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {coords.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#ff571a" />
          ))}
        </svg>
        <div className="mt-1 flex justify-between text-[11px] uppercase tracking-wide text-on-surface-variant">
          {points.map((p) => (
            <span key={p.label}>{p.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
