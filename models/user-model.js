const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone:{
    type:String,
    default:"+918007656432"
  },
  password: String,
  otp: String,
  isVerified: { type: Boolean, default: false },
  totalInvoices: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Invoice',
    default: []
  },
  paidInvoices:{
    type:Number,
    default:0
  },
  pendingInvoices:{
    type:Number,
    default:0
  },
  address:{
    type:String,
    default:"XYZ city-230124"
  },
  profilePicture:{
    type:String,
    default:"https://tableconvert.com/images/avatar.png"
  },
  businessDetail:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Business"
  },
  clientDetail:{
          type:[mongoose.Schema.Types.ObjectId],
          ref:"Client"
  }
},
{
  timestamps:true
});

module.exports = mongoose.model('User', userSchema);
