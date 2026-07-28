import Link from "next/link";
import Image from "next/image";
import { BarChart3, FilePenLine, LayoutDashboard, Package, Tag, Users, ShoppingCart } from "lucide-react";
import styles from "./admin.module.css";

export default function AdminSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
        <Image src="/images/logo/logo-main.PNG" alt="IBQA Logo" width={500} height={500} style={{ width: '170px', height: 'auto', objectFit: 'contain' }} />
        <span style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'var(--accent-gold)' }}>ADMIN PANEL</span>
      </div>
      <nav className={styles.sidebarNav}>
        <Link href="/admin" className={styles.sidebarLink}>
          <LayoutDashboard size={20} />
          Overview
        </Link>
        <Link href="/admin/products" className={styles.sidebarLink}>
          <Package size={20} />
          Products
        </Link>
        <Link href="/admin/discounts" className={styles.sidebarLink}>
          <Tag size={20} />
          Discounts
        </Link>
        <Link href="/admin/orders" className={styles.sidebarLink}>
          <ShoppingCart size={20} />
          Orders
        </Link>
        <Link href="/admin/ambassadors" className={styles.sidebarLink}>
          <Users size={20} />
          Ambassadors
        </Link>
        <Link href="/admin/content" className={styles.sidebarLink}><FilePenLine size={20} /> Content</Link>
        <Link href="/admin/analytics" className={styles.sidebarLink}><BarChart3 size={20} /> Analytics</Link>
      </nav>
    </aside>
  );
}
