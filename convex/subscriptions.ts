import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  query,
  type QueryCtx,
} from "./_generated/server";
import { authComponent } from "./auth";
import { planValidator } from "./schema";

// Límite de tickets al mes para el plan gratis. Pro es ilimitado.
export const FREE_MONTHLY_LIMIT = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Lectura del plan
// ─────────────────────────────────────────────────────────────────────────────

/** Devuelve el registro de suscripción de un usuario (o null si nunca pagó). */
async function subForUser(ctx: QueryCtx, userId: string) {
  return ctx.db
    .query("subscriptions")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

/** Plan efectivo de un usuario: "pro" sólo si tiene una suscripción en plan pro. */
export async function planForUser(
  ctx: QueryCtx,
  userId: string,
): Promise<"free" | "pro"> {
  const sub = await subForUser(ctx, userId);
  return sub?.plan === "pro" ? "pro" : "free";
}

/**
 * Plan + uso del usuario autenticado, para que el frontend desbloquee funciones
 * y muestre el contador "X de 10 tickets este mes".
 */
export const getMyPlan = query({
  args: {},
  returns: v.object({
    plan: planValidator,
    status: v.union(v.string(), v.null()),
    currentPeriodEnd: v.union(v.number(), v.null()),
    usedThisMonth: v.number(),
    monthlyLimit: v.union(v.number(), v.null()), // null = ilimitado
  }),
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return {
        plan: "free" as const,
        status: null,
        currentPeriodEnd: null,
        usedThisMonth: 0,
        monthlyLimit: FREE_MONTHLY_LIMIT,
      };
    }
    const sub = await subForUser(ctx, user._id);
    const plan: "free" | "pro" = sub?.plan === "pro" ? "pro" : "free";
    const usedThisMonth = await countTicketsThisMonth(ctx, user._id);
    return {
      plan,
      status: sub?.status ?? null,
      currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      usedThisMonth,
      monthlyLimit: plan === "pro" ? null : FREE_MONTHLY_LIMIT,
    };
  },
});

/** Cuenta los tickets que el usuario creó dentro del mes en curso (campo `date`). */
export async function countTicketsThisMonth(
  ctx: QueryCtx,
  userId: string,
): Promise<number> {
  // `date` es ISO "YYYY-MM-DD"; el prefijo del mes permite comparar como string.
  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const start = `${monthPrefix}-01`;
  const rows = await ctx.db
    .query("tickets")
    .withIndex("by_user_and_date", (q) =>
      q.eq("userId", userId).gte("date", start),
    )
    .collect();
  // El índice acota por >= inicio de mes; filtramos el fin de mes en memoria.
  return rows.filter((t) => t.date.startsWith(monthPrefix)).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Escritura (sólo interna: la disparan el webhook y la acción de checkout)
// ─────────────────────────────────────────────────────────────────────────────

/** Lee la suscripción de un usuario desde acciones (checkout / portal). */
export const getByUser = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => subForUser(ctx, userId),
});

/**
 * Guarda el Customer de Stripe en cuanto se crea, ANTES de pagar. Así el webhook
 * de renovación/cancelación (que sólo trae el customer) siempre puede mapearlo.
 */
export const attachCustomer = internalMutation({
  args: { userId: v.string(), stripeCustomerId: v.string() },
  handler: async (ctx, { userId, stripeCustomerId }) => {
    const existing = await subForUser(ctx, userId);
    if (existing) {
      await ctx.db.patch(existing._id, { stripeCustomerId });
    } else {
      await ctx.db.insert("subscriptions", {
        userId,
        plan: "free",
        stripeCustomerId,
      });
    }
  },
});

/**
 * `checkout.session.completed`: el usuario pagó. Sabemos el userId (lo metimos en
 * la metadata del checkout), así que activamos Pro directamente por usuario.
 */
export const fulfillCheckout = internalMutation({
  args: {
    userId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await subForUser(ctx, args.userId);
    const patch = {
      plan: "pro" as const,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    };
    if (existing) await ctx.db.patch(existing._id, patch);
    else await ctx.db.insert("subscriptions", { userId: args.userId, ...patch });
  },
});

/**
 * `customer.subscription.updated|deleted`: cambios posteriores (renovación,
 * cancelación, pago fallido). El evento sólo trae el customer, así que mapeamos
 * por `stripeCustomerId`. Pro mientras esté activa/trial; si no, baja a free.
 */
export const syncFromSubscription = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
    plan: planValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_customer", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId),
      )
      .first();
    // Customer desconocido (no creado por nuestro checkout): ignoramos.
    if (!existing) return;
    await ctx.db.patch(existing._id, {
      plan: args.plan,
      stripeSubscriptionId: args.stripeSubscriptionId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    });
  },
});
