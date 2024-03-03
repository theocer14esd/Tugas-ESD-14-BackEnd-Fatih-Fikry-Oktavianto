const pool = require('../config/database');

async function seedData() {
  try {
    await pool.query(`INSERT INTO Pembelis (nama, email, password, noTelp) VALUES 
      ('Ahmad', 'ahmad@example.com', 'passwordAhmad', '08123456789'),
      ('Budi', 'budi@example.com', 'passwordBudi', '087654321'),
      ('Cindy', 'cindy@example.com', 'passwordCindy', '08111222333');`);
    console.log("Data pembeli berhasil dimasukkan");
  } catch (err) {
    console.error("Error saat seeding data:", err);
  } finally {
    pool.end(); // Pastikan untuk menutup pool connection setelah selesai
  }
}

seedData();
