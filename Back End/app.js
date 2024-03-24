// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const fileUpload = require("express-fileupload");
// const menuRoutes = require("./routes/menuRoutes");
// const pembeliRoutes = require("./routes/pembeliRoutes");
// const transaksiRoutes = require("./routes/transaksiRoutes");
// const authRoutes = require("./routes/authRoutes");

// const app = express();
// const PORT = process.env.PORT || 6000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   fileUpload({
//     createParentPath: true,
//   })
// );
// app.use("/gambar", express.static(path.join(__dirname, "gambar")));

// // Menggunakan routes
// app.use("/menu", menuRoutes);
// app.use("/pembeli", pembeliRoutes);
// app.use("/api", transaksiRoutes);
// app.use('/auth', authRoutes);

// // Menangani route tidak ditemukan
// app.use((req, res, next) => {
//   res.status(404).send("Sorry, route does not exist!");
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const menuRoutes = require("./routes/menuRoutes");
const pembeliRoutes = require("./routes/pembeliRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const authRoutes = require("./routes/authRoutes");
const midtransController = require("./controllers/midtransController"); // Import midtransController
const { startTransactionExpirationScheduler } = require('./helpers/expiredAt'); // Import fungsi untuk penjadwalan transaksi yang kadaluarsa
const midtransRoutes = require("./routes/midtransRoutes"); 

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use("/gambar", express.static(path.join(__dirname, "gambar")));

// Menggunakan routes
app.use("/menu", menuRoutes);
app.use("/pembeli", pembeliRoutes);
app.use("/api", transaksiRoutes);
app.use('/auth', authRoutes);
app.use('/bayar', midtransRoutes);

// // Memulai penjadwalan transaksi yang kadaluarsa saat aplikasi dimulai
// startTransactionExpirationScheduler();

// Menangani route tidak ditemukan
app.use((req, res, next) => {
  res.status(404).send("Sorry, route does not exist!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

