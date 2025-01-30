const express = require("express");
//created a web server
const app = express();

app.get('/user/:name/:userId/:password',(req,res)=>{
    console.log(req.params);
    res.send({firstname: 'John', lastname: 'Doe', email: 'john@doe.com'});
})
app.post('/user',(req,res)=>{
    
    res.send("User created")
})

app.delete('/user',(req,res)=>{
    res.send("User deleted");
})

app.use('/start',(req, res)=>{
    res.send("Hello from the start route");
})
app.use('/test',(req,res)=>{
    res.send("hello from the test");
})
app.use('/go',(req, res)=>{
    res.send("Hello from the go route");
})

//to handle the incoming request
//this function is known as request handler
app.use('/',(req,res)=>{
    res.send("hello from the server");
})
//listen on port 3000
app.listen(3000,()=>{
    console.log("Server listening on port 3000");
});