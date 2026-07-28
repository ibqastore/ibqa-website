"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/products";
import UrgencyTimer from "./UrgencyTimer";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <article className={styles.card}>
      {/* Recessed Image Container */}
      <Link href={`/shop/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageBox}>
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <div className={styles.discountBadge}>
              SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className={styles.details}>
        <Link href={`/shop/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        {/* Price Display */}
        <div className={styles.priceContainer}>
          {product.originalPrice ? (
            <span className={styles.originalPrice}>
              Rs. {product.originalPrice.toLocaleString()}
            </span>
          ) : null}
          <span className={styles.currentPrice}>
            Rs. {product.price.toLocaleString()}
          </span>
        </div>

        {/* Urgency Timer */}
        <div className={styles.timerWrapper}>
          <UrgencyTimer compact />
        </div>

        {/* Action Buttons: ADD TO CART & BUY NOW */}
        <div className={styles.buttonGroup}>
          <button 
            type="button" 
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>
          <button 
            type="button" 
            className={styles.buyNowBtn}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
