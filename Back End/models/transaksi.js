'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaksi extends Model {
    static associate(models) {
      // Definisikan asosiasi di sini
      // Misalnya: Transaksi.belongsTo(models.Pembeli, {foreignKey: 'id_pembeli'});
      //           Transaksi.belongsTo(models.Menu, {foreignKey: 'id_menu'});
    }
  };
  Transaksi.init({
    id_pembeli: DataTypes.INTEGER,
    id_menu: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    total_harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaksi',
  });
  return Transaksi;
};
