const express = require('express');
const authRouter = express.Router();
const userModel = require('../models/userModl');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets');

authRouter
.route('/signup')
.get(getSignUp)
.post(postSignUp)

authRouter
.route('/login')
.post(loginUser)

// for authentication singup page
function getSignUp(req, res){
    res.sendFile('D:/My_Coding/Backend_Tutorial/foodApp/public/index.html');
}

async function postSignUp(req, res){
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    res.json({
        message:"user signed up",
        data: user
    });
}

async function loginUser(req, res){
    try{
        let data = req.body;
        if(data.email){
            let user = await userModel.findOne({email:data.email});
            if(user){
                // bcrypt -> compare function
                if(user.password == data.password){
                    let uid = user._id// unique id
                    let JWT = jwt.sign({payload:uid},JWT_KEY) // header,payload,signature
                    // user logged in so save jwt into a cookie
                    res.cookie('login', JWT, {httpOnly:true});

                    return res.json({
                        message:"User has logged in",
                        userDetails:data
                    })
                }
                else{
                    return res.json({
                        message:"Wrong Credentials"
                    })
                }
            }
            else{
                return res.json({
                    message:"User not found"
                })
            }
        }
        else{
            return res.json({
                message:"Empty filled found"
            })
        }
    }
    catch{
        return res.status(500).json({
            message:"User not found"
        })
    }
}
module.exports=authRouter;