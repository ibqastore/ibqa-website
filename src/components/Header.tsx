"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ShoppingBag, X, Search } from 'lucide-react';
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
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { cart, products } = useStore();
  
  const filteredProducts = searchQuery ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  const lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    let lastScroll = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScroll && currentScrollY > 80) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScroll = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div style={{ height: '95px' }} aria-hidden="true" />
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${isHidden ? styles.hidden : ''}`}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo/logo-main.webp"
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
            aria-label="Search"
            className={styles.cartBtn}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={22} strokeWidth={2} />
          </button>
          
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

      {isSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#D4AF37', margin: 0 }}>Search Products</h2>
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
          </div>
          <input 
            autoFocus
            type="text" 
            placeholder="Type to search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', background: '#222', color: '#fff', border: '1px solid #D4AF37', borderRadius: '8px', outline: 'none' }}
          />
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
            {searchQuery && filteredProducts.length === 0 && <p style={{ color: '#aaa' }}>No products found.</p>}
            {filteredProducts.map(p => (
              <Link 
                key={p.id} 
                href={`/shop/${p.id}`}
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', padding: '1rem', borderRadius: '8px', textDecoration: 'none', border: '1px solid #333' }}
              >
                <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#fff', borderRadius: '4px' }} />
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 0.3rem 0' }}>{p.name}</h3>
                  <p style={{ color: '#D4AF37', margin: 0, fontWeight: 'bold' }}>Rs. {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
