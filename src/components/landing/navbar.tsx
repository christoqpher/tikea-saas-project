import Link from "next/link";

const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Producto", href: "#producto" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 h-20 w-full border-b border-outline-variant/30 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-tight text-on-surface"
        >
          Tikea
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-label-md font-medium text-on-surface-variant transition-colors duration-300 hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#precios"
            className="border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary sm:px-5 sm:py-2.5"
          >
            Precios
          </a>
          <a
            href="/login"
            className="hidden text-label-md font-medium text-on-surface-variant transition-colors hover:text-primary sm:inline"
          >
            Iniciar sesión
          </a>
          <a
            href="/registro"
            className="bg-primary px-5 py-2.5 text-label-md font-bold text-on-primary-fixed transition-all hover:scale-[1.03] active:scale-95"
          >
            Prueba gratis
          </a>
        </div>
      </div>
    </nav>
  );
}
