const footerColumns = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Dashboard", href: "#producto" },
      { label: "Precios", href: "#precios" },
      { label: "Seguridad", href: "#" },
    ],
  },
  {
    title: "Compañía",
    links: [
      { label: "Sobre nosotros", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contacto", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Preguntas frecuentes", href: "#faq" },
      { label: "Ayuda", href: "#" },
      { label: "Estado del servicio", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "#" },
      { label: "Términos", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-lowest py-16">
      <div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-6 md:px-10"
        data-reveal-group
        data-reveal-step="80"
      >
        <div className="col-span-2 space-y-4" data-reveal>
          <div className="font-display text-headline-sm font-extrabold text-on-surface">
            Tikea
          </div>
          <p className="max-w-xs text-body-md text-on-surface-variant">
            Inteligencia artificial para tus gastos del día a día. Una foto, y el
            resto lo hacemos nosotros.
          </p>
          <div className="flex gap-3 pt-1 text-label-sm text-on-surface-variant">
            <span className="rounded-full border border-outline-variant/40 px-3 py-1">
              ES
            </span>
            <span className="rounded-full border border-outline-variant/40 px-3 py-1">
              MXN $
            </span>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-4" data-reveal>
            <p className="text-label-md font-semibold text-on-surface">
              {column.title}
            </p>
            <ul className="space-y-2 text-label-sm text-on-surface-variant">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-outline-variant/20 px-6 pt-8 md:flex-row md:px-10">
        <p className="text-label-sm text-on-surface-variant">
          © {new Date().getFullYear()} Tikea. Todos los derechos
          reservados.
        </p>
        <p className="text-label-sm text-on-surface-variant">
          Hecho con cuidado · Privado por diseño
        </p>
      </div>
    </footer>
  );
}
