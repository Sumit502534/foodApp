// mongoose ke thorough connect
const mongoose = require("mongoose");
const db_link = require("../secrets");

mongoose.connect(db_link)
.then(function(db){
    console.log("Plan database connected");
})

.catch(function(err){
    console.log(err);
})

const planSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed 20 characters']
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true, 'price not enter']
    },
    ratingsAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount < 100;
        }, 'discount should not exceed price']
    },
    // noOFReviews
})


const planModel = mongoose.model('planModel', planSchema);


// (async function createPlan(){
//     let planObj = {
//         name:'SuperFood',
//         duration:30,
//         price:1000,
//         ratingsAverage:5,
//         discount:20
//     }
//     // M - 1
//     try {
//         let data = await planModel.create(planObj);
//         console.log(data);
//     } 
//     catch (error) {
//         console.error(error);
//     }
//     // M - 2
//     // const doc = new planModel(planObj);
//     // await doc.save();
// })(); //=> immediately invoke function

module.exports = planModel;