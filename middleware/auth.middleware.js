const jwt=require('jsonwebtoken');
const path=require('path');
const loginAuthenticator=async(req,res,next)=>{
    let token=req.cookies.token;
    if (!token) {
        return res.redirect('http://localhost:3000/api-v1/user/login');
    }
    else{
        try{
            let verified_data=jwt.verify(token,process.env.JWT_TOKEN);
            req.userCookies=verified_data;
        }catch(err){console.log("token verification error",err.message)}
    }
    next();
}

module.exports=loginAuthenticator;