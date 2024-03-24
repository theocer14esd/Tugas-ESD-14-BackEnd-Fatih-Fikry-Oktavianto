const express = require('express');
const router = express.Router();
const midtransController = require('../controllers/midtransController');

// Menambahkan rute untuk pembayaran Midtrans
router.post('/midtrans', midtransController.createMidtransTransactionController);
// Menambahkan rute untuk menangani notifikasi webhook dari Midtrans
router.post('/midtrans-notification', midtransController.handleMidtransNotificationController);


module.exports = router;

