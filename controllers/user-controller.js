const userModel=require('../models/user-model');
const bcrypt=require('bcrypt')
const path=require('path')
const jwt=require('jsonwebtoken');
const register=async(req,res)=>{
    const {name,email,password,confirmPassword}=req.body;
    
    if(!name || !email || !password){
       return  res.status(404).json({
            status:false,
            message:"please fill all required field"
        })
        
    }

    if(password!=confirmPassword)
        return res.json({
            message:"password and confirm password not matched"
    })

    if(await userModel.findOne({email})){
        return res.status(500).json({
            status:false,
            message:"user already exists"
        })
    }

    if(password.length<8){
       return res.status(403).json({
        status:false,
        message:"please enter at least 8 character Password"
    })
    
    }

    bcrypt.hash(password,12,async(err,hashed)=>{
        if(err)
            console.log(err.message)
        else
        {
            try{
                let createdUser=await userModel.create({
                    name,
                    email,
                    password:hashed
                });

                if(createdUser)
                    return res.sendFile(path.join(__dirname,"../Static/HTML","login.html"))
                
            }
            catch(error){
                console.log("something went wrong in registering process",error.message)
            }
        }
    })


}

const login=async(req,res)=>{
    
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter your creadential details"});
    }

    let user=await userModel.findOne({email});
    if(!user){
        return  res.sendFile(path.join(__dirname,'../Static/HTML','register.html'));

}


    let passwordStatus=await bcrypt.compare(password,user.password);
    if(passwordStatus){
        let token=await jwt.sign({
            userId:user._id,
            userMail:user.email
        },process.env.JWT_TOKEN)
        res.cookie("token",token);
        return res.redirect('/')

    }
    else{
        return res.status(200).json({
            message:"please check your credential",
            status:false
        })
    }
    
    
}

module.exports={register,login};