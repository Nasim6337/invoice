const userModel=require('../models/user-model');
const bcrypt=require('bcrypt')

const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        res.status(404).json({
            status:false,
            message:"please fill all required field"
        })
    }
    bcrypt.hash(password,12,()=>{
        
    })


}

const login=async(req,res)=>{
    const {name,password}=req.body;
    if(!name || !password){
        return res.status(400).json({success:false,message:"Please enter your creadential details"});
    }
    
}