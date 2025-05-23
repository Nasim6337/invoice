const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  subtotal: Number,
totalDiscount: Number,
businessName: String,
businessAddress: String,
businessPhoneNumber: String,
businessEmail: String,
businessLogo: String,
notes: String,
dueDate:{
  type:String,
  default:Date.now()
}
},{
  timestamps:true
});

module.exports = mongoose.model('Invoice', invoiceSchema);