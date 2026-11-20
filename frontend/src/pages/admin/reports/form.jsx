import {
  ArrowLeft,
  CheckCircle2,
  FileImage,
  MapPin,
  Save,
  Send,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";
import "./style/form.css";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/reports";

const initialForm = {
  category_id: "",
  title: "",
  description: "",
  location: "",
  status: "diajukan",
};

export default function ReportForm() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Pengaduan Masalah");
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOptions() {
      try {
        const response = await fetch(`${API_URL}/options`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.message ?? "Gagal memuat pilihan form");

        setCategories(
          Array.isArray(result.categories) ? result.categories : [],
        );
      } catch (error) {
        if (error.name !== "AbortError")
          setMessage({ type: "error", text: error.message });
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

  const updateAttachment = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const isAllowed =
      ["png", "jpg", "jpeg"].includes(extension) &&
      ["image/png", "image/jpeg"].includes(file.type);
    if (!isAllowed) {
      event.target.value = "";
      setAttachment(null);
      setMessage({
        type: "error",
        text: "Bukti laporan hanya boleh berupa file PNG atau JPG/JPEG.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      setAttachment(null);
      setMessage({
        type: "error",
        text: "Ukuran bukti laporan maksimal 5 MB.",
      });
      return;
    }
    setAttachment(file);
    setMessage({ type: "", text: "" });
  };

  const removeAttachment = () => setAttachment(null);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const submit = async (event) => {
    event.preventDefault();
    setMessage({ type: "", text: "" });

    let currentUser = null;
    try {
      const serializedUser = localStorage.getItem("suara_desa_user") || sessionStorage.getItem("suara_desa_user");
      currentUser = serializedUser ? JSON.parse(serializedUser) : null;
    } catch {
      currentUser = null;
    }

    if (!currentUser?.id) {
      setMessage({ type: "error", text: "Sesi pengguna tidak ditemukan. Silakan login kembali." });
      return;
    }

    if (
      !form.category_id ||
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim()
    ) {
      setMessage({
        type: "error",
        text: "Lengkapi semua field wajib terlebih dahulu.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const encodedAttachment = attachment
        ? {
            name: attachment.name,
            type: attachment.type,
            size: attachment.size,
            data: await fileToDataUrl(attachment),
          }
        : null;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          user_id: Number(currentUser.id),
          report_type: "pengaduan",
          category_id: Number(form.category_id),
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          attachment: encodedAttachment,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Gagal menyimpan pengaduan");

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
      <AdminSidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="admin-content">
        <AdminTopbar setOpen={setSidebarOpen} />
        <main className="admin-main admin-report-form-main">
          <div className="admin-report-form-heading">
            <div>
              <Link to="/admin/reports" className="form-back-link">
                <ArrowLeft size={14} /> Kembali ke Pengaduan
              </Link>
              <h1>Buat Pengaduan Baru</h1>
              <p>
                Input laporan warga dengan field yang sesuai struktur database
                pengaduan.
              </p>
            </div>
          </div>

          <form className="admin-report-form-card" onSubmit={submit}>
            {message.text && (
              <div className={`admin-form-message ${message.type}`}>
                <CheckCircle2 size={15} /> {message.text}
              </div>
            )}

            <div className="admin-form-section-title">
              <span>01</span>
              <div>
                <h2>Identitas Laporan</h2>
                <p>Kategori dan status awal laporan.</p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field">
                <span>
                  Kategori <b>*</b>
                </span>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={updateField}
                  required
                  disabled={loadingOptions}
                >
                  <option value="">
                    {loadingOptions ? "Memuat kategori..." : "Pilih kategori"}
                  </option>
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form-field">
                <span>
                  Status Awal <b>*</b>
                </span>
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                >
                  <option value="diajukan">Diajukan</option>
                  <option value="diproses">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </label>
            </div>

            <div className="admin-form-section-title">
              <span>02</span>
              <div>
                <h2>Detail Pengaduan</h2>
                <p>
                  Jelaskan laporan secara jelas agar mudah diverifikasi petugas.
                </p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field">
                <span>
                  Judul Laporan <b>*</b>
                  <small>{form.title.length}/200 karakter</small>
                </span>
                <input
                  name="title"
                  value={form.title}
                  onChange={updateField}
                  maxLength={200}
                  placeholder="Contoh: Lampu jalan desa padam di depan balai warga"
                  required
                />
              </label>
              <label className="admin-form-field">
                <span>
                  Lokasi / Alamat Kejadian <b>*</b>
                </span>
                <div className="admin-input-with-icon">
                  <MapPin size={15} />
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="Contoh: Dusun Krajan, RW 02, dekat balai desa"
                    required
                  />
                </div>
              </label>
              <label className="admin-form-field">
                <span>
                  Deskripsi Lengkap <b>*</b>
                </span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={6}
                  placeholder="Tuliskan kondisi, kronologi, dan dampak laporan..."
                  required
                />
              </label>
              <div className="admin-form-field admin-attachment-field">
                <span>
                  Bukti Foto <small>Opsional · PNG/JPG maksimal 5 MB</small>
                </span>
                <label className="admin-file-dropzone">
                  <FileImage size={20} />
                  <span>
                    <b>
                      {attachment
                        ? attachment.name
                        : "Pilih foto bukti laporan"}
                    </b>
                    <small>
                      {attachment
                        ? `${(attachment.size / 1024 / 1024).toFixed(2)} MB`
                        : "Format yang didukung: PNG, JPG, JPEG"}
                    </small>
                  </span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={updateAttachment}
                  />
                </label>
                {attachment && (
                  <button
                    className="admin-file-remove"
                    type="button"
                    onClick={removeAttachment}
                  >
                    <X size={13} /> Hapus file
                  </button>
                )}
              </div>
            </div>

            <div className="admin-form-actions">
              <Link to="/admin/reports" className="admin-form-cancel">
                Batal
              </Link>
              <button
                type="submit"
                className="admin-form-submit"
                disabled={submitting || loadingOptions}
              >
                {submitting ? (
                  <>
                    <Save size={15} /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Send size={15} /> Simpan Pengaduan
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
