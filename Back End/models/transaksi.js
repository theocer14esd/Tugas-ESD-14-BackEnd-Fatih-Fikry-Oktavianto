'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  Transaksi.init({
    id_pembeli: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER,
    status: DataTypes.STRING,
    order_id: DataTypes.STRING // Tambahkan kolom order_id
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  
  return Transaksi;
};
