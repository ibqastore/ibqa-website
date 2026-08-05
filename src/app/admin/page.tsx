"use client";

import { useStore } from "@/context/StoreContext";
import Link from "next/link";
import styles from "./admin.module.css";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { products, discounts } = useStore();
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { count, error: countError } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      if (!countError && count !== null) {
        setTotalOrders(count);
      }
      
      const { data: recent, error: recentError } = await supabase.from('orders').select('id, customer_info, created_at, status, total').order('created_at', { ascending: false }).limit(3);
      if (recent && !recentError) {
        setRecentOrders(recent);
      }
    };
    fetchDashboardData();
  }, [supabase]);

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.metricsGrid}>
        <Link href="/admin/products" className={`${styles.card} ${styles.clickableCard}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.metricTitle}>Total Products</h3>
          <p className={styles.metricValue}>{products.length}</p>
        </Link>
        <Link href="/admin/discounts" className={`${styles.card} ${styles.clickableCard}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.metricTitle}>Active Discounts</h3>
          <p className={styles.metricValue}>{discounts.length}</p>
        </Link>
        <Link href="/admin/orders" className={`${styles.card} ${styles.clickableCard}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.metricTitle}>Total Orders</h3>
          <p className={styles.metricValue}>{totalOrders !== null ? totalOrders : '...'}</p>
        </Link>
      </div>
      
      <div className={styles.card}>
        <h2>Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.map(order => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#fcfaf6', borderRadius: '6px', border: '1px solid #e8e2d8' }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{order.customer_info?.firstName} {order.customer_info?.lastName}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Rs. {order.total?.toLocaleString()}</p>
                  <p style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>No recent activity to display.</p>
        )}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.8rem' }}>
        <Link className={styles.primaryBtn} href="/admin/products">Manage products</Link>
        <Link className={styles.actionBtn} href="/admin/orders">Manage orders</Link>
        <Link className={styles.actionBtn} href="/admin/content">Edit website content</Link>
        <Link className={styles.actionBtn} href="/admin/subscribers">Manage subscribers</Link>
      </div>
    </div>
  );
}
