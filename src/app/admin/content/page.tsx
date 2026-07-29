"use client";

import { useState } from "react";
import { useStore, HeroSlide } from "@/context/StoreContext";
import { Upload, Image as ImageIcon, Leaf, Plus, Trash2 } from "lucide-react";
import styles from "../admin.module.css";

export default function ContentPage() {
  const { siteContent, setSiteContent: originalSetSiteContent } = useStore();
  const [quickUploadResult, setQuickUploadResult] = useState<string | null>(null);
  const [hasWarned, setHasWarned] = useState(false);

  const setSiteContent = (newContent: any) => {
    if (!hasWarned) {
      if (!confirm("Warning: Changing this content will directly affect the live website. Do you want to proceed?")) {
        return;
      }
      setHasWarned(true);
    }
    originalSetSiteContent(newContent);
  };

  const handleFileUpload = async (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith("image/")) return alert("Please select a valid image file.");
    
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = () => callback(String(reader.result));
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
      alert("Failed to compress image.");
    }
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = [...(siteContent.heroSlides || [])];
    if (updatedSlides[index]) {
      updatedSlides[index] = { ...updatedSlides[index], [field]: value };
      setSiteContent({ ...siteContent, heroSlides: updatedSlides });
    }
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      pc: "/images/hero/facewash-hero-pc.webp",
      mobile: "/images/hero/facewash-hero-mobile.webp",
      title: "New Banner"
    };
    setSiteContent({ ...siteContent, heroSlides: [...(siteContent.heroSlides || []), newSlide] });
  };

  const removeSlide = (index: number) => {
    const updatedSlides = [...(siteContent.heroSlides || [])];
    updatedSlides.splice(index, 1);
    setSiteContent({ ...siteContent, heroSlides: updatedSlides });
  };

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div>
            <h1 className={styles.pageTitle}>Website Media & Content Manager</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: ".4rem" }}>
              Upload pictures for anywhere on your website (Hero Banners, Story, Before/After) and manage announcement copy.
            </p>
          </div>
          <button 
            onClick={() => alert("Changes saved successfully!")}
            style={{ 
              background: "var(--accent-gold)", 
              color: "#000", 
              padding: "0.8rem 1.5rem", 
              borderRadius: "4px", 
              fontWeight: 700, 
              border: "none", 
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* DELIVERY & PAYMENT SETTINGS */}
      <div className={styles.card} style={{ marginBottom: "2rem", borderLeft: "4px solid var(--accent-gold)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Delivery & Payment Settings</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <label>
            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Delivery Charge (Rs.)</span>
            <input
              type="number"
              value={siteContent.shippingFee ?? 200}
              onChange={(e) => setSiteContent({ ...siteContent, shippingFee: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Free Shipping Above (Rs.)</span>
            <input
              type="number"
              value={siteContent.freeShippingThreshold ?? 3000}
              onChange={(e) => setSiteContent({ ...siteContent, freeShippingThreshold: Number(e.target.value) })}
              style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
            />
          </label>
        </div>
        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#1f1f1f" }}>Payment / Bank Account Info (shown on checkout)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Bank Name</span>
            <input type="text" value={siteContent.paymentInfo?.bankName || ""} onChange={(e) => setSiteContent({ ...siteContent, paymentInfo: { ...siteContent.paymentInfo, bankName: e.target.value } })} style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }} />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Account Title</span>
            <input type="text" value={siteContent.paymentInfo?.accountTitle || ""} onChange={(e) => setSiteContent({ ...siteContent, paymentInfo: { ...siteContent.paymentInfo, accountTitle: e.target.value } })} style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }} />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Account Number</span>
            <input type="text" value={siteContent.paymentInfo?.accountNumber || ""} onChange={(e) => setSiteContent({ ...siteContent, paymentInfo: { ...siteContent.paymentInfo, accountNumber: e.target.value } })} style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }} />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>WhatsApp Number</span>
            <input type="text" value={siteContent.paymentInfo?.whatsapp || ""} onChange={(e) => setSiteContent({ ...siteContent, paymentInfo: { ...siteContent.paymentInfo, whatsapp: e.target.value } })} style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }} />
          </label>
        </div>
      </div>

      {/* QUICK UNIVERSAL UPLOAD BOX */}
      <div className={styles.card} style={{ border: "2px dashed var(--accent-gold)", background: "rgba(212, 175, 55, 0.04)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Leaf style={{ color: "var(--accent-gold)" }} />
          <h2 style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>Universal Picture Uploader</h2>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Need to upload an arbitrary image to use on a product, blog, or anywhere on the site? Upload it here to instantly convert it to a usable browser link:
        </p>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#000", color: "#D4AF37", padding: "0.75rem 1.4rem", borderRadius: "6px", fontWeight: 700, cursor: "pointer", border: "1px solid #D4AF37" }}>
          <Upload size={18} />
          <span>Select Picture to Upload</span>
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: "none" }} 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, (dataUrl) => setQuickUploadResult(dataUrl));
            }}
          />
        </label>
        {quickUploadResult && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={quickUploadResult} alt="Uploaded preview" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
            <div style={{ flexGrow: 1, overflow: "hidden" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-gold)", marginBottom: "0.2rem" }}>Image ready! Copy link below:</p>
              <input type="text" readOnly value={quickUploadResult} style={{ width: "100%", padding: "0.4rem", fontSize: "0.75rem", background: "#f9f9f9", border: "1px solid #ccc" }} />
            </div>
            <button 
              style={{ background: "#111", color: "#fff", padding: "0.5rem 1rem", borderRadius: "4px", fontWeight: 600, fontSize: "0.8rem" }}
              onClick={() => {
                navigator.clipboard.writeText(quickUploadResult);
                alert("Image URL copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* ANNOUNCEMENT BAR */}
      <div className={styles.card} style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "var(--text-primary)" }}>General Announcement</h2>
        <label style={{ display: "block" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)" }}>Golden Announcement Bar Text</span>
          <input 
            type="text" 
            value={siteContent.announcement || ""} 
            onChange={(e) => setSiteContent({ ...siteContent, announcement: e.target.value })}
            style={{ display: "block", width: "100%", marginTop: "0.45rem", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
          />
        </label>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          Note: Homepage button texts are locked to design standards and no longer editable from admin.
        </p>
      </div>

      {/* HERO CAROUSEL PICTURES */}
      <div className={styles.card} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", color: "var(--text-primary)" }}>Hero Carousel Banners (PC & Mobile)</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Upload separate banners for desktop/PC visitors and mobile screen visitors.</p>
          </div>
          <button 
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#000", color: "#D4AF37", padding: "0.6rem 1rem", borderRadius: "4px", fontWeight: 700, border: "1px solid #D4AF37", cursor: "pointer" }}
            onClick={addSlide}
          >
            <Plus size={16} /> Add Banner Slide
          </button>
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {(siteContent.heroSlides || []).map((slide, idx) => (
            <div key={slide.id || idx} style={{ padding: "1.2rem", background: "#fcfaf6", border: "1px solid #e8e2d8", borderRadius: "8px", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #e8e2d8", paddingBottom: "0.5rem" }}>
                <strong style={{ fontSize: "1rem", color: "var(--accent-gold)" }}>Banner Slide #{idx + 1}</strong>
                {(siteContent.heroSlides || []).length > 1 && (
                  <button 
                    style={{ background: "transparent", color: "#ff4d4d", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", cursor: "pointer" }}
                    onClick={() => removeSlide(idx)}
                  >
                    <Trash2 size={15} /> Remove Slide
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* PC IMAGE UPLOAD */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f1f1f" }}>🖥️ Desktop / PC Banner Image</label>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <img src={slide.pc} alt="PC Banner" style={{ width: "80px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }} />
                    <input 
                      type="text" 
                      value={slide.pc} 
                      onChange={(e) => updateSlide(idx, "pc", e.target.value)} 
                      style={{ flexGrow: 1, padding: "0.6rem", background: "#fff", border: "1px solid #ddd", fontSize: "0.8rem", color: "#1f1f1f" }} 
                    />
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#111", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                    <Upload size={14} /> Upload New PC Picture
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: "none" }} 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => updateSlide(idx, "pc", url));
                      }} 
                    />
                  </label>
                </div>

                {/* MOBILE IMAGE UPLOAD */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f1f1f" }}>📱 Mobile Screen Banner Image</label>
                  <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
                    <img src={slide.mobile} alt="Mobile Banner" style={{ width: "45px", height: "70px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }} />
                    <input 
                      type="text" 
                      value={slide.mobile} 
                      onChange={(e) => updateSlide(idx, "mobile", e.target.value)} 
                      style={{ flexGrow: 1, padding: "0.6rem", background: "#fff", border: "1px solid #ddd", fontSize: "0.8rem", color: "#1f1f1f" }} 
                    />
                  </div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#111", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                    <Upload size={14} /> Upload New Mobile Picture
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: "none" }} 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => updateSlide(idx, "mobile", url));
                      }} 
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OTHER WEBSITE IMAGES */}
      <div className={styles.card}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", color: "var(--text-primary)" }}>Other Website Section Pictures</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* STORY IMAGE */}
          <div style={{ padding: "1rem", background: "#fcfaf6", border: "1px solid #e8e2d8", borderRadius: "6px" }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", color: "#1f1f1f" }}>🌿 Our Story Section Image</label>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <img src={siteContent.storyImage || "/images/Lifestyle/luxury-bathroom.webp"} alt="Story" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
              <input 
                type="text" 
                value={siteContent.storyImage || ""} 
                onChange={(e) => setSiteContent({ ...siteContent, storyImage: e.target.value })}
                style={{ flexGrow: 1, padding: "0.6rem", background: "#fff", border: "1px solid #ddd", fontSize: "0.8rem", color: "#1f1f1f" }} 
              />
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#111", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
              <Upload size={14} /> Upload Story Picture
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, (url) => setSiteContent({ ...siteContent, storyImage: url }));
                }} 
              />
            </label>
          </div>

          {/* BEFORE IMAGE */}
          <div style={{ padding: "1rem", background: "#fcfaf6", border: "1px solid #e8e2d8", borderRadius: "6px" }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", color: "#1f1f1f" }}>🌿 Results Section (Before Picture)</label>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <img src={siteContent.beforeImage || "/images/before-after/before.webp"} alt="Before" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
              <input 
                type="text" 
                value={siteContent.beforeImage || ""} 
                onChange={(e) => setSiteContent({ ...siteContent, beforeImage: e.target.value })}
                style={{ flexGrow: 1, padding: "0.6rem", background: "#fff", border: "1px solid #ddd", fontSize: "0.8rem", color: "#1f1f1f" }} 
              />
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#111", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
              <Upload size={14} /> Upload Before Picture
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, (url) => setSiteContent({ ...siteContent, beforeImage: url }));
                }} 
              />
            </label>
          </div>

          {/* AFTER IMAGE */}
          <div style={{ padding: "1rem", background: "#fcfaf6", border: "1px solid #e8e2d8", borderRadius: "6px", gridColumn: "span 2" }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", color: "#1f1f1f" }}>🌿 Results Section (After Picture)</label>
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
              <img src={siteContent.afterImage || "/images/before-after/after.webp"} alt="After" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
              <input 
                type="text" 
                value={siteContent.afterImage || ""} 
                onChange={(e) => setSiteContent({ ...siteContent, afterImage: e.target.value })}
                style={{ flexGrow: 1, padding: "0.6rem", background: "#fff", border: "1px solid #ddd", fontSize: "0.8rem", color: "#1f1f1f" }} 
              />
            </div>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#111", color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
              <Upload size={14} /> Upload After Picture
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, (url) => setSiteContent({ ...siteContent, afterImage: url }));
                }} 
              />
            </label>
          </div>
        </div>
      </div>

      {/* CONTACT INFO SETTINGS */}
      <div className={styles.card} style={{ marginBottom: "2rem", borderLeft: "4px solid var(--accent-gold)" }}>
        <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem", color: "var(--text-primary)" }}>Store Contact Information</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          <label>
            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Phone Number / WhatsApp</span>
            <input
              type="text"
              value={siteContent.contactInfo?.phone || ""}
              onChange={(e) => setSiteContent({ ...siteContent, contactInfo: { ...siteContent.contactInfo, phone: e.target.value } })}
              placeholder="e.g. 0339-1326074"
              style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
            />
          </label>
          <label>
            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Email Address</span>
            <input
              type="email"
              value={siteContent.contactInfo?.email || ""}
              onChange={(e) => setSiteContent({ ...siteContent, contactInfo: { ...siteContent.contactInfo, email: e.target.value } })}
              placeholder="e.g. teamibqa@gmail.com"
              style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
            />
          </label>
          <label style={{ gridColumn: "span 2" }}>
            <span style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Store Address</span>
            <input
              type="text"
              value={siteContent.contactInfo?.address || ""}
              onChange={(e) => setSiteContent({ ...siteContent, contactInfo: { ...siteContent.contactInfo, address: e.target.value } })}
              placeholder="e.g. Shop#2, fawad plaza, hakimabad, nowshera"
              style={{ width: "100%", padding: "0.8rem", background: "#fff", border: "1px solid #ddd", color: "#1f1f1f" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
