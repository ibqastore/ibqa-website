"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      <div className={styles.mobileHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/images/logo/logo-main.webp" alt="IBQA Logo" width={100} height={40} style={{ width: '60px', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
          <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-gold)' }}>ADMIN</span>
        </div>
        <button className={styles.hamburgerBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      
      <div className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
