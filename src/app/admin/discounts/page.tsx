"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import styles from "../admin.module.css";

export default function AdminDiscounts() {
  const { discounts, setDiscounts, products, showConfirm } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: "", percentage: 0, productIds: [] as string[], startsAt: "", endsAt: "", active: true });
  
  const save = () => {
    if (!formData.code || !formData.percentage) return;
    if (editingCode) {
      setDiscounts(current => current.map(item => item.code === editingCode ? { ...formData, code: formData.code.toUpperCase() } : item));
    } else {
      setDiscounts(current => [...current, { ...formData, code: formData.code.toUpperCase() }]);
    }
    setFormData({ code: "", percentage: 0, productIds: [], startsAt: "", endsAt: "", active: true }); 
    setIsAdding(false);
    setEditingCode(null);
  };
  
  const toggleProduct = (id: string) => setFormData(current => ({ ...current, productIds: current.productIds.includes(id) ? current.productIds.filter(x => x !== id) : [...current.productIds, id] }));
  
  return <div className="animate-fade-up"><div className={styles.pageHeader}><div><h1 className={styles.pageTitle}>Discounts</h1><p style={{ color:'var(--text-secondary)', marginTop:'.4rem' }}>Schedule a site-wide offer or limit it to selected products.</p></div><button className={styles.primaryBtn} onClick={() => { setIsAdding(true); setEditingCode(null); setFormData({ code: "", percentage: 0, productIds: [], startsAt: "", endsAt: "", active: true }); }}>Create discount</button></div>
    {isAdding && <div className={styles.card} style={{ border:'1px solid var(--accent-gold)' }}><h2 style={{ marginBottom:'1.5rem' }}>{editingCode ? 'Edit promotion' : 'New promotion'}</h2><div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0, 1fr))', gap:'1rem' }}><input placeholder="Code e.g. GLOW15" value={formData.code} onChange={e => setFormData({...formData, code:e.target.value})} style={{ padding:'.8rem', border:'1px solid #ddd' }}/><input type="number" placeholder="Percentage" value={formData.percentage || ''} onChange={e => setFormData({...formData, percentage:Number(e.target.value)})} style={{ padding:'.8rem', border:'1px solid #ddd' }}/><label>Starts<input type="date" value={formData.startsAt} onChange={e => setFormData({...formData, startsAt:e.target.value})} style={{ display:'block', width:'100%', marginTop:'.4rem', padding:'.7rem', border:'1px solid #ddd' }}/></label><label>Ends<input type="date" value={formData.endsAt} onChange={e => setFormData({...formData, endsAt:e.target.value})} style={{ display:'block', width:'100%', marginTop:'.4rem', padding:'.7rem', border:'1px solid #ddd' }}/></label></div><p style={{ margin:'1.3rem 0 .6rem', fontWeight:700 }}>Apply to products <small style={{ fontWeight:400, color:'var(--text-secondary)' }}>(leave empty for whole website)</small></p><div style={{ display:'flex', flexWrap:'wrap', gap:'.8rem', marginBottom:'1.5rem' }}>{products.map(p => <label key={p.id} style={{ border:'1px solid #ddd', padding:'.6rem .8rem', fontSize:'.8rem' }}><input type="checkbox" checked={formData.productIds.includes(p.id)} onChange={() => toggleProduct(p.id)} /> {p.name}</label>)}</div><button className={styles.primaryBtn} onClick={save}>Save discount</button> <button className={styles.actionBtn} onClick={() => { setIsAdding(false); setEditingCode(null); }}>Cancel</button></div>}
    <div className={styles.card}><table className={styles.table}><thead><tr><th>Code</th><th>Offer</th><th>Applies to</th><th>Schedule</th><th>Status</th><th>Action</th></tr></thead><tbody>{discounts.map(d => <tr key={d.code}><td style={{ fontWeight:700 }}>{d.code}</td><td>{d.percentage}% off</td><td>{d.productIds.length ? `${d.productIds.length} selected product(s)` : 'Entire website'}</td><td>{d.startsAt || 'Now'} — {d.endsAt || 'No end date'}</td><td>{d.active ? 'Active' : 'Disabled'}</td><td><div style={{ display: 'flex', gap: '0.5rem' }}><button className={styles.actionBtn} onClick={() => setDiscounts(x => x.map(item => item.code === d.code ? {...item, active:!item.active} : item))}>{d.active ? 'Disable' : 'Enable'}</button> <button className={styles.actionBtn} onClick={() => { setEditingCode(d.code); setFormData(d); setIsAdding(true); }}>Edit</button> <button className={styles.actionBtn} style={{ color: '#ff4d4d', borderColor: '#ff4d4d' }} onClick={() => showConfirm("Delete discount?", () => setDiscounts(x => x.filter(item => item.code !== d.code)))}>Delete</button></div></td></tr>)}</tbody></table></div>
  </div>;
}
