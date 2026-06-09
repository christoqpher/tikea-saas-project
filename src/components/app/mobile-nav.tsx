"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ReceiptText, Tags, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Panel", href: "/app", icon: LayoutDashboard, exact: true },
  { label: "Tickets", href: "/app/tickets", icon: ReceiptText },
  { label: "Categorías", href: "/app/categorias", icon: Tags },
  { label: "Ajustes", href: "/app/ajustes", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-outline-variant/30 bg-background/90 backdrop-blur-xl lg:hidden">
      {tabs.slice(0, 2).map((t) => (
        <Tab key={t.href} {...t} active={active(t.href, t.exact)} />
      ))}

      <Link
        href="/app/subir"
        aria-label="Subir ticket"
        className="-mt-6 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary-fixed shadow-lg shadow-primary/30 transition-transform active:scale-95"
      >
        <Plus className="size-6" />
      </Link>

      {tabs.slice(2).map((t) => (
        <Tab key={t.href} {...t} active={active(t.href, t.exact)} />
      ))}
    </nav>
  );
}

function Tab({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-16 flex-col items-center gap-1 text-[10px] font-medium transition-colors",
        active ? "text-primary" : "text-on-surface-variant",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
      {label}
    </Link>
  );
}
