"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

/** Logo oficial de Google (4 colores). */
function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function GoogleSignInButton({
  label = "Continuar con Google",
}: {
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    // Redirige a Google; al volver, cae en /app. Si hubo error y no redirige,
    // reactivamos el botón.
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/app",
    });
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-outline-variant/60 bg-surface text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
    >
      <GoogleIcon />
      {loading ? "Conectando…" : label}
    </button>
  );
}
