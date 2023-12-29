const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const res = require("express/lib/response");
const { required } = require("nodemon/lib/config");

const reglandschema = new mongoose.Schema({
    name: 
    { type: String },
    username: { 
        type: String , 
        unique:true },
    email: { 
        type: String ,
        unique:true  },
    phone: { 
        type: Number,
        unique:true },
    password: { type: String },
    cpassword: { type: String },
    address: { type: String },
    aadharCard:{
        type:Number,
        unique:true},
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});


// generateToken
reglandschema.methods.generateTokenL = async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEYL)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(err){
        res.send(`err part ${err}`);
    }
}

//encrypting the password file kirayedar password becrypt

reglandschema.pre("save", async function(next){

   if (this.isModified('password')){
       this.password=await bcrypt.hash(this.password,10);
       this.cpassword=undefined;
   }
    
    next();
    
})



//now we need to create a collection

const rlandInfo = new mongoose.model("rlandInfo",reglandschema );   

module.exports =rlandInfo;

