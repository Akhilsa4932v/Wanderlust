const express = require("express");
const router = express.Router({mergeParams:true});
const  WrapAsync = require("../utils/WrapeAsync.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
const reviewcontroller = require('../controller/reviews.js');


//Reviews route
    router.post('/',isLoggedIn,validateReview,WrapAsync(reviewcontroller.createreview));
   
   //delete review route
   router.delete('/:reviewId',isLoggedIn,isReviewAuthor,WrapAsync(reviewcontroller.destroyReview))
   
   module.exports = router;