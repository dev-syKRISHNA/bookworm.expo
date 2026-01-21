import mongoose from "mongoose";   
import brcypt from "bcryptjs";

const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profileImg:{
        type:String,
        default:""
    }
})

// hash password before saving to database
userschema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await brcypt.genSalt(13);
    this.password = await brcypt.hash(this.password, salt);
    next();
})

const User = mongoose.model('User',userschema);

export default User;