// Protect Router :  a middleware to check whoever is accessing getUser is looged in or not, if lloged in then only he can access all users

const jwt = require('jsonwebtoken');
const JWT_KEY = require('../secrets');

function protectRoute(req, res, next){
    if(req.cookies.login){
        let isVerified = jwt.verify(req.cookies.login, JWT_KEY);
        if(isVerified){
            next();
        }
        else{
            res.json({
                message:"user not verified"
            })
        }
    }
    else{
        res.json({
            message:"operation not allowed"
        })
    }
}

module.exports=protectRoute;