const Invoice = require('../models/invoice');
const puppeteer = require('puppeteer');
const userModel=require('../models/user-model');
const path = require('path');
const ejs = require('ejs');
const clientModel=require('../models/client-model');
const businessModel=require('../models/business-model')
const {createClient}=require('../controllers/common-controller');
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

  
  const invoice = await  Invoice.create({
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
  });
  if(invoice)
  {const invoiceRef=invoice?._id;
    const userData=req.UserData;
    await userModel.findByIdAndUpdate({_id:userData?.userId},
      {$push:{totalInvoices:invoiceRef}
      },
      {new:true}
    )
  }
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
  
    const invoice = await  Invoice.create({
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
      status: 'unpaid', // default
    });

    let invoiceUser;
    if(invoice)
    {const invoiceRef=invoice?._id;
      const userData=req.UserData;
       invoiceUser=await userModel.findByIdAndUpdate({_id:userData?.userId},
        {$push:{totalInvoices:invoiceRef}
        },
        {new:true}
      )
    }
    if(invoiceUser){
      await createClient(invoiceUser,invoice,req.body)
    }

    let business=await userModel.findOne({_id:req?.UserData?.userId})
    .populate("businessDetail")
    
  
    const html = await ejs.renderFile(
      path.join(__dirname, `../templates/${template}.ejs`),
      { invoice,"business":business?.businessDetail }
    );

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
