// transaksiService.js

const { Transaksi, Menu, Pembeli } = require("../models");
const midtransService = require("./midtransService");
const formatCurrency = require("../helpers/formatCurrency");
const { client } = require("../wa");

exports.createCheckoutTransaction = async (dataTransaksi) => {
  const { userId, id, jumlah } = dataTransaksi;

  if (!id) {
    return { status: 400, message: "Parameter id tidak valid" };
  }

  const menu = await Menu.findOne({ where: { id } });

  if (!menu) {
    return { status: 404, message: "Menu tidak ditemukan" };
  }

  const grossAmount = menu.harga * jumlah;

  // Membuat transaksi di Midtrans
  const orderId = `ORDER_${Date.now()}`;
  const redirectUrl = await midtransService.createMidtransTransaction(
    orderId,
    grossAmount
  );

  // Simpan transaksi lokal dengan status 'pending'
  let transaksi = await Transaksi.create({
    id_pembeli: userId,
    id_menu: id,
    jumlah: jumlah,
    total_harga: grossAmount,
    order_id: orderId,
    status: "pending",
  });

  // Format total_harga untuk tampilan
  transaksi.dataValues.total_harga_formatted = formatCurrency(
    transaksi.total_harga
  );

  // Mengambil nomor telepon pengguna dari database
  const pembeli = await Pembeli.findOne({ where: { id: userId } });
  const userPhoneNumber = pembeli ? pembeli.noTelp : null;

  // Mengirim pesan WhatsApp ke nomor telepon pengguna
  if (userPhoneNumber) {
    client.sendMessage(
      `${userPhoneNumber}@c.us`,
      `Terima kasih telah memesan di WarungKu. Silakan selesaikan pembayaran di ${redirectUrl}`
    );
  } else {
    console.error("Nomor telepon pengguna tidak ditemukan.");
  }

  return {
    status: 201,
    message: "Transaksi berhasil dibuat",
    data: { transaksi, redirectUrl },
  };
};

exports.handleMidtransNotification = async (req, res) => {
  try {
    const midtransNotif = req.body; // Mengambil notifikasi langsung dari req.body

    // console.log('Midtrans notification received:', midtransNotif);

    const transaksiStatus = await midtransService.checkTransactionStatus(
      midtransNotif.order_id,  midtransNotif.transaction_status
    );

    // Update status transaksi berdasarkan notifikasi dari Midtrans
    await Transaksi.update(
      { status: transaksiStatus.transaction_status },
      { where: { order_id: transaksiStatus.order_id } }
    );

    // Menemukan data transaksi berdasarkan order_id yang diberikan
    const dataTransaksi = await Transaksi.findOne({
      where: { order_id: transaksiStatus.order_id },
    });

    // Mengirimkan notifikasi WhatsApp hanya jika transaksi berhasil dibayar (settlement)
    const pembeli = await Pembeli.findOne({
      where: { id: dataTransaksi.id_pembeli },
    });
    const userPhoneNumber = pembeli ? pembeli.noTelp : null;
    if (transaksiStatus.transaction_status === "settlement" && userPhoneNumber) {
      // Menggunakan client WhatsApp untuk mengirim pesan
      client.sendMessage(
        `${userPhoneNumber}@c.us`,
        `Terima kasih telah melakukan pembayaran, pesanan Anda akan segera kami proses.`
      );
    }

    // Mengembalikan respons keberhasilan dan data transaksi yang diperbarui
    return res
      .status(200)
      .json({
        status: 200,
        message: "Transaksi berhasil diperbarui",
        data: { dataTransaksi },
      });
  } catch (error) {
    console.error("Error handling Midtrans notification:", error);
    // Mengembalikan respons kesalahan jika terjadi error
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
};

module.exports = exports;