const { Transaksi, Menu } = require('../models');

exports.getAllTransactions = async () => {
  try {
    const transactions = await Transaksi.findAll();
    return transactions;
  } catch (error) {
    throw error;
  }
};

exports.checkout = async function(id_pembeli, id_menu, jumlah) {
  const menu = await Menu.findByPk(id_menu);
  const total_harga = menu.harga * jumlah;
  return Transaksi.create({ id_pembeli, id_menu, jumlah, total_harga });
};
