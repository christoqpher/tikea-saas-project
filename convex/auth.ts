import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

// URL pública del frontend (Next). Se define en las env vars del deployment Convex
// con `npx convex env set SITE_URL http://localhost:3000`.
const siteUrl = process.env.SITE_URL!;

// Cliente del componente Better Auth. Es la autoridad de autenticación de la app:
// la base de datos de auth vive en Convex (ya no en SQLite).
export const authComponent = createClient<DataModel>(components.betterAuth);

// Instancia de Better Auth que corre DENTRO de Convex, usando el adaptador de Convex
// como base de datos. Se reconstruye por petición a partir del `ctx`.
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  // Credenciales de Google (env vars del deployment de Convex, no de Next).
  // Si no están configuradas, el provider simplemente no se activa.
  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders:
      googleId && googleSecret
        ? { google: { clientId: googleId, clientSecret: googleSecret } }
        : undefined,
    plugins: [convex({ authConfig })],
  });
};

// Query de conveniencia: devuelve el usuario autenticado actual (o null).
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});
