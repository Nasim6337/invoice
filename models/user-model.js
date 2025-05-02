const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone:{
    type:String,
  },
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },
});

module.exports = mongoose.model('User', userSchema);
