const express=require('express');
const app=express();
const path=require('path');
const cookie=require('cookie-parser');
const userRoute=require('./routes/user-routes')
const dotenv=require('dotenv');
const loginAuthenticator=require('./middleware/auth.middleware')
const pagesRoutes=require('./PagesRoute/page-routers')

app.use(express.static(path.join(__dirname,"Static")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie())
dotenv.config();
app.use("/api-v1/user",userRoute);
app.use(pagesRoutes);

app.get('/',loginAuthenticator,(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'Static/HTML','index.html'))
});



module.exports=app;