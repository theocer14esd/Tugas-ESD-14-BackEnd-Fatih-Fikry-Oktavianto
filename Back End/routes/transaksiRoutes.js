const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.get('/', transaksiController.getAllTransactions);
router.post('/checkout', transaksiController.handleCheckout);

module.exports = router;
