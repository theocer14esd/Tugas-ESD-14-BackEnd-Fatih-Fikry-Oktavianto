// midtransController.js
const midtransService = require("../services/midtransService");
const transaksiService = require("../services/transaksiService");

exports.createMidtransTransactionController = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const grossAmount = req.body.grossAmount;

    const redirectUrl = await midtransService.createMidtransTransaction(
      orderId,
      grossAmount
    );

    res.status(200).json({ redirectUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleMidtransNotificationController = async (req, res) => {
  try {
    const notification = req.body;

    // Tambahkan pemanggilan untuk mengecek status transaksi
    const transactionStatus = await midtransService.checkTransactionStatus(
      notification.order_id
    );
    // console.log("Status transaksi diperiksa:", transactionStatus);

    console.log(`
    ////////////////////
    `);
    console.log("order_id", transactionStatus.order_id);
    // find checkout where order_id
    console.log(`
    ////////////////////
    `);
    console.log("status", transactionStatus.transaction_status);
    // update by status

    // Lanjutkan dengan proses notifikasi seperti biasa
    // const result = await transaksiService.handleMidtransNotification(notification);
    res
      .status(200)
      .json({ message: "Notifikasi berhasil diproses", transactionStatus });
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat memproses notifikasi Midtrans:",
      error
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = exports;
