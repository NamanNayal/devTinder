const express = require('express');
const requestRouter = express.Router();
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest  = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res)=>{
    try{
        const fromUser = req.user._id;
        const toUserId = req.params.toUserId;
        const status  = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"});
        }

        //check if toUserId exists in db
        const toUser = await User.findOne(toUserId);
        if(!toUser){
            return res.status(404).json({message: "User not found"});
        }

        //if there is an existing connection request
        const existingConnectionRequest = new ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ]
        });
        if(existingConnectionRequest){
            res.status(200).json({message: "Connection request already exists"}); 
        }

    


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        res.json({
            message: req.user.firstName + ' is ' + status + ' in '+toUser.firstName,
            data: data,
        })
    }catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    
})

module.exports = requestRouter;