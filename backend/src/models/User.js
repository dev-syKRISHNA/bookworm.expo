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
},{timestamps:true})

// hash password before saving to database
userschema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await brcypt.genSalt(13);
    this.password = await brcypt.hash(this.password, salt);
})

// method to compare password during login
userschema.methods.comparePassword = async function (userPassword) {
    return await brcypt.compare(userPassword, this.password);
}

const User = mongoose.model('User',userschema);

export default User;