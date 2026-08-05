"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import styles from "../admin.module.css";
import { Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminPolicies() {
  const { siteContent, setSiteContent } = useStore();
  
  // Local state for editing
  const [policies, setPolicies] = useState(siteContent.policies);
  const [activeTab, setActiveTab] = useState<"refund" | "shipping" | "privacy" | "terms">("refund");
  const [hasWarned, setHasWarned] = useState(false);

  const handleEdit = (val: string) => {
    if (!hasWarned) {
      if (!confirm("Warning: Changing these policies will directly affect the live website. Do you want to proceed?")) {
        return;
      }
      setHasWarned(true);
    }
    setPolicies({ ...policies, [activeTab]: val });
  };

  const supabase = createClient();

  const handleSave = async () => {
    const newContent = { ...siteContent, policies };
    
    const { error } = await supabase.from('site_content').update({ data: newContent }).eq('id', 1);
    
    if (error) {
      alert("Error saving policies to database!");
      console.error(error);
      return;
    }
    
    setSiteContent(newContent);
    alert("Policies saved successfully!");
  };

  const tabs = [
    { id: "refund", label: "Refund Policy" },
    { id: "shipping", label: "Shipping Policy" },
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" }
  ];

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manage Policies</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: ".4rem" }}>
            Edit the legal policies of your store. Use Markdown for formatting (e.g., **bold**, *italic*, 1. List).
          </p>
        </div>
        <button className={styles.primaryBtn} onClick={handleSave}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className={styles.card}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem', 
          borderBottom: '1px solid #eee', 
          paddingBottom: '1rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: activeTab === tab.id ? '#D4AF37' : '#f5f5f5',
                color: activeTab === tab.id ? '#000' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 600 }}>{tabs.find(t => t.id === activeTab)?.label} Content</label>
          <textarea
            value={policies[activeTab]}
            onChange={(e) => handleEdit(e.target.value)}
            style={{
              width: '100%',
              height: 'calc(100vh - 280px)', /* Adjusted to prevent page scroll */
              minHeight: '300px',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              resize: 'none' /* Disable manual resize to avoid breaking layout */
            }}
          />
        </div>
      </div>
    </div>
  );
}
