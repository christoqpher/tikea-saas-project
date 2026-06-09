import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";
import { Sidebar } from "@/components/app/sidebar";
import { MobileHeader } from "@/components/app/mobile-header";
import { MobileNav } from "@/components/app/mobile-nav";

export const metadata: Metadata = {
  title: "Tikea · Panel",
  description: "Gestiona tus gastos del día a día con claridad.",
};

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Protege toda la app: sin sesión, al login.
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="app-dark min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
