import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/lapor" element={<ReportFormPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/reports" element={<AdminReportPage />} />
      <Route path="/admin/reports/form" element={<AdminReportFormPage />} />
      <Route path="/admin/aspirasi" element={<AdminAspirationPage />} />
      <Route path="/admin/pengguna" element={<AdminUserPage />} />
      <Route path="/admin/petugas" element={<AdminOfficersPage />} />
      <Route path="/admin/kategori" element={<AdminCategoriesPage />} />
      <Route path="/admin/laporan" element={<AdminReportsSummaryPage />} />
      <Route path="/admin/wilayah" element={<AdminAreasPage />} />
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
