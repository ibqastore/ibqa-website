"use client";

import { useStore } from "@/context/StoreContext";
import { Trash2 } from "lucide-react";
import styles from "../admin.module.css";
import Link from "next/link";

export default function SubscribersPage() {
  const { subscribers, removeSubscriber } = useStore();

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Newsletter Subscribers</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: ".4rem" }}>
            Manage emails collected from the footer newsletter form.
          </p>
        </div>
        <Link href="/admin" className={styles.actionBtn}>Back to Dashboard</Link>
      </div>

      <div className={styles.card}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--text-primary)" }}>
          Total Subscribers: {subscribers.length}
        </h2>
        
        {subscribers.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No subscribers yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {subscribers.map((email, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  padding: "1rem", 
                  background: "#f9f9f9", 
                  border: "1px solid #ddd", 
                  borderRadius: "6px" 
                }}
              >
                <span style={{ fontWeight: 600, color: "#111" }}>{email}</span>
                <button 
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove ${email}?`)) {
                      removeSubscriber(email);
                    }
                  }}
                  style={{ 
                    background: "transparent", 
                    border: "none", 
                    color: "#e53e3e", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.4rem" 
                  }}
                >
                  <Trash2 size={18} /> Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
