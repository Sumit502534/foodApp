// mongoose ke thorough connect
const mongoose = require("mongoose");
const db_link = require("../secrets");

mongoose.connect(db_link)
.then(function(db){
    console.log("Review database connected");
})

.catch(function(err){
    console.log(err);
})

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true,'review is required']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'rating is required']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'userModel', // reference from a user because a review must be given by a user
        required:[true, 'User review must belong to a user']
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:'planModel', // reference from a plan because a review must be given by a plan
        required:[true, 'User review must belong to a plan']
    }
});

//  making link
// 'find' 'findById' 'findOne'
reviewSchema.pre(/^find/, function (next){
    this.populate({
        path:"user",
        select:"name profileImage"
    }).populate("plan");
    next();
});

const reviewModel = mongoose.model('reviewModel', reviewSchema);

module.exports = reviewModel;

// https://youtu.be/wYqWWa4UF4U?si=rPKkZNusXht38Oaz