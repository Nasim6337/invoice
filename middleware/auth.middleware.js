const jwt=require('jsonwebtoken');
const path=require('path');
const loginAuthenticator=async(req,res,next)=>{
    let token=req.cookies.token;
    if (!token) {
        return res.sendFile(path.join(__dirname,"../Static/HTML","login.html"));
    }
    else{
        try{
            let verified_data=jwt.verify(req.cookies.token,process.env.ACCESS_TOKEN);
            req.userCookies=verified_data;
        }catch(err){console.log("token verification error")}
    }
    next();
}

module.exports=loginAuthenticator;