import {
  Archive,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Lightbulb,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const aspirations = [
  {
    id: "#AS-2024-0286",
    date: "21 Okt 2024, 08:45 WIB",
    author: "Rina Wulandari",
    location: "Dusun Krajan (RW 02 / RT 04)",
    category: "Pemberdayaan Ekonomi",
    title: "Pelatihan Digital Marketing untuk UMKM Desa",
    detail: "Pelatihan pemasaran digital untuk kelompok ibu-ibu PKK dan pemuda karang taruna.",
    support: 115,
    status: "Terverifikasi",
    statusTone: "mint",
    stage: "Masuk agenda Musrenbangdes",
    action: "Detail & Tinjau",
  },
  {
    id: "#AS-2024-0281",
    date: "20 Okt 2024, 16:20 WIB",
    author: "Karang Taruna RW 01",
    location: "Dusun Mawar (RT 03 / RW 01)",
    category: "Kepemudaan & Olahraga",
    title: "Pengadaan Peralatan Olahraga Lapangan Desa",
    detail: "Usulan bola, net, dan penerangan untuk menghidupkan kegiatan olahraga warga.",
    support: 86,
    status: "Sedang Dikaji",
    statusTone: "blue",
    stage: "Menunggu verifikasi anggaran",
    action: "Proses Usulan",
  },
  {
    id: "#AS-2024-0274",
    date: "18 Okt 2024, 10:05 WIB",
    author: "Slamet Riyadi",
    location: "Dusun Kuning (RW 01 / RT 02)",
    category: "Pendidikan",
    title: "Pojok Baca dan Perpustakaan Mini Dusun",
    detail: "Pemanfaatan ruang kosong balai dusun sebagai tempat belajar anak-anak.",
    support: 64,
    status: "Butuh Data Tambahan",
    statusTone: "orange",
    stage: "Menunggu kelengkapan dokumen",
    action: "Minta Kelengkapan",
  },
  {
    id: "#AS-2024-0268",
    date: "16 Okt 2024, 13:40 WIB",
    author: "Ibu-Ibu PKK Desa",
    location: "Dusun Sukamaju",
    category: "Kesehatan & Sosial",
    title: "Posyandu Keliling untuk Lansia dan Disabilitas",
    detail: "Layanan pemeriksaan rutin agar warga yang sulit datang ke posyandu tetap terlayani.",
    support: 142,
    status: "Disetujui",
    statusTone: "mint",
    stage: "Menunggu penjadwalan kegiatan",
    action: "Lihat Detail",
  },
  {
    id: "#AS-2024-0259",
    date: "12 Okt 2024, 09:15 WIB",
    author: "Ahmad Dani",
    location: "Dusun Ngumpul (RW 02)",
    category: "Lingkungan",
    title: "Bank Sampah dan Program Tukar Sampah",
    detail: "Program pengelolaan sampah rumah tangga dengan insentif untuk warga.",
    support: 98,
    status: "Selesai Ditindaklanjuti",
    statusTone: "gray",
    stage: "Diteruskan ke pengelola lingkungan",
    action: "Lihat Arsip",
  },
];

function Badge({ children, tone = "gray" }) {
  return <span className={`reports-badge ${tone}`}>{children}</span>;
}

function AspirationRow({ aspiration }) {
  return (
    <tr className="report-row">
      <td className="report-check">
        <input type="checkbox" aria-label={`Pilih aspirasi ${aspiration.id}`} />
      </td>
      <td>
        <div className="report-ticket">
          <b>{aspiration.id}</b>
          <small>{aspiration.date}</small>
          <em>▣ Portal Warga</em>
        </div>
      </td>
      <td>
        <div className="report-person">
          <b><UserRound size={11} /> {aspiration.author}</b>
          <small>⌖ {aspiration.location}</small>
        </div>
      </td>
      <td>
        <div className="report-detail">
          <Badge tone="light-blue">{aspiration.category}</Badge>
          <b>{aspiration.title}</b>
          <small>{aspiration.detail}</small>
          <span className="attachment"><ThumbsUp size={11} /> {aspiration.support} warga mendukung</span>
        </div>
      </td>
      <td>
        <div className="report-urgency">
          <Badge tone={aspiration.statusTone}>{aspiration.status}</Badge>
          <b><ThumbsUp size={11} /> {aspiration.support} dukungan</b>
          <small>Validasi suara warga</small>
        </div>
      </td>
      <td>
        <div className="report-officer">
          <b><i><Lightbulb size={11} /></i> Tim Perencana Desa</b>
          <small>{aspiration.stage}</small>
          {aspiration.status === "Butuh Data Tambahan" && (
            <button type="button"><CheckCircle2 size={11} /> Tinjau Berkas</button>
          )}
        </div>
      </td>
      <td>
        <div className="report-status">
          <Badge tone={aspiration.statusTone}>{aspiration.status}</Badge>
          <small>{aspiration.stage}</small>
        </div>
      </td>
      <td>
        <div className="report-action">
          <button type="button" className={aspiration.status === "Terverifikasi" ? "primary-action" : ""}>
            {aspiration.action}
          </button>
          <MoreVertical size={15} />
        </div>
      </td>
    </tr>
  );
}

export default function IndexAspiration() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [status, setStatus] = useState("Semua Status");

  const filteredAspirations = useMemo(() => aspirations.filter((item) => {
    const matchesQuery = `${item.id} ${item.title} ${item.author} ${item.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === "Semua Kategori" || item.category === category) && (status === "Semua Status" || item.status === status);
  }), [query, category, status]);

  const resetFilters = () => {
    setQuery("");
    setCategory("Semua Kategori");
    setStatus("Semua Status");
  };

  return (
    <div className="admin-page reports-page">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="admin-content">
        <AdminTopbar setOpen={setSidebarOpen} />
        <main className="admin-main reports-main">
          <div className="admin-heading">
            <div>
              <h1>Manajemen Aspirasi & Usulan</h1>
              <p>Kelola ide pembangunan warga, validasi dukungan, dan pantau usulan yang masuk ke agenda desa.</p>
            </div>
          </div>

          <div className="reports-toolbar">
            <div className="reports-actions">
              <button className="select-action"><Archive size={13} /> Aksi Massal (0 dipilih) <ChevronDown size={12} /></button>
              <button><Download size={13} /> Ekspor Data</button>
              <button><Filter size={13} /> Cetak Rekap Aspirasi</button>
              <button className="manual-report"><Plus size={13} /> Input Aspirasi Manual</button>
            </div>
          </div>

          <section className="reports-filter">
            <label className="report-search">
              <Search size={14} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kode, judul usulan, atau nama pengusul..." />
            </label>
            <div className="report-filter-grid">
              <label><small>KATEGORI ASPIRASI</small><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Semua Kategori</option><option>Pemberdayaan Ekonomi</option><option>Kepemudaan & Olahraga</option><option>Pendidikan</option><option>Kesehatan & Sosial</option><option>Lingkungan</option></select></label>
              <label><small>WILAYAH / DUSUN</small><select><option>Semua Dusun</option><option>Dusun Krajan</option><option>Dusun Mawar</option><option>Dusun Kuning</option></select></label>
              <label><small>STATUS USULAN</small><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Semua Status</option><option>Terverifikasi</option><option>Sedang Dikaji</option><option>Butuh Data Tambahan</option><option>Disetujui</option><option>Selesai Ditindaklanjuti</option></select></label>
              <label><small>RENTANG WAKTU</small><div className="date-filter-input"><CalendarDays size={13} /> 30 Hari Terakhir <CalendarDays size={12} /></div></label>
              <button className="reset-filter" onClick={resetFilters}><RefreshCw size={12} /> Reset Filter</button>
            </div>
          </section>

          <section className="reports-table-card">
            <div className="reports-list-heading">
              <h2>Daftar Aspirasi Warga <small>Menampilkan {filteredAspirations.length} dari 286 data</small></h2>
              <span>Diperbarui: 2 menit yang lalu <RefreshCw size={11} /></span>
            </div>
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead><tr><th><input type="checkbox" aria-label="Pilih semua aspirasi" /></th><th>NO. ASPIRASI & TANGGAL</th><th>PENGUSUL & LOKASI</th><th>RINCIAN USULAN & DUKUNGAN</th><th>VALIDASI WARGA</th><th>PENGELOLA USULAN</th><th>STATUS USULAN</th><th>AKSI CEPAT</th></tr></thead>
                <tbody>{filteredAspirations.length > 0 ? filteredAspirations.map((item) => <AspirationRow aspiration={item} key={item.id} />) : <tr><td colSpan={8} className="reports-empty">Tidak ada aspirasi ditemukan.</td></tr>}</tbody>
              </table>
            </div>
            <div className="reports-pagination"><span>Tampilkan: <b>10 data</b>&nbsp;&nbsp;&nbsp; Menampilkan 1 - {filteredAspirations.length} dari total 286 aspirasi warga</span><div><button>‹</button><button className="current">1</button><button>2</button><button>3</button><span>...</span><button>29</button><button>›</button></div></div>
          </section>
        </main>
      </div>
    </div>
  );
}
