const mongoose= require('mongoose')

const connectDB= async()=>{
    try {
     await mongoose.connect(process.env.MONGO_URI)
     .then(console.log("connection suucessfully with db"))   
    } catch (error) {
        console.log(error.message)
    }
}
module.exports=connectDB;