// transaksiRoutes.js
const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const { auth } = require('../middleware/indexMiddleware');

// Definisikan rute untuk membuat transaksi
router.post('/create', auth, transaksiController.checkoutProductController);
router.post('/notification', transaksiController.handleMidtransNotificationController);

module.exports = router;
