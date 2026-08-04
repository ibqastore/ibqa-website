import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

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
  title: "IBQA Skincare | Premium Luxury Skincare",
  description: "Reveal Your Natural Glow. Premium skincare made for healthier, radiant skin.",
  icons: {
    icon: '/images/logo/logo-main.webp',
  }
};

import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <StoreProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
