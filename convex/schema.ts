import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Validadores reutilizables que reflejan los tipos de `src/lib/types.ts`
// (fuente de verdad de los enums del dominio). Se reexportan para usarlos en
// los `args` de las mutations de `tickets.ts` sin duplicar literales.
export const categoryValidator = v.union(
  v.literal("joyeria"),
  v.literal("moda"),
  v.literal("gastronomia"),
  v.literal("viajes"),
  v.literal("relojeria"),
  v.literal("arte"),
  v.literal("hospitalidad"),
);

export const currencyValidator = v.union(
  v.literal("EUR"),
  v.literal("MXN"),
  v.literal("USD"),
  v.literal("GBP"),
);

export const methodValidator = v.union(
  v.literal("Tarjeta"),
  v.literal("Efectivo"),
  v.literal("Transferencia"),
  v.literal("Bizum"),
);

export const statusValidator = v.union(
  v.literal("verificado"),
  v.literal("pendiente"),
  v.literal("procesando"),
  v.literal("listo"),
  v.literal("error"),
);

// Plan de suscripción del usuario. "free" por defecto; "pro" tras pagar en Stripe.
export const planValidator = v.union(v.literal("free"), v.literal("pro"));

export default defineSchema({
  // Las tablas de autenticación (user, session, account…) las gestiona el
  // componente Better Auth; aquí sólo definimos las tablas de la app.
  tickets: defineTable({
    // Id del usuario propietario (id del usuario de Better Auth) para el scoping.
    userId: v.string(),
    vendor: v.string(),
    // Fecha en formato ISO (YYYY-MM-DD).
    date: v.string(),
    category: categoryValidator,
    // Importe total con impuestos, en la divisa indicada.
    amount: v.number(),
    currency: currencyValidator,
    // Importe de IVA/impuesto incluido en el total.
    tax: v.number(),
    method: methodValidator,
    status: statusValidator,
    note: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    // Clave del objeto en Cloudflare R2 (imagen original del ticket). La imagen
    // se sirve mediante URLs firmadas; aquí sólo guardamos la referencia.
    imageKey: v.optional(v.string()),
    // Texto en markdown extraído por LlamaParse (OCR), útil para auditoría/búsqueda.
    rawText: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_date", ["userId", "date"]),

  // Estado de suscripción por usuario. Es la fuente de verdad del plan: la
  // actualiza el webhook de Stripe (convex/stripe.ts) cuando alguien paga,
  // renueva o cancela. El frontend la lee para desbloquear funciones Pro.
  subscriptions: defineTable({
    // Usuario propietario (id de Better Auth).
    userId: v.string(),
    plan: planValidator,
    // Id del Customer en Stripe (lo usamos para mapear eventos del webhook que
    // no traen el userId, p. ej. renovaciones/cancelaciones).
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    // Estado crudo de la suscripción en Stripe (active, canceled, past_due…).
    status: v.optional(v.string()),
    // Fin del periodo actual (epoch en segundos), para mostrar la renovación.
    currentPeriodEnd: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_customer", ["stripeCustomerId"]),
});
