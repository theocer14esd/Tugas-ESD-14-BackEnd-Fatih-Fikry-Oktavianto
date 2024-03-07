const transaksiService = require("../services/transaksiService");

exports.checkoutProductController = async (req, res) => {
    const { id, jumlah } = req.body; // Ambil id dan jumlah dari body request
    const userId = req.userId; // asumsikan userId sudah di-set oleh middleware autentikasi
  
    const dataTransaksi = {
      userId,
      id,
      jumlah
    };
  
    const result = await transaksiService.createCheckoutTransaction(dataTransaksi);
  
    return res.status(result.status).json(result);
  };
  
