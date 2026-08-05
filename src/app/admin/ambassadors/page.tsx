"use client";
import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { useStore, Ambassador } from "@/context/StoreContext";
import styles from "../admin.module.css";

export default function AdminAmbassadors() {
  const { ambassadors: list, setAmbassadors: setList, showConfirm } = useStore();
  const [name, setName] = useState(""); const [commission, setCommission] = useState(15); const [selected, setSelected] = useState<Ambassador | null>(null);
  const create = () => { if (!name.trim()) return; const code = `IBQA-${name.replace(/[^a-zA-Z]/g, "").slice(0,6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`; setList(x => [...x, { name, code, commission, clicks:0, sales:0, earned:0, active:true }]); setName(""); };
  const copy = async (code:string) => navigator.clipboard.writeText(`${window.location.origin}/?ref=${code}`);
  const toggle = (code:string) => setList(x => x.map(i => i.code === code ? { ...i, active:!i.active } : i));
  const remove = (code:string) => { showConfirm("Are you sure you want to delete this ambassador?", () => setList(x => x.filter(i => i.code !== code))); };
  return <div className="animate-fade-up"><div className={styles.pageHeader}><div><h1 className={styles.pageTitle}>Ambassadors</h1><p style={{color:"var(--text-secondary)", marginTop:".4rem"}}>Set commission before generating a unique, controllable referral link.</p></div></div>
    <div className={styles.card} style={{display:"flex", gap:"1rem", alignItems:"end"}}><label style={{flex:1}}>Ambassador name<input value={name} onChange={e=>setName(e.target.value)} style={{display:"block",width:"100%",marginTop:".4rem",padding:".8rem",border:"1px solid #ddd"}} /></label><label>Commission %<input type="number" value={commission} onChange={e=>setCommission(Number(e.target.value))} style={{display:"block",width:"110px",marginTop:".4rem",padding:".8rem",border:"1px solid #ddd"}} /></label><button className={styles.primaryBtn} onClick={create}><Plus size={16}/> Generate link</button></div>
    <div className={styles.card}><table className={styles.table}><thead><tr><th>Name</th><th>Code</th><th>Commission</th><th>Clicks</th><th>Sales</th><th>Earnings</th><th>Status</th><th>Controls</th></tr></thead><tbody>{list.map(a=><tr key={a.code}><td>{a.name}</td><td>{a.code}</td><td>{a.commission}%</td><td>{a.clicks}</td><td>{a.sales}</td><td>Rs. {a.earned.toLocaleString()}</td><td>{a.active ? "Active" : "Disabled"}</td><td style={{display:"flex",gap:".4rem"}}><button className={styles.actionBtn} onClick={()=>copy(a.code)}><Copy size={13}/> Copy</button><button className={styles.actionBtn} onClick={()=>toggle(a.code)}>{a.active ? "Disable" : "Enable"}</button><button className={styles.actionBtn} onClick={()=>setSelected(a)}>Analytics</button><button className={styles.actionBtn} onClick={()=>remove(a.code)} style={{color: 'red'}}>Delete</button></td></tr>)}</tbody></table></div>
    {selected && <div className={styles.card}><h2>{selected.name} — analytics</h2><p style={{marginTop:"1rem",color:"var(--text-secondary)"}}>Referral code: {selected.code} · {selected.clicks} clicks · {selected.sales} attributed sales · Rs. {selected.earned.toLocaleString()} commission.</p></div>}
  </div>;
}
