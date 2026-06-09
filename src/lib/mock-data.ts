import type {
  Category,
  CategorySlug,
  CategoryTotal,
  Currency,
  MonthlyPoint,
  Ticket,
} from "./types";

/**
 * Helpers de presentación y derivación para los tickets.
 * Los datos reales vienen de Convex (`src/lib/tickets.ts` → `useTickets`); aquí
 * sólo viven el catálogo de categorías/monedas, el formato y los cálculos
 * derivados (totales por categoría, tendencia, KPIs), todos funciones puras que
 * reciben la lista de tickets.
 */

// Paleta Tikea (cálida + neutros) para que el donut/chips combinen con el
// tema oscuro: naranja → ámbar → amarillo → blanco → gris.
export const categories: Category[] = [
  { slug: "joyeria", name: "Joyería", color: "#ff571a" },
  { slug: "moda", name: "Moda", color: "#ff7a4d" },
  { slug: "gastronomia", name: "Gastronomía", color: "#f9c425" },
  { slug: "viajes", name: "Viajes", color: "#ffd166" },
  { slug: "relojeria", name: "Relojería", color: "#ffffff" },
  { slug: "arte", name: "Arte", color: "#b0b0b0" },
  { slug: "hospitalidad", name: "Hospitalidad", color: "#6e6e6e" },
];

const bySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: CategorySlug): Category {
  return bySlug.get(slug) ?? categories[0];
}

/** Monedas soportadas en la app (código + etiqueta para los selectores). */
export const currencies: { code: Currency; label: string }[] = [
  { code: "MXN", label: "MXN — Peso mexicano $" },
  { code: "EUR", label: "EUR — Euro €" },
  { code: "USD", label: "USD — Dólar $" },
  { code: "GBP", label: "GBP — Libra £" },
];

/** Locale de formato por moneda (afecta separadores y posición del símbolo). */
const CURRENCY_LOCALE: Record<Currency, string> = {
  EUR: "es-ES", // 8.450,00 €
  MXN: "es-MX", // $8,450.00
  USD: "en-US", // $8,450.00
  GBP: "en-GB", // £8,450.00
};

/**
 * Formato ÚNICO de moneda para toda la app (Panel, Tickets, Categorías,
 * Informes, panel de revisión). SIEMPRE 2 decimales y separador de miles.
 */
export function formatCurrency(n: number, currency: Currency = "MXN"): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: "always",
  }).format(n);
}

/**
 * Formato compacto para etiquetas con poco espacio (centro del donut, ejes):
 * $8.5k · $1.6k · $420. Mantiene el símbolo de la moneda.
 */
export function formatCompactCurrency(
  n: number,
  currency: Currency = "MXN",
): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Monto a mostrar: "—" mientras la IA procesa o si falló la lectura. */
export function amountLabel(t: Ticket): string {
  if (t.status === "procesando" || t.status === "error") return "—";
  return formatCurrency(t.amount, t.currency);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Clave de mes "YYYY-MM" para una fecha. */
function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function ticketsInMonth(list: Ticket[], month: string): Ticket[] {
  return list.filter((t) => t.date.startsWith(month));
}

export function categoryTotals(list: Ticket[]): CategoryTotal[] {
  const total = list.reduce((s, t) => s + t.amount, 0) || 1;
  const map = new Map<CategorySlug, { total: number; count: number }>();
  for (const t of list) {
    const cur = map.get(t.category) ?? { total: 0, count: 0 };
    cur.total += t.amount;
    cur.count += 1;
    map.set(t.category, cur);
  }
  return categories
    .map((category) => {
      const agg = map.get(category.slug) ?? { total: 0, count: 0 };
      return {
        category,
        total: agg.total,
        count: agg.count,
        pct: Math.round((agg.total / total) * 100),
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

/** Serie de gasto de los últimos `months` meses (para la gráfica de tendencia). */
export function monthlyTrend(list: Ticket[], months = 6): MonthlyPoint[] {
  const now = new Date();
  const points: MonthlyPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(d);
    const total = list
      .filter((t) => t.date.startsWith(key))
      .reduce((s, t) => s + t.amount, 0);
    points.push({ label: d.toLocaleDateString("es-ES", { month: "short" }), total });
  }
  return points;
}

export interface DashboardStats {
  monthTotal: number;
  prevMonthTotal: number;
  changePct: number;
  ticketCount: number;
  topCategory: CategoryTotal | undefined;
}

export function dashboardStats(list: Ticket[]): DashboardStats {
  const now = new Date();
  const curKey = monthKey(now);
  const prevKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const month = ticketsInMonth(list, curKey);
  const prev = ticketsInMonth(list, prevKey);
  const monthTotal = month.reduce((s, t) => s + t.amount, 0);
  const prevMonthTotal = prev.reduce((s, t) => s + t.amount, 0);
  const changePct =
    prevMonthTotal > 0
      ? Math.round(((monthTotal - prevMonthTotal) / prevMonthTotal) * 100)
      : 0;
  return {
    monthTotal,
    prevMonthTotal,
    changePct,
    ticketCount: month.length,
    topCategory: categoryTotals(month)[0],
  };
}
