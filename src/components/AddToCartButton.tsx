"use client";

import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/products";

export default function AddToCartButton({ 
  product, 
  className,
  children = "Add To Cart"
}: { 
  product: Product; 
  className?: string;
  children?: React.ReactNode;
}) {
  const { addToCart } = useStore();

  return (
    <button 
      className={className} 
      style={{
        backgroundColor: "#000000",
        color: "#D4AF37",
        border: "1px solid #D4AF37",
        fontWeight: 700,
        padding: "0.6rem 1.2rem",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
      }}
      onClick={(e) => {
        e.preventDefault(); // In case it's inside a Link
        addToCart(product);
        alert(`${product.name} added to cart!`);
      }}
    >
      {children}
    </button>
  );
}
