import Stripe from "stripe";
import { v } from "convex/values";
import { action, httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

// ─────────────────────────────────────────────────────────────────────────────
// Integración con Stripe (suscripción Pro). Corre en el runtime normal de Convex,
// por eso usamos el cliente HTTP basado en `fetch` y, en el webhook, el verificador
// de firma asíncrono con SubtleCrypto (no dependemos de APIs de Node).
//
// Claves (env vars del deployment de Convex, nunca en el código):
//   STRIPE_SECRET_KEY      → clave restringida (rk_…) con permisos mínimos
//   STRIPE_WEBHOOK_SECRET  → secreto de firma del endpoint del webhook (whsec_…)
//   STRIPE_PRICE_PRO       → id del precio recurrente del plan Pro (price_…)
//   SITE_URL               → URL pública del frontend (ya configurada para auth)
// ─────────────────────────────────────────────────────────────────────────────

const API_VERSION = "2026-05-27.dahlia";

/** Cliente de Stripe perezoso: sólo se crea (y exige la clave) al usarse. */
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY en el deployment de Convex");
  return new Stripe(key, {
    apiVersion: API_VERSION,
    httpClient: Stripe.createFetchHttpClient(),
  });
}

/** Fin del periodo actual: en la API nueva vive en los items, no en la suscripción. */
function periodEnd(sub: Stripe.Subscription): number | undefined {
  return sub.items.data[0]?.current_period_end;
}

// ─────────────────────────────────────────────────────────────────────────────
// Acciones llamadas desde el frontend (Convex como API)
// ─────────────────────────────────────────────────────────────────────────────

/** Crea una sesión de Checkout (modo suscripción) y devuelve su URL para redirigir. */
export const createCheckoutSession = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx): Promise<{ url: string }> => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user) throw new Error("No autenticado");

    const priceId = process.env.STRIPE_PRICE_PRO;
    if (!priceId) throw new Error("Falta STRIPE_PRICE_PRO en el deployment de Convex");
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

    const stripe = getStripe();

    // Reutiliza el Customer si el usuario ya lo tiene; si no, lo crea y lo guarda
    // de inmediato (para que el webhook pueda mapear eventos por customer).
    const existing = await ctx.runQuery(internal.subscriptions.getByUser, {
      userId: user._id,
    });
    let customerId = existing?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { userId: user._id },
      });
      customerId = customer.id;
      await ctx.runMutation(internal.subscriptions.attachCustomer, {
        userId: user._id,
        stripeCustomerId: customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user._id,
      // Sin `payment_method_types`: Stripe elige los métodos dinámicamente.
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/app/ajustes?upgrade=success`,
      cancel_url: `${siteUrl}/app/ajustes?upgrade=cancel`,
      metadata: { userId: user._id },
      subscription_data: { metadata: { userId: user._id } },
    });

    if (!session.url) throw new Error("Stripe no devolvió URL de checkout");
    return { url: session.url };
  },
});

/** Sesión del portal de cliente (gestionar/cancelar suscripción, cambiar tarjeta). */
export const createPortalSession = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx): Promise<{ url: string }> => {
    const user = await ctx.runQuery(api.auth.getCurrentUser);
    if (!user) throw new Error("No autenticado");

    const sub = await ctx.runQuery(internal.subscriptions.getByUser, {
      userId: user._id,
    });
    if (!sub?.stripeCustomerId) {
      throw new Error("No tienes una suscripción que gestionar");
    }
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${siteUrl}/app/ajustes`,
    });
    return { url: session.url };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Webhook: Stripe avisa "este usuario pagó / renovó / canceló"
// ─────────────────────────────────────────────────────────────────────────────

export const webhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return new Response("Falta la firma o el secreto del webhook", { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  // Verificación de firma (obligatoria): garantiza que el evento viene de Stripe
  // y no fue manipulado. Usa SubtleCrypto para correr en el runtime de Convex.
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      secret,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "firma inválida";
    return new Response(`Webhook no verificado: ${msg}`, { status: 400 });
  }

  switch (event.type) {
    // Pago inicial completado: activamos Pro por userId (lo pusimos en metadata).
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id ?? session.metadata?.userId;
      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        await ctx.runMutation(internal.subscriptions.fulfillCheckout, {
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: sub.id,
          status: sub.status,
          currentPeriodEnd: periodEnd(sub),
        });
      }
      break;
    }

    // Cambios posteriores: renovación, cancelación, pago fallido. Mapeamos por
    // customer. Pro mientras esté active/trialing; en cualquier otro caso, free.
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const active = sub.status === "active" || sub.status === "trialing";
      await ctx.runMutation(internal.subscriptions.syncFromSubscription, {
        stripeCustomerId: sub.customer as string,
        stripeSubscriptionId: sub.id,
        status: sub.status,
        currentPeriodEnd: periodEnd(sub),
        plan: active ? "pro" : "free",
      });
      break;
    }
  }

  return new Response(null, { status: 200 });
});
