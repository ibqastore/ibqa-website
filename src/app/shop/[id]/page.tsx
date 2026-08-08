import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import styles from "./product.module.css";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const images = (product.images || []).map(img => `https://ibqastore.com${img}`);

  return {
    title: `${product.name} | IBQA Skincare`,
    description: product.description.replace(/\[badge:.*?\]/g, '').trim().substring(0, 160),
    alternates: {
      canonical: `/shop/${product.id}`,
    },
    openGraph: {
      title: product.name,
      description: product.description.replace(/\[badge:.*?\]/g, '').trim().substring(0, 160),
      images: images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description.replace(/\[badge:.*?\]/g, '').trim().substring(0, 160),
      images: images,
    },
  };
}
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": (product.images || []).map(img => `https://ibqastore.com${img}`),
    "description": product.description.replace(/\[badge:.*?\]/g, '').trim(),
    "brand": {
      "@type": "Brand",
      "name": "IBQA"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://ibqastore.com/shop/${product.id}`,
      "priceCurrency": "PKR",
      "price": product.price.toString(),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ibqastore.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://ibqastore.com/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://ibqastore.com/shop/${product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient id={id} fallbackProduct={product} />
    </>
  );
}

// Generate static params for our mock data
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
