"use client";
import { useState } from "react";
import styles from "../admin.module.css";

const TABS = ["All", "Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data && !error) {
        setOrders(data);
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [supabase]);

  const filteredOrders = activeTab === "All" 
    ? orders 
    : orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const oldStatus = orders.find(o => o.id === id)?.status;
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus.toLowerCase() } : o));
    
    const { error } = await supabase.from('orders').update({ status: newStatus.toLowerCase() }).eq('id', id);
    if (error) {
      alert("Failed to update status in database.");
      if (oldStatus) {
        setOrders(orders.map(o => o.id === id ? { ...o, status: oldStatus } : o));
      }
    }
  };

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
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
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Loading orders from database...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
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
                  filteredOrders.map(order => {
                    const customer = order.customer_info || {};
                    const statusCapitalized = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending';
                    
                    return (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600 }}>#{order.id}</td>
                        <td>{customer.firstName} {customer.lastName}</td>
                        <td>
                          <a 
                            href={getWhatsAppLink(customer.phone || '')} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ color: '#25D366', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Chat on WhatsApp"
                          >
                            {customer.phone || 'No phone'}
                          </a>
                          <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>{customer.address}, {customer.city}</small>
                        </td>
                        <td style={{ fontWeight: 600 }}>Rs. {order.total?.toLocaleString() || 0}</td>
                        <td style={{ textTransform: 'capitalize' }}>{order.payment_method === 'cod' ? 'Cash on delivery' : 'Bank Transfer'}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            backgroundColor: 
                              statusCapitalized === 'Delivered' ? '#dcfce7' : 
                              statusCapitalized === 'Cancelled' ? '#fee2e2' : 
                              '#f3f4f6',
                            color: 
                              statusCapitalized === 'Delivered' ? '#166534' : 
                              statusCapitalized === 'Cancelled' ? '#991b1b' : 
                              '#374151'
                          }}>
                            {statusCapitalized}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={statusCapitalized} 
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      No orders found for "{activeTab}" status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
