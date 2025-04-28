const express = require('express');
const mongoose = require('mongoose');



const db=async()=>{
    try {
        await  mongoose.connect('mongodb://localhost:27017/invoices')
        console.log("connected to DB")
    } catch (error) {
        console.log("error in connection with DB",error.message);
    }
   
}

module.exports=db;