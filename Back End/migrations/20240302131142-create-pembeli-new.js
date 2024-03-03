'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pembelis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      email: { // Menambahkan kolom email
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      password: { // Menambahkan kolom password
        type: Sequelize.STRING,
        allowNull: false
      },
      noTelp: {
        type: Sequelize.STRING // Mengubah tipe data menjadi string untuk menampung nomor telepon yang mungkin mengandung karakter selain angka
      },
      // Menghapus kolom pesananMakanan dan totalPembelian jika tidak diperlukan
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pembelis');
  }
};