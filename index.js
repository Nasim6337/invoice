
const app=require('./app');
const db=require('./DB/db');

db()
.then(()=>{
    app.listen(3000,()=>{
        console.log("server is running at 3000 port")
    });
})
.catch((err)=>{
    console.log(err.message);
})



