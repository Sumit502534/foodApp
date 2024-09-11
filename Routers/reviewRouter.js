const express = require('express');
const reviewRouter = express.Router();
const {protectRoute} = require('../controller/authController');
const {} = require('../controller/reviewController');
const{getAllReviews, top3reviews, getPlanReviews, createReview, updateReview, deleteReview} = require('../controller/reviewController');

// get all reviews
reviewRouter
.route('/all')
.get(getAllReviews)

reviewRouter
.route('/top3')
.get(top3reviews)

reviewRouter
.route('/:id')
.get(getPlanReviews)

reviewRouter.use(protectRoute);
reviewRouter
.route('/crud/:id') // becasue the review will be of a particular plan, so we pass id of the plan
.post(createReview)  //  so we take id of the plan to create review
.patch(updateReview)
.delete(deleteReview)



module.exports = reviewRouter;