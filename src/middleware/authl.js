const res = require('express/lib/response');
const jwt= require('jsonwebtoken');
const  rlandInfo=require('../modules/schemal');
require('dotenv').config();

const authl = async (req ,res , next)=>{
     try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEYL);
        const user2=await rlandInfo.findOne({_id:verifyUser._id})

        req.token=token;
        req.user2=user2;
        next();
     }catch(err){
         res.status(401).send('Login to perform this action');
     }
}

module.exports= authl;