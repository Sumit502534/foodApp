const planModel = require('../models/planModel');

module.exports.getAllPlans = async function getAllPlans(req, res){
    try
    {
        let plans = await planModel.find();
        if(plans){
            return res.json({
                message:'all plans retrieved',
                data:plans
            })
        }
        else{
            return res.json({
                message:'Plans not found'
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

module.exports.getPlan = async function getPlan(req, res){
    try
    {
        let id = req.params.id;
        let plan = await planModel.findById(id);
        if(plan){
            res.json({
                message:'Plan retrieved',
                data:plan
            })
        }
        else{
            return res.json({
                message:'Plan not found'
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

module.exports.createPlan = async function createPlan(req,res){
    try
    {
        let plandata = req.body;
        let createdPlan = await planModel.create(plandata);
        return res.json({
            message:'Plan created successfully',
            data:createdPlan
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.deletePlan = async function deletePlan(req,res){
    try
    {
        let id = req.params.id;
        if(id){
            let deletedPlan = await planModel.findByIdAndDelete(id);
            return res.json({
                message:'Plan deleted successfully',
                data:deletedPlan
            })
        }
        else{
            res.json({
                message:'Plan not found'
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

module.exports.updatePlan = async function updatePlan(req,res){
    try
    {
        let id = req.params.id;
        let dataTobeUpdated = req.body;
        let keys = [];
        for(let key in dataTobeUpdated){
            keys.push(key);
        }
        let plan = await planModel.findById(id);
        if(plan){
            for(let i = 0 ; i < keys.length ; i++){
                plan[keys[i]] = dataTobeUpdated[keys[i]];
            }
            await plan.save();
            res.json({
                message:'Plan updated successfully',
                data:plan
            })
        }
        else{
            res.json({
                message:'Plan not found'
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
// get top 3 plans
module.exports.top3Plans = async function top3Plans(req, res){
    try{
        const top3plans = await planModel.find().sort({
            ratingsAverage:-1
        }).limit(3);
        // sort them on the basis of ratings and get top 3
        return res.json({
            message:'Top 3 plans',
            data :top3plans
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:err.message
        })
    }
}