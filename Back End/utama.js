const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mysql = require("mysql2");
const app = express();
const PORT = 6000;
const fs = require("fs"); // Import modul fs untuk menghapus file

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use("/gambar", express.static(path.join(__dirname, "gambar")));

// Buat pool koneksi ke database MySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "catering",
  waitForConnections: true,
  connectionLimit: 10, // Jumlah maksimum koneksi dalam pool
  queueLimit: 0, // Tidak ada batasan antrian
});

// Buka koneksi ke database
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");

  // SQL INSERT statements untuk memasukkan data makanan
  const insertMenuMakanan = `INSERT INTO menu_makanan (nama, harga, gambar, description) VALUES 
      ('Nasi Padang', 25000, '/gambar/Nasi_Padang.jpg', 'Nasi Padang adalah makanan khas dari Padang, Sumatera Barat.'),
      ('Nasi Kuning', 20000, '/gambar/Nasi_Kuning.jpg', 'Nasi Kuning adalah makanan tradisional dari Indonesia yang terbuat dari beras kuning yang dimasak dengan santan.'),
      ('Nasi Goreng', 18000, '/gambar/Nasi_Goreng.jpg', 'Nasi Goreng adalah masakan Indonesia yang terdiri dari nasi yang digoreng dalam minyak sayur, margarin, atau mentega, dan dicampur dengan bahan-bahan seperti telur, sayuran, daging, atau seafood.');`;

  // Jalankan SQL INSERT untuk memasukkan data makanan
  connection.query(insertMenuMakanan, (err, result) => {
    if (err) {
      console.error("Error inserting menu makanan:", err);
      return;
    }
    console.log("Data makanan berhasil dimasukkan");
  });

  // SQL INSERT statements untuk memasukkan data pembeli
  const insertDataPembeli = `INSERT INTO data_pembeli (nama, no_telp, pesanan_makanan, total_pembelian) VALUES 
      ('Ahmad', '08123456789', 'Nasi Padang, Nasi Goreng', 43000),
      ('Budi', '087654321', 'Nasi Kuning, Nasi Goreng', 38000),
      ('Cindy', '08111222333', 'Nasi Goreng', 18000);`;

  // Jalankan SQL INSERT untuk memasukkan data pembeli
  connection.query(insertDataPembeli, (err, result) => {
    if (err) {
      console.error("Error inserting data pembeli:", err);
      return;
    }
    console.log("Data pembeli berhasil dimasukkan");
    connection.release(); // Tutup koneksi setelah selesai
  });
});

// Endpoint untuk menambahkan menu makanan
app.post("/menu", (req, res) => {
  const { nama, harga, description } = req.body;

  // Pastikan ada file gambar yang diunggah
  if (!req.files || !req.files.gambar) {
    return res.status(400).send("No image file uploaded.");
  }

  // Akses file gambar yang diunggah
  const gambarFile = req.files.gambar;
  const filename = `${nama.replace(/ /g, "_")}.jpg`;

  // Simpan file gambar di sistem file server
  gambarFile.mv(path.join(__dirname, "gambar", filename), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Simpan path gambar ke dalam database
    const imagePath = `/gambar/${filename}`;
    const insertMenu = `INSERT INTO menu_makanan (nama, harga, description, gambar) VALUES (?, ?, ?, ?)`;
    pool.query(
      insertMenu,
      [nama, harga, description, imagePath],
      (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }

        console.log("Menu inserted successfully");
        const newMenu = {
          id: result.insertId,
          nama,
          harga,
          description,
          gambar: imagePath,
        };
        res.status(201).json(newMenu);
      }
    );
  });
});

// Endpoint untuk mendapatkan semua menu
app.get("/menu", (req, res) => {
  const selectMenuMakanan = `SELECT * FROM menu_makanan`;
  pool.query(selectMenuMakanan, (err, results) => {
    if (err) {
      console.error("Error getting menu:", err);
      return res.status(500).send("Error getting menu");
    }
    res.json(results);
  });
});

app.get("/menu/id/:id", (req, res) => {
  const { id } = req.params;
  const selectMenuById = `SELECT * FROM menu_makanan WHERE id = ?`;
  pool.query(selectMenuById, [id], (err, results) => {
    if (err) {
      console.error("Error getting menu by ID:", err);
      return res.status(500).send("Error getting menu by ID");
    }
    if (results.length === 0) {
      return res.status(404).send("Menu not found");
    }
    res.json(results[0]);
  });
});

app.get("/menu/nama/:nama", (req, res) => {
  const { nama } = req.params;
  const selectMenuByNama = `SELECT * FROM menu_makanan WHERE nama = ?`;
  pool.query(selectMenuByNama, [nama], (err, results) => {
    if (err) {
      console.error("Error getting menu by name:", err);
      return res.status(500).send("Error getting menu by name");
    }
    if (results.length === 0) {
      return res.status(404).send("Menu not found");
    }
    res.json(results[0]);
  });
});

// Endpoint untuk mengupdate menu berdasarkan ID
app.put("/menu/:id", (req, res) => {
    const { id } = req.params;
    const { nama, harga, description } = req.body;
  
    // Dapatkan path gambar yang saat ini tersimpan di database untuk menu yang akan diubah
    const selectMenuQuery = `SELECT gambar FROM menu_makanan WHERE id = ?`;
    pool.query(selectMenuQuery, [id], (err, results) => {
      if (err) {
        console.error("Error selecting menu:", err);
        return res.status(500).send("Error updating menu");
      }
  
      if (results.length === 0) {
        return res.status(404).send("Menu not found");
      }
  
      const imagePath = results[0].gambar; // Path gambar yang saat ini tersimpan di database
  
      // Hapus file gambar lama jika ada
      const pathGambarLama = path.join(__dirname, "gambar", imagePath.substr(8)); // Dapatkan path file gambar lama
      fs.unlink(pathGambarLama, (err) => {
        if (err && err.code !== "ENOENT") {
          // Jika file tidak ditemukan, abaikan kesalahan ENOENT (File not found)
          console.error("Error deleting old image:", err);
          return res.status(500).send("Error updating menu");
        }
  
        // Menangani penggantian atau penambahan gambar baru
        const gambarFile = req.files.gambar;
        const filename = `${nama.replace(/ /g, "_")}.jpg`;
        gambarFile.mv(path.join(__dirname, "gambar", filename), (err) => {
          if (err) {
            return res.status(500).send(err);
          }
  
          // Perbarui informasi menu di database dengan gambar baru
          const updateMenuQuery = `UPDATE menu_makanan SET nama = ?, harga = ?, description = ?, gambar = ? WHERE id = ?`;
          pool.query(
            updateMenuQuery,
            [nama, harga, description, `/gambar/${filename}`, id],
            (err, result) => {
              if (err) {
                console.error("Error updating menu:", err);
                return res.status(500).send("Error updating menu");
              }
              if (result.affectedRows === 0) {
                return res.status(404).send("Menu not found");
              }
              console.log("Menu updated successfully");
              // Kirim respons dengan informasi menu yang diperbarui
              res.json({ id, nama, harga, description, gambar: `/gambar/${filename}` });
            }
          );
        });
      });
    });
  });

// Endpoint untuk menghapus menu berdasarkan ID
app.delete("/menu/:id", (req, res) => {
  const { id } = req.params;
  const deleteMenuMakanan = `DELETE FROM menu_makanan WHERE id = ?`;
  pool.query(deleteMenuMakanan, [id], (err, result) => {
    if (err) {
      console.error("Error deleting menu:", err);
      return res.status(500).send("Error deleting menu");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Menu not found");
    }
    console.log("Menu deleted successfully");
    res.send("Menu deleted successfully");
  });
});

// Endpoint untuk menambahkan pembeli
app.post("/pembeli", (req, res) => {
  const { nama, noTelp, pesananMakanan, totalPembelian } = req.body;
  const insertPembeli = `INSERT INTO data_pembeli (nama, no_telp, pesanan_makanan, total_pembelian) VALUES (?, ?, ?, ?)`;
  pool.query(
    insertPembeli,
    [nama, noTelp, pesananMakanan.join(", "), totalPembelian],
    (err, result) => {
      if (err) {
        console.error("Error inserting pembeli:", err);
        return res.status(500).send("Error inserting pembeli");
      }
      console.log("Pembeli inserted successfully");
      res.status(201).json({
        id: result.insertId,
        nama,
        noTelp,
        pesananMakanan,
        totalPembelian,
      });
    }
  );
});

// Endpoint untuk mendapatkan semua pembeli
app.get("/pembeli", (req, res) => {
  const selectPembeli = `SELECT * FROM data_pembeli`;
  pool.query(selectPembeli, (err, results) => {
    if (err) {
      console.error("Error getting pembeli:", err);
      return res.status(500).send("Error getting pembeli");
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan pembeli berdasarkan ID
app.get("/pembeli/:id", (req, res) => {
  const { id } = req.params;
  const selectPembeliById = `SELECT * FROM data_pembeli WHERE id = ?`;
  pool.query(selectPembeliById, [id], (err, results) => {
    if (err) {
      console.error("Error getting pembeli by ID:", err);
      return res.status(500).send("Error getting pembeli by ID");
    }
    if (results.length === 0) {
      return res.status(404).send("Pembeli not found");
    }
    res.json(results[0]);
  });
});

// Endpoint untuk mencari pembeli berdasarkan nama
app.get("/pembeli/nama/:nama", (req, res) => {
  const { nama } = req.params;
  const selectPembeliByNama = `SELECT * FROM data_pembeli WHERE nama = ?`;
  pool.query(selectPembeliByNama, [nama], (err, results) => {
    if (err) {
      console.error("Error getting pembeli by name:", err);
      return res.status(500).send("Error getting pembeli by name");
    }
    if (results.length === 0) {
      return res.status(404).send("Pembeli not found");
    }
    res.json(results[0]);
  });
});

// Endpoint untuk mengupdate pembeli berdasarkan ID
app.put("/pembeli/:id", (req, res) => {
  const { id } = req.params;
  const { nama, noTelp, pesananMakanan, totalPembelian } = req.body;
  const updatePembeli = `UPDATE data_pembeli SET nama = ?, no_telp = ?, pesanan_makanan = ?, total_pembelian = ? WHERE id = ?`;
  pool.query(
    updatePembeli,
    [nama, noTelp, pesananMakanan.join(", "), totalPembelian, id],
    (err, result) => {
      if (err) {
        console.error("Error updating pembeli:", err);
        return res.status(500).send("Error updating pembeli");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Pembeli not found");
      }
      console.log("Pembeli updated successfully");
      res.json({ id, nama, noTelp, pesananMakanan, totalPembelian });
    }
  );
});

// Endpoint untuk menghapus pembeli berdasarkan ID
app.delete("/pembeli/:id", (req, res) => {
  const { id } = req.params;
  const deletePembeli = `DELETE FROM data_pembeli WHERE id = ?`;
  pool.query(deletePembeli, [id], (err, result) => {
    if (err) {
      console.error("Error deleting pembeli:", err);
      return res.status(500).send("Error deleting pembeli");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Pembeli not found");
    }
    console.log("Pembeli deleted successfully");
    res.send("Pembeli deleted successfully");
  });
});

// Tutup koneksi ke database setelah selesai
app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
