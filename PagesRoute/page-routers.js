const express=require('express');
const router=express.Router();
const path=require('path');

router.route('/api-v1/user/login').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","login.html"))
})

router.route('/api-v1/user/register').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","register.html"))
})

router.route('/api-v1/createInvoice').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","createInvoice.html"))
})

router.route('/api-v1/invoices').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","invoices.html"))
})

router.route('/api-v1/client').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","client.html"))
})


router.route('/api-v1/user/profile').get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Static/HTML","profile.html"))
})



module.exports=router;