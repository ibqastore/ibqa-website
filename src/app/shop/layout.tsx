import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Collection | IBQA Skincare",
  description: "Reveal Your Natural Glow. Premium skincare made for healthier, radiant skin.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
