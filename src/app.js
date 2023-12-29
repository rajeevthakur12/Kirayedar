require('dotenv').config();
const cookieParser= require('cookie-parser');
const express = require('express');
const app=express();
const path= require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
require('./db/conn');
const jwt = require('jsonwebtoken')
const assert = require('assert');
const  rlandInfo=require('./modules/schemal');
const  rrenterInfo=require('./modules/schemar');    
const authr=require('./middleware/authr');
const authl=require('./middleware/authl');

const res = require('express/lib/response');



const port= process.env.PORT ||3000;

const pathDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')  
// npm config set strict-ssl=false

// console.log (path.join(__dirname, '../public'))


app.set('view engine', 'hbs')
app.set('views',  viewsPath);
hbs.registerPartials(partialsPath)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(pathDirectory))

// console.log(process.env.SECRET_KEY) 

// routing 
app.get("/",(req,res)=>{
    res.render('index');
})


// jwt for renter 
app.get("/book",authr,(req,res)=>{
    console.log(req.cookies.jwt);
    res.render('book');
})
app.get("/logoutr",authr,async (req,res)=>{
    try{
        // req.userl.token=req.userl.token.filter((currentelement)=>{
        //     return currentelement.token !== req.token
        // })
        res.clearCookie('jwt');
        console.log('logout Successfully...!!');
        req.userl.save();
        res.redirect('renter');
    }catch(err){
        res.status(500).render('renter')
    }
})


// jwt for landlord 
app.get("/UploadRoom",authl,(req,res)=>{
    console.log(req.cookies.jwt);
    res.render('UploadRoom');
})
app.get("/logoutl",authl,async (req,res)=>{
    try{
        // req.user2.token=req.user2.token.filter((currentelement)=>{
        //     return currentelement.token !== req.token
        // })
        res.clearCookie('jwt');
        console.log('logout Successfully...!!');
        req.user2.save();
        res.redirect('lord');
    }catch(err){
        res.status(500).render('lord');
    }
})


app.get('/registerkiraye',(req,res)=>{
    res.render('registerkiraye');
})
app.post('/registerkiraye',async(req,res)=>{
    try {
        const email = req.body.email;
        //console.log(`${email}`);
        const useremail = await rrenterInfo.findOne({ email: email });
        if (useremail == null) {
            const user = new rrenterInfo(req.body);

            console.log("Record Inserted Successfully");
            //res.send("Success")
            const token= await user.generateTokenR();
            res.cookie("jwt",token);
            await user.save();
            return res.redirect('renter');
        }
        else {
            res.send('Renter is already Register');
        }
    } catch (error) {
        res.status(400). send(error);

    }
})



// registration land lord 


app.get('/registerland',(req,res)=>{
    res.render('registerland');
})

app.post('/registerland',async(req,res)=>{
    try {
        const email = req.body.email;
        //console.log(`${email}`);
        const useremail = await rlandInfo.findOne({ email: email });
        if (useremail == null ) {
            const user = new rlandInfo(req.body);

            console.log("Record Inserted Successfully");
            //res.send("Success")
            const token= await user.generateTokenL();
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+3),
                httpOnly:true,
                secure:true
            });
            await user.save();
            return res.redirect('land');
        }
        else {
            res.send('Land Lord is already Register');
        }
    } catch (error) {
        res.status(400). send(error);

    }
})


// login land lord 
app.get('/land',(req,res)=>{
    res.render('land');
});
app.post("/landlogin", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        //console.log(`${username}`);
        //console.log(`${password}`);
        const user = await rlandInfo.findOne({ email: email });
         
        const isMatch= await bcrypt.compare(password,user.password);
        const token= await user.generateTokenL();  
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+3000000),
            httpOnly:true,
            secure:true
        });

        console.log(isMatch);
        if(isMatch)
          {
            //const user = new signupInfo(req.body);

            console.log("login Successfull");
            //res.send("Success")
            //await user.save()
            return res.redirect('book');

        }
        else {
             return res.send("Invalid email or password");
            // return res.redirect("student_login.html");
        }


    } catch (error) {
        res.status(400).send("not registered invalid id");
    }
});

// login renter 
app.get('/renter',(req,res)=>{
    res.render('renter');
});


app.post("/renterlogin", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
        //console.log(`${username}`);
        //console.log(`${password}`);
        const userl = await rrenterInfo.findOne({ email: email });
        const isMatch= await bcrypt.compare(password,userl.password);
        const token= await userl.generateTokenR();
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+3000000),
            httpOnly:true,
            secure:true
        });
        console.log(isMatch);
        // console.log(token);
          if(isMatch)
          {
            //const user = new signupInfo(req.body);

            console.log("login Successfull");
            //res.send("Success")
            //await user.save()
            return res.redirect('book');

        }
        else {
             return res.send('Invalid email or password');
            // return res.redirect("student_login.html");
        }


    } catch (error) {
        res.status(400).send("not registered invalid id");
    }
});

// navbar2
app.get('/index',(req,res)=>{
    res.render('home');
})
app.get('/about',(req,res)=>{
    res.render("about");
})
app.get('/contact',(req,res)=>{
    res.render('contact');
})

app.get('/home',(req,res)=>{
    res.render("welcome to home page");
})

app.listen(port,()=>{
    console.log(`listening in port ${port}`);
})