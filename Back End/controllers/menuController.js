const express = require('express');
const path = require('path');
const { Menu } = require('../models'); // Asumsikan ini path yang benar ke model Anda
const formatCurrency = require('../helpers/formatCurrency');
const { Sequelize } = require('sequelize'); // Impor Sequelize
const fs = require('fs');
const MenuService = require('../services/menuService');
const { validateAddMenu, validateEditMenu } = require('../validations/menuValidation');

exports.addMenu = async (req, res) => {
  const { error } = validateAddMenu(req.body); // Validasi input
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { nama, harga, description } = req.body;
    const gambarFile = req.files ? req.files.gambar : null;

    if (!gambarFile) return res.status(400).send("No image file uploaded.");

    // Nama file berdasarkan nama menu
    const filename = `${nama.replace(/ /g, "_")}.jpg`;

    // Menentukan direktori tujuan untuk menyimpan file
    const uploadPath = path.join(__dirname, '..', 'public', 'gambar', filename);

    // Pindahkan file yang di-upload ke direktori tujuan
    gambarFile.mv(uploadPath, async (err) => {
      if (err) return res.status(500).send(err);

      // Path yang akan disimpan di database harus relatif ke root server
      const gambarPath = `/menu/gambar/${filename}`;

      // Membuat record baru di database
      const newMenu = await Menu.create({
        nama,
        harga,
        description,
        gambar: gambarPath,
      });

      // Format harga sebelum mengirimkan response
      newMenu.harga = formatCurrency(newMenu.harga);

      res.status(201).json(newMenu);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllMenus = async (req, res) => {
    try {
        let menus = await Menu.findAll();
        // Format harga setiap menu menjadi format mata uang
        menus = menus.map((menu) => ({
            ...menu.toJSON(),
            harga: formatCurrency(menu.harga),
        }));
        res.json(menus);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getMenuById = async (req, res) => {
    try {
        const { id } = req.params;
        let menu = await Menu.findByPk(id);
        // Format harga menu menjadi format mata uang
        if (menu) {
            menu.harga = formatCurrency(menu.harga); // Terapkan formatCurrency di sini
        }
        res.json(menu);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchMenuByName = async (req, res) => {
    try {
        const { nama } = req.query; // Mengambil nama dari query parameter
        if (!nama) {
            return res.status(400).send("Please provide a name to search.");
        }
        const menus = await Menu.findAll({
            where: {
                nama: {
                    [Sequelize.Op.like]: `%${nama}%`,
                },
            },
        });

        if (menus.length === 0) {
            return res.status(404).send("No menus found with that name.");
        }

        const formattedMenus = menus.map((menu) => ({
            ...menu.toJSON(),
            harga: formatCurrency(menu.harga),
        }));

        res.json(formattedMenus);
    } catch (error) {
        console.error("Error searching for menu by name:", error);
        res.status(500).send(error.message);
    }
};

exports.updateMenu = async (req, res) => {
  const { error } = validateEditMenu(req.body); // Validasi input
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
      const { id } = req.params;
      const { nama, harga, description } = req.body;
      const gambarFile = req.files ? req.files.gambar : null;

      let menu = await Menu.findByPk(id);

      if (!menu) {
          return res.status(404).send("Menu not found");
      }

      // Update data menu
      menu.nama = nama;
      menu.harga = harga;
      menu.description = description;

      // Jika ada file gambar baru diunggah
      if (gambarFile) {
          const filename = `${nama.replace(/ /g, "_")}.jpg`;
          const uploadPath = path.join(__dirname, '..', 'public', 'gambar', filename);

          // Hapus gambar lama jika ada
          if (fs.existsSync(path.join(__dirname, '..', 'public', 'gambar', menu.gambar))) {
              fs.unlinkSync(path.join(__dirname, '..', 'public', 'gambar', menu.gambar));
          }

          // Pindahkan file yang di-upload ke direktori tujuan
          gambarFile.mv(uploadPath, async (err) => {
              if (err) return res.status(500).send(err);

              // Setel path gambar baru
              menu.gambar = `/menu/gambar/${filename}`;

              // Simpan perubahan menu
              await menu.save();

              res.json({ id, nama, harga, description, gambar: menu.gambar });
          });
      } else {
          // Jika tidak ada file gambar baru, hanya simpan perubahan menu
          await menu.save();

          res.json({ id, nama, harga, description, gambar: menu.gambar });
      }
  } catch (error) {
      console.error("Error updating menu:", error);
      res.status(500).send(error.message);
  }
};


exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);

    if (!menu) {
      return res.status(404).send("Menu not found");
    }

    // Menghapus file gambar terkait
    const gambarPath = path.join(__dirname, '..', 'public', 'gambar', menu.gambar.split('/').pop());
    fs.unlinkSync(gambarPath);

    await menu.destroy();

    res.send("Menu deleted successfully");
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).send(error.message);
  }
};

exports.resetMenuId = async (req, res) => {
  try {
    await MenuService.resetMenuId();
    res.send('Menu IDs have been reset successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

