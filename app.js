const express=require('express');
const app=express();
const path=require('path');
const cookie=require('cookie-parser');

app.use(express.static(path.join(__dirname,"Static")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie())

app.get('/',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'Static/HTML','index.html'))
});

module.exports=app;