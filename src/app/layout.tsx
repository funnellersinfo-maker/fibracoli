import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ColiPlus | Colon Limpio · Sistema Digestivo Óptimo",
  description: "Suplemento de bienestar natural con Noni, Linaza y Espirulina. Desintoxica tu colon, reduce inflamación y recupera tu energía. Paga 2 Lleva 3 por $151.800 COP.",
  keywords: ["ColiPlus", "colon limpio", "noni", "linaza", "espirulina", "suplemento natural", "desintoxicación", "bienestar", "Colombia"],
  authors: [{ name: "ColiPlus" }],
  openGraph: {
    title: "ColiPlus | Colon Limpio · Sistema Digestivo Óptimo",
    description: "Suplemento de bienestar natural con Noni, Linaza y Espirulina. Paga 2 Lleva 3.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
