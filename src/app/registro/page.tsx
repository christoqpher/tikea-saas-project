"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, useSession } from "@/lib/auth-client";
import { GoogleSignInButton } from "@/components/auth/google-button";

const inputCls =
  "h-11 w-full rounded-lg border border-outline-variant/60 bg-surface px-3 text-body-md text-on-surface outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30";

export default function RegistroPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.replace("/app");
  }, [session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "No se pudo crear la cuenta.");
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
            Crea tu cuenta
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Gratis para empezar. Sin tarjeta.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-outline-variant/30 bg-surface p-6"
        >
          <GoogleSignInButton label="Registrarme con Google" />
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
              Nombre
            </span>
            <input
              type="text"
              required
              autoComplete="name"
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </label>

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
              autoComplete="new-password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando cuenta…" : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-body-md text-on-surface-variant">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
