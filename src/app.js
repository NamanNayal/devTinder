//created a web server
const express = require("express");
const connectDB = require('./config/database')
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validation');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require('./middlewares/auth');
//connecting to the cluster
require('./config/database');
 
const app = express();

app.use(express.json());
app.use(cookieParser());
//handler function as async
//to create a user in the db
app.post("/signup",async(req,res)=>{
    // const userObj = {
    //     firstName:"Naman",
    //     lastName:"Nayal",
    //     emailId:"naman@gmail.com",
    //     password:"123456",
    // }
    //creating a new instance of the User Model
    // const user = new User(userObj);


    
    try{
        //validation of data
        validateSignUpData(req);
        //encrypt the password
        const {password, firstName, lastName, emailId} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });    
        await user.save();
    res.send("User created successfully");
    }catch(err){
    res.status(400).send("ERROR: "+err.message);
    }
})

app.post('/signin', async(req,res)=>{ 
    try{
        const {emailId, password} = req.body;
        //get the response from body
        const user = await User.findOne({emailId: emailId});
        //check if the email id is present in the db
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);

        //check if the password is correct or not 
        if(isPasswordValid){
            
            //importing the getJWT method from user.js model
            const token = await user.getJWT();

            //add the token to cookie and send the response back to the user
            res.cookie("token", token);
            //res.cookie(name,value) by express
            res.send("User logged in successfully");

        }else{
            throw new Error("Invalid Credentials");
        }

    }catch(err){
        res.status(400).send("ERROR: "+err.message);

    }
})

app.get('/profile',userAuth, async(req,res)=>{
    try{
        // user passed from auth middleware
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error fetching user");
    }
})

app.post('/sendConnectionRequest', userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+" Sent a connection request")
    }catch(err){
        res.status(400).send("Error sending connection request");
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


