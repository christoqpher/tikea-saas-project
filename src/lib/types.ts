export type CategorySlug =
  | "joyeria"
  | "moda"
  | "gastronomia"
  | "viajes"
  | "relojeria"
  | "arte"
  | "hospitalidad";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Color de acento (hex) para chips, donut y leyendas. */
  color: string;
}

export type Currency = "EUR" | "MXN" | "USD" | "GBP";

export type TicketStatus =
  | "verificado"
  | "pendiente"
  | "procesando"
  | "listo"
  | "error";

export type PaymentMethod =
  | "Tarjeta"
  | "Efectivo"
  | "Transferencia"
  | "Bizum";

export interface Ticket {
  id: string;
  vendor: string;
  /** Fecha en formato ISO (YYYY-MM-DD). */
  date: string;
  category: CategorySlug;
  /** Importe total con impuestos, en la divisa indicada. */
  amount: number;
  currency: Currency;
  /** Importe de IVA/impuesto incluido en el total. */
  tax: number;
  method: PaymentMethod;
  status: TicketStatus;
  note?: string;
  tags?: string[];
}

export interface MonthlyPoint {
  /** Etiqueta corta del mes (ene, feb, …). */
  label: string;
  total: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
  /** Porcentaje sobre el gasto total (0–100, redondeado). */
  pct: number;
}
