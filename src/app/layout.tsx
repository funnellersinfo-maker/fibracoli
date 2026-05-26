import type { Metadata } from "next";
import Script from "next/script";
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
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2087342215159630');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2087342215159630&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
