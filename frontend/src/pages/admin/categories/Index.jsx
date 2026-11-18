import { useState } from "react";
import { Edit3, FolderTree, MoreVertical, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const categories = [
  ["Infrastruktur & Jalan", "Pengaduan jalan, jembatan, drainase, dan irigasi", 248, "mint"],
  ["Penerangan & Fasum", "Lampu jalan, fasilitas umum, dan sarana desa", 126, "blue"],
  ["Kebersihan & Lingkungan", "Sampah, penghijauan, dan kebersihan lingkungan", 98, "orange"],
  ["Administrasi & Layanan", "Dokumen kependudukan dan layanan balai desa", 76, "purple"],
  ["Pendidikan & Kesehatan", "Sekolah, posyandu, dan layanan sosial warga", 54, "peach"],
  ["Pemberdayaan Ekonomi", "UMKM, pertanian, dan kegiatan ekonomi warga", 42, "mint"],
];
function Badge({ children, tone }) { return <span className={`reports-badge ${tone}`}>{children}</span>; }

export default function IndexCategories() {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  const filtered = categories.filter(([name, desc]) => `${name} ${desc}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="admin-page reports-page management-page"><AdminSidebar open={open} setOpen={setOpen} /><div className="admin-content"><AdminTopbar setOpen={setOpen} /><main className="admin-main reports-main">
    <div className="admin-heading"><div><h1>Kategori Laporan</h1><p>Kelola klasifikasi laporan dan aspirasi yang digunakan dalam pelayanan warga.</p></div></div>
    <div className="management-toolbar"><label className="report-search"><Search size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari kategori atau deskripsi..." /></label><button className="manual-report"><Plus size={13} /> Tambah Kategori</button></div>
    <section className="reports-table-card category-panel category-only-panel"><div className="reports-list-heading"><h2><FolderTree size={15} /> Daftar Kategori Layanan <small>{filtered.length} kategori aktif</small></h2><RefreshCw size={12} /></div><div className="category-list">{filtered.map(([name, desc, total, tone]) => <div className="category-item" key={name}><span className={`category-icon ${tone}`}><FolderTree size={16} /></span><div><b>{name}</b><small>{desc}</small></div><Badge tone={tone}>{total} laporan</Badge><button aria-label={`Edit ${name}`}><Edit3 size={14} /></button><MoreVertical size={14} /></div>)}</div></section>
    <div className="category-note"><Trash2 size={15} /><span><b>Perubahan kategori memengaruhi laporan baru.</b> Data laporan lama tetap tersimpan pada klasifikasi sebelumnya.</span></div>
  </main></div></div>;
}
