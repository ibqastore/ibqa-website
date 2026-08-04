"use client";
import { useState } from "react";
import styles from "../admin.module.css";

const initialOrders = [
  { id: '#IBQA-1001', customer: 'Ahmed Raza', phone: '03001234567', address: 'DHA Phase 6, Karachi', total: 'Rs. 3,500', status: 'Pending' },
  { id: '#IBQA-1002', customer: 'Sara Khan', phone: '03339876543', address: 'Bahria Town, Lahore', total: 'Rs. 1,500', status: 'Confirmed' },
  { id: '#IBQA-1003', customer: 'Ali Hassan', phone: '03451122334', address: 'F-8/4, Islamabad', total: 'Rs. 2,500', status: 'Processing' },
  { id: '#IBQA-1004', customer: 'Fatima Noor', phone: '03125556667', address: 'Clifton, Karachi', total: 'Rs. 6,000', status: 'Dispatched' },
  { id: '#IBQA-1005', customer: 'Usman Tariq', phone: '03219998887', address: 'Saddar, Rawalpindi', total: 'Rs. 1,500', status: 'Delivered' },
  { id: '#IBQA-1006', customer: 'Ayesha Bibi', phone: '03014443332', address: 'Gulshan-e-Iqbal, Karachi', total: 'Rs. 3,500', status: 'Cancelled' },
];

const TABS = ["All", "Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');
    // If it starts with 0, replace with 92 (Pakistan country code)
    if (cleaned.startsWith('0')) {
      cleaned = '92' + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="animate-fade-up">
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '.4rem' }}>
            Confirm, fulfil, dispatch, or cancel customer orders from one place.
          </p>
        </div>
      </div>

      <div className={styles.card}>
        
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === tab ? '#D4AF37' : '#f5f5f5',
                color: activeTab === tab ? '#000' : '#333',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 500,
                transition: 'all 0.2s ease',
                fontSize: '0.85rem'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Contact & delivery</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      <a 
                        href={getWhatsAppLink(order.phone)} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Chat on WhatsApp"
                      >
                        {order.phone}
                      </a>
                      <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>{order.address}</small>
                    </td>
                    <td>{order.total}</td>
                    <td>Cash on delivery</td>
                    <td>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600,
                        backgroundColor: 
                          order.status === 'Delivered' ? '#dcfce7' : 
                          order.status === 'Cancelled' ? '#fee2e2' : 
                          '#f3f4f6',
                        color: 
                          order.status === 'Delivered' ? '#166534' : 
                          order.status === 'Cancelled' ? '#991b1b' : 
                          '#374151'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={order.status} 
                        onChange={e => updateOrderStatus(order.id, e.target.value)} 
                        style={{ padding: '.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Processing</option>
                        <option>Dispatched</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No orders found for "{activeTab}" status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.75rem', marginTop: '1.5rem', textAlign: 'center' }}>
          This preview becomes a live order queue once checkout is connected to a database.
        </p>
      </div>
    </div>
  );
}
