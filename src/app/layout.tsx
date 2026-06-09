import type { Metadata } from "next";
import { Inter, Inter_Tight, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ScrollFX } from "@/components/landing/scroll-fx";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { getToken } from "@/lib/auth-server";

// Inter — cuerpo / etiquetas
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Inter Tight — titulares / display (tipografía de Open Design)
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Playfair Display — acentos en cursiva serif
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  display: "swap",
});

// JetBrains Mono — detalles técnicos
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tikea | Inteligencia para tus gastos del día a día",
  description:
    "Fotografía tus tickets y facturas de lujo y deja que la IA extraiga el monto, la fecha, el proveedor y la categoría. Visualiza todos tus gastos en un dashboard elegante.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Token de Convex de la sesión actual (o undefined si no hay sesión). Se pasa
  // al provider para que el cliente de Convex quede autenticado desde el primer
  // render y las queries (`useQuery`) resuelvan sin quedarse en "cargando".
  const initialToken = await getToken();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${interTight.variable} ${playfair.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="scroll-progress" aria-hidden="true" />
        <ConvexClientProvider initialToken={initialToken}>
          {children}
        </ConvexClientProvider>
        <ScrollFX />
      </body>
    </html>
  );
}
