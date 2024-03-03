const express = require('express');
const router = express.Router();
const pembeliController = require('../controllers/pembeliController');

// Endpoint untuk menambahkan pembeli baru
router.post('/', pembeliController.addPembeli);

// Endpoint untuk mendapatkan semua pembeli
router.get('/', pembeliController.getAllPembeli);

router.get('/search', pembeliController.searchPembeliByName);

// Endpoint untuk mendapatkan pembeli berdasarkan ID
router.get('/:id', pembeliController.getPembeliById);

// Endpoint untuk memperbarui pembeli berdasarkan ID
router.put('/:id', pembeliController.updatePembeli);

// Endpoint untuk menghapus pembeli berdasarkan ID
router.delete('/:id', pembeliController.deletePembeli);

module.exports = router;
