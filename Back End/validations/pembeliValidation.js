const joi = require('joi');

// Validasi tambah pembeli
exports.validateAddPembeli = (pembeli) => {
  const schema = joi.object({
    nama: joi.string().min(3).required(),
    email: joi.string().email().required(), // Email harus valid
    password: joi.string().min(6).required(), // Tambahkan validasi password
    noTelp: joi.string().min(10).required(), // Nomor telepon minimal 10 angka
  });

  return schema.validate(pembeli);
};

// Validasi edit pembeli
exports.validateEditPembeli = (pembeli) => {
  const schema = joi.object({
    nama: joi.string().min(3).required(),
    email: joi.string().email().required(), // Email harus valid
    password: joi.string().min(6).required(), // Tambahkan validasi password
    noTelp: joi.string().min(10).required(), // Nomor telepon minimal 10 angka
  });

  return schema.validate(pembeli);
};
