"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { navItems, isActive } from "./nav-items";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function initials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "U";
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-outline-variant/30 bg-surface-container-lowest lg:flex">
      {/* Marca */}
      <div className="flex h-20 items-center px-6">
        <Link
          href="/app"
          className="font-display text-xl font-extrabold tracking-tight text-on-surface"
        >
          Tikea
        </Link>
      </div>

      {/* Botón subir */}
      <div className="px-4">
        <Link
          href="/app/subir"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.02] active:scale-95"
        >
          <Plus className="size-4" />
          Subir ticket
        </Link>
      </div>

      {/* Navegación */}
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = isActive(pathname, item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
              )}
            >
              <item.icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Cuenta */}
      <div className="border-t border-outline-variant/30 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-label-md font-bold text-primary">
            {initials(user?.name, user?.email)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-md font-semibold text-on-surface">
              {user?.name ?? "Mi cuenta"}
            </p>
            <p className="truncate text-label-sm text-on-surface-variant">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-label-md font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <LogOut className="size-5" strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
