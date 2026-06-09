import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

/**
 * Helpers de Better Auth + Convex para el lado servidor de Next.js.
 * - `handler`: maneja las rutas /api/auth/* (proxy hacia Convex).
 * - `isAuthenticated`: comprobación de sesión en Server Components/layouts.
 * - `getToken`/`fetchAuth*`/`preloadAuthQuery`: para leer datos de Convex
 *   autenticados desde el servidor.
 */
export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});
