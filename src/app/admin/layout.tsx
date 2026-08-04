"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import { usePathname } from "next/navigation";
import InactivityTimeout from "@/components/InactivityTimeout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--background-secondary)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Image src="/images/logo/logo-main.webp" alt="IBQA Logo" width={120} height={50} style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.adminLayout}>
      <InactivityTimeout />
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
