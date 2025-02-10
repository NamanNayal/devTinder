const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', userAuth, async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+" Sent a connection request")
    }catch(err){
        res.status(400).send("Error sending connection request");
    }
})

module.exports = requestRouter;