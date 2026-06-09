import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

// Configura Convex para validar los JWT emitidos por Better Auth (Custom JWT).
export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
