const express = require('express');
const userRouter = express.Router();
const {userAuth}= require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = ["firstName", "lastName","age","gender","photoUrl","about","skills"];  
//get all the pending connection request for the loggedIn in user

userRouter.get('/user/requests/received', async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: ''
        }).populate("fromUserId",USER_SAFE_DATA);
    }catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
});

userRouter.get('/user/connections', userAuth, async(req,res)=>{

    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
            {fromUserId: loggedInUser._id, status:'accepted'},
            {toUserId: loggedInUser._id, status:'accepted'},
            ],
        }).populate('fromUserId', USER_SAFE_DATA).populate('toUserId', USER_SAFE_DATA);
        const data = connectionRequest.map((row)=>{
            if(row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    }catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
})

userRouter.get('/feed', userAuth, async(req,res)=>{
    try{
    const loggedInUser = req.user;

    const page = parseInt(req.query.page)||1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50: limit;
    const skip = (page-1)*limit;


    const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id},
        ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req)=>{
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
        $and:[
            {
                _id:{$nin: Array.from(hideUsersFromFeed)} },
            {_id:{$ne: loggedInUser._id}},
        ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({data:users});

    }catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
})

module.exports = userRouter;