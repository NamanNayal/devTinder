//created a web server
const express = require("express");
const connectDB = require('./config/database')
const User = require('./models/user');
//connecting to the cluster
require('./config/database');
 
const app = express();

app.use(express.json());

//handler function as async
app.post("/signup",async(req,res)=>{
    // const userObj = {
    //     firstName:"Naman",
    //     lastName:"Nayal",
    //     emailId:"naman@gmail.com",
    //     password:"123456",
    // }
    //creating a new instance of the User Model
    // const user = new User(userObj);
    const user = new User(req.body);
    await user.save();
    try{
    res.send("User created successfully");
    }catch(err){
    res.status(400).send("Error creating user");
    }
})

connectDB().then(()=>{
    console.log("Connected to the database");
    //listen on port 3000
    app.listen(3000,()=>{
    console.log("Server listening on port 3000");
});
}).catch((err)=>{
    console.log("Error connecting to the database");
})


