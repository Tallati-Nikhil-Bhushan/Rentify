const express = require('express');
const routes = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const ExpressError = require("../utils/ExpressError");
const {reviewSchema} = require('../schemas.js')
const Review = require("../models/review")
const Product = require('../models/products');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


routes.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))

routes.delete('/:reviewId',isLoggedIn,isReviewAuthor,reviews.deleteReview)

module.exports = routes