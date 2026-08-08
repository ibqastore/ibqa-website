import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambassador Portal | IBQA Skincare",
  description: "Join the IBQA Skincare ambassador program and earn rewards.",
  alternates: {
    canonical: "/ambassador",
  },
};

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
