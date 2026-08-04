"use client";

import { useState, useRef, useEffect } from "react";
import { useStore, Discount } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { ChevronDown, Lock, Loader2 } from "lucide-react";
import { PAKISTAN_CITIES } from "@/data/cities";
import { createClient } from "@/utils/supabase/client";
import styles from "./checkout.module.css";

export default function Checkout() {
  const { cart, clearCart, discounts, siteContent } = useStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Pakistan",
    address: "",
    addressExtension: "",
    postalCode: "",
    city: ""
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    // Check if required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.country) {
      alert("Please fill in all required fields.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    
    // Save to database
    const { data, error } = await supabase.from('orders').insert([
      {
        customer_info: formData,
        order_items: cart,
        subtotal: subtotal,
        discount: discountAmount,
        shipping: shipping,
        total: total,
        payment_method: paymentMethod,
        status: 'pending'
      }
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
      return;
    }

    alert(`Order placed successfully! We will deliver to ${formData.city} soon.`);
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
          <div className={styles.formGroup}>
            <label>Country *</label>
            <select 
              name="country" 
              value={formData.country} 
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              style={{ width: '100%', padding: '1rem', border: (hasSubmitted && !formData.country) ? '1px solid red' : '1px solid #ddd', borderRadius: '8px', background: '#fff', fontSize: '1rem' }}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </select>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} style={{ border: (hasSubmitted && !formData.firstName) ? '1px solid red' : undefined }} />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} style={{ border: (hasSubmitted && !formData.lastName) ? '1px solid red' : undefined }} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Email Address *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ border: (hasSubmitted && !formData.email) ? '1px solid red' : undefined }} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number (WhatsApp) *</label>
              <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={{ border: (hasSubmitted && !formData.phone) ? '1px solid red' : undefined }} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Complete Address *</label>
            <input required type="text" name="address" value={formData.address} onChange={handleInputChange} style={{ border: (hasSubmitted && !formData.address) ? '1px solid red' : undefined }} />
          </div>
          <div className={styles.formGroup}>
            <label>Apartment, suite, etc. (optional)</label>
            <input type="text" name="addressExtension" value={formData.addressExtension} onChange={handleInputChange} />
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup} ref={dropdownRef} style={{ position: 'relative' }}>
              <label>City *</label>
              <div 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '1rem', border: (hasSubmitted && !formData.city) ? '1px solid red' : '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '1rem' 
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
            <div className={styles.formGroup}>
              <label>Postal code (optional)</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Payment Method</h2>
          <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} /> All transactions are secured and encrypted.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* COD Option */}
            <div 
              onClick={() => setPaymentMethod('cod')}
              style={{ padding: '1.2rem', border: paymentMethod === 'cod' ? '2px solid var(--accent-gold)' : '1px solid #ddd', borderRadius: '8px', background: paymentMethod === 'cod' ? '#FFFDF5' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="radio" checked={paymentMethod === 'cod'} readOnly style={{ accentColor: '#D4AF37' }} id="cod" />
                <label style={{ fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Cash on Delivery (COD)</label>
              </div>
              {paymentMethod === 'cod' && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.8rem', marginLeft: '24px' }}>Pay cash when your order arrives at your doorstep.</p>}
            </div>

            {/* Bank Transfer Option */}
            <div 
              onClick={() => setPaymentMethod('bank')}
              style={{ padding: '1.2rem', border: paymentMethod === 'bank' ? '2px solid var(--accent-gold)' : '1px solid #ddd', borderRadius: '8px', background: paymentMethod === 'bank' ? '#FFFDF5' : '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="radio" checked={paymentMethod === 'bank'} readOnly style={{ accentColor: '#D4AF37' }} id="bank" />
                <label style={{ fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Bank Deposit / Transfer</label>
              </div>
              
              {paymentMethod === 'bank' && (
                <div style={{ borderTop: '1px dashed #D4AF37', paddingTop: '1rem', marginTop: '1rem', marginLeft: '24px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem', color: '#000' }}>Prepay via Bank Transfer & get priority dispatch:</p>
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
              )}
            </div>
          </div>
        </div>

        <div className={styles.section} style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--accent-gold)' }}>
          <button 
            type="button" 
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            style={{ width: '100%', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFDF5', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f1f1f' }}>Order Summary</span>
              <ChevronDown size={20} style={{ transform: isSummaryExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} color="#1f1f1f" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1f1f1f' }}>Rs. {total.toLocaleString()}</span>
          </button>
          
          <div style={{ display: isSummaryExpanded ? 'block' : 'none', padding: '1.2rem', borderTop: '1px solid rgba(212, 175, 55, 0.3)' }}>
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

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" size={18} style={{ margin: '0 auto' }} /> : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
