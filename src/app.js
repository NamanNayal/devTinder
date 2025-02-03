//created a web server
const express = require("express");
const connectDB = require('./config/database')
const User = require('./models/user');
//connecting to the cluster
require('./config/database');
 
const app = express();

app.use(express.json());

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
    const user = new User(req.body);
    await user.save();
    try{
    res.send("User created successfully");
    }catch(err){
    res.status(400).send("Error creating user");
    }
})
//to get user from the db
app.get("/user",async(req, res) => {
    const userEmail = req.body.emailId;
    if(!userEmail){
        return res.status(400).send("Email is required");
    }
    try{
        const user = await User.findOne({emailId: userEmail});
        if(!user){
            return res.status(404).send("User not found");
        }else{
            res.send(user);
        }
       
    }catch(e){
        res.status(400).send("Error fetching user");
    }
})
//Feed API  GET feed  get all the users from the db
app.get('/feed',async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err){
        res.status(500).send("Server Error");
    }

})
//to delete user from the database 
app.delete('/user', async(req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(500).send("Error deleting user");
    }
})
//to update user from the database
app.patch('/user/:userId', async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
   
    try{
        const ALLOWED_UPDATE = ["photoUrl","about","gender","skills"];
        const isUpdateAlllowed = Object.keys(data).every((k)=> ALLOWED_UPDATE.includes(k));
        if(!isUpdateAlllowed){
            throw new Error("Invalid updates");
        }

        if(data?.skills.length > 10){
            throw new Error("Skills limit exceeded");
        }

        await User.findByIdAndUpdate({_id: userId},data,{
            returnDocument:"after",
            runValidators:true,
        });
        res.send("User updated successfully");
    }catch(err){
        res.status(500).send("Error updating user");
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


