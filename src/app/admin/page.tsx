"use client";

import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const { products, discounts } = useStore();

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className={styles.card}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Products</h3>
          <p style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>{products.length}</p>
        </div>
        <div className={styles.card}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Discounts</h3>
          <p style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>{discounts.length}</p>
        </div>
        <div className={styles.card}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Orders</h3>
          <p style={{ fontSize: '2.5rem', color: 'var(--accent-gold)' }}>0</p>
        </div>
      </div>
      
      <div className={styles.card}>
        <h2>Recent Activity</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No recent activity to display.</p>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.8rem' }}>
        <Link className={styles.primaryBtn} href="/admin/products">Manage products</Link>
        <Link className={styles.actionBtn} href="/admin/orders">Manage orders</Link>
        <Link className={styles.actionBtn} href="/admin/content">Edit website content</Link>
      </div>
    </div>
  );
}
