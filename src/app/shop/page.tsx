"use client";

import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import styles from "./shop.module.css";

export default function Shop() {
  const { products } = useStore();

  return (
    <div className={styles.shopContainer}>
      <h1 className={`${styles.shopTitle} gold-gradient-text animate-fade-up`}>
        Shop Collection
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "3rem", fontSize: "1.1rem" }}>
        Discover our intentional, clinically inspired daily skincare ritual.
      </p>
      
      <div className={styles.grid}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="animate-fade-up" 
            style={{ animationDelay: `${index * 0.1}s`, height: '100%' }}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
