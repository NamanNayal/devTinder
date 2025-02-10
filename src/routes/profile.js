const express = require('express');
const {userAuth} = require('../middlewares/auth');
const { validateEditProfileData, validatePassword } = require('../utils/validation');
const bcrypt = require("bcrypt");

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

profileRouter.patch('/profile/edit',userAuth, async(req, res)=>{
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

profileRouter.patch('/profile/changePassword', userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const loggedInUser = req.user;

        if (!loggedInUser) {
            throw new Error("User not found");
        }
        const isMatch = await validatePassword(currentPassword, loggedInUser.password);
        if (!isMatch) {
            throw new Error("Current password is incorrect");
        }
        loggedInUser.password = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();

        res.json({ message: "Password changed successfully" });

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


//take exisiting password and new password, checkk if new password is strong enough or not 



module.exports = profileRouter;