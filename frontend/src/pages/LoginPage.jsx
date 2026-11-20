import {
  Eye,
  EyeOff,
  LockKeyhole,
  MessageCircleQuestion,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/LoginPage.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ identity: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    if (!form.identity.trim() || !form.password) {
      setStatus({
        type: "error",
        message: "Nomor identitas dan kata sandi wajib diisi.",
      });
      return;
    }
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login gagal.");
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("suara_desa_token", result.token);
      storage.setItem("suara_desa_user", JSON.stringify(result.user));
      if (remember) sessionStorage.removeItem("suara_desa_token");
      else localStorage.removeItem("suara_desa_token");
      navigate(result.user.role === "admin" ? "/admin/dashboard" : "/", {
        replace: true,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-intro" aria-label="Informasi SuaraDesa">
        <div className="login-status">
          <span /> Terhubung dengan Data Warga Desa
        </div>
        <h1>
          Selamat Datang di Portal
          <br />
          <em>SuaraDesa</em>
        </h1>
        <p>
          Sampaikan aspirasi warga, pantau perkembangan pembangunan, dan akses
          transparansi administrasi desa secara langsung, mudah, dan aman.
        </p>
        <div className="login-benefit">
          <span>
            <ShieldCheck size={16} />
          </span>
          <div>
            <b>Terhubung dengan Data Warga Desa</b>
            <small>
              Aspirasi dan pengaduan langsung diterima oleh pengurus RT/RW dan
              perangkat desa.
            </small>
          </div>
        </div>
        <div className="login-benefit">
          <span>
            <LockKeyhole size={16} />
          </span>
          <div>
            <b>Privasi & Keamanan Terjamin</b>
            <small>
              Data kependudukan dan pesan Anda dilindungi dengan standar
              keamanan resmi.
            </small>
          </div>
        </div>
      </section>
      <section className="login-card">
        <div className="login-heading">
          <h2>Masuk ke SuaraDesa</h2>
          <p>
            Masukkan NIK, nomor WhatsApp, atau email terdaftar untuk
            melanjutkan.
          </p>
        </div>
        <form onSubmit={submit}>
          <label className="login-field">
            <b>Nomor Identitas / Kontak (NIK / WhatsApp / Email)</b>
            <span>
              <UsersRound size={15} />
              <input
                autoComplete="username"
                value={form.identity}
                onChange={update("identity")}
                placeholder="Contoh: 330208xxxx0002 atau 08123456789"
              />
            </span>
          </label>
          <label className="login-field">
            <b>Kata Sandi / PIN Warga</b>
            <span>
              <LockKeyhole size={15} />
              <input
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={update("password")}
                placeholder="Masukkan 6 digit PIN atau kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />{" "}
              Ingat saya di perangkat ini
            </label>
            <a href="#forgot">Lupa Kata Sandi?</a>
          </div>
          {status.message && (
            <p className={`login-${status.type}`}>{status.message}</p>
          )}
          <button
            className="button button-dark login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                Masuk <span>→</span>
              </>
            )}
          </button>
        </form>
        <div className="login-divider">
          <span>atau</span>
        </div>
        <Link className="button register-button" to="/register">
          <UserRoundPlus size={15} /> Belum punya akun? Daftar Akun Baru
        </Link>
        <div className="login-help">
          <MessageCircleQuestion size={14} /> Butuh bantuan masuk? Hubungi via
          WhatsApp
        </div>
      </section>
    </main>
  );
}
