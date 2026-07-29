"use client";

import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import styles from "./shop.module.css";

const reviews = [
  ["Yaar genuinely telling you, ye facewash meri routine ka best part ban gaya hai. Skin pe itna soft feel hota hai and bilkul tight nahi karta.", "Areeba K. — Beta Tester"],
  ["Niacinamide serum ne mere pores aur dark spots kaafi had tak kam kar diye hain. Glow itna natural hai ab! Highly recommended.", "Maham A. — Beta Tester"],
  ["Minimal, elegant and effective. The duo is now my little evening ritual. I feel like my skin is finally breathing.", "Hiba M. — Beta Tester"],
  ["Shuru m mujhe doubt tha, but one week m hi skin ki texture itni smooth ho gayi. I love how it doesn't strip my skin.", "Zainab R. — Beta Tester"],
  ["Ye duo magic hai! Face wash and serum combination ne skin brightening m kamal kar dia hai. Trust me guys, you need this.", "Sana Q. — Beta Tester"],
  ["Best investment for my skin! Itna gentle hai and glow foran notice hota hai. Beta testing k baad m toh regular customer ban gayi hun.", "Fatima S. — Beta Tester"],
];

import { Star } from "lucide-react";
import pageStyles from "../page.module.css";

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

      <section className={pageStyles.reviews} style={{ marginTop: '5rem', borderRadius: '12px' }}>
        <p className={pageStyles.eyebrow}>Loved in the ritual</p>
        <div className={pageStyles.reviewsContainer}>
          <div className={pageStyles.reviewGrid}>
            {[...reviews, ...reviews].map(([quote, name], i) => (
              <blockquote key={i}>
                <div>{[1, 2, 3, 4, 5].map(star => <Star key={star} size={13} fill="currentColor" />)}</div>
                <p>“{quote}”</p>
                <cite>{name}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
