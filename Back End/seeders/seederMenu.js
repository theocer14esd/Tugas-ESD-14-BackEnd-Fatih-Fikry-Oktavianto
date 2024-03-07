const pool = require('../config/database');

async function seedData() {
  try {
    await pool.query(`INSERT INTO menus (nama, harga, gambar, description) VALUES 
      ('Nasi Padang', 25000, '/menu/gambar/Nasi_Padang.jpg', 'Nasi Padang adalah makanan khas dari Padang, Sumatera Barat.'),
      ('Nasi Kuning', 20000, '/menu/gambar/Nasi_Kuning.jpg', 'Nasi Kuning adalah makanan tradisional dari Indonesia yang terbuat dari beras kuning yang dimasak dengan santan.'),
      ('Nasi Goreng', 18000, '/menu/gambar/Nasi_Goreng.jpg', 'Nasi Goreng adalah masakan Indonesia yang terdiri dari nasi yang digoreng dalam minyak sayur, margarin, atau mentega, dan dicampur dengan bahan-bahan seperti telur, sayuran, daging, atau seafood.');`);
    console.log("Data menus berhasil dimasukkan");

    // Jika Anda memiliki data lain untuk dimasukkan ke tabel lain, bisa dilakukan di sini.
  } catch (err) {
    console.error("Error saat seeding data:", err);
  } finally {
    pool.end(); // Pastikan untuk menutup pool connection setelah selesai
  }
}

seedData();
