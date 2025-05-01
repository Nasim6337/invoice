const Invoice = require('../models/invoice');
const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');

exports.createInvoice = async (req, res) => {
  const { clientName, items, template } = req.body;
  const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const invoice = new Invoice({
   // userId: req.user.id,
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
  console.log(" inside backend")
  try {
    const { clientName, items, template } = req.body;
    const totalAmount = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const invoice = new Invoice({
      clientName,
      items,
      totalAmount,
      template,
    });

    await invoice.save();
  console.log(invoice)
    const html = await ejs.renderFile(
      path.join(__dirname, `../templates/${template}.ejs`),
      { invoice }
    );
    const fs = require('fs');
    fs.writeFileSync('debug.html', html);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('Failed to generate PDF');
  }
};

  