import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

/**
 * Cliente de Better Auth para el navegador.
 * Sin baseURL: usa el mismo origen de la app (las rutas viven en /api/auth).
 * El plugin `convexClient()` integra la sesión con el ConvexReactClient.
 */
export const authClient = createAuthClient({
  plugins: [convexClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
