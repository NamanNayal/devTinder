const express = require('express');
const {userAuth} = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

const profileRouter = express.Router();


profileRouter.get('/profile',userAuth, async(req,res)=>{
    try{
        // user passed from auth middleware
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error fetching user");
    }
})

profileRouter.patch('/profileEdit',userAuth, async(req, res)=>{
    try{
        if(!validateEditProfileData){
            throw new Error("Invalid data");
        }
        const loggedInUser = req.user;
        

        Object.keys(req.body).forEach((key)=>loggedInUser[key] = req.body[key]);
        res.json({message: `${loggedInUser.firstName}, your profile has been updated`,
        data: loggedInUser,
    })
        await loggedInUser.save(); 
        

    }catch(e){
        res.status(400).send("Error editing profile");
    }
})



module.exports = profileRouter;