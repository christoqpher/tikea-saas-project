import { R2 } from "@convex-dev/r2";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Cliente del componente R2. Lee credenciales de las env vars del deployment de
// Convex: R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_TOKEN.
export const r2 = new R2(components.r2);

// `syncMetadata` (registra en Convex la metadata del objeto ya subido) lo tomamos
// del clientApi generado. `generateUploadUrl` lo definimos a mano más abajo para
// prefijar la clave con el userId.
const clientApi = r2.clientApi<DataModel>({
  checkUpload: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("No autenticado");
  },
});

export const syncMetadata = clientApi.syncMetadata;

// Firma una URL de subida (PUT directo del navegador a R2). La clave se prefija
// con el userId: `<userId>/<uuid>`, lo que aísla los objetos por usuario y permite
// validar la propiedad al leer/borrar sin tener que consultar metadata.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    const key = `${user._id}/${crypto.randomUUID()}`;
    return r2.generateUploadUrl(key);
  },
});

// Devuelve una URL firmada (temporal) para mostrar la imagen de un ticket propio.
export const getTicketImageUrl = query({
  args: { id: v.id("tickets") },
  handler: async (ctx, { id }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;
    const ticket = await ctx.db.get(id);
    if (!ticket || ticket.userId !== user._id || !ticket.imageKey) return null;
    return r2.getUrl(ticket.imageKey, { expiresIn: 60 * 60 }); // 1 hora
  },
});
