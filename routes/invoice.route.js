const express = require('express');
const { createInvoice, getInvoices, generatePDF } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth.middleware');

const checkLogin=require('../middleware/auth-land-middleware')
const router = express.Router();

router.post('/', checkLogin, generatePDF);
router.get('/', protect, getInvoices);
router.get('/:id/pdf', protect, generatePDF);

module.exports = router;