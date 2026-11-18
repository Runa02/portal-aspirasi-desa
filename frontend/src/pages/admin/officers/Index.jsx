import { useMemo, useState } from "react";
import { Activity, CheckCircle2, ClipboardCheck, Filter, MoreVertical, Plus, RefreshCw, Search, UserRound } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const officers = [
  { name: "Rina Astuti", role: "Operator Pelayanan & Loket", area: "Balai Desa Sukamaju", active: 26, done: 148, status: "Sedang Online", tone: "mint" },
  { name: "Pak Suyatno", role: "Kaur Pembangunan", area: "Dusun Krajan & Mawar", active: 12, done: 86, status: "Aktif", tone: "mint" },
  { name: "Mas Rian", role: "Teknisi Kelistrikan Desa", area: "Dusun Kuning", active: 8, done: 54, status: "Aktif", tone: "blue" },
  { name: "Pak Samad", role: "Koordinator Kebersihan", area: "Dusun Sukamaju", active: 5, done: 42, status: "Tidak Aktif", tone: "gray" },
];

function Badge({ children, tone = "gray" }) { return <span className={`reports-badge ${tone}`}>{children}</span>; }

export default function IndexOfficers() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => officers.filter((item) => `${item.name} ${item.role} ${item.area}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="admin-page reports-page management-page">
    <AdminSidebar open={open} setOpen={setOpen} /><div className="admin-content"><AdminTopbar setOpen={setOpen} /><main className="admin-main reports-main">
      <div className="admin-heading"><div><h1>Petugas & Disposisi</h1><p>Atur petugas, pembagian wilayah kerja, dan antrean disposisi laporan warga.</p></div></div>
      <section className="management-kpis"><article><span><UserRound size={15} /> Total Petugas</span><b>18</b><small>12 petugas aktif</small></article><article><span><ClipboardCheck size={15} /> Perlu Disposisi</span><b className="orange-text">14</b><small>4 prioritas mendesak</small></article><article><span><Activity size={15} /> Sedang Bertugas</span><b>34</b><small>Laporan dalam proses</small></article><article><span><CheckCircle2 size={15} /> Selesai Bulan Ini</span><b>186</b><small>Naik 12% dari bulan lalu</small></article></section>
      <div className="management-toolbar"><label className="report-search"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama petugas, jabatan, atau wilayah..." /></label><button><Filter size={13} /> Semua Status</button><button className="manual-report"><Plus size={13} /> Tambah Petugas</button></div>
      <section className="reports-table-card"><div className="reports-list-heading"><h2>Daftar Petugas <small>{filtered.length} petugas ditampilkan</small></h2><span>Diperbarui: 2 menit yang lalu <RefreshCw size={11} /></span></div><div className="reports-table-wrapper"><table className="reports-table management-table"><thead><tr><th>PETUGAS</th><th>JABATAN / PERAN</th><th>WILAYAH KERJA</th><th>AKTIF DITANGANI</th><th>SELESAI</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.name}><td><div className="management-person"><i>{item.name.split(" ").map((part) => part[0]).join("")}</i><b>{item.name}</b></div></td><td>{item.role}</td><td>{item.area}</td><td><strong>{item.active}</strong> laporan</td><td><strong>{item.done}</strong> laporan</td><td><Badge tone={item.tone}>{item.status}</Badge></td><td><div className="management-actions"><button>Detail</button><MoreVertical size={15} /></div></td></tr>)}</tbody></table></div></section>
    </main></div></div>;
}
