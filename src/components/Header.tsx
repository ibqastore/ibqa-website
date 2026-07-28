"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import CartDrawer from './CartDrawer';
import styles from './Header.module.css';

const navItems = [
  { label: 'Shop Collection', href: '/#shop' },
  { label: 'Our Story', href: '/#our-story' },
  { label: 'Ingredients', href: '/#ingredients' },
  { label: 'Results', href: '/#results' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const { cart } = useStore();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo/logo-main.PNG"
            alt="IBQA Skincare Logo"
            width={500}
            height={500}
            priority
            className={styles.logoImage}
          />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.menuOpen : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.icons}>
          <button
            aria-label="Cart"
            className={styles.cartBtn}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={24} strokeWidth={2} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          <button
            aria-label="Toggle navigation"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={26} strokeWidth={2} /> : <Menu size={26} strokeWidth={2} />}
          </button>
        </div>
      </header>

      {/* CartDrawer is rendered outside <header> so fixed positioning is relative to viewport */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
