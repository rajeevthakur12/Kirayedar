const res = require('express/lib/response');
const jwt= require('jsonwebtoken');
const  rrenterInfo=require('../modules/schemar');
require('dotenv').config();

const authr = async (req ,res , next)=>{
     try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEYR);
        const user1=await rrenterInfo.findOne({_id:verifyUser._id})
        

        req.token=token;
        req.user1=user1;

        next();
     }catch(err){
         res.status(401).send('Login to to perform this action');
     }
}

module.exports= authr;