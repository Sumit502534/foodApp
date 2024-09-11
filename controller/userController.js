const userModel = require('../models/userModl');

// read mongoose documentation : https://mongoosejs.com/docs/queries.html

// GET users from database
module.exports.getUser = async function getUser(req, res){
    try
    {
        let id = req.id;
        let user = await userModel.findById(id);
        if(user){
            return res.json(user);
        }
        else{
            res.json({
                message:'user not found'
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

// POST 
// module.exports.postUser = function postUser(req,res){
//     users = req.body;
//     console.log(req.body);
    
//     res.json({
//         message:"data recieved successfully",
//         user:req.body
//     });
// }

// PATCH 
module.exports.updateUser = async function updateUser(req, res){
    // update data in users object
    try
    {
        let id = req.params.id;
        let user = await userModel.findById(id);
        let dataTobeUpdated = req.body;
        const keys = [];
        if(user){
            for(let key in dataTobeUpdated){
                keys.push(key);
            }
            for(let i = 0 ; i < keys.length ; i++){
                user[keys[i]] = dataTobeUpdated[keys[i]];
            }
            const updateData = await user.save();
            res.json({
                message:'data updated successfully',
                data:user
            });
        }
        else{
            res.json({
                message:'user not found'
            })
        }
    }
    catch(err)
    {
        res.json({
            message:err.message
        });
    }
}

// DELETE
module.exports.deleteUser = async function deleteUser(req, res){
    try
    {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if(!user)
        {
            res.json({
                message:'user not found'
            })
        }
        res.json({
            message:"data deleted successfully",
            data: user
        })
    }
    catch(err)
    {
        res.json({
            message:err.message
        });
    }
}

// parameters/params
module.exports.getAllUser = async function getAllUser(req,res){
    
    try
    {
        // console.log("hi")
        let users = await userModel.find();
        if(users){
            return res.json({
                message:'users retrieved',
                data:users
            })
        }
        else{
            res.json({
                message:'not any user there'
            })
        }
    }
    catch(err)
    {
        res.json({
            message:err.message
        });
    }
}

// cookies
// function setCookies(res, res){
//     // res.setHeader('Set-Cookie','isLoggedIn = true');
//     res.cookie('isLoggedIn', true, {maxAge:24*60*60*1000, secure:true, httpOnly:true});
//     res.cookie('isPrimeMember', true);
//     res.send('cookie has been set');
// }
// if you add the cookie:secure than the connection wiil only be accessable for https website
// hhtpOnly:true means the cookie data transfer will only be on http server, now it cant be access from frontend. so always use hhtpOnly:true for security purpose

// function getCookies(req, res){
//     let cookies = req.cookies;
//     // let cookiessepcific = req.cookies.isLoggedIn;
//     console.log(cookies);
//     res.send('cookies recieved');
// }
