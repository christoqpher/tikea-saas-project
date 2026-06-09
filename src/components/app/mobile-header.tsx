"use client";

import Link from "next/link";

export function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant/30 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
      <Link
        href="/app"
        className="font-display text-lg font-extrabold tracking-tight text-on-surface"
      >
        Tikea
      </Link>
      <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 font-display text-label-sm font-bold text-primary">
        LX
      </span>
    </header>
  );
}
