const User = require('../models/user-model');

getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
  await user.save();
  res.json(user);
};


//     if(password.length<8){
//        return res.status(403).json({
//         status:false,
//         message:"please enter at least 8 character Password"
//     })
    
//     }

//     bcrypt.hash(password,12,async(err,hashed)=>{
//         if(err)
//             console.log(err.message)
//         else
//         {
//             try{
//                 let createdUser=await userModel.create({
//                     name,
//                     email,
//                     password:hashed
//                 });

//                 if(createdUser)
//                     return res.redirect('http://localhost:3000/api-v1/user/login')
                
//             }
//             catch(error){
//                 console.log("something went wrong in registering process",error.message)
//             }
//         }
//     })


// }

const login=async(req,res)=>{
    
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"Please enter your creadential details"});
    }

    let user=await userModel.findOne({email});
    if(!user){
        return  res.redirect('http://localhost:3000/api-v1/user/register')

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




searchUsers = async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    name: { $regex: q, $options: 'i' },
    isVerified: true
  }).select('name email');
  res.json(users);
};

module.exports={login,getProfile,updateProfile,searchUsers};

