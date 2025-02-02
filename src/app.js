const express = require("express");
//created a web server
const app = express();
const {adminAuth, userAuth} = require("./middlewares/auth.js");

app.use('/admin',adminAuth);

app.post('/user/login',(req,res)=>{
    res.send("User logged in");
});
app.get('/admin',(req,res)=>{
    res.send("Admin recognized");
})
app.get('/admin/getAllData',(req,res)=>{
    
    res.send("User Data Sent");
})

app.get('/user/:name/:userId/:password',(req,res)=>{
    console.log(req.params);
    res.send({firstname: 'John', lastname: 'Doe', email: 'john@doe.com'});
})
app.get('/user',userAuth,(req,res)=>{
    
    res.send("User created")
})

app.delete('/user',(req,res)=>{
    res.send("User deleted");
})

app.use('/start',(req, res)=>{
    res.send("Hello from the start route");
})
app.use('/test',(req,res)=>{
    res.send("hello from the test");
})
app.use('/go',(req, res)=>{
    res.send("Hello from the go route");
})

app.get('/getUserData',(req,res)=>{
    try{
        throw new Error ("Error");
        res.send("Hello from the getUserData route");
    }catch(err){
        res.status(500).send("something went wrong!!");
    }
})
app.get("/getUserData",(req,res)=>{
    throw new Error("dasx");
    res.send("user data");
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
})
//to handle the incoming request
// // //this function is known as request handler
// app.use('/',(req,res)=>{
//     res.send("hello from the server");
// })
//listen on port 3000
app.listen(3000,()=>{
    console.log("Server listening on port 3000");
});