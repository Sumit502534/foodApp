const express = require('express');
const userModel = require('../models/userModl');
const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets');

// for authentication singup user
module.exports.signup = async function signup(req, res){
    try
    {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        if(user)
        {
            return res.json({
                message:"user signed up",
                data: user
            });
        }
        else
        {
            res.json({
                message:'Error while signing up'
            })
        }
    }
    catch(err)
    {
        res.json({
            message:err.message
        })
    }
}

// for login
module.exports.login = async function login(req, res){
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

// for lgoout
module.exports.logout = function logout(req, res){
    // we are sending the cookie as empty so it will overwrite the login cookie jwt
    res.cookie('login', ' ', {maxAge:1});
    res.json({
        message:'User logged out Successfully'
    })
}

// isAuthorised : to check the user role(Admin, user, resturant, deliveryboy)
module.exports.isAuthorised = function isAuthorised(roles){
    return function(req, res, next){
        if(roles.includes(req.role) == true){
            next();
        }
        else{
            res.status(401).json({
                message:'operation not allowed'
            })
        }
    }
}

// protectroute
module.exports.protectRoute = async function protectRoute(req, res, next){
    let token;
    try{
        if(req.cookies.login)
        {
            token = req.cookies.login;
            let payload = jwt.verify(token, JWT_KEY);
            if(payload)
            {
                const user = await userModel.findById(payload.payload)
                req.role = user.role
                req.id = user.id
                next();
            }
            else
            {
                res.json({
                    message:"user not verified"
                })
            }
        }
        else{
            // browser : redirect to login page
            const client = req.get('User-Agent');
            if(client.includes('Mozilla') == true){
                return res.redirect('/login');
            }
            //postman
            res.json({
                message:"please login"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

// forget passowrd
module.exports.forgetpassword = async function forgetpassword(req, res){
    let {email} = req.body;
    try
    {
        const user = await userModel.findOne({email:email});
        if(user)
        {
            // create resetToken is used to create a new token
            const resetToken = user.createResetToken();
            let resetPasswordLink = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`
            // send email to the user
            // using nodemailer
            return res.json({
                message: 'Reset password link sent successfully'
            });
        }
        else
        {
            return res.json({
                message: 'User not found. Please sign up.'
            });
        }
    }
    catch(err)
    {
        res.status(500).json({
            message:err.message
        });
    }
}

// resetpassword
module.exports.resetpassword = async function resetpassword(req, res){
    try{
        const token = req.params.token;
        let {password, confirmPassword} = req.body;
        const user = await userModel.findOne({resetToken:token});
        if(user)
        {
            // resetpasswordHandler will update user password in db
            user.resetpasswordHandler(password, confirmPassword);
            await user.save();
            res.json({
                message:'user password changed successfully please login again'
            })
        }
        else
        {
            res.json({
                message: 'user not found'
            })
        }
    }
    catch(err)
    {
        res.status(500).json({
            message:err.message
        })
    }
}