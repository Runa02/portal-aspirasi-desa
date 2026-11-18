const express = require("express");
const pool = require("../db");

const router = express.Router();

const validText = (value, maxLength) =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  (!maxLength || value.length <= maxLength);

const validId = (value) =>
  Number.isSafeInteger(Number(value)) && Number(value) > 0;

const validStatus = ["diajukan", "diproses", "selesai", "ditolak"];
const validReportType = ["pengaduan", "aspirasi"];

function handleError(error, res) {
  console.error("Database Error:", error);

  if (error.code === "23503") {
    return res.status(400).json({
      message: "User ID atau Category ID tidak ditemukan",
    });
  }

  return res.status(500).json({
    message: "Terjadi kesalahan pada server",
  });
}

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id,
        r.title,
        r.description,
        r.location,
        r.status,
        r.report_type,
        r.created_at,
        r.updated_at,

        u.name AS reporter,
        up.phone,
        c.name AS category,

        COALESCE(att.photos, 0)::INTEGER AS photos

      FROM reports r

      JOIN users u
        ON r.user_id = u.id

      LEFT JOIN user_profiles up
        ON u.id = up.user_id

      JOIN categories c
        ON r.category_id = c.id

      LEFT JOIN (
        SELECT
          report_id,
          COUNT(*) AS photos
        FROM report_attachments
        GROUP BY report_id
      ) att ON r.id = att.report_id

      WHERE r.report_type = 'pengaduan'

      ORDER BY r.created_at DESC
    `);

    res.status(200).json({
      message: "Berhasil mengambil semua pengaduan",
      data: result.rows,
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/counts", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::INTEGER AS total_pengaduan,
        COUNT(*) FILTER (
          WHERE status = 'diajukan'
        )::INTEGER AS perlu_verifikasi,
        COUNT(*) FILTER (
          WHERE status = 'diproses'
        )::INTEGER AS sedang_diproses,
        COUNT(*) FILTER (
          WHERE status = 'selesai'
        )::INTEGER AS selesai,
        COUNT(*) FILTER (
          WHERE status = 'ditolak'
        )::INTEGER AS ditolak
      FROM reports
      WHERE report_type = 'pengaduan'
    `);

    res.status(200).json({
      message: "Berhasil mengambil statistik pengaduan",
      data: result.rows[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/options", async (req, res) => {
  try {
    const [categories, users] = await Promise.all([
      pool.query(
        "SELECT id, name, description FROM categories ORDER BY name ASC",
      ),
      pool.query("SELECT id, name, email, role FROM users ORDER BY name ASC"),
    ]);

    res.status(200).json({
      categories: categories.rows,
      users: users.rows,
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Berhasil mengambil laporan",
      data: result.rows[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.post("/", async (req, res) => {
  const {
    user_id,
    category_id,
    title,
    description,
    location,
    status = "diajukan",
    report_type = "pengaduan",
  } = req.body || {};

  if (
    !validId(user_id) ||
    !validId(category_id) ||
    !validText(title, 200) ||
    !validText(description) ||
    !validText(location) ||
    !validStatus.includes(status) ||
    !validReportType.includes(report_type)
  ) {
    return res.status(400).json({
      message: "Data laporan tidak valid atau tidak lengkap",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reports
        (user_id, category_id, title, description, location, status, report_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        user_id,
        category_id,
        title.trim(),
        description.trim(),
        location.trim(),
        status,
        report_type,
      ],
    );

    res.status(201).json({
      message: "Laporan berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

// 4. PUT - Update laporan
router.put("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  const {
    user_id,
    category_id,
    title,
    description,
    location,
    status,
    report_type = "pengaduan",
  } = req.body || {};

  if (
    !validId(user_id) ||
    !validId(category_id) ||
    !validText(title, 200) ||
    !validText(description) ||
    !validText(location) ||
    !validStatus.includes(status) ||
    !validReportType.includes(report_type)
  ) {
    return res.status(400).json({
      message: "Data laporan tidak valid atau tidak lengkap",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE reports SET
        user_id = $1,
        category_id = $2,
        title = $3,
        description = $4,
        location = $5,
        status = $6,
        report_type = $7,
        updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        user_id,
        category_id,
        title.trim(),
        description.trim(),
        location.trim(),
        status,
        report_type,
        req.params.id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Laporan berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

// 5. DELETE - Hapus laporan
router.delete("/:id", async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM reports WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Laporan tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Laporan berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

module.exports = router;
