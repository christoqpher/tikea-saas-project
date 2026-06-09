import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { r2 } from "./files";
import {
  countTicketsThisMonth,
  FREE_MONTHLY_LIMIT,
  planForUser,
} from "./subscriptions";
import {
  categoryValidator,
  currencyValidator,
  methodValidator,
  statusValidator,
} from "./schema";

// Prefijo de error reconocible por el frontend para mostrar el aviso de upgrade.
export const LIMIT_REACHED = "LIMIT_REACHED";

// Campos editables de un ticket (todos los del esquema salvo `userId`, que se
// deriva del usuario autenticado, nunca del cliente).
const ticketFields = {
  vendor: v.string(),
  date: v.string(),
  category: categoryValidator,
  amount: v.number(),
  currency: currencyValidator,
  tax: v.number(),
  method: methodValidator,
  status: statusValidator,
  note: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  // Referencia a la imagen original en R2 y texto OCR (opcionales: un ticket
  // puede crearse a mano sin imagen).
  imageKey: v.optional(v.string()),
  rawText: v.optional(v.string()),
};

// Lista los tickets del usuario autenticado, más recientes primero.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    return ctx.db
      .query("tickets")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Devuelve un ticket por id, sólo si pertenece al usuario autenticado.
export const get = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    const ticket = await ctx.db.get(id);
    if (!ticket || ticket.userId !== user._id) return null;
    return ticket;
  },
});

// Crea un ticket para el usuario autenticado. Aplica el límite mensual del plan
// gratis EN EL SERVIDOR (no confiamos en que el frontend lo respete).
export const create = mutation({
  args: ticketFields,
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    const plan = await planForUser(ctx, user._id);
    if (plan === "free") {
      const used = await countTicketsThisMonth(ctx, user._id);
      if (used >= FREE_MONTHLY_LIMIT) {
        throw new Error(
          `${LIMIT_REACHED}: Alcanzaste el límite de ${FREE_MONTHLY_LIMIT} tickets este mes. Mejora a Pro para tickets ilimitados.`,
        );
      }
    }
    return ctx.db.insert("tickets", { ...args, userId: user._id });
  },
});

// Actualiza campos de un ticket propio (parcial).
export const update = mutation({
  args: {
    id: v.id("tickets"),
    patch: v.object({
      vendor: v.optional(v.string()),
      date: v.optional(v.string()),
      category: v.optional(categoryValidator),
      amount: v.optional(v.number()),
      currency: v.optional(currencyValidator),
      tax: v.optional(v.number()),
      method: v.optional(methodValidator),
      status: v.optional(statusValidator),
      note: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, { id, patch }) => {
    const user = await authComponent.getAuthUser(ctx);
    const ticket = await ctx.db.get(id);
    if (!ticket || ticket.userId !== user._id) {
      throw new Error("Ticket no encontrado");
    }
    await ctx.db.patch(id, patch);
  },
});

// Elimina un ticket propio (y su imagen en R2, si la tiene).
export const remove = mutation({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    const user = await authComponent.getAuthUser(ctx);
    const ticket = await ctx.db.get(id);
    if (!ticket || ticket.userId !== user._id) {
      throw new Error("Ticket no encontrado");
    }
    if (ticket.imageKey) {
      await r2.deleteObject(ctx, ticket.imageKey);
    }
    await ctx.db.delete(id);
  },
});
