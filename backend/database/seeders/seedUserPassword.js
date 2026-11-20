const bcrypt = require("bcrypt");
const pool = require("../../db");

async function seedUserPasswords() {
  try {
    const hashedPassword = await bcrypt.hash("123!", 10);

    const result = await pool.query(
      `UPDATE users
       SET password = $1
       WHERE password IS NULL
       RETURNING id, name, email`,
      [hashedPassword],
    );

    console.log(`${result.rowCount} user berhasil diperbarui!`);
    console.table(result.rows);
  } catch (error) {
    console.error("Gagal seed password:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedUserPasswords();
