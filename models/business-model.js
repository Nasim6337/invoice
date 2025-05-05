const mongoose=require('mongoose');

const businessSchema=mongoose.Schema({
    businessOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    businessName:{
        type:String,
        default:"XYZ"
    },
    businessEmail:{
        type:String,
        default:"XYZ@gmail.com"
    },
    businessPhoneNumber:{type:String,default:"+917560076322"},
    businessAddress:{type:String,default:"XYZ city ABC-230678"},
    businessLogo:String,
    businessGSTIN_Number:String,
    bankDetails: {
        accountNumber: String,
        ifsc: String,
        bankName: String,
        holderName:String
      },
},
{
    timestamps:true
  })

module.exports=mongoose.model("Business",businessSchema);

