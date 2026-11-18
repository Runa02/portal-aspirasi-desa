import {
  Check,
  ChevronDown,
  Download,
  Eye,
  Filter,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserCog,
} from "lucide-react";
import { useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const users = [
  {
    initials: "JS",
    tone: "mint",
    name: "Joko Santoso",
    detail: "Petani / Wiraswasta • Pria (38 th)",
    nik: "330208******0002",
    role: "Warga Terverifikasi",
    roleTone: "light-blue",
    place: "Dusun Krajan",
    area: "RT 04 / RW 02",
    phone: "+62 812-3456-7890",
    activity: "10 menit yang lalu",
    activityNote: "3 Laporan Aktif",
    status: "Selesai Validasi",
    statusTone: "mint",
  },
  {
    initials: "BS",
    tone: "peach",
    name: "Pak Budi Santoso",
    detail: "Pamong Wilayah • Pria (52 th)",
    nik: "330208******0019",
    role: "Ketua RT 04 / Pamong",
    roleTone: "peach",
    place: "Dusun Krajan",
    area: "RW 02 / Penanggung Jawab RT 04",
    phone: "+62 813-9988-7766",
    activity: "2 jam yang lalu",
    activityNote: "14 Warga",
    status: "Aktif • Aparat RT",
    statusTone: "mint",
  },
  {
    initials: "SR",
    tone: "lavender",
    name: "Siti Rohmah",
    detail: "Tenaga Pendidik PAUD • Wanita (29 th)",
    nik: "330208******0044",
    role: "Warga Terverifikasi",
    roleTone: "light-blue",
    place: "Dusun Krajan",
    area: "RT 01 / RW 02",
    phone: "+62 857-1234-9991",
    activity: "Kemarin, 16:40",
    activityNote: "1 Usulan Musrenbang",
    status: "Selesai Validasi",
    statusTone: "mint",
  },
  {
    initials: "RA",
    tone: "green",
    name: "Rina Astuti",
    detail: "Staf Balai Desa • Wanita (27 th)",
    nik: "330208******0011",
    role: "Operator Pelayanan & Loket",
    roleTone: "blue",
    place: "Balai Desa Sukamaju",
    area: "Kantor Pelayanan Terpadu",
    phone: "+62 821-3344-5566",
    activity: "Sedang Online",
    activityNote: "Menangani 26 Tiket",
    status: "Super Operator",
    statusTone: "blue",
  },
  {
    initials: "BW",
    tone: "orange",
    name: "Bambang Wijaya",
    detail: "Unggah KK & e-KTP 3 jam lalu",
    nik: "330208******0089",
    role: "Pendaftar Warga",
    roleTone: "blue",
    place: "Dusun Sukamaju Asri",
    area: "RT 03 / RW 12 (Pindah Masuk)",
    phone: "+62 899-0011-2233",
    activity: "3 jam yang lalu",
    activityNote: "Menunggu Tindakan Admin",
    status: "Validasi e-KTP",
    statusTone: "orange",
    pending: true,
  },
];

function Badge({ children, tone = "gray" }) {
  return <span className={`reports-badge ${tone}`}>{children}</span>;
}

function UserRow({ user }) {
  return (
    <tr className={`user-row ${user.pending ? "pending" : ""}`}>
      <td className="user-check">
        <input type="checkbox" aria-label={`Pilih pengguna ${user.name}`} />
      </td>
      <td>
        <div className="user-profile-cell">
          <span className={`user-avatar ${user.tone}`}>{user.initials}</span>
          <div>
            <b>
              {user.name} <Check size={11} />
            </b>
            <small>{user.detail}</small>
            {user.pending && <em>WARGA BARU</em>}
          </div>
        </div>
      </td>
      <td>
        <code>{user.nik}</code>
      </td>
      <td>
        <Badge tone={user.roleTone}>
          <i />
          {user.role}
        </Badge>
      </td>
      <td>
        <div className="user-place">
          <b>{user.place}</b>
          <small>{user.area}</small>
        </div>
      </td>
      <td>
        <a
          className="user-phone"
          href={`tel:${user.phone.replace(/[^0-9]/g, "")}`}
        >
          ▤ {user.phone}
        </a>
      </td>
      <td>
        <div className={`user-activity ${user.pending ? "warning" : ""}`}>
          <b>{user.activity}</b>
          <small>{user.activityNote}</small>
        </div>
      </td>
      <td>
        <Badge tone={user.statusTone}>{user.status}</Badge>
      </td>
      <td>
        <div className="user-actions">
          {user.pending ? (
            <button className="validate-action" type="button">
              <Check size={11} /> Validasi Berkas
            </button>
          ) : (
            <>
              <button type="button" aria-label={`Lihat ${user.name}`}>
                <Eye size={15} />
              </button>
              <button type="button" aria-label={`Kelola ${user.name}`}>
                <UserCog size={14} />
              </button>
            </>
          )}
          <MoreVertical size={15} />
        </div>
      </td>
    </tr>
  );
}

export default function IndexUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState("Semua Dusun");
  const [status, setStatus] = useState("Semua Status");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const searchable =
          `${user.name} ${user.nik} ${user.phone} ${user.place}`.toLowerCase();
        return (
          searchable.includes(query.toLowerCase()) &&
          (place === "Semua Dusun" || user.place === place) &&
          (status === "Semua Status" || user.status === status)
        );
      }),
    [query, place, status],
  );

  const resetFilters = () => {
    setQuery("");
    setPlace("Semua Dusun");
    setStatus("Semua Status");
  };

  return (
    <div className="admin-page reports-page user-page">
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="admin-content">
        <AdminTopbar setOpen={setSidebarOpen} />
        <main className="admin-main reports-main">
          <div className="admin-heading">
            <div>
              <h1>Manajemen Pengguna</h1>
              <p>
                Kelola data warga, hak akses, dan validasi akun yang terdaftar
                di Portal SuaraDesa.
              </p>
            </div>
          </div>
          <div className="reports-toolbar">
            <div className="reports-actions">
              <button className="select-action">
                <Filter size={13} /> Tindakan Massal (0){" "}
                <ChevronDown size={12} />
              </button>
              <button>
                <Download size={13} /> Ekspor Data
              </button>
              <button className="manual-report">
                <Plus size={13} /> Tambah Pengguna
              </button>
            </div>
          </div>
          <section className="reports-filter user-filter">
            <label className="report-search">
              <Search size={14} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari NIK, Nama Lengkap, No WhatsApp, atau Dusun..."
              />
            </label>
            <label className="user-select">
              <select
                value={place}
                onChange={(event) => setPlace(event.target.value)}
              >
                <option>Semua Dusun</option>
                <option>Dusun Krajan</option>
                <option>Balai Desa Sukamaju</option>
                <option>Dusun Sukamaju Asri</option>
              </select>
              <ChevronDown size={13} />
            </label>
            <label className="user-select">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>Semua Status</option>
                <option>Selesai Validasi</option>
                <option>Aktif • Aparat RT</option>
                <option>Super Operator</option>
                <option>Validasi e-KTP</option>
              </select>
              <SlidersHorizontal size={13} />
            </label>
            <button className="reset-filter" onClick={resetFilters}>
              <RefreshCw size={12} /> Reset Filter
            </button>
          </section>
          <section className="reports-table-card user-table-card">
            <div className="reports-list-heading">
              <h2>
                Daftar Pengguna{" "}
                <small>
                  Menampilkan {filteredUsers.length} dari 3.858 total pengguna
                </small>
              </h2>
              <span>
                Diperbarui: 2 menit yang lalu <RefreshCw size={11} />
              </span>
            </div>
            <div className="reports-table-wrapper">
              <table className="reports-table users-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Pilih semua pengguna"
                      />
                    </th>
                    <th>PROFIL & NAMA LENGKAP</th>
                    <th>NIK (TERENKRIPSI)</th>
                    <th>PERAN / HAK AKSES</th>
                    <th>WILAYAH DUSUN & RT/RW</th>
                    <th>NO. WHATSAPP</th>
                    <th>AKTIVITAS TERAKHIR</th>
                    <th>STATUS VALIDASI</th>
                    <th>AKSI OTORITAS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length ? (
                    filteredUsers.map((user) => (
                      <UserRow user={user} key={user.nik} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="reports-empty">
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="reports-pagination">
              <span>
                Menampilkan <b>10</b> dari <strong>3.858 total pengguna</strong>
              </span>
              <div>
                <button>‹</button>
                <button className="current">1</button>
                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>155</button>
                <button>›</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
