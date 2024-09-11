const express = require('express');

const app = express();

app.use(express.json())

app.listen(3000);

let users = [
    {
        'id':1,
        'name':"Sumit"
    },
    {
        'id':2,
        'name':"Suman"
    },
    {
        'id':3,
        'name':"Sudip"
    },
];

// mini app
const authRouter = express.Router();
// use route, router to use
app.use('/auth',authRouter);

authRouter
.route('/signup')
.get(getSignUp)
.post(postSignUp)


// for authentication singup page
function getSignUp(req, res){
    res.sendFile('D:/My_Coding/Backend_Tutorial/foodApp/public/index.html');
}

function postSignUp(req, res){
    let obj = req.body;
    console.log('backend', obj); 
    res.json({
        message:"user signed up",
        data: obj
    });
}