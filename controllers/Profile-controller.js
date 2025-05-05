const userModel=require('../models/user-model');
const businessModel=require('../models/business-model');

const getProfileInfo=async(req,res)=>{
      try {
        const userData=req?.UserData;
        const user=await userModel.findOne({_id:userData?.userId}).select("-password -bankDetails");
        if(!user)
            return res.json({
        status:false,
    message:"may be you are not logged in "});

            if(user)
                return res.status(200).json({
            status:true,
            user})
      } catch (error) {
        return res.json({
            status:false,
            message:error.message
        })
      }
        
}

const editProfile=async(req,res)=>{
    try {

        const {name,phone,address}=req.body;
        const userData=req.UserData;
        if(userData){
            let user=await userModel.findByIdAndUpdate({_id:userData.userId},
                {name,phone,address},
                {new:true}
            )
            if(user)
                return res.status(200).json({
            status:true,
            message:"user updated successfully"})
            
        }
        
    } catch (error) {
        return res.status(501).json({
            status:false,
            message:"something went wrong in profile updation",
            error:error.message
        })
    }
}

const deleteProfile=async(req,res)=>{
    try {
        
        const userData=req?.UserData;
        let deletedUser=await userModel.findByIdAndDelete({_id:userData?.userId});
        if(deletedUser)
            return res.json({
        status:true,
    message:"deleted successfully"})
    } catch (error) {
       return res.json({
        status:false,
        message:"something went wrong in deletion"
       }) 
    }
}

const businessDetail=async(req,res)=>{
    try {        
        const {businessName,businessEmail,businessPhoneNumber,businessAddress,holderName,bankName,accountNumber,ifsc}=req.body;
        if(!businessName || !businessEmail ||!businessAddress || !businessPhoneNumber)
            return res.status(403).json({
        status:false,
    message:"Please fill all required field"});
        const userData=req?.UserData;
        if(!userData){
            return res.json({status:false,
                message:"something went wrong in user detail fetching"
            })
        }

        let user=await userModel.findOne({_id:userData?.userId});

        if(user){
            let bankDetails={accountNumber,ifsc,holderName,bankName}
            let business=await businessModel.create({
                businessOwner:user._id ,
                businessName,businessEmail,businessPhoneNumber,businessAddress,
                bankDetails
            })
            if(business){
                user.businessDetail=business._id;
                await user.save();
                return res.status(200).json({
                    status:true,
                    message:"business detail created successfully"
                })
            }
        }

    } catch (error) {
        return res.status(500).json({
            status:false,
            message:error.message
        })
    }
}

const updateBusinessDetail=async(req,res)=>{
    
    try {        
        const {businessName,businessEmail,businessPhoneNumber,businessAddress,accountNumber,ifsc,holderName,bankName}=req.body;
        if(!businessName || !businessEmail ||!businessAddress || !businessPhoneNumber)
            return res.status(403).json({
        status:false,
        message:"Please fill all required field"});
        const userData=req?.UserData;


           const user = await userModel
            .findById(userData?.userId)
            .populate("businessDetail");

        if (!user || !user.businessDetail) {
        return res.status(404).json({
            status: false,
            message: "Business not found for this user"
        });
        }

        if(user){
            let bankDetails={accountNumber,ifsc,holderName,bankName}
            let updatedBusiness=await businessModel.findByIdAndUpdate({_id:user?.businessDetail?._id},{
                businessName,businessEmail,businessPhoneNumber,businessAddress,
                bankDetails
            },{
                new:true
            })
            if(updatedBusiness){
                return res.status(200).json({
                    status:true,
                    message:"business detail updated successfully"
                })
            }
        }  

    } catch (error) {
        console.log("error in updating business",error.message)
        return res.status(500).json({
            status:false,
            message:error.message
        })
    }
}

const getBusinessDetail=async(req,res)=>{
    try {
        let userData=req?.UserData;
        let business=await userModel.findOne({_id:userData?.userId}).populate("businessDetail");

        if(!business){
            return res.json({status:false,
                message:"something went wrong in detail fetching"
            })
        }
        return res.status(200).json({
            status:true,
            "business":business.businessDetail
        })
    } catch (error) {
        return res.status(501).json({
            status:false,
            message:error.message
        })
    }
}

module.exports={getProfileInfo,editProfile,deleteProfile,businessDetail,updateBusinessDetail,getBusinessDetail};