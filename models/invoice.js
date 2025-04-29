const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clientName: String,
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
    }
  ],
  totalAmount: Number,
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' },
  template: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);