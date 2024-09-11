const express = require('express');
const userRouter = express.Router();
const {getUser,updateUser,deleteUser,getAllUser} = require('../controller/userController')

const protectRoute = require('./authHelper');
const {signup, login, logout, isAuthorised, forgetpassword, resetpassword} = require('../controller/authController');

// user options
userRouter.route('/:id')
.patch(updateUser)
.delete(deleteUser)

// for signup
userRouter
.route('/signup')
.post(signup)

// for login
userRouter
.route('/login')
.post(login)

// for logout
userRouter
.route('/logout')
.get(logout)

// profile page
userRouter.use(protectRoute); // this will protect all the routes below it 
userRouter
.route('/userProfile')
.get(getUser)

// admin specific function
userRouter.use(isAuthorised(['admin']));
userRouter
.route('/')
.get(getAllUser)

// forget Password route
userRouter
.route('/forgetpassword')
.post(forgetpassword)

userRouter
.route('/resetpassword/:token')
.post(resetpassword)

// for cookies
// userRouter
// .route("/getCookies")
// .get(getCookies)

// userRouter
// .route('/setCookies')
// .get(setCookies)

module.exports = userRouter;