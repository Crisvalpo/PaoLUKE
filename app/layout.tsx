import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
//import { ThemeProvider } from "@/components/ui/theme-provider";

// Configuramos la fuente (tipografía) de la tienda
const inter = Inter({ subsets: ["latin"] });

// Información que aparece en las pestañas del navegador y en buscadores
export const metadata: Metadata = {
  title: "PaoLUKE Tienda",
  description: "Disfraces y Ropa Americana de Calidad",
  applicationName: "PaoLUKE",
  keywords: ["Disfraces", "Ropa Americana", "Chile", "Vestuario"],
  authors: [{ name: "PaoLUKE Store" }],
  icons: [
    { rel: "apple-touch-icon", url: "/icon-192.png" },
    { rel: "icon", url: "/icon-192.png" },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Aquí es donde pondremos la navegación, el pie de página, etc. */}
        {children}
      </body>
    </html>
  );
}