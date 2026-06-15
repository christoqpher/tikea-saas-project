import { ArrowUpRight, TrendingUp } from "lucide-react";

const kpis = [
  { label: "Total · junio", value: "$8,540", sub: "+12% vs. mayo", up: true },
  { label: "Tickets", value: "37", sub: "100% categorizados" },
  { label: "Categoría top", value: "Supermercado", sub: "34% del gasto" },
  { label: "Ahorro detectado", value: "$420", sub: "2 suscripciones" },
];

const categories = [
  { label: "Supermercado", pct: 34, color: "#ff571a" },
  { label: "Restaurantes", pct: 24, color: "#f9c425" },
  { label: "Transporte", pct: 18, color: "#ffffff" },
  { label: "Ropa", pct: 14, color: "#999999" },
];

const transactions = [
  { name: "Soriana", cat: "Supermercado", amount: "$842.30" },
  { name: "Uber", cat: "Transporte", amount: "$124.00" },
  { name: "Zara", cat: "Ropa", amount: "$399.00" },
  { name: "Netflix", cat: "Suscripciones", amount: "$219.00" },
];

export function DashboardShowcase() {
  return (
    <section id="producto" className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
      <div className="mb-12 max-w-2xl space-y-4" data-reveal>
        <p className="text-label-md font-semibold uppercase tracking-widest text-primary">
          El producto
        </p>
        <h2 className="font-display text-headline-md font-bold text-on-surface md:text-4xl">
          Tu dinero, por fin{" "}
          <span className="italic text-primary">claro</span>
        </h2>
        <p className="text-body-lg text-on-surface-variant">
          Cada ticket que subes alimenta un dashboard vivo. Ve a dónde va tu
          dinero, detecta fugas y decide con datos —no con corazonadas.
        </p>
      </div>

      {/* Panel tipo app */}
      <div
        className="overflow-hidden rounded-[24px] border border-outline-variant/30 shadow-2xl glass"
        data-reveal="scale"
      >
        {/* barra de ventana */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-highest/50 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary/70" />
            <span className="size-3 rounded-full bg-accent/70" />
            <span className="size-3 rounded-full bg-outline/50" />
          </div>
          <span className="text-label-sm font-semibold text-on-surface-variant">
            Dashboard · junio 2026
          </span>
          <span className="text-label-sm text-on-surface-variant">MXN $</span>
        </div>

        <div className="grid gap-5 p-5 md:p-7">
          {/* KPIs */}
          <div
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            data-reveal-group
            data-reveal-step="80"
          >
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-2xl border border-outline-variant/30 bg-surface p-5"
                data-reveal
              >
                <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
                  {k.label}
                </p>
                <p className="mt-2 font-display text-2xl font-extrabold text-on-surface">
                  {k.value}
                </p>
                <p
                  className={`mt-1 inline-flex items-center gap-1 text-label-sm ${
                    k.up ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {k.up && <TrendingUp className="size-3.5" />}
                  {k.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Gráficas */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Donut categorías */}
            <div
              className="rounded-2xl border border-outline-variant/30 bg-surface p-5 md:p-6"
              data-reveal
            >
              <p className="mb-5 text-label-md font-semibold text-on-surface">
                Gasto por categoría
              </p>
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
                <div
                  className="relative size-32 shrink-0 rounded-full sm:size-36"
                  style={{
                    background:
                      "conic-gradient(#ff571a 0% 34%, #f9c425 34% 58%, #ffffff 58% 76%, #999999 76% 90%, #2e2e2e 90% 100%)",
                  }}
                >
                  <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-surface text-center">
                    <span className="font-display text-xl font-extrabold text-on-surface">
                      $8.5k
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-on-surface-variant">
                      total
                    </span>
                  </div>
                </div>
                <ul className="w-full space-y-2.5 sm:flex-1">
                  {categories.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-center justify-between text-label-md"
                    >
                      <span className="inline-flex items-center gap-2 text-on-surface">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: c.color }}
                        />
                        {c.label}
                      </span>
                      <span className="font-semibold tabular-nums text-on-surface-variant">
                        {c.pct}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tendencia mensual */}
            <div
              className="rounded-2xl border border-outline-variant/30 bg-surface p-5 md:p-6"
              data-reveal
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-label-md font-semibold text-on-surface">
                  Tendencia mensual
                </p>
                <span className="inline-flex items-center gap-1 text-label-sm text-primary">
                  <TrendingUp className="size-3.5" /> +18% en 6 meses
                </span>
              </div>
              <svg viewBox="0 0 300 120" className="h-36 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff571a" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ff571a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M10,69 L66,63 L122,71 L178,54 L234,50 L290,28 L290,110 L10,110 Z"
                  fill="url(#area)"
                />
                <path
                  className="chart-line"
                  d="M10,69 L66,63 L122,71 L178,54 L234,50 L290,28"
                  fill="none"
                  stroke="#ff571a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {[
                  [10, 69],
                  [66, 63],
                  [122, 71],
                  [178, 54],
                  [234, 50],
                  [290, 28],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#ff571a" />
                ))}
              </svg>
              <div className="mt-1 flex justify-between text-[11px] uppercase tracking-wide text-on-surface-variant">
                {["ene", "feb", "mar", "abr", "may", "jun"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Transacciones recientes */}
          <div
            className="rounded-2xl border border-outline-variant/30 bg-surface p-5 md:p-6"
            data-reveal
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-label-md font-semibold text-on-surface">
                Tickets recientes
              </p>
              <a
                href="#precios"
                className="inline-flex items-center gap-1 text-label-sm font-semibold text-primary hover:underline"
              >
                Ver todos <ArrowUpRight className="size-3.5" />
              </a>
            </div>
            <ul className="divide-y divide-outline-variant/20">
              {transactions.map((t) => (
                <li key={t.name} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-display text-label-md font-bold text-primary">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-label-md font-semibold text-on-surface">
                        {t.name}
                      </span>
                      <span className="block text-label-sm text-on-surface-variant">
                        {t.cat}
                      </span>
                    </span>
                  </span>
                  <span className="font-display font-bold tabular-nums text-on-surface">
                    {t.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
