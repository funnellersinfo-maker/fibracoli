import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fibracoli.pages.dev"),
  title: "ColiPlus | Colon Limpio · Sistema Digestivo Óptimo",
  description:
    "Suplemento natural con Noni, Linaza y Espirulina. Desintoxica tu colon, reduce inflamación y recupera tu energía. Paga 2 Lleva 3 por $151.800 COP. Envío gratis a toda Colombia.",
  keywords: [
    "ColiPlus",
    "colon limpio",
    "noni",
    "linaza",
    "espirulina",
    "suplemento natural",
    "desintoxicación",
    "bienestar",
    "Colombia",
    "inflamación",
    "digestión",
  ],
  authors: [{ name: "ColiPlus" }],
  openGraph: {
    title: "ColiPlus | Colon Limpio · Sistema Digestivo Óptimo",
    description:
      "Suplemento natural con Noni, Linaza y Espirulina. Desintoxica tu colon, reduce inflamación y recupera tu energía. Paga 2 Lleva 3.",
    type: "website",
    url: "https://fibracoli.pages.dev",
    images: [
      {
        url: "/coliplus.webp",
        width: 400,
        height: 400,
        alt: "ColiPlus - Suplemento natural para colon limpio",
      },
    ],
  },
  icons: {
    icon: "/coliplus.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://fibracoli.pages.dev" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
