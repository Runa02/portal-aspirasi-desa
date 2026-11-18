import { useMemo, useState } from "react";
import { Edit3, MapPin, MoreVertical, Plus, RefreshCw, Search, Users } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const areas = [
  ["Dusun Krajan", "RW 01-02", 186, 842, "Pak Budi Santoso"],
  ["Dusun Mawar", "RW 01", 124, 625, "Ibu Sumiati"],
  ["Dusun Kuning", "RW 03", 98, 514, "Pak Slamet Riyadi"],
  ["Dusun Sukamaju", "RW 04", 86, 738, "Rina Astuti"],
  ["Dusun Ngumpul", "RW 02", 64, 489, "Ahmad Dani"],
];

export default function IndexAreas() {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  const filtered = useMemo(() => areas.filter(([name, code, , , head]) => `${name} ${code} ${head}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="admin-page reports-page management-page"><AdminSidebar open={open} setOpen={setOpen} /><div className="admin-content"><AdminTopbar setOpen={setOpen} /><main className="admin-main reports-main">
    <div className="admin-heading"><div><h1>Wilayah Desa</h1><p>Kelola dusun, RW/RT, penanggung jawab, dan sebaran pelayanan warga.</p></div></div>
    <div className="management-toolbar"><label className="report-search"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari dusun, RW/RT, atau penanggung jawab..." /></label><button className="manual-report"><Plus size={13} /> Tambah Wilayah</button></div>
    <section className="reports-table-card"><div className="reports-list-heading"><h2><MapPin size={15} /> Daftar Wilayah Desa <small>{filtered.length} dari 5 dusun terdaftar</small></h2><span>Diperbarui: 2 menit yang lalu <RefreshCw size={11} /></span></div><div className="reports-table-wrapper"><table className="reports-table area-table"><thead><tr><th>NAMA WILAYAH</th><th>KODE RW / RT</th><th>PENANGGUNG JAWAB</th><th>JUMLAH WARGA</th><th>LAPORAN MASUK</th><th>AKSI</th></tr></thead><tbody>{filtered.map(([name, code, reports, citizens, head]) => <tr key={name}><td><div className="area-table-name"><MapPin size={15} /><b>{name}</b></div></td><td><span className="area-code">{code}</span></td><td><div className="area-head"><i>{head.split(" ").map((part) => part[0]).join("")}</i><span>{head}</span></div></td><td><strong>{citizens.toLocaleString("id-ID")}</strong> warga</td><td><strong className="success-text">{reports}</strong> laporan</td><td><div className="management-actions"><button><Edit3 size={12} /> Edit</button><MoreVertical size={15} /></div></td></tr>)}</tbody></table></div><div className="area-summary"><Users size={15} /><span><b>3.858 warga</b><small>tersebar di seluruh wilayah Desa Sukamaju</small></span></div></section>
  </main></div></div>;
}
