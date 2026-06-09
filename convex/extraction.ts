import { v, type Infer } from "convex/values";
import { action } from "./_generated/server";
import { authComponent } from "./auth";
import { r2 } from "./files";
import {
  categoryValidator,
  currencyValidator,
  methodValidator,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline de extracción: imagen en R2 → OCR (LlamaParse) → estructura (OpenAI).
// Se ejecuta como `action` porque hace llamadas HTTP a servicios externos.
// ─────────────────────────────────────────────────────────────────────────────

const LLAMA_BASE = "https://api.cloud.llamaindex.ai/api/v1/parsing";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// Pausa cooperativa (el runtime de Convex permite setTimeout dentro de actions).
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** OCR con LlamaParse: sube los bytes, espera el job y devuelve el markdown. */
async function runLlamaParse(bytes: Blob): Promise<string> {
  const apiKey = process.env.LLAMA_CLOUD_API_KEY;
  if (!apiKey) throw new Error("Falta LLAMA_CLOUD_API_KEY en el deployment de Convex");

  const form = new FormData();
  form.append("file", bytes, "ticket");

  const uploadRes = await fetch(`${LLAMA_BASE}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!uploadRes.ok) {
    throw new Error(`LlamaParse upload falló (${uploadRes.status}): ${await uploadRes.text()}`);
  }
  const { id: jobId } = (await uploadRes.json()) as { id: string };

  // Poll del estado del job (máx ~60s).
  for (let i = 0; i < 30; i++) {
    await sleep(2000);
    const statusRes = await fetch(`${LLAMA_BASE}/job/${jobId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) continue;
    const { status } = (await statusRes.json()) as { status: string };
    if (status === "SUCCESS") break;
    if (status === "ERROR" || status === "CANCELED") {
      throw new Error(`LlamaParse no pudo procesar la imagen (${status})`);
    }
    if (i === 29) throw new Error("LlamaParse tardó demasiado en responder");
  }

  const resultRes = await fetch(`${LLAMA_BASE}/job/${jobId}/result/markdown`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!resultRes.ok) {
    throw new Error(`LlamaParse result falló (${resultRes.status}): ${await resultRes.text()}`);
  }
  const { markdown } = (await resultRes.json()) as { markdown: string };
  return markdown ?? "";
}

// Esquema JSON estricto que OpenAI debe devolver. Refleja los enums del dominio.
const EXTRACTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["vendor", "date", "category", "amount", "currency", "tax", "method", "note"],
  properties: {
    vendor: { type: "string", description: "Nombre del comercio o proveedor" },
    date: { type: "string", description: "Fecha de la compra en formato ISO YYYY-MM-DD" },
    category: {
      type: "string",
      enum: ["joyeria", "moda", "gastronomia", "viajes", "relojeria", "arte", "hospitalidad"],
      description:
        "Categoría de lujo más adecuada: joyeria, moda, gastronomia, viajes, relojeria, arte u hospitalidad",
    },
    amount: { type: "number", description: "Importe TOTAL pagado, impuestos incluidos" },
    currency: { type: "string", enum: ["EUR", "MXN", "USD", "GBP"] },
    tax: { type: "number", description: "Importe de IVA/impuesto incluido en el total (0 si no consta)" },
    method: { type: "string", enum: ["Tarjeta", "Efectivo", "Transferencia", "Bizum"] },
    note: { type: "string", description: "Nota breve opcional; cadena vacía si no aplica" },
  },
} as const;

interface Draft {
  vendor: string;
  date: string;
  category: Infer<typeof categoryValidator>;
  amount: number;
  currency: Infer<typeof currencyValidator>;
  tax: number;
  method: Infer<typeof methodValidator>;
  note: string;
}

/** Estructura el texto OCR en campos de ticket usando OpenAI (salida JSON estricta). */
async function runOpenAI(markdown: string): Promise<Draft> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Falta OPENAI_API_KEY en el deployment de Convex");
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente que extrae datos estructurados de tickets y facturas. " +
            "Devuelves SIEMPRE el importe total con impuestos en `amount`. " +
            "Si un dato no aparece, usa un valor razonable por defecto (tax=0, note=\"\", " +
            "method=\"Tarjeta\"). La fecha debe ir en formato YYYY-MM-DD.",
        },
        {
          role: "user",
          content: `Extrae los datos de este ticket (en markdown):\n\n${markdown}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "ticket", strict: true, schema: EXTRACTION_SCHEMA },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`OpenAI falló (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI no devolvió contenido");
  return JSON.parse(content) as Draft;
}

// Acción pública: recibe la clave de R2 de la imagen recién subida y devuelve el
// borrador extraído. La UI lo muestra para revisión antes de guardar el ticket.
export const processReceipt = action({
  args: { key: v.string() },
  returns: v.object({
    vendor: v.string(),
    date: v.string(),
    category: categoryValidator,
    amount: v.number(),
    currency: currencyValidator,
    tax: v.number(),
    method: methodValidator,
    note: v.string(),
    rawText: v.string(),
  }),
  handler: async (ctx, { key }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) throw new Error("No autenticado");
    // La clave se generó como `<userId>/<uuid>`: impide procesar objetos ajenos.
    if (!key.startsWith(`${user._id}/`)) throw new Error("Acceso denegado al objeto");

    // 1) URL firmada de R2 → 2) descargar bytes de la imagen.
    const url = await r2.getUrl(key, { expiresIn: 60 * 10 });
    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error("No se pudo leer la imagen de R2");
    const blob = await imgRes.blob();

    // 3) OCR con LlamaParse.
    const markdown = await runLlamaParse(blob);

    // 4) Estructurar con OpenAI.
    const draft = await runOpenAI(markdown);

    return { ...draft, rawText: markdown };
  },
});
