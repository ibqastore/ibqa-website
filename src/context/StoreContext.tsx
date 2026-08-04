"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, products as defaultProducts } from '@/data/products';
import { createClient } from '@/utils/supabase/client';

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
  ourStoryTitle: string;
  ourStoryText: string;
  storyImage: string;
  ingredientsTitle: string;
  ingredientsSubtitle: string;
  resultsTitle: string;
  beforeImage: string;
  afterImage: string;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentInfo: PaymentInfo;
  policies: {
    refund: string;
    shipping: string;
    privacy: string;
    terms: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

const defaultSiteContent: SiteContent = {
  heroEyebrow: "Simple rituals. Radiant skin.",
  heroTitle: "Skincare that lets your natural glow lead.",
  heroDescription: "Intentional formulas for your softest, healthiest-looking skin—every single day.",
  announcement: "Free delivery on orders over Rs. 3,000",
  heroSlides: [
    { id: "slide-1", pc: "/images/hero/facewash-hero-pc.webp", mobile: "/images/hero/facewash-hero-mobile.webp", title: "Rice Extract Face Wash" },
    { id: "slide-2", pc: "/images/hero/serum-facewash-pc.webp", mobile: "/images/hero/facewash-serum-hero-mobile.webp", title: "Brightening Duo" },
    { id: "slide-3", pc: "/images/hero/serum-hero-pc.webp", mobile: "/images/hero/serum-hero-mobile.webp", title: "Niacinamide Serum" }
  ],
  ourStoryTitle: "Every Beautiful Skin Begins With Trust.",
  ourStoryText: "IBQA was created with one simple belief: skincare should protect before it promises.\n\nInspired by Korean skincare philosophy, we craft gentle, effective formulas using carefully selected ingredients that nourish, strengthen, and care for your skin. No unnecessary complexity. No empty claims. Just skincare designed to become part of your everyday ritual.\n\nProtection Before Perfection.\n\nBecause true confidence begins with healthy skin.",
  storyImage: "/images/our-story/ibqa-story-v2.webp",
  ingredientsTitle: "The Science Behind Every Drop",
  ingredientsSubtitle: "Every ingredient is carefully selected for a reason—not because it's trending, but because your skin deserves proven, gentle care inspired by Korean skincare philosophy.",
  resultsTitle: "Real People. Real Results.",
  beforeImage: "/images/hero/before.webp",
  afterImage: "/images/hero/after.webp",
  shippingFee: 200,
  freeShippingThreshold: 3000,
  paymentInfo: {
    bankName: "Your Bank Name",
    accountTitle: "Your Account Title",
    accountNumber: "0000-0000-0000",
    whatsapp: "03000000000"
  },
  contactInfo: {
    phone: "0339-1326074",
    email: "teamibqa@gmail.com",
    address: "Shop#2, fawad plaza, hakimabad, nowshera"
  },
  policies: {
    refund: `**Claim**\nMake a Video When Opening a parcel to Claim any damage or Short Products\n\n**Exchange Policy**\nIBQA Skincare has a 7-day goodwill exchange policy, provided the item is returned to us in time:\n• It is in its original packaging\n• The seal of each product is intact\n• The packaging of the product has not been tampered with\n\n*Please note that items bought during the sale cannot be exchanged or returned unless the product received does not match the product that you have ordered.*\n\n**How You Can Exchange An Item?**\n1. Email us at teamibqa@gmail.com and request an exchange.\n2. Log in the reason for exchanging the item. Make sure to add your order number and the name of the items being exchanged, in the email.\n3. Send the item back to us in its original packaging and seal intact.\n4. We will send your chosen replacement item in exchange to your address.\n5. You will need to pay any applicable shipping charges for the re-shipment.\n\n**Returns Policy**\nIBQA Skincare will fully refund (credit voucher) or replace any goods purchased if they are found to be faulty or damaged. \nIf you change your mind about the products you have ordered and decide you no longer wish to use them, your product(s) purchased can be returned to us for a refund under the following conditions:\n• Products must be unopened and in the original condition\n• Products must be sent back within 7 days from original receipt of goods\n• Your proof of purchase / order information must also be included in the return.\n\n**How You Can Return An Item**\n1. Take a picture of the item/items that are damaged or faulty and need to be returned\n2. Email us at teamibqa@gmail.com to request a return, attach pictures of the product as well.\n3. Log in the reason for exchanging the item. Make sure to add your order number and the name of the items being exchanged, in the email.\n4. Send the item back to us in its original packaging and seal intact to:\n**Attention: Returns Department**\n**Address:** Shop#2, fawad plaza, hakimabad, nowshera\n5. We will send you a coupon of the same amount as your returning item.\n6. You will need to pay any applicable shipping charges for the re-shipment.\n\n**Cancellation**\nIf you want to cancel an order, the sooner you inform us the better! We dispatch most orders within 24 hours so be sure to let us know about cancellations at the earliest. \nCancellations depend on whether your order has been shipped or not. Usually, items are shipped within one business day so it important that you notify us immediately. If you would like to cancel an order, please send an order cancellation request to IBQA Customer Services at teamibqa@gmail.com / call us at 0339-1326074\n*Please note that if your order has been shipped, we will not be able to cancel it.*`,
    
    shipping: `**SHIPPING TERMS**\nWe strive to ensure that your orders reach you as soon as possible. After placing an order, you will instantly receive a confirmation e-mail with details of your order. It will then be our priority to swiftly dispatch your order. Usually, all items are sourced from our warehouse and dispatched within 48 hours (provided it is a business day). However, we will let you know via a phone call or SMS if an item is out of stock, and the soonest it can be dispatched.\n\nIn Pakistan, we offer a standard shipping charge on all orders of Rs 250, no matter how big or small your package is.\n\nFor nationwide delivery, the projected delivery time for all non-Islamabad based orders is 3-5 business days.\n\nFor international deliveries we use DHL, you will need to contact us and we can respond with shipping costs based on your destination.\n\n*Please note that your parcel will only be delivered to the shipping address and not to any alternative address.*`,
    
    privacy: `**Privacy Policy**\n\nIBQA Skincare operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us.\n\n**Personal Information We Collect or Process**\nWhen we use the term "personal information," we are referring to information that identifies or can reasonably be linked to you or another person. We may collect or process the following categories of personal information:\n• Contact details including your name, address, billing address, shipping address, phone number, and email address.\n• Financial information including transaction details and payment confirmation.\n• Account information including your preferences and settings.\n• Transaction information including the items you view, put in your cart, or purchase.\n• Communications with us including the information you include in communications with us.\n• Device information including information about your device, browser, your IP address, and other unique identifiers.\n\n**How We Use Your Personal Information**\n• Provide, Tailor, and Improve the Services. We use your personal information to provide you with the Services, to fulfill your orders, to remember your preferences and items you are interested in, to process purchases, returns, exchanges or other transactions.\n• Marketing and Advertising. We use your personal information for marketing and promotional purposes, such as to send marketing, advertising and promotional communications.\n• Security and Fraud Prevention. We use your personal information to authenticate your account, to provide a secure payment and shopping experience, detect, investigate or take action regarding possible fraudulent activity.\n• Communicating with You. We use your personal information to provide you with customer support.\n• Legal Reasons. We use your personal information to comply with applicable law or respond to valid legal process.\n\n**How We Disclose Personal Information**\nIn certain circumstances, we may disclose your personal information to third parties for legitimate purposes subject to this Privacy Policy. Such circumstances may include:\n• With vendors and other third parties who perform services on our behalf (e.g. IT management, payment processing, data analytics, customer support, shipping).\n• When you direct, request us or otherwise consent to our disclosure of certain information to third parties, such as to ship you products.\n• In connection with a business transaction such as a merger or bankruptcy, to comply with any applicable legal obligations.\n\n**Security and Retention of Your Information**\nPlease be aware that no security measures are perfect or impenetrable, and we cannot guarantee "perfect security." In addition, any information you send to us may not be secure while in transit. We recommend that you do not use unsecure channels to communicate sensitive or confidential information to us.\n\n**Managing Communication Preferences**\nWe may send you promotional emails, and you may opt out of receiving these at any time. If you opt out, we may still send you non-promotional emails, such as those about your account or orders that you have made.\n\n**Contact Us**\nIf you have complaints or questions about how we process your personal information, please contact us at teamibqa@gmail.com or 0339-1326074.`,
    
    terms: `**Terms & Conditions**\n\nWe are committed to safeguarding the privacy of our website visitors; in this policy we explain how we will treat your personal information.\nBy using our website, you accept these terms and conditions in full; accordingly, if you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website.\n\n**Payment Policy**\nWe provide the following modes of business transaction:\n• Cash on delivery service\n• Direct Bank Transfer for specific orders or international orders\n\n**Local & International Orders**\nAll International Shipping Orders shall attract local duties applicable in that country and the customer will have to incur all those duties/charges/fees. The brand is not liable to pay them under any circumstances.\n\n**Products & Services For Personal Use**\nThe products and services described on this website, and any samples thereof we may provide to you, are solely for personal use only. You may not sell or resell any of the products or services, or samples thereof, you receive from us.\n\n**Manufacturing Information**\nAll our products are Made in Pakistan. Our official address for any manufacturing information can be directed to the following address:\n**Name:** IBQA Skincare\n**Address:** Shop#2, fawad plaza, hakimabad, nowshera\n**Helpline:** 0339-1326074\n**Email:** teamibqa@gmail.com\n\n**Intellectual Property**\nAll information and content available on the website and its "look and feel" is the property of IBQA Skincare, our Affiliates, partners or licensors, and is protected by laws of Pakistan, including laws governing all applicable forms of intellectual property.\n\n**Acceptable Use**\nYou must not:\n• Use our website in any way or take any action that causes, or may cause, damage to the website or impairment of the performance, availability or accessibility of the website;\n• Use our website in any way that is unlawful, illegal, fraudulent or harmful.\n\n**Medical, Nutrition & Fitness Information**\n1. You expressly acknowledge and agree that all medical, nutrition and fitness information provided on the website is provided for informational purposes only and is not intended to be and should not be used in place of the advice of your physician or other medical professionals.\n2. Information and statements have not been evaluated by the health authorities and are not intended to diagnose, treat, cure or prevent any disease.\n\n**Representations, Warranties & Limitations Of Liability**\nWe make no representations or warranties of any kind whatsoever, express or implied, in connection with these terms and conditions or the site. You agree that, to the fullest extent permitted by applicable law, we shall not be responsible or liable under any circumstances for any interruption of business, access delays, or system failures. Although enormous efforts are made and precautions taken to render the products absolutely safe for human use, it is possible that certain ingredients may cause allergic reactions to certain individuals. It will be your sole responsibility to take proper precaution or professional dermatological advice before using any of our personal care products.\n\n**Disputes & Jurisdiction**\nThese terms and conditions shall be governed by and construed in accordance with Pakistani law. Any disputes relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Pakistan.`
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
  subscribers: string[];
  addSubscriber: (email: string) => void;
  removeSubscriber: (email: string) => void;
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
  const [subscribers, setSubscribers] = useState<string[]>([]);

  // Load from Supabase & localStorage on mount
  useEffect(() => {
    const supabase = createClient();

    const fetchProductsAndContent = async () => {
      // Fetch Products
      const { data: productsData, error: productsError } = await supabase.from('products').select('*');
      if (productsData && !productsError) {
        const mergedProducts = productsData.map((dbProduct: any) => {
          const original = defaultProducts.find(p => p.id === dbProduct.id) || {};
          return { ...original, ...dbProduct };
        });
        setProducts(mergedProducts as Product[]);
      } else {
        const savedProducts = localStorage.getItem('ibqa_products');
        if (savedProducts) {
          const migrated = savedProducts.replace(/\.png/gi, '.webp').replace(/\.jpeg/gi, '.webp').replace(/\.jpg/gi, '.webp');
          setProducts(JSON.parse(migrated));
        }
      }

      // Fetch Site Content
      const { data: contentData, error: contentError } = await supabase.from('site_content').select('data').eq('id', 1).single();
      if (contentData && !contentError) {
        const data = contentData.data;
        // Fix legacy image path containing spaces which breaks on Vercel
        if (!data.storyImage || data.storyImage === "/images/Our story/ibqa-story-v2.webp" || data.storyImage.includes("luxury-bathroom")) {
          data.storyImage = "/images/our-story/ibqa-story-v2.webp";
        }
        setSiteContent(data);
      } else {
        const savedContent = localStorage.getItem('ibqa_site_content');
        if (savedContent) {
          setSiteContent(JSON.parse(savedContent));
        }
      }
    };

    fetchProductsAndContent();

    const savedCart = localStorage.getItem('ibqa_cart');
    const savedDiscounts = localStorage.getItem('ibqa_discounts');
    const savedRecent = localStorage.getItem('ibqa_recently_viewed');
    const savedSubscribers = localStorage.getItem('ibqa_subscribers');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDiscounts) setDiscounts(JSON.parse(savedDiscounts));

    if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
    if (savedSubscribers) setSubscribers(JSON.parse(savedSubscribers));
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

  useEffect(() => {
    localStorage.setItem('ibqa_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

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
      return [productId, ...filtered].slice(0, 5); // Keep last 5 viewed
    });
  };

  const addSubscriber = (email: string) => {
    setSubscribers(prev => {
      if (prev.includes(email)) return prev;
      return [...prev, email];
    });
  };

  const removeSubscriber = (email: string) => {
    setSubscribers(prev => prev.filter(e => e !== email));
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      discounts, setDiscounts,
      siteContent, setSiteContent,
      recentlyViewed, addToRecentlyViewed,
      subscribers, addSubscriber, removeSubscriber
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
