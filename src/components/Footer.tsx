"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import styles from './Footer.module.css';

const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.64l.36-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTok = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const { addSubscriber } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openQuickLinks, setOpenQuickLinks] = useState(false);
  const [openLegal, setOpenLegal] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      addSubscriber(email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>

        {/* LEFT: Logo + About */}
        <div className={styles.col}>
          <Link href="/" style={{ margin: '-0.5rem 0 1rem 0', display: 'flex', alignItems: 'flex-start', cursor: 'pointer', textDecoration: 'none' }}>
            <Image
              src="/images/logo/logo-main.webp"
              alt="IBQA Logo"
              width={80}
              height={80}
              style={{ width: '60px', height: 'auto', objectFit: 'contain', objectPosition: 'left top', filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))' }}
            />
          </Link>
          <h3>About IBQA</h3>
          <p>
            Premium skincare made for healthier, radiant skin.
            Experience luxury and elegance with every drop.
          </p>
        </div>

        {/* CENTRE: Quick Links */}
        <div className={`${styles.col} ${styles.colCenter}`}>
          <button className={styles.accordionBtn} onClick={() => setOpenQuickLinks(!openQuickLinks)}>
            <h3>Quick Links</h3>
          </button>
          <div className={`${styles.accordionContent} ${openQuickLinks ? styles.open : ''}`}>
            <Link href="/#shop">Shop</Link>
            <Link href="/#our-story">Our Story</Link>
            <Link href="/#ingredients">Ingredients</Link>
          </div>
        </div>

        {/* POLICIES */}
        <div className={`${styles.col} ${styles.colCenter}`}>
          <button className={styles.accordionBtn} onClick={() => setOpenLegal(!openLegal)}>
            <h3>Legal</h3>
          </button>
          <div className={`${styles.accordionContent} ${openLegal ? styles.open : ''}`}>
            <Link href="/policies/refund">Refund Policy</Link>
            <Link href="/policies/shipping">Shipping Policy</Link>
              <Link href="/policies/privacy">Privacy Policy</Link>
              <Link href="/policies/terms">Terms of Service</Link>
            </div>
        </div>

        {/* RIGHT: Newsletter */}
        <div className={`${styles.col} ${styles.colRight}`}>
          <h3>Newsletter</h3>
          <p>Join IBQA Community for exclusive offers.</p>
          <input 
            type="email" 
            placeholder="Your email address" 
            className={styles.newsletterInput} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.newsletterBtn} onClick={handleSubscribe}>
            {subscribed ? "Subscribed!" : "Subscribe"}
          </button>
        </div>

      </div>

      {/* BOTTOM: Copyright + Social icons centred */}
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} IBQA Skincare. All rights reserved.</p>
        <div className={styles.social}>
          <a href="https://www.instagram.com/ibqaskincare?igsh=MXR0a2NzcXV0Zmd5eA==" aria-label="Instagram"><Instagram size={20} /></a>
          <a href="https://www.facebook.com/share/1DQ1Agyra4/?mibextid=wwXIfr" aria-label="Facebook"><Facebook size={20} /></a>
          <a href="https://www.tiktok.com/@ibqaskincare?_r=1&_t=ZS-98PyFCUArED" aria-label="TikTok"><TikTok size={20} /></a>
        </div>
      </div>
    </footer>
  );
}
