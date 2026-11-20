const crypto = require("crypto");
const bcrypt = require("bcrypt");
const express = require("express");
const pool = require("../db");

const router = express.Router();
const TOKEN_SECRET = process.env.AUTH_SECRET || "portal-aspirasi-desa-development-secret";

function createToken(user) {
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

router.post("/login", async (req, res) => {
  const identity = typeof req.body?.identity === "string" ? req.body.identity.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!identity || !password) {
    return res.status(400).json({ message: "Identitas dan kata sandi wajib diisi." });
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.password,
              up.nik, up.phone
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE LOWER(u.email) = LOWER($1)
          OR up.nik = $1
          OR (regexp_replace($1, '[^0-9]', '', 'g') <> ''
              AND regexp_replace(COALESCE(up.phone, ''), '[^0-9]', '', 'g') = regexp_replace($1, '[^0-9]', '', 'g'))
       LIMIT 1`,
      [identity],
    );

    const user = result.rows[0];
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identitas atau kata sandi salah." });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nik: user.nik,
      phone: user.phone,
    };

    return res.json({ message: "Login berhasil.", token: createToken(safeUser), user: safeUser });
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === "42703") {
      return res.status(500).json({ message: "Kolom password belum tersedia. Jalankan migrasi database terlebih dahulu." });
    }
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;
