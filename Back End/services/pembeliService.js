const { Pembeli } = require('../models');
const { Sequelize } = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');

class PembeliService {
  static async addPembeli({ nama, email, password, noTelp }) {
    try {
      const hashedPassword = await hashPassword(password); // Hash password sebelum disimpan
      const newPembeli = await Pembeli.create({ nama, email, password: hashedPassword, noTelp });
      return newPembeli.toJSON();
    } catch (error) {
      throw error;
    }
  }
  
  // static async addPembeli({ nama, email, password, noTelp }) {
  //   try {
  //     const newPembeli = await Pembeli.create({ nama, email, password, noTelp });
  //     return newPembeli.toJSON();
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  static async getAllPembeli() {
    try {
      const pembeli = await Pembeli.findAll();
      return pembeli;
    } catch (error) {
      throw error;
    }
  }

  static async getPembeliById(id) {
    try {
      const pembeli = await Pembeli.findByPk(id);
      if (!pembeli) throw new Error('Pembeli not found');
      return pembeli.toJSON();
    } catch (error) {
      throw error;
    }
  }

  static async searchPembeliByName(nama) {
    try {
      const pembeli = await Pembeli.findAll({
        where: { nama: { [Sequelize.Op.like]: `%${nama}%` } }
      });
      return pembeli;
    } catch (error) {
      throw error;
    }
  }

  static async updatePembeli(id, { nama, email, password, noTelp }) {
    try {
      const pembeli = await Pembeli.findByPk(id);
      if (!pembeli) throw new Error('Pembeli not found');

      pembeli.nama = nama;
      pembeli.email = email;
      pembeli.password = password;
      pembeli.noTelp = noTelp;

      await pembeli.save();
      return pembeli.toJSON();
    } catch (error) {
      throw error;
    }
  }

  static async deletePembeli(id) {
    try {
      const pembeli = await Pembeli.findByPk(id);
      if (!pembeli) throw new Error('Pembeli not found');

      await pembeli.destroy();
      return { message: 'Pembeli deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PembeliService;
