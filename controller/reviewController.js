const reviewModel = require('../models/reviewModel');
const planModel = require('../models/planModel');

module.exports.getAllReviews = async function getAllReviews(req, res){
    try
    {
        const reviews = await reviewModel.find();
        if(reviews){
            res.json({
                message:'All reviews retrived',
                data:reviews
            })
        }
        else{
            res.json({
                message:'There is no review'
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
module.exports.top3reviews = async function top3reviews(req, res){
    try
    {
        const reviews = await reviewModel.find().sort({
            rating:-1
        }).limit(3);
        if(reviews){
            res.json({
                message:'Top 3 reviews retrived',
                data:reviews
            })
        }
        else{
            res.json({
                message:'There is no review'
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
module.exports.getPlanReviews = async function getPlanReviews(req, res){
    try
    {
        let planId  = req.params.id;
        let reviews = await reviewModel.find();
        reviews = reviews.filter(review => review.plan._id == planId);
        if(reviews){
            return res.json({
                message:'review retrived for a particular plan',
                data:reviews
            })
        }
        else{
            res.json({
                message:'reviews not found'
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
module.exports.createReview = async function createReview(req, res){
    try
    {
        let id = req.params.id;
        console.log(id);
        let plan = await planModel.findById(id);
        if(plan){
            let data = req.body;
            let review = await reviewModel.create(data);
            plan.ratingsAverage = (plan.ratingsAverage + data.rating)/2;
            await plan.save();
            
            res.json({
                message:'review created',
                data:review
            })
        }
        else{
            return res.status(404).json({
                message: 'Plan not found'
            });
        }
    }
    catch(err)
    {
        res.json({
            message:err.message
        })
    }
}
module.exports.updateReview = async function updateReview(req, res){
    try
    {
        let planId = req.params.id; // in url planid will be send
        // reviewid from frontend
        let reviewId = req.body.id; // we will send the review id in body of req
        let dataTobeUpdated = req.body; // here reviewid also included so we will not update it
        let keys = [];
        for(let key in dataTobeUpdated){
            if(key == 'reviewId') continue; // that's why we skip the review id here
            keys.push(key);
        }
        let plan = await planModel.findById(planId);
        if(plan){
            let review = await reviewModel.findById(reviewId);
            if(review){
                for(let i = 0 ; i < keys.length ; i++){
                    review[keys[i]] = dataTobeUpdated[keys[i]];
                }
                await review.save();
                res.json({
                    message:'review updated successfully',
                    data:review
                })
            }
            else{
                res.json({
                    message:'review for the specifed plan is not found',
                })
            }
        }
        else{
            res.json({
                message:'plan not found',
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
module.exports.deleteReview = async function deleteReview(req, res){
    try
    {
        let planId = req.params.id;
        // reviewid from frontend
        let reviewId = req.body.id; //we will send the review id in body of req.
        let plan = await planModel.findById(planId);
        if(plan){
            if(reviewId){
                let review = await reviewModel.findByIdAndDelete(reviewId);
                return res.json({
                    message:'review deleted successfully',
                    data:review
                })
            }
            else{
                res.json({
                    message:'review not found'
                })
            }
        }
        else{
            res.json({
                message:'plan not found',
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
