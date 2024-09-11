const express = require('express');
const planRouter = express.Router();
const {protectRoute, isAuthorised} = require('../controller/authController');
const {getPlan, getAllPlans, createPlan, updatePlan, deletePlan, top3Plans} = require('../controller/planController');

// all plans leke ayega
planRouter.route('/allPlans')
.get(getAllPlans)

// own plan => logged in necessary that's why protectRoute(protectRoute check logged in or not)
planRouter.use(protectRoute);
planRouter
.route('/plan/:id')
.get(getPlan)

// admin and resturantowner can only create, update or delete plans.
planRouter.use(isAuthorised(['admin', 'resturantowner']));
planRouter.route('/crudPlan')
.post(createPlan)

planRouter.route('/crudPlan/:id')
.patch(updatePlan)
.delete(deletePlan)

// top 3 plans
planRouter.route('/top3')
.get(top3Plans)

module.exports = planRouter;