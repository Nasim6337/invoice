const jwt=require('jsonwebtoken');
const userModel=require('../models/user-model');

const checkLogin=async(req,res,next)=>{
try{
    const token = req.cookies.token;
    if(!token){
        res.redirect('http://localhost:5000/login');
    }

    const UserData=jwt.verify(token,process.env.JWT_SECRET);
    req.UserData=UserData;
    next();
}
catch(error){
    console.log("login checking failed",error.message)
}
}

module.exports=checkLogin;