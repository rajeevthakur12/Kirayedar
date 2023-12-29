const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const res = require("express/lib/response");
const { required } = require("nodemon/lib/config");

const regrenterschema = new mongoose.Schema({
    name: { type: String},
    username: { 
        type: String ,
        unique:true },
    email: { 
        type: String,
        unique:true  },
    phone: { 
        type: Number, 
        unique:true,
     },
    password: { type: String },
    cpassword: { type: String },
    address: { type: String },
    aadharCard:{
        type:String,
        unique:true },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});


// generateToken

regrenterschema.methods.generateTokenR = async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEYR)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(err){
        res.send(`err part ${err}`);
    }
}

// renter password bcrypt

regrenterschema.pre("save", async function(next){

if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,10);
    this.cpassword=undefined;

}
next();
});



//now we need to create a collection

const rrenterInfo = new mongoose.model("rrenterInfo", regrenterschema);          

module.exports =rrenterInfo;

