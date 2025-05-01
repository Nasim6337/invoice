const mongoose=require('mongoose');

const invoiceSchema=mongoose.Schema({
    BusinessInformation:String,
    BusinessEmail:String,
    BUsinessAddress:String,
    BusinessPhoneNumber:String,
    BusinessLogo:String,
    ItemDescription:String
})