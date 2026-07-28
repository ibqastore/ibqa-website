"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Product, ProductReview, ProductFaq, BuyMoreTier } from "@/data/products";
import styles from "../admin.module.css";
import RichText from "@/components/RichText";

export default function AdminProducts() {
  const { products, setProducts } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    description: "",
    image: "/images/products/product-facewash.png",
    images: ["/images/products/product-facewash.png"],
    ingredients: [],
    howToUse: "",
    descriptionImages: [],
    reviews: [],
    faqs: [],
    buyMoreSaveMore: [
      { qty: 1, discountPercent: 0, label: "Standard Price" },
      { qty: 2, discountPercent: 10, label: "Most Popular" },
      { qty: 3, discountPercent: 20 }
    ]
  });

  const handleSave = () => {
    if (!formData.name || !formData.price) return;
    
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: formData.name,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || undefined,
        category: formData.category || "Uncategorized",
        description: formData.description || "",
        image: formData.image || formData.images?.[0] || "",
        images: formData.images || (formData.image ? [formData.image] : []),
        ingredients: formData.ingredients || [],
        howToUse: formData.howToUse || ""
      };
      setProducts(prev => [...prev, newProduct]);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", price: 0, originalPrice: 0, category: "", description: "", image: "/images/products/product-facewash.png", images: ["/images/products/product-facewash.png"], ingredients: [], howToUse: "", descriptionImages: [], reviews: [], faqs: [], buyMoreSaveMore: [{ qty: 1, discountPercent: 0, label: "Standard Price" }, { qty: 2, discountPercent: 10, label: "Most Popular" }, { qty: 3, discountPercent: 20 }] });
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image file.");
    if (file.size > 1_500_000) return alert("Please use an image smaller than 1.5 MB for browser storage.");
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => {
        const currentImages = current.images && current.images.length > 0 ? current.images : (current.image ? [current.image] : []);
        const newImages = [...currentImages, String(reader.result)];
        return { ...current, image: newImages[0] || "", images: newImages };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setFormData((current) => {
      const newImages = [...(current.images || [])];
      newImages.splice(index, 1);
      return { ...current, image: newImages[0] || "", images: newImages };
    });
  };

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Manage Products</h1>
        <button 
          className={styles.primaryBtn}
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: "", price: 0, originalPrice: 0, category: "", description: "", image: "/images/products/product-facewash.png", images: ["/images/products/product-facewash.png"], ingredients: [], howToUse: "", descriptionImages: [], reviews: [], faqs: [], buyMoreSaveMore: [{ qty: 1, discountPercent: 0, label: "Standard Price" }, { qty: 2, discountPercent: 10, label: "Most Popular" }, { qty: 3, discountPercent: 20 }] });
          }}
        >
          Add New Product
        </button>
      </div>

      {isAdding && (
        <div className={styles.card} style={{ border: '1px solid var(--accent-gold)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Product Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ddd', color: '#1f1f1f' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Price (Rs.)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ddd', color: '#1f1f1f' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Original / Cut Price (Rs.)</label>
              <input 
                type="number" 
                placeholder="e.g. 2000"
                value={formData.originalPrice || ''}
                onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})}
                style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ddd', color: '#1f1f1f' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ddd', color: '#1f1f1f' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1f1f1f', fontWeight: 'bold' }}>Product Pictures</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#FFF9E6', padding: '1rem', border: '1.5px dashed #D4AF37', borderRadius: '8px', flexWrap: 'wrap' }}>
                {formData.images && formData.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img src={img} alt="Preview" style={{ width: '75px', height: '75px', objectFit: 'contain', background: '#fff', border: '1px solid #D4AF37', borderRadius: '6px', padding: '6px' }} />
                    <button type="button" onClick={() => handleRemoveImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>X</button>
                  </div>
                ))}
                {!formData.images?.length && formData.image && (
                  <div style={{ position: 'relative' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '75px', height: '75px', objectFit: 'contain', background: '#fff', border: '1px solid #D4AF37', borderRadius: '6px', padding: '6px' }} />
                  </div>
                )}
                <div style={{ flexGrow: 1 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#000000', color: '#D4AF37', padding: '0.8rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #D4AF37', transition: 'all 0.3s' }}>
                    🖼️ Add Picture
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
                    Upload multiple pictures. The first one will be the main image.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '2rem', marginBottom: '2rem' }}>
            {/* Interactive Description Editor */}
            <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '10px' }}>
                <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem' }}>Product Description & Benefits (Interactive Rich-Text)</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setFormData({...formData, description: (formData.description || "") + " **Bold Text** "})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ Bold</button>
                  <button type="button" onClick={() => setFormData({...formData, description: (formData.description || "") + " *Italic Text* "})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', fontStyle: 'italic', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ Italic</button>
                  <button type="button" onClick={() => setFormData({...formData, description: (formData.description || "") + "\n• Benefit Point 1\n• Benefit Point 2"})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ • Bullet Points</button>
                  <button type="button" onClick={() => setFormData({...formData, description: (formData.description || "") + "\n> Key Highlight: Clinically proven radiance in 7 days!"})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ Gold Highlight Box</button>
                  <button type="button" onClick={() => setFormData({...formData, description: (formData.description || "") + " [badge: 100% Natural] [badge: Best Seller] "})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ 🏷️ Add Badges</button>
                </div>
              </div>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Type description or click the interactive formatting buttons above..."
                style={{ width: '100%', minHeight: '120px', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', borderRadius: '6px', color: '#1f1f1f', fontFamily: 'monospace', fontSize: '0.95rem' }} 
              />
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFF9E6', border: '1px dashed #D4AF37', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#B8860B', textTransform: 'uppercase', marginBottom: '8px' }}>👁️ Live Page Preview:</div>
                <RichText text={formData.description || "Nothing to preview yet..."} />
              </div>
            </div>

            {/* Ingredients Editor */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem' }}>🌿 Ingredients (Comma Separated — Auto-creates interactive tag chips)</label>
              <input type="text" value={formData.ingredients?.join(', ')} onChange={e => setFormData({...formData, ingredients: e.target.value.split(',').map(x => x.trim()).filter(Boolean)})} placeholder="e.g. Rice Extract, Niacinamide, Glycerin, Hyaluronic Acid" style={{ width: '100%', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', borderRadius: '6px', color: '#1f1f1f', fontSize: '1rem' }} />
            </div>

            {/* Interactive How To Use Editor */}
            <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '10px' }}>
                <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem' }}>💡 Step-by-Step How To Use (Interactive Rich-Text)</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setFormData({...formData, howToUse: (formData.howToUse || "") + " **Bold Step** "})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ Bold</button>
                  <button type="button" onClick={() => setFormData({...formData, howToUse: (formData.howToUse || "") + "\n1. Step One\n2. Step Two\n3. Step Three"})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ 1. Numbered Steps</button>
                  <button type="button" onClick={() => setFormData({...formData, howToUse: (formData.howToUse || "") + "\n• Tip: Use morning and night for best results."})} style={{ padding: '4px 8px', background: '#000', color: '#D4AF37', borderRadius: '4px', border: '1px solid #D4AF37', fontSize: '0.8rem', cursor: 'pointer' }}>+ • Bullet Tip</button>
                </div>
              </div>
              <textarea 
                value={formData.howToUse} 
                onChange={e => setFormData({...formData, howToUse: e.target.value})} 
                placeholder="Enter step-by-step instructions or click formatting buttons above..."
                style={{ width: '100%', minHeight: '100px', padding: '0.8rem', background: '#fff', border: '1px solid #ccc', borderRadius: '6px', color: '#1f1f1f', fontFamily: 'monospace', fontSize: '0.95rem' }} 
              />
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#FFF9E6', border: '1px dashed #D4AF37', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#B8860B', textTransform: 'uppercase', marginBottom: '8px' }}>👁️ Live Instructions Preview:</div>
                <RichText text={formData.howToUse || "Nothing to preview yet..."} />
              </div>
            </div>
          </div>

          {/* Description Images */}
          <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem' }}>
            <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem', display: 'block', marginBottom: '0.8rem' }}>🖼️ Description Images (up to 2 — benefit photos, before/after, infographics)</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
              {(formData.descriptionImages || []).map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt={`Desc img ${idx + 1}`} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #D4AF37' }} />
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, descriptionImages: (prev.descriptionImages || []).filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
              {(formData.descriptionImages || []).length < 2 && (
                <label style={{ width: '90px', height: '90px', border: '2px dashed #D4AF37', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#D4AF37', fontSize: '0.75rem', gap: '4px' }}>
                  <span style={{ fontSize: '1.5rem' }}>+</span>
                  <span>Add Image</span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2_000_000) return alert("Please use an image under 2MB.");
                    const reader = new FileReader();
                    reader.onload = () => setFormData(prev => ({ ...prev, descriptionImages: [...(prev.descriptionImages || []), String(reader.result)] }));
                    reader.readAsDataURL(file);
                  }} />
                </label>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>These images appear above the description on the product page (e.g., ingredient close-up, benefits infographic).</p>
          </div>

          {/* Reviews */}
          <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem' }}>⭐ Product Reviews</label>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, reviews: [...(prev.reviews || []), { author: '', rating: 5, text: '' }] }))} style={{ padding: '4px 12px', background: '#000', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Review</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(formData.reviews || []).map((review, idx) => (
                <div key={idx} style={{ padding: '0.8rem', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', display: 'grid', gridTemplateColumns: '1fr 80px auto', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <input type="text" placeholder="Reviewer Name" value={review.author} onChange={e => { const r = [...(formData.reviews || [])]; r[idx] = { ...r[idx], author: e.target.value }; setFormData(prev => ({ ...prev, reviews: r })); }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }} />
                    <textarea placeholder="Review text..." value={review.text} onChange={e => { const r = [...(formData.reviews || [])]; r[idx] = { ...r[idx], text: e.target.value }; setFormData(prev => ({ ...prev, reviews: r })); }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem', minHeight: '50px', resize: 'vertical' }} />
                  </div>
                  <select value={review.rating} onChange={e => { const r = [...(formData.reviews || [])]; r[idx] = { ...r[idx], rating: Number(e.target.value) }; setFormData(prev => ({ ...prev, reviews: r })); }} style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, reviews: (prev.reviews || []).filter((_, i) => i !== idx) }))} style={{ padding: '0.4rem 0.7rem', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem' }}>❓ Product FAQs</label>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, faqs: [...(prev.faqs || []), { question: '', answer: '' }] }))} style={{ padding: '4px 12px', background: '#000', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Add FAQ</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(formData.faqs || []).map((faq, idx) => (
                <div key={idx} style={{ padding: '0.8rem', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <input type="text" placeholder="Question" value={faq.question} onChange={e => { const f = [...(formData.faqs || [])]; f[idx] = { ...f[idx], question: e.target.value }; setFormData(prev => ({ ...prev, faqs: f })); }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }} />
                    <textarea placeholder="Answer" value={faq.answer} onChange={e => { const f = [...(formData.faqs || [])]; f[idx] = { ...f[idx], answer: e.target.value }; setFormData(prev => ({ ...prev, faqs: f })); }} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem', minHeight: '50px', resize: 'vertical' }} />
                  </div>
                  <button type="button" onClick={() => setFormData(prev => ({ ...prev, faqs: (prev.faqs || []).filter((_, i) => i !== idx) }))} style={{ padding: '0.4rem 0.7rem', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', alignSelf: 'start' }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Buy More Save More Tiers */}
          <div style={{ background: '#fcfcfc', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '1.2rem', marginBottom: '2rem' }}>
            <label style={{ color: '#1f1f1f', fontWeight: 'bold', fontSize: '1.05rem', display: 'block', marginBottom: '0.8rem' }}>📦 Buy More Save More Tiers</label>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              {(formData.buyMoreSaveMore || []).map((tier, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 120px 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>Qty:</div>
                  <input type="number" min={1} value={tier.qty} onChange={e => { const t = [...(formData.buyMoreSaveMore || [])]; t[idx] = { ...t[idx], qty: Number(e.target.value) }; setFormData(prev => ({ ...prev, buyMoreSaveMore: t })); }} style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }} />
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="number" min={0} max={100} value={tier.discountPercent} onChange={e => { const t = [...(formData.buyMoreSaveMore || [])]; t[idx] = { ...t[idx], discountPercent: Number(e.target.value) }; setFormData(prev => ({ ...prev, buyMoreSaveMore: t })); }} style={{ width: '70px', padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }} placeholder="% off" />
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>% off</span>
                    <input type="text" value={tier.label || ''} onChange={e => { const t = [...(formData.buyMoreSaveMore || [])]; t[idx] = { ...t[idx], label: e.target.value }; setFormData(prev => ({ ...prev, buyMoreSaveMore: t })); }} style={{ flexGrow: 1, padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }} placeholder='Label (e.g. "Most Popular")' />
                  </div>
                  {idx > 0 && <button type="button" onClick={() => setFormData(prev => ({ ...prev, buyMoreSaveMore: (prev.buyMoreSaveMore || []).filter((_, i) => i !== idx) }))} style={{ padding: '0.4rem 0.7rem', background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>}
                  {idx === 0 && <div />}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, buyMoreSaveMore: [...(prev.buyMoreSaveMore || []), { qty: (prev.buyMoreSaveMore?.length || 0) + 1, discountPercent: 0 }] }))} style={{ marginTop: '0.8rem', padding: '4px 12px', background: '#000', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>+ Add Tier</button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.primaryBtn} onClick={handleSave}>Save Product</button>
            <button className={styles.actionBtn} onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>
                  {p.originalPrice ? (
                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '6px' }}>Rs. {p.originalPrice.toLocaleString()}</span>
                  ) : null}
                  <strong>Rs. {p.price.toLocaleString()}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(p)}>Edit</button>
                    <button className={styles.actionBtn} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
