import { ArrowLeft, CheckCircle2, MapPin, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/reports";

const initialForm = {
  user_id: "",
  category_id: "",
  title: "",
  description: "",
  location: "",
  status: "diajukan",
  report_type: "pengaduan",
};

export default function ReportForm() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Pengaduan Masalah");
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadOptions() {
      try {
        const response = await fetch(`${API_URL}/options`, { signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message ?? "Gagal memuat pilihan form");

        setCategories(Array.isArray(result.categories) ? result.categories : []);
        setUsers(Array.isArray(result.users) ? result.users : []);
      } catch (error) {
        if (error.name !== "AbortError") setMessage({ type: "error", text: error.message });
      } finally {
        if (!controller.signal.aborted) setLoadingOptions(false);
      }
    }

    loadOptions();
    return () => controller.abort();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (message.type) setMessage({ type: "", text: "" });
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.user_id || !form.category_id || !form.title.trim() || !form.description.trim() || !form.location.trim()) {
      setMessage({ type: "error", text: "Lengkapi semua field wajib terlebih dahulu." });
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: Number(form.user_id),
          category_id: Number(form.category_id),
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Gagal menyimpan pengaduan");

      setMessage({ type: "success", text: "Pengaduan berhasil dibuat." });
      window.setTimeout(() => navigate("/admin/reports"), 700);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page reports-page report-queue-page">
      <AdminSidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="admin-content">
        <AdminTopbar setOpen={setSidebarOpen} />
        <main className="admin-main admin-report-form-main">
          <div className="admin-report-form-heading">
            <div>
              <Link to="/admin/reports" className="form-back-link"><ArrowLeft size={14} /> Kembali ke Pengaduan</Link>
              <h1>Buat Pengaduan Baru</h1>
              <p>Input laporan warga dengan field yang sesuai struktur database pengaduan.</p>
            </div>
          </div>

          <form className="admin-report-form-card" onSubmit={submit}>
            {message.text && <div className={`admin-form-message ${message.type}`}><CheckCircle2 size={15} /> {message.text}</div>}

            <div className="admin-form-section-title"><span>01</span><div><h2>Identitas Laporan</h2><p>Tentukan pelapor, kategori, dan jenis laporan.</p></div></div>
            <div className="admin-form-grid two-columns">
              <label className="admin-form-field"><span>Pelapor <b>*</b></span><select name="user_id" value={form.user_id} onChange={updateField} required disabled={loadingOptions}><option value="">{loadingOptions ? "Memuat pelapor..." : "Pilih pelapor"}</option>{users.map((user) => <option value={user.id} key={user.id}>{user.name} — {user.email}</option>)}</select></label>
              <label className="admin-form-field"><span>Kategori <b>*</b></span><select name="category_id" value={form.category_id} onChange={updateField} required disabled={loadingOptions}><option value="">{loadingOptions ? "Memuat kategori..." : "Pilih kategori"}</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
              <label className="admin-form-field"><span>Jenis Laporan <b>*</b></span><select name="report_type" value={form.report_type} onChange={updateField}><option value="pengaduan">Pengaduan</option><option value="aspirasi">Aspirasi</option></select></label>
              <label className="admin-form-field"><span>Status Awal <b>*</b></span><select name="status" value={form.status} onChange={updateField}><option value="diajukan">Diajukan</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option><option value="ditolak">Ditolak</option></select></label>
            </div>

            <div className="admin-form-section-title"><span>02</span><div><h2>Detail Pengaduan</h2><p>Jelaskan laporan secara jelas agar mudah diverifikasi petugas.</p></div></div>
            <div className="admin-form-grid">
              <label className="admin-form-field"><span>Judul Laporan <b>*</b><small>{form.title.length}/200 karakter</small></span><input name="title" value={form.title} onChange={updateField} maxLength={200} placeholder="Contoh: Lampu jalan desa padam di depan balai warga" required /></label>
              <label className="admin-form-field"><span>Lokasi / Alamat Kejadian <b>*</b></span><div className="admin-input-with-icon"><MapPin size={15} /><input name="location" value={form.location} onChange={updateField} placeholder="Contoh: Dusun Krajan, RW 02, dekat balai desa" required /></div></label>
              <label className="admin-form-field"><span>Deskripsi Lengkap <b>*</b></span><textarea name="description" value={form.description} onChange={updateField} rows={6} placeholder="Tuliskan kondisi, kronologi, dan dampak laporan..." required /></label>
            </div>

            <div className="admin-form-actions"><Link to="/admin/reports" className="admin-form-cancel">Batal</Link><button type="submit" className="admin-form-submit" disabled={submitting || loadingOptions}>{submitting ? <><Save size={15} /> Menyimpan...</> : <><Send size={15} /> Simpan Pengaduan</>}</button></div>
          </form>
        </main>
      </div>
    </div>
  );
}
