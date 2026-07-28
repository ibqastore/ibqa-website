"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Discount } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PAKISTAN_CITIES } from "@/data/cities";
import styles from "./checkout.module.css";

export default function Checkout() {
  const { cart, clearCart, discounts, siteContent } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = PAKISTAN_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = siteContent.freeShippingThreshold ?? 3000;
  const shippingFee = siteContent.shippingFee ?? 200;
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.productIds && appliedDiscount.productIds.length > 0) {
      const eligibleSubtotal = cart.reduce((sum, item) => 
        appliedDiscount.productIds.includes(item.id) ? sum + (item.price * item.quantity) : sum
      , 0);
      discountAmount = (eligibleSubtotal * appliedDiscount.percentage) / 100;
    } else {
      discountAmount = (subtotal * appliedDiscount.percentage) / 100;
    }
  }

  const isFreeShipping = subtotal - discountAmount >= freeShippingThreshold;
  const shipping = subtotal > 0 ? (isFreeShipping ? 0 : shippingFee) : 0;
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const validDiscount = discounts.find(d => d.code === promoCode.trim().toUpperCase() && d.active);
    if (!validDiscount) {
      alert("Invalid or inactive promo code.");
      return;
    }
    if (validDiscount.productIds && validDiscount.productIds.length > 0) {
      const hasValidProduct = cart.some(item => validDiscount.productIds.includes(item.id));
      if (!hasValidProduct) {
        alert("This promo code does not apply to any items in your cart.");
        return;
      }
    }
    setAppliedDiscount(validDiscount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    // Simulate order placement
    alert(`Order placed successfully! We will deliver to ${formData.city} soon. Payment will be collected on delivery.`);
    clearCart();
    router.push("/");
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 20px', minHeight: '60vh' }}>
        <h2>Your cart is empty</h2>
        <p>Return to shop to add items.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} animate-fade-up`}>
      <form onSubmit={handleSubmit} className={styles.leftCol}>
        <h1 className={styles.title}>Checkout</h1>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number (WhatsApp)</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Complete Address</label>
            <input required type="text" name="address" value={formData.address} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup} ref={dropdownRef} style={{ position: 'relative' }}>
            <label>City</label>
            <div 
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', background: '#fff', cursor: 'pointer' 
              }}
              onClick={() => setShowCityDropdown(!showCityDropdown)}
            >
              <span>{formData.city || "Select a city"}</span>
              <ChevronDown size={16} color="#888" />
            </div>
            {showCityDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '4px', zIndex: 10, marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <input 
                  type="text" 
                  placeholder="Search city..." 
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '100%', padding: '0.6rem', borderBottom: '1px solid #ddd', borderTop: 'none', borderLeft: 'none', borderRight: 'none', outline: 'none' }}
                />
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredCities.length > 0 ? filteredCities.map(city => (
                    <div 
                      key={city} 
                      onClick={() => { setFormData({ ...formData, city }); setShowCityDropdown(false); setCitySearch(""); }}
                      style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {city}
                    </div>
                  )) : (
                    <div style={{ padding: '0.6rem 0.8rem', color: '#888', cursor: 'default' }}>No city found.</div>
                  )}
                  {citySearch && !filteredCities.some(c => c.toLowerCase() === citySearch.toLowerCase()) && (
                    <div 
                      onClick={() => { setFormData({ ...formData, city: citySearch }); setShowCityDropdown(false); setCitySearch(""); }}
                      style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', color: 'var(--accent-gold)', fontWeight: 'bold' }}
                    >
                      Use "{citySearch}"
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* hidden input for form validation */}
            <input type="hidden" name="city" value={formData.city} required />
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment Method</h2>
          
          {/* Bank Transfer Option */}
          <div style={{ padding: '1.2rem', border: '1px solid var(--accent-gold)', borderRadius: '8px', marginBottom: '1rem', background: '#FFFDF5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
              <input type="radio" checked readOnly style={{ accentColor: '#D4AF37' }} id="cod" />
              <label htmlFor="cod" style={{ fontWeight: 700, fontSize: '1rem' }}>Cash on Delivery (COD)</label>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Pay cash when your order arrives at your doorstep.</p>

            <div style={{ borderTop: '1px dashed #D4AF37', paddingTop: '1rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#000' }}>Or Prepay via Bank Transfer & get priority dispatch:</p>
              {siteContent.paymentInfo?.accountNumber && siteContent.paymentInfo.accountNumber !== '0000-0000-0000' ? (
                <div style={{ background: '#fff', border: '1px solid #e8e2d8', borderRadius: '6px', padding: '0.8rem', fontSize: '0.88rem', lineHeight: 2 }}>
                  <div><strong>Bank:</strong> {siteContent.paymentInfo.bankName}</div>
                  <div><strong>Account Title:</strong> {siteContent.paymentInfo.accountTitle}</div>
                  <div><strong>Account Number:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#000', fontWeight: 700 }}>{siteContent.paymentInfo.accountNumber}</span></div>
                </div>
              ) : (
                <div style={{ background: '#fff8e1', border: '1px solid #D4AF37', borderRadius: '6px', padding: '0.8rem', fontSize: '0.85rem', color: '#7a6700' }}>
                  Bank details not configured yet. Go to Admin → Content to add them.
                </div>
              )}
              {siteContent.paymentInfo?.whatsapp && siteContent.paymentInfo.whatsapp !== '03000000000' && (
                <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#333' }}>
                  After transferring, send the payment screenshot to WhatsApp: <strong style={{ color: '#25D366' }}>+92{siteContent.paymentInfo.whatsapp.replace(/^0/, '')}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn}>Place Order</button>
      </form>

      <div className={styles.rightCol}>
        <div className={styles.section} style={{ position: 'sticky', top: '100px' }}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          
          <div className={styles.orderItems}>
            {cart.map(item => (
              <div key={item.id} className={styles.summaryItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)} 
                disabled={!!appliedDiscount}
                style={{ flexGrow: 1, padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              {appliedDiscount ? (
                <button type="button" onClick={() => { setAppliedDiscount(null); setPromoCode(""); }} style={{ padding: '0 1rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
              ) : (
                <button type="button" onClick={handleApplyPromo} style={{ padding: '0 1rem', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply</button>
              )}
            </div>

            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className={styles.totalRow} style={{ color: '#22c55e' }}>
                <span>Discount ({appliedDiscount?.code})</span>
                <span>- Rs. {discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>Shipping</span>
              <span style={{ color: isFreeShipping ? '#22c55e' : 'inherit' }}>
                {isFreeShipping ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
              </span>
            </div>
            <div className={styles.finalTotal}>
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
