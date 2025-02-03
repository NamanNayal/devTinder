const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(
        "mongodb+srv://namannayal:u3iuUGbI6kll08Dw@cluster0.otevr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
}

module.exports = connectDB;


