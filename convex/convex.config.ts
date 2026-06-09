import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import r2 from "@convex-dev/r2/convex.config";

// Registra el componente de Better Auth: éste gestiona internamente las tablas
// de autenticación (user, session, account, verification, jwks…) en Convex.
// Y el componente R2, que guarda metadata de los objetos subidos a Cloudflare R2
// y firma las URLs de subida/lectura.
const app = defineApp();
app.use(betterAuth);
app.use(r2);

export default app;
