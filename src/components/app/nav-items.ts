import {
  LayoutDashboard,
  ReceiptText,
  Tags,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Panel", href: "/app", icon: LayoutDashboard, exact: true },
  { label: "Tickets", href: "/app/tickets", icon: ReceiptText },
  { label: "Categorías", href: "/app/categorias", icon: Tags },
  { label: "Informes", href: "/app/informes", icon: BarChart3 },
  { label: "Ajustes", href: "/app/ajustes", icon: Settings },
];

export function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
