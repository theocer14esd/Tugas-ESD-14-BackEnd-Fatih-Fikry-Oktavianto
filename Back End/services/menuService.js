const { Menu, Sequelize } = require("../models"); // Pastikan ini mengarah ke index.js yang menginisialisasi semua model
const formatCurrency = require("../helpers/formatCurrency"); // Asumsikan ini adalah fungsi helper Anda

class MenuService {
    static async addMenu({ nama, harga, description, gambarPath }) {
        try {
            const newMenu = await Menu.create({
                nama,
                harga,
                description,
                gambar: gambarPath,
            });
            // Format harga sebelum dikembalikan
            newMenu.harga = formatCurrency(newMenu.harga);
            return newMenu.toJSON(); // Pastikan mengembalikan objek JSON
        } catch (error) {
            throw error;
        }
    }

    static async getAllMenus() {
        try {
            let menus = await Menu.findAll();
            // Format harga setiap menu
            menus = menus.map(menu => ({
                ...menu.toJSON(),
                harga: formatCurrency(menu.harga)
            }));
            return menus;
        } catch (error) {
            throw error;
        }
    }

    static async getMenuById(id) {
        try {
            let menu = await Menu.findByPk(id);
            if (!menu) throw new Error('Menu not found');
            // Format harga
            menu.harga = formatCurrency(menu.harga);
            return menu.toJSON();
        } catch (error) {
            throw error;
        }
    }

    static async searchMenuByName(nama) {
        try {
            const menus = await Menu.findAll({
                where: {
                    nama: {
                        [Sequelize.Op.like]: `%${nama}%`
                    }
                }
            });
            if (menus.length === 0) throw new Error('No menus found with that name');
            // Format harga setiap menu
            return menus.map(menu => ({
                ...menu.toJSON(),
                harga: formatCurrency(menu.harga)
            }));
        } catch (error) {
            throw error;
        }
    }

    static async updateMenu(id, { nama, harga, description }) {
        try {
            let menu = await Menu.findByPk(id);
            if (!menu) throw new Error('Menu not found');

            menu.nama = nama;
            menu.harga = harga;
            menu.description = description;

            await menu.save();
            // Format harga setelah update
            menu.harga = formatCurrency(menu.harga);
            return menu.toJSON();
        } catch (error) {
            throw error;
        }
    }

    static async deleteMenu(id) {
      try {
          let menu = await Menu.findByPk(id);
          if (!menu) throw new Error('Menu tidak ditemukan');
  
          // Perbarui jalur gambar menu
          const imagePath = path.join(__dirname, '../public', menu.gambar);
          fs.unlinkSync(imagePath); // Hapus gambar dari direktori
  
          await menu.destroy();
          return { message: 'Menu dan gambar terkait berhasil dihapus' };
      } catch (error) {
          throw error;
      }
    }

    static async resetMenuId() {
      try {
        await Menu.sequelize.query('ALTER TABLE menus AUTO_INCREMENT = 1');
      } catch (error) {
        throw error;
      }
    }  
}

module.exports = MenuService;
