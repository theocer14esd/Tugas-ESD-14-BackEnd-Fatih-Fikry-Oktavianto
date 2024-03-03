'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // define association here
    }
  }
  Menu.init({
    nama: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    description: DataTypes.STRING,
    gambar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Menu',
  });
  return Menu;
};
