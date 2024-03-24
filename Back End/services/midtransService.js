// midtransService.js
const axios = require("axios");
const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: false, // Ubah menjadi true ketika siap ke produksi
  serverKey: "SB-Mid-server-dZmgryP9BGzDYfrJYo6I_uBF",
  clientKey: "SB-Mid-client-Nn0htVUW17Ebbeqz",
});

exports.createMidtransTransaction = async (orderId, grossAmount) => {
  try {
    const transactionDetails = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
    };

    const response = await snap.createTransaction(transactionDetails);
    console.log("Transaction created in Midtrans:", response);
    return response.redirect_url;
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    throw new Error("Terjadi kesalahan saat membuat transaksi Midtrans");
  }
};

// Fungsi baru untuk mengecek status transaksi
exports.checkTransactionStatus = async (orderId) => {
  const serverKeyEncoded = Buffer.from(snap.apiConfig.serverKey + ':').toString('base64');
  const headers = {
    'Authorization': `Basic ${serverKeyEncoded}`,
    'Content-Type': 'application/json',
  };

  // URL tanpa duplikat slash
  const statusUrl = `${snap.apiConfig.isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com'}/v2/${orderId}/status`;

  try {
    const response = await axios.get(statusUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Error ketika mengecek status transaksi:", error);
    throw new Error("Terjadi kesalahan saat mengecek status transaksi");
  }
};

exports.snap = snap;
