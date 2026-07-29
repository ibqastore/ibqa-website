"use client";

import { useStore } from "@/context/StoreContext";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RichText from "@/components/RichText";

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const { siteContent } = useStore();
  
  const validPolicies = ["refund", "shipping", "privacy", "terms"];
  
  if (!validPolicies.includes(params.slug)) {
    return notFound();
  }

  const titleMap: Record<string, string> = {
    refund: "Refund & Exchange Policy",
    shipping: "Shipping Policy",
    privacy: "Privacy Policy",
    terms: "Terms of Service"
  };

  const title = titleMap[params.slug];
  const content = siteContent.policies[params.slug as keyof typeof siteContent.policies];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 className="gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          {title}
        </h1>
        
        <div style={{ background: '#fcfcfc', border: '1px solid #eee', padding: '2rem', borderRadius: '12px', lineHeight: '1.6' }}>
          <RichText text={content} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
