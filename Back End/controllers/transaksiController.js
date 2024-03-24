// const transaksiService = require("../services/transaksiService");

// exports.checkoutProductController = async (req, res) => {
//     const { id, jumlah } = req.body; // Ambil id dan jumlah dari body request
//     const userId = req.userId; // asumsikan userId sudah di-set oleh middleware autentikasi

//     const dataTransaksi = {
//       userId,
//       id,
//       jumlah
//     };

//     const result = await transaksiService.createCheckoutTransaction(dataTransaksi);

//     return res.status(result.status).json(result);
//   };

// transaksiController.js
const transaksiService = require("../services/transaksiService");

exports.checkoutProductController = async (req, res) => {
    try {
        const { id, jumlah } = req.body;
        const userId = req.userId;

        const dataTransaksi = {
          userId,
          id,
          jumlah
        };

        const result = await transaksiService.createCheckoutTransaction(dataTransaksi);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.handleMidtransNotificationController = async (req, res) => {
    try {
        const result = await transaksiService.handleMidtransNotification(req, res);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Terjadi kesalahan saat memperbarui status transaksi:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = exports;

