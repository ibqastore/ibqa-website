"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Product } from "@/data/products";
import RichText from "@/components/RichText";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import styles from "./product.module.css";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ShieldCheck, Truck, FlaskConical, Lock, Star, ChevronLeft, ChevronRight, Check } from "lucide-react";

const INGREDIENT_GLOSSARY: Record<string, string> = {
  "Rice Extract": "Rich in amino acids and antioxidants; naturally brightens and softens rough skin.",
  "Niacinamide (Vitamin B3)": "Visibly minimizes enlarged pores, evens skin tone, and strengthens skin barrier.",
  "Niacinamide": "Visibly minimizes enlarged pores, evens skin tone, and strengthens skin barrier.",
  "Niacinamide (10%)": "High-potency dose to target stubborn dark spots and regulate oil production.",
  "Hyaluronic Acid": "Acts as a moisture magnet, pulling hydration deep into the skin layers for a plump look.",
  "Zinc PCA": "Regulates sebum production and soothes active blemishes without drying.",
  "Glycerin": "A powerhouse humectant that defends against dryness and keeps skin supple.",
  "Aqua (Water)": "Ultra-pure base to ensure gentle delivery of active ingredients.",
  "Organic Aloe Vera": "Instantly calms irritation, reduces redness, and provides refreshing hydration.",
  "Panthenol": "Vitamin B5 derivate that intensely restores skin elasticity and soothes sensitivity."
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={14} fill={i <= rating ? "#D4AF37" : "none"} color={i <= rating ? "#D4AF37" : "#ccc"} />
      ))}
    </div>
  );
}

export default function ProductDetailClient({
  id,
  fallbackProduct
}: {
  id: string;
  fallbackProduct: Product;
}) {
  const { products, addToCart, siteContent, addToRecentlyViewed, recentlyViewed } = useStore();
  const router = useRouter();
  const product = products.find(p => p.id === id) || fallbackProduct;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedTierIdx, setSelectedTierIdx] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState<string>("benefits");
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Build image list
  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  // Buy More Save More tiers
  const tiers = product.buyMoreSaveMore ?? [
    { qty: 1, discountPercent: 0, label: "Standard Price" },
    { qty: 2, discountPercent: 10, label: "Most Popular" },
    { qty: 3, discountPercent: 20 }
  ];
  const selectedTier = tiers[selectedTierIdx];
  const effectivePrice = selectedTier.discountPercent > 0
    ? product.price * (1 - selectedTier.discountPercent / 100)
    : product.price;
  const runningTotal = effectivePrice * selectedTier.qty;

  const freeShippingThreshold = siteContent.freeShippingThreshold ?? 3000;
  const isFreeShipping = runningTotal >= freeShippingThreshold;

  // Recently viewed tracking
  useEffect(() => {
    addToRecentlyViewed(product.id);
  }, [product.id]);

  const recentlyViewedProducts = recentlyViewed
    .filter(rid => rid !== product.id)
    .map(rid => products.find(p => p.id === rid))
    .filter(Boolean) as Product[];

  const youMightAlsoLike = products.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < selectedTier.qty; i++) {
      addToCart(product);
    }
    alert(`${selectedTier.qty}x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < selectedTier.qty; i++) {
      addToCart(product);
    }
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => prev === section ? "" : section);
  };

  return (
    <div className={styles.pageWrapper}>

      {/* ====== TOP PRODUCT SECTION ====== */}
      <div className={styles.topGrid}>

        {/* LEFT: Image Gallery */}
        <div className={styles.imageCol}>
          <div className={styles.mainImageBox}>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className={styles.saleRibbon}>SALE!!</div>
            )}
            <img
              src={allImages[selectedImageIdx]}
              alt={product.name}
              className={styles.mainImage}
            />
            {allImages.length > 1 && (
              <>
                <button className={`${styles.imgNav} ${styles.imgNavLeft}`} onClick={() => setSelectedImageIdx(i => (i - 1 + allImages.length) % allImages.length)}>
                  <ChevronLeft size={20} />
                </button>
                <button className={`${styles.imgNav} ${styles.imgNavRight}`} onClick={() => setSelectedImageIdx(i => (i + 1) % allImages.length)}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnail dots */}
          <div className={styles.thumbnailDots}>
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`${styles.thumbnailDot} ${idx === selectedImageIdx ? styles.thumbnailDotActive : ""}`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className={styles.infoCol}>
          {/* Trust bar */}
          <div className={styles.trustBar}>
            <span>AUTHENTIC</span>
            <span>|</span>
            <span>CASH ON DELIVERY</span>
            <span>|</span>
            <span>24/7 CUSTOMER SUPPORT</span>
          </div>

          {/* Title + Price */}
          <p className={styles.categoryLabel}>{product.category}</p>
          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.priceRow}>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.strikePrice}>Rs. {product.originalPrice.toLocaleString()}</span>
            )}
            <span className={styles.currentPrice}>Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className={styles.saveBadge}>
                SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Buy More Save More */}
          <div className={styles.buyMoreSection}>
            <p className={styles.buyMoreTitle}>Buy More &amp; Save More</p>
            <div className={styles.tierGrid}>
              {tiers.map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTierIdx(idx)}
                  className={`${styles.tierCard} ${idx === selectedTierIdx ? styles.tierCardActive : ""}`}
                >
                  {tier.label && (
                    <span className={styles.tierBadge}>{tier.label}</span>
                  )}
                  {!tier.label && tier.discountPercent > 0 && (
                    <span className={styles.tierBadge}>{tier.discountPercent}% OFF</span>
                  )}
                  <span className={styles.tierQty}>{tier.qty} PCS</span>
                  <span className={styles.tierPrice}>
                    {tier.discountPercent > 0
                      ? `Rs. ${(product.price * (1 - tier.discountPercent / 100)).toFixed(0)}/each`
                      : "Standard Price"}
                  </span>
                  {idx === selectedTierIdx && <Check size={14} className={styles.tierCheck} />}
                </button>
              ))}
            </div>
            <div className={styles.freeShippingBar}>
              <span style={{ color: isFreeShipping ? "#22c55e" : "#888", fontWeight: 600 }}>
                {isFreeShipping ? "✓ Free Shipping Applied!" : `Free Shipping Above Rs. ${freeShippingThreshold.toLocaleString()}`}
              </span>
              <span style={{ fontWeight: 700 }}>Total: Rs. {runningTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button onClick={handleAddToCart} className={styles.addToCartBtn}>Add to Cart</button>
            <button onClick={handleBuyNow} className={styles.buyNowBtn}>Buy Now</button>
          </div>

          {/* Trust Icons Strip */}
          <div className={styles.trustIcons}>
            <div className={styles.trustIcon}><ShieldCheck size={22} /><span>7 Days Warranty</span></div>
            <div className={styles.trustIcon}><Truck size={22} /><span>Free Shipping</span></div>
            <div className={styles.trustIcon}><FlaskConical size={22} /><span>Dermatologically tested</span></div>
            <div className={styles.trustIcon}><Lock size={22} /><span>Secure Checkout</span></div>
          </div>
        </div>
      </div>

      {/* ====== DESCRIPTION SECTION ====== */}
      <div className={styles.descriptionSection}>
        <h2 className={styles.sectionHeading}>DESCRIPTION</h2>
        {product.descriptionImages && product.descriptionImages.length > 0 && (
          <div className={styles.descImages}>
            {product.descriptionImages.map((img, i) => (
              <img key={i} src={img} alt={`Product benefit ${i + 1}`} className={styles.descImage} />
            ))}
          </div>
        )}

        {/* Accordion tabs */}
        <div className={styles.accordionGroup}>
          {/* Benefits & Description */}
          <div className={styles.accordionItem}>
            <button onClick={() => toggleAccordion("benefits")} className={styles.accordionBtn}>
              <span>Description & Key Benefits</span>
              {activeAccordion === "benefits" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {activeAccordion === "benefits" && (
              <div className={styles.accordionContent}>
                <RichText text={product.description} />
              </div>
            )}
          </div>

          {/* How To Use */}
          <div className={styles.accordionItem}>
            <button onClick={() => toggleAccordion("howToUse")} className={styles.accordionBtn}>
              <span>Step-by-Step Application Guide</span>
              {activeAccordion === "howToUse" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {activeAccordion === "howToUse" && (
              <div className={styles.accordionContent}>
                <RichText text={product.howToUse} />
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className={styles.accordionItem}>
            <button onClick={() => toggleAccordion("ingredients")} className={styles.accordionBtn}>
              <span>Active Ingredients <small style={{ fontWeight: 400, color: "#888", fontSize: "0.8em" }}>(tap to learn more)</small></span>
              {activeAccordion === "ingredients" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {activeAccordion === "ingredients" && (
              <div className={styles.accordionContent}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {product.ingredients.map((ing, idx) => {
                    const isSelected = selectedIngredient === ing;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIngredient(isSelected ? null : ing)}
                        style={{
                          padding: "6px 14px", borderRadius: "20px",
                          backgroundColor: isSelected ? "#000" : "#FFF9E6",
                          color: isSelected ? "#D4AF37" : "#3D3833",
                          border: `1px solid ${isSelected ? "#000" : "#D4AF37"}`,
                          fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {ing}
                      </button>
                    );
                  })}
                </div>
                {selectedIngredient && (
                  <div style={{ padding: "1rem", backgroundColor: "#FFF9E6", border: "1px solid #D4AF37", borderRadius: "8px" }}>
                    <p style={{ fontWeight: 700, marginBottom: "6px", color: "#000" }}>{selectedIngredient}</p>
                    <p style={{ margin: 0, color: "#4A443E", fontSize: "0.95rem", lineHeight: 1.6 }}>
                      {INGREDIENT_GLOSSARY[selectedIngredient] || "Essential nourishment and skin conditioning agent."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====== REVIEWS SECTION ====== */}
      {product.reviews && product.reviews.length > 0 && (
        <div className={styles.reviewsSection}>
          <h2 className={styles.sectionHeading}>Reviews</h2>
          <div className={styles.reviewsScroll}>
            {product.reviews.map((review, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <div className={styles.reviewAvatar}>{review.author.charAt(0)}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>{review.author}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                {review.videoUrl && (
                  <div style={{ marginBottom: '10px' }}>
                    {(review.videoUrl.includes("youtube.com") || review.videoUrl.includes("youtu.be")) ? (
                      <iframe 
                        width="100%" 
                        height="200" 
                        src={`https://www.youtube.com/embed/${review.videoUrl.includes('v=') ? review.videoUrl.split('v=')[1].split('&')[0] : review.videoUrl.split('.be/')[1].split('?')[0]}`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        style={{ borderRadius: '8px', marginBottom: '10px' }}
                      />
                    ) : (
                      <video width="100%" height="200" controls style={{ borderRadius: '8px', objectFit: 'cover' }}>
                        <source src={review.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}
                <p style={{ fontSize: "0.88rem", color: "#444", lineHeight: 1.6, margin: 0 }}>{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== BEFORE / AFTER SECTION ====== */}
      <div className={styles.faqSection} style={{ padding: '0', background: 'transparent' }}>
        <BeforeAfterSlider 
          beforeImage={siteContent.beforeImage || "/images/before-after/before.webp"} 
          afterImage={siteContent.afterImage || "/images/before-after/after.webp"} 
        />
      </div>

      {/* ====== FAQ SECTION ====== */}
      {product.faqs && product.faqs.length > 0 && (
        <div className={styles.faqSection}>
          <h2 className={styles.sectionHeading}>Discover more in our FAQ</h2>
          <div className={styles.faqList}>
            {product.faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <button
                  onClick={() => setActiveFaqIdx(activeFaqIdx === idx ? null : idx)}
                  className={styles.faqBtn}
                >
                  <span>{faq.question}</span>
                  {activeFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {activeFaqIdx === idx && (
                  <div className={styles.faqAnswer}>{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== YOU MIGHT ALSO LIKE ====== */}
      {youMightAlsoLike.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.sectionHeading}>You Might Also Like</h2>
          <div className={styles.relatedScroll}>
            {youMightAlsoLike.map(p => (
              <div key={p.id} className={styles.relatedCard} onClick={() => router.push(`/shop/${p.id}`)}>
                <div className={styles.relatedImageBox}>
                  <img src={p.image} alt={p.name} className={styles.relatedImage} />
                </div>
                <p className={styles.relatedName}>{p.name}</p>
                <div className={styles.relatedPriceRow}>
                  {p.originalPrice && <span className={styles.relatedOldPrice}>Rs. {p.originalPrice.toLocaleString()}</span>}
                  <span className={styles.relatedNewPrice}>Rs. {p.price.toLocaleString()}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); addToCart(p); router.push("/checkout"); }} className={styles.relatedBuyBtn}>Buy Now</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====== RECENTLY VIEWED ====== */}
      {recentlyViewedProducts.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.sectionHeading}>Recently Viewed</h2>
          <div className={styles.relatedScroll}>
            {recentlyViewedProducts.map(p => (
              <div key={p.id} className={styles.relatedCard} onClick={() => router.push(`/shop/${p.id}`)}>
                <div className={styles.relatedImageBox}>
                  <img src={p.image} alt={p.name} className={styles.relatedImage} />
                </div>
                <p className={styles.relatedName}>{p.name}</p>
                <div className={styles.relatedPriceRow}>
                  {p.originalPrice && <span className={styles.relatedOldPrice}>Rs. {p.originalPrice.toLocaleString()}</span>}
                  <span className={styles.relatedNewPrice}>Rs. {p.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
