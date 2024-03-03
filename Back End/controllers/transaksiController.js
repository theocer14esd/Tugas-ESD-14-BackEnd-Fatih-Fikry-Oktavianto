const transaksiService = require('../services/transaksiService');

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transaksiService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.handleCheckout = async (req, res) => {
  try {
    const { id_pembeli, id_menu, jumlah } = req.body;
    const transaksi = await transaksiService.checkout(id_pembeli, id_menu, jumlah);
    res.json(transaksi);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
