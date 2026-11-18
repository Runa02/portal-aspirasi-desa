import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Plus,
  Search,
  UsersRound,
  Wrench,
  Archive,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminTopbar from "../components/AdminTopbar.jsx";
import ReportTable from "./components/ReportTable.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/reports"
).replace(/\/$/, "");

const API_URL_SUMMARY = `${API_URL}/counts`;

const PAGE_SIZE = 10;

export default function IndexReports() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Pengaduan Masalah");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [tab, setTab] = useState("all");

  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    total_pengaduan: 0,
    perlu_verifikasi: 0,
    sedang_diproses: 0,
    selesai: 0,
    ditolak: 0,
  });

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState("");

  const stats = [
    [
      "Total Pengaduan",
      summary.total_pengaduan,
      "Seluruh laporan pengaduan",
      ClipboardList,
      "neutral",
    ],
    [
      "Perlu Verifikasi",
      summary.perlu_verifikasi,
      "Membutuhkan tindakan",
      Archive,
      "orange",
    ],
    [
      "Sedang Diproses",
      summary.sedang_diproses,
      "Dalam penanganan",
      UsersRound,
      "blue",
    ],
    [
      "Terselesaikan",
      summary.selesai,
      "Pengaduan selesai",
      CheckCircle2,
      "green",
    ],
    ["Ditolak", summary.ditolak, "Pengaduan ditolak", X, "red"],
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function fetchReports() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data laporan");
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Format respons API tidak valid");
        }

        const formattedReports = result.data.map((report) => {
          const statusConfig = {
            diajukan: {
              tone: "waiting",
              action: "Verifikasi",
            },
            diproses: {
              tone: "progress",
              action: "Proses",
            },
            selesai: {
              tone: "done",
              action: "Lihat",
            },
            ditolak: {
              tone: "rejected",
              action: "Lihat",
            },
          };

          const config = statusConfig[report.status] ?? {
            tone: "waiting",
            action: "Lihat",
          };

          return {
            ...report,
            id: String(report.id),
            reporter: report.reporter ?? "Tidak diketahui",
            location: report.location ?? "Lokasi tidak tersedia",
            phone: report.phone ?? "",
            category: report.category ?? "-",
            detail: report.description ?? "Tidak ada deskripsi laporan.",
            photos: Number(report.photos ?? 0),
            date: Number.isNaN(new Date(report.created_at).getTime())
              ? "Tanggal tidak tersedia"
              : new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta",
                }).format(new Date(report.created_at)),
            statusTone: config.tone,
            action: config.action,
            statusLabel:
              report.status === "diajukan"
                ? "Menunggu Verifikasi"
                : report.status === "diproses"
                  ? "Sedang Diproses"
                  : report.status === "selesai"
                    ? "Selesai & Arsip"
                    : "Ditolak",
          };
        });

        setReports(formattedReports);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    async function fetchSummary() {
      try {
        setSummaryLoading(true);
        setSummaryError("");

        const response = await fetch(API_URL_SUMMARY, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data ringkasan laporan");
        }

        const result = await response.json();

        const data = result.data;

        if (
          !data ||
          [
            "total_pengaduan",
            "perlu_verifikasi",
            "sedang_diproses",
            "selesai",
            "ditolak",
          ].some(
            (key) =>
              data[key] === undefined ||
              data[key] === null ||
              !Number.isFinite(Number(data[key])),
          )
        ) {
          throw new Error("Format respons ringkasan API tidak valid");
        }

        if (!controller.signal.aborted) {
          setSummary({
            total_pengaduan: Number(data.total_pengaduan),
            perlu_verifikasi: Number(data.perlu_verifikasi),
            sedang_diproses: Number(data.sedang_diproses),
            selesai: Number(data.selesai),
            ditolak: Number(data.ditolak),
          });
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setSummaryError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSummaryLoading(false);
        }
      }
    }

    fetchSummary();

    fetchReports();

    return () => controller.abort();
  }, []);

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          report.id,
          report.title,
          report.reporter,
          report.location,
          report.category,
        ].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedQuery),
        );

      const matchesCategory =
        category === "Semua Kategori" || report.category === category;
      const matchesTab =
        tab === "all" ||
        (tab === "waiting" && report.status === "diajukan") ||
        (tab === "processing" && report.status === "diproses") ||
        (tab === "done" && report.status === "selesai");

      return matchesQuery && matchesCategory && matchesTab;
    });
  }, [category, query, reports, tab]);

  const categoryOptions = useMemo(
    () => [
      ...new Set(reports.map((report) => report.category).filter(Boolean)),
    ],
    [reports],
  );

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const paginatedReports = filteredReports.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [category, query, tab]);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages));
    setSelectedIds((currentIds) =>
      currentIds.filter((id) =>
        filteredReports.some((report) => report.id === id),
      ),
    );
  }, [filteredReports, totalPages]);

  const toggleReport = (id) => {
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  };

  const toggleAll = (checked) => {
    setSelectedIds((currentIds) =>
      checked
        ? [
            ...new Set([
              ...currentIds,
              ...paginatedReports.map((report) => report.id),
            ]),
          ]
        : currentIds.filter(
            (id) => !paginatedReports.some((report) => report.id === id),
          ),
    );
  };

  const tabItems = [
    ["all", `Semua (${reports.length})`],
    [
      "waiting",
      `Menunggu Verifikasi (${reports.filter((report) => report.status === "diajukan").length})`,
    ],
    [
      "processing",
      `Diproses (${reports.filter((report) => report.status === "diproses").length})`,
    ],
    [
      "done",
      `Selesai (${reports.filter((report) => report.status === "selesai").length})`,
    ],
  ];

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
        <main className="admin-main reports-main">
          <div className="report-queue-heading">
            <div>
              <h1>Manajemen Pengaduan Warga</h1>
              <p>
                Kelola verifikasi, penugasan tim lapangan, dan pantau status
                tindak lanjut aduan.
              </p>
            </div>
            <div className="report-heading-actions">
              <button type="button">
                <Download size={13} /> Ekspor Data
              </button>
              <button
                type="button"
                className="manual-report"
                onClick={() => navigate("/admin/reports/form")}
              >
                <Plus size={13} /> Buat Pengaduan
              </button>
            </div>
          </div>
          <section className="report-stat-grid">
            {stats.map(([label, value, note, Icon, tone]) => (
              <article className={`report-stat-card ${tone}`} key={label}>
                <div>
                  <span>{label}</span>
                  <strong>
                    {summaryLoading || summaryError ? "—" : value}
                  </strong>
                  <small>
                    {summaryError
                      ? "Gagal memuat statistik"
                      : summaryLoading
                        ? "Memuat statistik..."
                        : note}
                  </small>
                </div>
                <Icon size={19} />
              </article>
            ))}
          </section>
          <section className="report-controls">
            <div className="report-tabs">
              {tabItems.map(([value, label]) => (
                <button
                  type="button"
                  className={tab === value ? "active" : ""}
                  onClick={() => setTab(value)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="report-control-filters">
              <label className="report-search">
                <Search size={14} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nomor tiket, nama pelapor, atau topik..."
                />
              </label>
              <label className="report-category-select">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option>Semua Kategori</option>
                  {categoryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
          </section>
          <div className="report-selection-bar">
            <span>
              <Wrench size={13} />{" "}
              {selectedIds.length
                ? `${selectedIds.length} pengaduan dipilih`
                : "Pilih pengaduan untuk aksi massal"}
            </span>
          </div>
          {loading && (
            <div className="reports-feedback">Memuat data pengaduan...</div>
          )}
          {error && (
            <div className="reports-feedback error">
              {error}. Pastikan server API berjalan di {API_URL}.
            </div>
          )}
          <ReportTable
            reports={loading || error ? [] : paginatedReports}
            selectedIds={selectedIds}
            onToggle={toggleReport}
            onToggleAll={toggleAll}
            page={page}
            totalPages={totalPages}
            totalItems={filteredReports.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}
