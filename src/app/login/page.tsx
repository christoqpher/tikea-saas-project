"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/components/auth/google-button";

const inputCls =
  "h-11 w-full rounded-lg border border-outline-variant/60 bg-surface px-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, ve directo al panel.
  useEffect(() => {
    if (session) router.replace("/app");
  }, [session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "No se pudo iniciar sesión. Revisa tus datos.");
    } else {
      router.push("/app");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-tight text-on-surface"
          >
            Tikea
          </Link>
          <h1 className="mt-6 font-display text-headline-md font-extrabold text-on-surface">
            Bienvenido de nuevo
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Inicia sesión para ver tu panel.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-outline-variant/30 bg-surface p-6"
        >
          <GoogleSignInButton label="Iniciar sesión con Google" />
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-outline-variant/40" />
            <span className="text-label-sm text-on-surface-variant">o</span>
            <span className="h-px flex-1 bg-outline-variant/40" />
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-label-sm text-destructive">
              {error}
            </p>
          )}

          <label className="block space-y-1.5">
            <span className="text-label-sm font-medium text-on-surface-variant">
              Correo electrónico
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-label-sm font-medium text-on-surface-variant">
              Contraseña
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-body-md text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-primary hover:underline">
            Crea una gratis
          </Link>
        </p>
      </div>
    </main>
  );
}
