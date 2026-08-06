import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { StoreProvider } from "@/context/StoreContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ibqastore.com'),
  title: "IBQA Skincare | Premium Luxury Skincare",
  description: "Reveal Your Natural Glow. Premium skincare made for healthier, radiant skin.",
  icons: {
    icon: '/images/logo/logo-main.webp',
  },
  openGraph: {
    title: "IBQA Skincare | Premium Luxury Skincare",
    description: "Reveal Your Natural Glow. Premium skincare made for healthier, radiant skin.",
    url: 'https://ibqastore.com',
    siteName: 'IBQA',
    images: [
      {
        url: '/images/logo/logo-main.webp',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IBQA Skincare | Premium Luxury Skincare",
    description: "Reveal Your Natural Glow. Premium skincare made for healthier, radiant skin.",
    images: ['/images/logo/logo-main.webp'],
  },
};

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TWFMYZM35E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TWFMYZM35E');
          `}
        </Script>
      </head>
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <StoreProvider>
          <ClientLayout>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "IBQA",
                  "url": "https://ibqastore.com",
                  "logo": "https://ibqastore.com/images/logo/logo-main.webp",
                  "sameAs": [
                    "https://www.facebook.com/ibqastore",
                    "https://www.instagram.com/ibqastore"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+92-300-0000000",
                    "contactType": "customer service"
                  }
                })
              }}
            />
            {children}
            <Analytics />
          </ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
