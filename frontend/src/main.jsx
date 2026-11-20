import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import ReportFormPage from "./pages/ReportFormPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminReportPage from "./pages/admin/reports/Index.jsx";
import AdminReportFormPage from "./pages/admin/reports/form.jsx";
import AdminAspirationPage from "./pages/admin/aspiration/Index.jsx";
import AdminUserPage from "./pages/admin/user/Index.jsx";
import AdminOfficersPage from "./pages/admin/officers/Index.jsx";
import AdminCategoriesPage from "./pages/admin/categories/Index.jsx";
import AdminReportsSummaryPage from "./pages/admin/reports-summary/Index.jsx";
import AdminAreasPage from "./pages/admin/areas/Index.jsx";
import "./styles.css";

function AdminRoute({ children }) {
  const token = localStorage.getItem("suara_desa_token") || sessionStorage.getItem("suara_desa_token");
  let user = null;
  try {
    const serializedUser = localStorage.getItem("suara_desa_user") || sessionStorage.getItem("suara_desa_user");
    user = serializedUser ? JSON.parse(serializedUser) : null;
  } catch {
    user = null;
  }

  if (!token || user?.role !== "admin") {
    return <Navigate to={token ? "/" : "/login"} replace />;
  }

  return children;
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lapor" element={<ReportFormPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/reports" element={<AdminRoute><AdminReportPage /></AdminRoute>} />
      <Route path="/admin/reports/form" element={<AdminRoute><AdminReportFormPage /></AdminRoute>} />
      <Route path="/admin/aspirasi" element={<AdminRoute><AdminAspirationPage /></AdminRoute>} />
      <Route path="/admin/pengguna" element={<AdminRoute><AdminUserPage /></AdminRoute>} />
      <Route path="/admin/petugas" element={<AdminRoute><AdminOfficersPage /></AdminRoute>} />
      <Route path="/admin/kategori" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/laporan" element={<AdminRoute><AdminReportsSummaryPage /></AdminRoute>} />
      <Route path="/admin/wilayah" element={<AdminRoute><AdminAreasPage /></AdminRoute>} />
      <Route path="/admin/*" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href="#lapor"]');
  if (link) {
    event.preventDefault();
    window.location.assign("/lapor");
  }
});
