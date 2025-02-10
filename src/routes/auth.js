const express = require('express');
const {validateSignUpData} = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{
    
    try{
        validateSignUpData(req);
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

authRouter.post('/signin', async(req,res)=>{ 
    try{
        const {emailId, password} = req.body;
     
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("User logged in successfully");

        }else{
            throw new Error("Invalid Credentials");
        }

    }catch(err){
        res.status(400).send("ERROR: "+err.message);

    }
})

authRouter.post('/signout', async(req,res)=>{
    req.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send();
})

module.exports = authRouter;