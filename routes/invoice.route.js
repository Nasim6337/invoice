const express = require('express');
const { createInvoice, getInvoices, generatePDF } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/',  generatePDF);
router.get('/', protect, getInvoices);
router.get('/:id/pdf', protect, generatePDF);

module.exports = router;