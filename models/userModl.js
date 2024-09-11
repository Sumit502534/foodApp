const mongoose = require("mongoose");
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db_link = require("../secrets");

mongoose.connect(db_link)
.then(function(db){
    console.log("database connected");
})

.catch(function(err){
    console.log(err);
})

const userShcema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
            return emailValidator.validate(this.email);
        }
    },
    password:{
        type:String,
        require:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        require:true,
        minLength:8,
        validate:function(){
            return this.confirmPassword == this.password;
        }
    },
    role:{
        type:String,
        enum:['admin','user','resturantowner','deliveryboy'],
        default:'user'
    },
    profileImage:{
        type:String,
        default:'img/users/default.jpeg'
    },
    resetToken:String
});

// mongoose hooks

// Ex: we do't want to save the confirmpassword in the database its only for check

userShcema.pre('save', function(){
    //console.log('before save into db')
    this.confirmPassword = undefined;
})

userShcema.methods.createResetToken = function(){
    // cretaing unique using npm crypto crypto
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetToken = resetToken;
    return resetToken;
}

userShcema.methods.resetpasswordHandler = function(passowrd, confirmPassword){
    this.passowrd = passowrd;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}
// hashing(salt)

// userShcema.pre('save', async function(){
//     let salt = await bcrypt.genSalt();
//     let hashedString = await bcrypt.hash(this.password, salt);
//     this.password = hashedString;
// }) 
 
//  after saving into db if yoy want to change

// userShcema.post('save', function(doc){
//     console.log('After saving in databse', doc);
// })

// model
const userModel = mongoose.model('userModel', userShcema);

module.exports = userModel;
/* manually inserting into the db
 createuser
 (async function createUser(){
    let user={
        name:'Suman Kumar Nag',
        email:'sumankumarnag3@gmail.com'        password:'Suman@2000',
       confirmPassword:'Suman@2000'
    };
    let data = await userModel.create(user);
    console.log(data);
 })();
*/
