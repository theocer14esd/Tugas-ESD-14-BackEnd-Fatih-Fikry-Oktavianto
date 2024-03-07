const formatCurrency = require("../helpers/formatCurrency");
const { Transaksi, Menu } = require("../models");

exports.createCheckoutTransaction = async (dataTransaksi) => {
  const { userId, id, jumlah } = dataTransaksi;

  if (!id) {
    return { status: 400, message: "Parameter id tidak valid" };
  }

  const menu = await Menu.findOne({ where: { id } });

  if (!menu) {
    return { status: 404, message: "Menu tidak ditemukan" };
  }

  // Hitung total harga tanpa memformatnya untuk penyimpanan di database
  const totalHarga = menu.harga * jumlah;

  // Simpan total_harga sebagai bagian dari operasi create
  let transaksi = await Transaksi.create({
    id_pembeli: userId,
    id_menu: id,
    jumlah: jumlah,
    total_harga: totalHarga, // Langsung simpan nilai numerik ini
  });

  // Format total_harga untuk tampilan jika perlu
  transaksi.dataValues.total_harga_formatted = formatCurrency(transaksi.total_harga);

  return { status: 201, message: "Transaksi berhasil", data: transaksi };
};
