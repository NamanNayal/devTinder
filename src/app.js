const express = require("express");
//created a web server
const app = express();

//to handle the incoming request
//this function is known as request handler
app.use((req,res)=>{
    res.send("hello from the server");
})
//listen on port 3000
app.listen(3000,()=>{
    console.log("Server listening on port 3000");
});