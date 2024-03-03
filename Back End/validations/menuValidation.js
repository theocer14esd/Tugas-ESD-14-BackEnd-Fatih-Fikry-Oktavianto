const joi = require('joi');

// Validasi tambah menu
exports.validateAddMenu = (menu) => {
  const schema = joi.object({
    nama: joi.string().min(3).required(),
    description: joi.string().min(5).required(), // Asumsi deskripsi menu lebih panjang
    harga: joi.number().min(0).required(), // Harga harus valid dan positif
  });

  return schema.validate(menu);
};

// Validasi edit menu
exports.validateEditMenu = (menu) => {
  const schema = joi.object({
    nama: joi.string().min(3).required(),
    description: joi.string().min(5).required(), // Asumsi deskripsi menu lebih panjang
    harga: joi.number().min(0).required(), // Harga harus valid dan positif
  });

  return schema.validate(menu);
};
