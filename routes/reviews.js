const express = require('express');
const router = express.Router({ mergeParams: true });  //if there is a params in the parent route then to access that params , we set mergeParams to true
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn,isReviewAuthor,validateReview } = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");

//POST Review Route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete('/:reviewID', isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;