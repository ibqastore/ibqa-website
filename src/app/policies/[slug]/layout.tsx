import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const titleMap: Record<string, string> = {
    refund: "Refund & Exchange Policy | IBQA Skincare",
    shipping: "Shipping Policy | IBQA Skincare",
    privacy: "Privacy Policy | IBQA Skincare",
    terms: "Terms of Service | IBQA Skincare",
  };

  const title = titleMap[slug] || "Policy | IBQA Skincare";

  return {
    title,
    alternates: {
      canonical: `/policies/${slug}`,
    },
  };
}

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
