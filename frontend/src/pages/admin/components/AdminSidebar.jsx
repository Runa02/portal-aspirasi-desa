import {
  AlertCircle,
  Building2,
  ClipboardCheck,
  CheckCircle2,
  ChevronDown,
  FileBarChart,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MapPin,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const menu = [
  ["Ringkasan", LayoutDashboard, "/admin/dashboard"],
  ["Pengaduan Masalah", AlertCircle, "/admin/reports"],
  ["Aspirasi & Usulan Warga", MessageSquare, "/admin/aspirasi"],
  ["Manajemen Pengguna", Users, "/admin/pengguna"],
  ["Petugas & Disposisi", ClipboardCheck, "/admin/petugas"],
  ["Laporan & Rekap Cetak", FileBarChart, "/admin/laporan"],
];

const masterDataMenu = [
  ["Kategori Laporan", FolderTree, "/admin/kategori"],
  ["Wilayah Desa", MapPin, "/admin/wilayah"],
  ["Jabatan", Users, "/admin/jabatan"],
  ["Unit / Bidang", FolderTree, "/admin/unit-bidang"],
  ["Prioritas Laporan", ClipboardCheck, "/admin/prioritas"],
  ["Status Laporan", CheckCircle2, "/admin/status-laporan"],
];

export default function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [masterDataOpen, setMasterDataOpen] = useState(
    location.pathname.startsWith("/admin/kategori") ||
      location.pathname.startsWith("/admin/wilayah") ||
      location.pathname.startsWith("/admin/jabatan") ||
      location.pathname.startsWith("/admin/unit-bidang") ||
      location.pathname.startsWith("/admin/prioritas") ||
      location.pathname.startsWith("/admin/status-laporan"),
  );

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <aside className={`admin-sidebar ${open ? "open" : ""}`}>
      <div className="admin-brand">
        <span>
          <Building2 size={20} />
        </span>
        <div>
          <b>SuaraDesa</b>
          <small>Portal Desa Sukamaju</small>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Tutup menu">
          <X size={18} />
        </button>
      </div>

      <div className="admin-menu-label">MENU UTAMA</div>

      <nav>
        {menu.map(([label, MenuIcon, path], index) => {
          const isActive =
            location.pathname === path ||
            (path !== "/admin" && location.pathname.startsWith(path + "/"));

          return (
            <button
              key={label}
              className={isActive ? "active" : ""}
              onClick={() => handleNavigate(path)}
            >
              <MenuIcon size={15} />
              <span>{label}</span>
              {index === 1 && <em>14</em>}
            </button>
          );
        })}

        <div className="admin-config-label">KONFIGURASI SISTEM</div>
        <div className={`admin-master-data ${masterDataMenu.some(([, , path]) => location.pathname === path || location.pathname.startsWith(`${path}/`)) ? "active" : ""}`}>
          <button
            type="button"
            className="admin-master-toggle"
            onClick={() => setMasterDataOpen((value) => !value)}
          >
            <FolderTree size={15} />
            <span>Master Data</span>
            <ChevronDown className={masterDataOpen ? "rotated" : ""} size={14} />
          </button>
          {masterDataOpen && (
            <div className="admin-master-submenu">
              {masterDataMenu.map(([label, MenuIcon, path]) => {
                const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
                return <button key={path} className={isActive ? "active" : ""} onClick={() => handleNavigate(path)}><MenuIcon size={13} /><span>{label}</span></button>;
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="admin-sidebar-bottom">
        <button onClick={() => handleNavigate("/admin/pengaturan")}>
          <Settings size={15} />
          Pengaturan Sistem
        </button>

        <button className="logout">
          <LogOut size={15} />
          Keluar / Logout
        </button>
      </div>
    </aside>
  );
}
