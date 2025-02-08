const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async(req,res, next)=>{
    
    //read the token from req cookies
    try{
        //get the token from cookies
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token not found");
        }
        //checks if the token exists or not
        const decodeObj = await jwt.verify(token, "12345");
        //get the id from the token
        const{_id} = decodeObj;
        //find the user with the id
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        //add the user we found to the request object
        req.user = user;
        
        next();
    }catch(e){
        res.status(401).send("Please authenticate");
    }


};

module.exports = {
    userAuth,
};