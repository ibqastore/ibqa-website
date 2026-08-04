"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { BarChart3, FilePenLine, LayoutDashboard, Package, Tag, Users, ShoppingCart, FileText, LogOut } from "lucide-react";
import styles from "./admin.module.css";
import { createClient } from "@/utils/supabase/client";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    return `${styles.sidebarLink} ${isActive(path) ? styles.active : ""}`;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
        <Image src="/images/logo/logo-main.webp" alt="IBQA Logo" width={500} height={500} style={{ width: '80px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-gold)' }}>ADMIN PANEL</span>
      </div>
      <nav className={styles.sidebarNav}>
        <Link href="/admin" className={getLinkClass("/admin")} onClick={onClose}>
          <LayoutDashboard size={20} />
          Overview
        </Link>
        <Link href="/admin/products" className={getLinkClass("/admin/products")} onClick={onClose}>
          <Package size={20} />
          Products
        </Link>
        <Link href="/admin/discounts" className={getLinkClass("/admin/discounts")} onClick={onClose}>
          <Tag size={20} />
          Discounts
        </Link>
        <Link href="/admin/orders" className={getLinkClass("/admin/orders")} onClick={onClose}>
          <ShoppingCart size={20} />
          Orders
        </Link>
        <Link href="/admin/ambassadors" className={getLinkClass("/admin/ambassadors")} onClick={onClose}>
          <Users size={20} />
          Ambassadors
        </Link>
        <Link href="/admin/content" className={getLinkClass("/admin/content")} onClick={onClose}><FilePenLine size={20} /> Content</Link>
        <Link href="/admin/policies" className={getLinkClass("/admin/policies")} onClick={onClose}><FileText size={20} /> Policies</Link>
        <Link href="/admin/analytics" className={getLinkClass("/admin/analytics")} onClick={onClose}><BarChart3 size={20} /> Analytics</Link>
        
        <button 
          onClick={handleLogout} 
          className={styles.sidebarLink} 
          style={{ marginTop: 'auto', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#ef4444' }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}

