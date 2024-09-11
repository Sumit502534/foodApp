const express = require('express');
const cookiePareser = require('cookie-parser');

const app = express();

app.use(cookiePareser());
app.use(express.json())
app.listen(3000);

// let users = [
//     {
//         'id':1,
//         'name':"Sumit"
//     },
//     {
//         'id':2,
//         'name':"Suman"
//     },
//     {
//         'id':3,
//         'name':"Sudip"
//     },
// ];

// mini app

const userRouter = require('./Routers/userRouter');
// const authRouter = require('./Routers/authRouter');
const planRouter = require('./Routers/planRouter');

const reviewRouter = require('./Routers/reviewRouter');
// use route, router to use
app.use('/user',userRouter);
// app.use('/auth',authRouter);
app.use('/plans', planRouter);
app.use('/review', reviewRouter);

