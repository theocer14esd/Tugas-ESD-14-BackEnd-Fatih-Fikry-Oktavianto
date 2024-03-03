'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembeli extends Model {
    static associate(models) {
      // define association here
    }
  };
  Pembeli.init({
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    noTelp: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Pembeli',
  });
  return Pembeli;
};
