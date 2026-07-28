"use client";

import { useState } from "react";
import styles from "./ambassador.module.css";

export default function AmbassadorDashboard() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://ibqaskincare.com?ref=AMB-001";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} gold-gradient-text animate-fade-up`}>Ambassador Portal</h1>
      
      <div className={`${styles.dashboardGrid} animate-fade-up`} style={{ animationDelay: '0.1s' }}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your Referral Link</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Share this link with your audience to earn 15% commission on every sale.
          </p>
          <div className={styles.linkBox}>
            <span style={{ color: 'var(--accent-gold)' }}>{referralLink}</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.statBox}>
            <h3>Total Clicks</h3>
            <p>124</p>
          </div>
          <div className={styles.statBox}>
            <h3>Sales Generated</h3>
            <p>12</p>
          </div>
          <div className={styles.statBox}>
            <h3>Unpaid Commission</h3>
            <p>Rs. 4,500</p>
          </div>
        </div>
      </div>

      <div className={`${styles.card} animate-fade-up`} style={{ animationDelay: '0.2s', marginTop: '2rem' }}>
        <h2 className={styles.cardTitle}>Recent Referrals</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Commission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jul 12, 2026</td>
              <td>#ORD-892</td>
              <td>Rs. 3,500</td>
              <td style={{ color: 'var(--accent-gold)' }}>Rs. 525</td>
              <td>Pending</td>
            </tr>
            <tr>
              <td>Jul 10, 2026</td>
              <td>#ORD-764</td>
              <td>Rs. 1,500</td>
              <td style={{ color: 'var(--accent-gold)' }}>Rs. 225</td>
              <td style={{ color: '#4dff4d' }}>Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
