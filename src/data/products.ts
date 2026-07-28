export interface ProductReview {
  author: string;
  rating: number; // 1-5
  text: string;
  avatar?: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface BuyMoreTier {
  qty: number;
  discountPercent: number;
  label?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  ingredients: string[];
  howToUse: string;
  descriptionImages?: string[];
  reviews?: ProductReview[];
  faqs?: ProductFaq[];
  buyMoreSaveMore?: BuyMoreTier[];
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Rice Extract Face Wash",
    description: `[badge: 100% Natural] [badge: Gentle Formula] [badge: Paraben Free]

Gentle purifying cleanse infused with **pure rice water extracts** that removes daily impurities while maintaining the skin's natural moisture barrier.

> Key Benefit: Leaves skin visibly softer, brighter, and luminous from the very first wash without stripping essential hydration!

• **Deep Purifying Action**: Gently lifts away dirt, excess sebum, and makeup residue.
• **Skin Barrier Protection**: Enriched with nourishing botanicals to lock in soothing hydration.
• **Instant Radiance Boost**: Promotes a clean, smooth, glass-skin complexion.`,
    price: 1500,
    originalPrice: 2000,
    image: "/images/products/product-facewash.png",
    category: "Cleanser",
    ingredients: ["Rice Extract", "Glycerin", "Aqua (Water)", "Amino Acid Cleansers", "Panthenol"],
    howToUse: `1. Wet your face with lukewarm water to open pores.
2. Squeeze a coin-sized amount of **Rice Extract Face Wash** onto clean palms and lather.
3. Gently massage onto skin in circular motions for 30–60 seconds.
4. Rinse thoroughly and pat dry with a soft towel.`,
    buyMoreSaveMore: [
      { qty: 1, discountPercent: 0, label: "Standard Price" },
      { qty: 2, discountPercent: 10, label: "Most Popular" },
      { qty: 3, discountPercent: 20 }
    ],
    reviews: [
      { author: "Ayesha K.", rating: 5, text: "Bohot acha face wash hai! Meri skin itni soft ho gayi hai. Definitely recommend karti hun!" },
      { author: "Sara M.", rating: 5, text: "Rice extract wala formula really works. My skin glows after every wash. Love it!" },
      { author: "Fatima N.", rating: 4, text: "Gentle on skin, no dryness. Perfect for my sensitive skin type." }
    ],
    faqs: [
      { question: "Can I use this face wash daily?", answer: "Yes! It is designed for twice-daily use — morning and evening. Its gentle amino acid formula ensures no over-stripping." },
      { question: "Is it suitable for sensitive skin?", answer: "Absolutely. It is free from sulfates and parabens, making it safe for sensitive and dry skin types." },
      { question: "How long until I see results?", answer: "Most users notice visibly softer and brighter skin within 1–2 weeks of consistent use." }
    ]
  },
  {
    id: "p2",
    name: "Niacinamide Serum",
    description: `[badge: 10% Niacinamide] [badge: Clinically Tested] [badge: Fast Absorbing]

High-strength brightening & pore-minimizing serum formulated for **radiant, even-toned skin**. Concentrated active formula targets blemishes and refines skin texture.

> Key Benefit: Clinically proven to visibly reduce dark spots, tighten enlarged pores, and balance excess oil in just 7 days!

• **Pore Minimizing**: Dramatically tightens and refines the appearance of enlarged pores.
• **Blemish & Spot Fade**: Fades post-acne marks and stubborn hyperpigmentation.
• **Barrier Strengthening**: Infused with Zinc PCA and Hyaluronic Acid for deep bounce and elasticity.`,
    price: 2500,
    originalPrice: 3200,
    image: "/images/products/product-serum.png",
    category: "Serum",
    ingredients: ["Niacinamide (Vitamin B3)", "Zinc PCA", "Hyaluronic Acid", "Organic Aloe Vera", "Allantoin"],
    howToUse: `1. Cleanse face thoroughly and pat slightly damp.
2. Dispense 2–3 drops of **Niacinamide Serum** onto fingertips.
3. Gently press and smooth over face and neck until fully absorbed.
4. Follow with your favorite moisturizer. Use morning and night for best glow!`,
    buyMoreSaveMore: [
      { qty: 1, discountPercent: 0, label: "Standard Price" },
      { qty: 2, discountPercent: 10, label: "Most Popular" },
      { qty: 3, discountPercent: 20 }
    ],
    reviews: [
      { author: "Hira T.", rating: 5, text: "7 days mein mujhe fark nazar aaya! Dark spots kam ho gaaye. IBQA serum best hai!" },
      { author: "Zainab A.", rating: 5, text: "My pores look so much smaller now. This serum is a game changer for oily skin." },
      { author: "Noor F.", rating: 4, text: "Lightweight and absorbs quickly. No stickiness at all. Really impressed!" }
    ],
    faqs: [
      { question: "Can I use Niacinamide Serum with other products?", answer: "Yes! It pairs perfectly with our Rice Extract Face Wash. Apply serum after cleansing and before moisturizer." },
      { question: "Is 10% Niacinamide safe for beginners?", answer: "We recommend starting with once-daily application to allow your skin to adjust, then move to twice daily." },
      { question: "How soon will I see results?", answer: "Clinical results show visible pore reduction and brighter skin in as little as 7 days of consistent use." }
    ]
  },
  {
    id: "p3",
    name: "Brightening Duo",
    description: `[badge: Best Seller] [badge: Save Rs. 1,000] [badge: Complete Routine]

The ultimate **2-step glass skin routine** combining our best-selling Rice Extract Face Wash and high-potency Niacinamide Serum for maximum synergy.

> 👑 The Golden Glow Routine: Paired together, these two formulas accelerate skin brightening and provide complete barrier defense against daily stressors!

• **Step 1 - Purify & Prepare**: Rice Extract Cleanser leaves skin clean, receptive, and soft.
• **Step 2 - Treat & Illuminate**: Niacinamide Serum penetrates deeply to banish dullness and refine pores.
• **Incredible Value**: Get both premium products together at a special discounted bundle price!`,
    price: 3500,
    originalPrice: 4500,
    image: "/images/products/product-facewash-serum.png",
    category: "Bundle",
    ingredients: ["Rice Extract", "Niacinamide (10%)", "Hyaluronic Acid", "Zinc PCA", "Glycerin"],
    buyMoreSaveMore: [
      { qty: 1, discountPercent: 0, label: "Standard Price" },
      { qty: 2, discountPercent: 10, label: "Most Popular" },
      { qty: 3, discountPercent: 20 }
    ],
    reviews: [
      { author: "Maryam S.", rating: 5, text: "Yeh duo set toh kamaal hai! Dono products milake use kiye toh skin ekdum glowing ho gayi!" },
      { author: "Amna R.", rating: 5, text: "Best value for money. Getting both products together is such a great deal!" },
      { author: "Sana B.", rating: 5, text: "Been using this duo for 3 weeks. My skin has never looked this good. 100% worth it!" }
    ],
    faqs: [
      { question: "What is the correct order to use the Duo?", answer: "Step 1: Cleanse with Rice Extract Face Wash. Step 2: Apply Niacinamide Serum while skin is slightly damp." },
      { question: "Can I use the Duo twice daily?", answer: "Yes, both products are suitable for morning and evening use. The serum pairs perfectly under SPF in the morning." },
      { question: "How long does the Duo supply last?", answer: "With regular twice-daily use, the Face Wash lasts ~2 months and the Serum lasts ~1.5 months." }
    ],
    howToUse: `1. **Morning & Evening Cleansing**: Wash face with the Rice Extract Face Wash for 45 seconds and rinse.
2. **Targeted Serum Treatment**: While skin is slightly damp, apply 3 drops of Niacinamide Serum across cheeks, forehead, and chin.
3. **Daily Glow**: Allow 1 minute to absorb before applying sunscreen or makeup.`
  }
];
