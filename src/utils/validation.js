const validator = require("validator");
const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error("First Name and Last Name are required");
    }
    // else if(firstName.length < 4 || firstName.length > 50){
    //     throw new Error("First Name should be between 4 and 50 characters");
    // }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Use Strong Password");
    }

};

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName", "lastName", "emailId", "about","photoUrl","gender","age","skils"];

    const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports ={
    validateSignUpData,
    validateEditProfileData,
}