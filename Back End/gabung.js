const express = require("express");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = 6000;
const fs1 = require("fs"); // Import modul fs untuk menghapus file
const fs2 = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));
app.use("/gambar", express.static(path.join(__dirname, "gambar")));

// Data makanan
let menuMakanan = [
  {
    id: 1,
    nama: "Nasi Padang",
    harga: 25000,
    gambar: "/gambar/Nasi_Padang.jpg",
    description: "Nasi Padang adalah makanan khas dari Padang, Sumatera Barat.",
  },
  {
    id: 2,
    nama: "Nasi Kuning",
    harga: 20000,
    gambar: "/gambar/Nasi_Kuning.jpg",
    description:
      "Nasi Kuning adalah makanan tradisional dari Indonesia yang terbuat dari beras kuning yang dimasak dengan santan.",
  },
  {
    id: 3,
    nama: "Nasi Goreng",
    harga: 18000,
    gambar: "/gambar/Nasi_Goreng.jpg",
    description:
      "Nasi Goreng adalah masakan Indonesia yang terdiri dari nasi yang digoreng dalam minyak sayur, margarin, atau mentega, dan dicampur dengan bahan-bahan seperti telur, sayuran, daging, atau seafood.",
  },
];

// Data pembeli
let dataPembeli = [
  {
    id: 1,
    nama: "Ahmad",
    noTelp: "08123456789",
    pesananMakanan: ["Nasi Padang", "Nasi Goreng"],
    totalPembelian: 43000,
  },
  {
    id: 2,
    nama: "Budi",
    noTelp: "087654321",
    pesananMakanan: ["Nasi Kuning", "Nasi Goreng"],
    totalPembelian: 38000,
  },
  {
    id: 3,
    nama: "Cindy",
    noTelp: "08111222333",
    pesananMakanan: ["Nasi Goreng"],
    totalPembelian: 18000,
  },
];

function validateMenu(data) {
  if (!data.nama || !data.harga || !data.description) {
    return {
      error: {
        details: [{ message: "Nama, harga, dan deskripsi harus diisi." }],
      },
    };
  }
  return { error: null };
}

// Endpoint untuk menambahkan menu makanan
app.post("/menu", (req, res) => {
  const { nama, harga, description } = req.body;
  const validation = validateMenu(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ messages: validation.error.details[0].message });
  }

  if (!req.files || !req.files.gambar) {
    return res.status(400).send("No image file uploaded.");
  }

  const gambarFile = req.files.gambar;
  const filename = `${nama.replace(/ /g, "_")}.jpg`;
  gambarFile.mv(path.join(__dirname, "gambar", filename), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    const newMenu = {
      id: menuMakanan.length + 1,
      nama,
      harga,
      description,
      gambar: `/gambar/${filename}`,
    };
    menuMakanan.push(newMenu);
    res.status(201).json(newMenu);
  });
});

// Endpoint untuk mendapatkan semua menu
app.get("/menu", (req, res) => {
  res.json(menuMakanan);
});

// Endpoint untuk mendapatkan menu berdasarkan ID
app.get("/menu/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const menu = menuMakanan.find((item) => item.id === id);
  if (!menu) {
    res.status(404).send("Menu not found");
  } else {
    res.json(menu);
  }
});

app.get("/menu/search", (req, res) => {
  const { nama } = req.query;
  const menu = menuMakanan.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );
  if (!menu) {
    res.status(404).json({ error: "Menu not found" });
  } else {
    res.json(menu);
  }
});

app.put("/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const menuIndex = menuMakanan.findIndex((item) => item.id === id);

  if (menuIndex === -1) {
    return res.status(404).send("Menu not found");
  }

  const { nama, harga, description } = req.body;

  // Validasi input
  const validation = validateMenu(req.body);
  if (validation.error) {
    return res
      .status(400)
      .json({ messages: validation.error.details[0].message });
  }

  // Menangani penggantian atau penambahan gambar
  if (!req.files || !req.files.gambar) {
    return res.status(400).send("No image file uploaded.");
  }

  const gambarFile = req.files.gambar;
  const filename = `${nama.replace(/ /g, "_")}.jpg`;

  // Hapus file gambar lama jika ada
  if (menuMakanan[menuIndex].gambar) {
    const pathGambarLama = path.join(
      __dirname,
      "gambar",
      menuMakanan[menuIndex].gambar.substr(8)
    ); // Dapatkan path file gambar lama
    fs1.unlinkSync(pathGambarLama); // Hapus file gambar lama dari direktori
  }

  gambarFile.mv(path.join(__dirname, "gambar", filename), (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Update data menu dengan data baru termasuk gambar yang baru diupload
    menuMakanan[menuIndex] = {
      id,
      nama,
      harga,
      description,
      gambar: `/gambar/${filename}`, // Menggunakan path gambar baru
    };

    res.json(menuMakanan[menuIndex]);
  });
});


// Endpoint untuk menghapus menu berdasarkan ID, termasuk logika untuk menghapus gambar terkait
app.delete("/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const menuIndex = menuMakanan.findIndex((item) => item.id === id);

  if (menuIndex === -1) {
    res.status(404).send("Menu not found");
  } else {
    // Hapus file gambar terkait jika ada
    if (menuMakanan[menuIndex].gambar) {
      const pathGambar = path.join(
        __dirname,
        "gambar",
        menuMakanan[menuIndex].gambar.substr(8)
      ); // Dapatkan path file gambar
      try {
        fs2.unlinkSync(pathGambar); // Hapus file gambar dari direktori
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    menuMakanan.splice(menuIndex, 1);
    res.send("Menu deleted successfully");
  }
});

// Endpoint untuk menambahkan pembeli baru
app.post("/pembeli", (req, res) => {
  const { nama, noTelp, pesananMakanan, totalPembelian } = req.body;
  const newPembeli = {
    id: dataPembeli.length + 1,
    nama,
    noTelp,
    pesananMakanan,
    totalPembelian,
  };
  dataPembeli.push(newPembeli);
  res.status(201).json(newPembeli);
});

// Endpoint untuk mendapatkan semua pembeli
app.get("/pembeli", (req, res) => {
  res.json(dataPembeli);
});

// Endpoint untuk mendapatkan pembeli berdasarkan ID
app.get("/pembeli/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pembeli = dataPembeli.find((item) => item.id === id);
  if (!pembeli) {
    res.status(404).send("Pembeli not found");
  } else {
    res.json(pembeli);
  }
});

app.get("/pembeli/search", (req, res) => {
  const { nama } = req.query;
  const pembeli = dataPembeli.find(
    (item) => item.nama.toLowerCase() === nama.toLowerCase()
  );
  if (!pembeli) {
    res.status(404).json({ error: "Pembeli not found" });
  } else {
    res.json(pembeli);
  }
});

// Endpoint untuk mengupdate pembeli berdasarkan ID
app.put("/pembeli/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, noTelp, pesananMakanan, totalPembelian } = req.body;
  const pembeliIndex = dataPembeli.findIndex((item) => item.id === id);
  if (pembeliIndex === -1) {
    res.status(404).send("Pembeli not found");
  } else {
    dataPembeli[pembeliIndex] = {
      ...dataPembeli[pembeliIndex],
      nama,
      noTelp,
      pesananMakanan,
      totalPembelian,
    };
    res.json(dataPembeli[pembeliIndex]);
  }
});

// Endpoint untuk menghapus pembeli berdasarkan ID
app.delete("/pembeli/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pembeliIndex = dataPembeli.findIndex((item) => item.id === id);
  if (pembeliIndex === -1) {
    res.status(404).send("Pembeli not found");
  } else {
    dataPembeli.splice(pembeliIndex, 1);
    res.send("Pembeli deleted successfully");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
