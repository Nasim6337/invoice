const express=require('express');
const router=express.Router();
const checkLogin=require("../middleware/auth-land-middleware");

const {getClients}=require('../controllers/common-controller');

router.get('/getClients',checkLogin,getClients)

module.exports=router