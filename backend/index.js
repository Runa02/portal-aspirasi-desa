
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

const reportsRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json({ limit: "8mb" }));

app.use("/api/reports", reportsRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Portal Aspirasi Desa API",
    status: "running"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");

    res.json({
      message: "Database connected successfully",
      server_time: result.rows[0].server_time
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
