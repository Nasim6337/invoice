const clientModel=require('../models/client-model');
const businessModel=require('../models/business-model')
const userModel=require('../models/user-model');
const { get } = require('mongoose');

const getClients=async(req,res)=>{
    try {
        const userData=req?.UserData;
        let clients=await userModel.findOne({_id:userData?.userId}).populate("clientDetail");

        if(clients){
            return res.status(200).json({
                status:true,
                clients:clients.clientDetail
            })
        }
    } catch (error) {
       console.log("error in client fetching",error.message) 
    }
}

const createClient=async(invoiceUser,invoice,body)=>{

     try {
        let client=await clientModel.findOne({
            clientEmail:body?.businessEmail
        })
        if(client && client.clientPhoneNumber===body?.businessPhoneNumber){
            client.numberOfInvoices.push(invoice._id);
            await client.save();
        }
        else{
            let createdClient=await clientModel.create({
                        clientName:body?.businessName,
                        clientEmail:body?.businessEmail,
                        clientAddress:body?.businessAddress,
                        clientPhoneNumber:body?.businessPhoneNumber
            }) 
            if(createdClient){
                createdClient.numberOfInvoices.push(invoice._id);
                await createdClient.save()
                invoiceUser.clientDetail.push(createdClient._id);
                await invoiceUser.save();

            }
        }
    } catch (error) {
        console.log("error in client creation",error.message)
    }

return;
}

module.exports={getClients,createClient}