const Invoice = require('../models/invoice');
const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');

exports.createInvoice = async (req, res) => {
  const {
    clientName,
    items,
    template,
    businessName,
    businessAddress,
    businessPhoneNumber,
    businessEmail,
    businessLogo,
    notes
  } = req.body;

  // Subtotal, discounts and tax calculations
  let subtotal = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const itemTotal = item.quantity * item.price;
    subtotal += itemTotal;
    totalDiscount += item.discount || 0;
  });

  const totalAmount = items.reduce((acc, item) => {
    const base = item.quantity * item.price;
    const tax = base * ((item.cgst + item.sgst) / 100);
    return acc + base + tax - (item.discount || 0);
  }, 0);

  const invoice = new Invoice({
    clientName,
    items,
    template,
    businessName,
    businessAddress,
    businessPhoneNumber,
    businessEmail,
    businessLogo,
    notes,
    subtotal,
    totalDiscount,
    totalAmount,
    status: 'Pending', // default
    createdAt: new Date()
  });

  await invoice.save();
  res.status(201).json(invoice);
};

exports.getInvoices = async (req, res) => {
  const { name, status, days } = req.query;
  const filters = {}; // Add `userId: req.user.id` if needed

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
  try {
    const {
      clientName,
      items,
      template,
      businessName,
      businessAddress,
      businessPhoneNumber,
      businessEmail,
      businessLogo,
      notes
    } = req.body;

    // Subtotal, discount, total
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const base = item.quantity * item.price;
      subtotal += base;
      totalDiscount += item.discount || 0;
    });

    const totalAmount = items.reduce((acc, item) => {
      const base = item.quantity * item.price;
      const tax = base * ((item.cgst + item.sgst) / 100);
      return acc + base + tax - (item.discount || 0);
    }, 0);

    const invoice = new Invoice({
      clientName,
      items,
      template,
      businessName,
      businessAddress,
      businessPhoneNumber,
      businessEmail,
      businessLogo,
      notes,
      subtotal,
      totalDiscount,
      totalAmount,
      status: 'unpaid',
      createdAt: new Date()
    });

    await invoice.save();

    const html = await ejs.renderFile(
      path.join(__dirname, `../templates/${template}.ejs`),
      { invoice }
    );
<<<<<<< HEAD

=======
   
    
>>>>>>> f11df4f3e90fd33afcc783591f4b3d0e709a588e
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
