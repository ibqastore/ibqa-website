import Link from "next/link";
import Image from "next/image";
import { BarChart3, FilePenLine, LayoutDashboard, Package, Tag, Users, ShoppingCart, FileText } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
        <Image src="/images/logo/logo-main.webp" alt="IBQA Logo" width={500} height={500} style={{ width: '80px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))' }} />
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-gold)' }}>ADMIN PANEL</span>
      </div>
      <nav className={styles.sidebarNav}>
        <Link href="/admin" className={styles.sidebarLink} onClick={onClose}>
          <LayoutDashboard size={20} />
          Overview
        </Link>
        <Link href="/admin/products" className={styles.sidebarLink} onClick={onClose}>
          <Package size={20} />
          Products
        </Link>
        <Link href="/admin/discounts" className={styles.sidebarLink} onClick={onClose}>
          <Tag size={20} />
          Discounts
        </Link>
        <Link href="/admin/orders" className={styles.sidebarLink} onClick={onClose}>
          <ShoppingCart size={20} />
          Orders
        </Link>
        <Link href="/admin/ambassadors" className={styles.sidebarLink} onClick={onClose}>
          <Users size={20} />
          Ambassadors
        </Link>
        <Link href="/admin/content" className={styles.sidebarLink} onClick={onClose}><FilePenLine size={20} /> Content</Link>
        <Link href="/admin/policies" className={styles.sidebarLink} onClick={onClose}><FileText size={20} /> Policies</Link>
        <Link href="/admin/analytics" className={styles.sidebarLink} onClick={onClose}><BarChart3 size={20} /> Analytics</Link>
      </nav>
    </aside>
  );
}
