const userModel=require('../models/user-model');


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

module.exports={getProfileInfo,editProfile,deleteProfile};