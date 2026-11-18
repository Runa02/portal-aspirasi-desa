import { Check, ChevronLeft, ChevronRight, Eye, Play, X } from "lucide-react";

function StatusBadge({ tone, children }) {
  return <span className={`report-status-badge ${tone}`}>{children}</span>;
}

function ReportRow({ report, selected, onToggle }) {
  const actionIcon =
    report.statusTone === "done" ? (
      <Eye size={14} />
    ) : report.statusTone === "waiting" ? (
      <Check size={14} />
    ) : report.statusTone === "rejected" ? (
      <X size={14} />
    ) : (
      <Play size={14} />
    );

  const phone = report.phone ?? "";

  return (
    <tr>
      <td className="report-table-check">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(report.id)}
          aria-label={`Pilih ${report.id}`}
        />
      </td>

      <td>
        <div className="report-ticket-cell">
          <strong>#{report.id}</strong>
          <small>{report.date}</small>
        </div>
      </td>

      <td>
        <div className="report-reporter-cell">
          <strong>{report.reporter}</strong>
          <small>{report.location}</small>

          {phone ? (
            <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>
          ) : (
            <small>Tidak ada nomor telepon</small>
          )}
        </div>
      </td>

      <td>
        <div className="report-problem-cell">
          <div className="report-problem-meta">
            <span>{report.category}</span>
            <small>{report.photos} Foto</small>
          </div>

          <strong>{report.title}</strong>
          <small>{report.detail}</small>
        </div>
      </td>

      <td>
          <StatusBadge tone={report.statusTone}>{report.statusLabel ?? report.status}</StatusBadge>
      </td>

      <td>
        <div className="report-row-actions">
          <button
            type="button"
            aria-label={`Lihat ${report.id}`}
            className="icon-action"
          >
            <Eye size={14} />
          </button>

          <button
            type="button"
            aria-label={`${report.action} ${report.id}`}
            className={`icon-action filled ${report.statusTone}`}
          >
            {actionIcon}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ReportTable({
  reports = [],
  selectedIds = [],
  onToggle = () => {},
  onToggleAll = () => {},
  page = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const allSelected =
    reports.length > 0 &&
    reports.every((report) => selectedIds.includes(report.id));

  const start = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;

  const end = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="reports-table-card report-table-card">
      <div className="report-table-wrapper">
        <table className="reports-table report-queue-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onToggleAll(event.target.checked)}
                  aria-label="Pilih semua pengaduan"
                />
              </th>
              <th>TIKET &amp; TANGGAL</th>
              <th>PELAPOR</th>
              <th>LAPORAN MASALAH</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  selected={selectedIds.includes(report.id)}
                  onToggle={onToggle}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="reports-empty">
                  Tidak ada pengaduan ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="report-table-footer">
        <span>
          Menampilkan{" "}
          <b>
            {start}–{end}
          </b>{" "}
          dari <b>{totalItems}</b> tiket pengaduan
        </span>

        <div className="report-pagination">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={14} />
          </button>

          {pages.map((number) => (
            <button
              type="button"
              key={number}
              className={page === number ? "current" : ""}
              onClick={() => onPageChange?.(number)}
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
