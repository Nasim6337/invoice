const mongoose=require('mongoose');

const clientSchema=mongoose.Schema({
    clientName:String,
    clientEmail:String,
    clientAddress:String,
    clientPhoneNumber:String,
    businessRelation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    numberOfInvoices:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Invoice"
    }
},{
    timeStamp:true
})

module.exports=mongoose.model("Client",clientSchema);