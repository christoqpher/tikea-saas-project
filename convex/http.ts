import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { webhook as stripeWebhook } from "./stripe";

// Registra las rutas HTTP de Better Auth (token, jwks, openid-config…) en el
// deployment de Convex (dominio `.convex.site`).
const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Webhook de Stripe: Stripe hace POST aquí cuando alguien paga/renueva/cancela.
// URL pública: https://<deployment>.convex.site/stripe/webhook
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
