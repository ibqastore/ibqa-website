import { notFound } from "next/navigation";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";
import ProductDetailClient from "./ProductDetailClient";
import styles from "./product.module.css";

// In Next.js 13+ App Router, `params` is a promise in the latest versions, 
// but for static routes it's directly accessible depending on the setup. 
// We will treat it as an async component to be safe with Next 15+ patterns.
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient id={id} fallbackProduct={product} />;
}

// Generate static params for our mock data
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}
