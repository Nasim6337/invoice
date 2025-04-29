const Invoice = require('../models/invoice');
const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');

exports.createInvoice = async (req, res) => {
  const { clientName, items, template } = req.body;
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const invoice = new Invoice({
    userId: req.user.id,
    clientName,
    items,
    totalAmount,
    template
  });
  await invoice.save();
  res.status(201).json(invoice);
};

exports.getInvoices = async (req, res) => {
  const { name, status, days } = req.query;
  const filters = { userId: req.user.id };
  if (name) filters.clientName = { $regex: name, $options: 'i' };
  if (status) filters.status = status;
  if (days) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    filters.createdAt = { $gte: date };
  }

  const invoices = await Invoice.find(filters);
  res.json(invoices);
};

exports.generatePDF = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate('userId');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  
    // Render EJS template to HTML
    const html = await ejs.renderFile(
      path.join(__dirname, '../templates/template1.ejs'),
      { invoice }
    );
  
    // Launch Puppeteer and create PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
  
    const pdfBuffer = await page.pdf({ format: 'A4' });
  
    await browser.close();
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
    res.send(pdfBuffer);
  };
  