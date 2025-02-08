const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validator(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email "+value);
        }
    }},
    password:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Use Strong Password "+value);
        }
    }},
    age:{
        type:Number,
        min:9,
    },
    gender:{
        type:String,

        validate(value){
        if(!["male", "female", "other"].includes(value)){
            throw new Error("Invalid gender");
        }
    },

    },
    photoUrl:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL "+value);
        }
    }},
    about:{
        type:String,
        default:"Hey there! I am using DevTinder",
    },
    skills:{
        type:[String],
    }
},
{
    timestamps:true,
}
);


//userSchema method for generating JWT token
userSchema.methods.getJWT = async function(){
    //this method will break if we use an arow function
    //whenever create an instance of the User model, we can call this function
    const user = this;
    //create a JWT token
    const token = await jwt.sign({_id: user._id},"12345", {expiresIn:"7d"});
    return token;

}
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user  = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}


module.exports = mongoose.model("User",userSchema);