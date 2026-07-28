"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, products as defaultProducts } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
}

export interface Discount {
  code: string;
  percentage: number;
  productIds: string[];
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface HeroSlide {
  id: string;
  pc: string;
  mobile: string;
  title?: string;
}

export interface PaymentInfo {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  whatsapp: string;
}

export interface SiteContent {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  announcement: string;
  heroSlides: HeroSlide[];
  storyImage: string;
  beforeImage: string;
  afterImage: string;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentInfo: PaymentInfo;
}

const defaultSiteContent: SiteContent = {
  heroEyebrow: "Simple rituals. Radiant skin.",
  heroTitle: "Skincare that lets your natural glow lead.",
  heroDescription: "Intentional formulas for your softest, healthiest-looking skin—every single day.",
  announcement: "Free delivery on orders over Rs. 3,000",
  heroSlides: [
    { id: "slide-1", pc: "/images/hero/facewash-hero-pc.PNG", mobile: "/images/hero/facewash-hero-mobile.PNG", title: "Rice Extract Face Wash" },
    { id: "slide-2", pc: "/images/hero/serum-facewash-pc.PNG", mobile: "/images/hero/facewash-serum-hero-mobile.PNG", title: "Brightening Duo" },
    { id: "slide-3", pc: "/images/hero/serum-hero-pc.PNG", mobile: "/images/hero/serum-hero-mobile.PNG", title: "Niacinamide Serum" }
  ],
  storyImage: "/images/Lifestyle/luxury-bathroom.PNG",
  beforeImage: "/images/before-after/before.PNG",
  afterImage: "/images/before-after/after.PNG",
  shippingFee: 200,
  freeShippingThreshold: 3000,
  paymentInfo: {
    bankName: "Your Bank Name",
    accountTitle: "Your Account Title",
    accountNumber: "0000-0000-0000",
    whatsapp: "03000000000"
  }
};

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([
    { code: "WELCOME10", percentage: 10, productIds: [], startsAt: "", endsAt: "", active: true }
  ]);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('ibqa_products');
    const savedCart = localStorage.getItem('ibqa_cart');
    const savedDiscounts = localStorage.getItem('ibqa_discounts');
    const savedContent = localStorage.getItem('ibqa_site_content');
    const savedRecent = localStorage.getItem('ibqa_recently_viewed');

    // The provider intentionally hydrates persisted browser-only demo state after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setSiteContent({ ...defaultSiteContent, ...parsed, paymentInfo: { ...defaultSiteContent.paymentInfo, ...(parsed.paymentInfo || {}) } });
      } catch (e) {
        console.error("Error loading site content:", e);
      }
    }
    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('ibqa_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ibqa_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ibqa_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => { localStorage.setItem('ibqa_site_content', JSON.stringify(siteContent)); }, [siteContent]);

  useEffect(() => {
    localStorage.setItem('ibqa_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 5);
    });
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      discounts, setDiscounts, siteContent, setSiteContent,
      recentlyViewed, addToRecentlyViewed
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
