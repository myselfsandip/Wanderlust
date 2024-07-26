const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const { listingSchema } = require('./schema.js');
const { reviewSchema } = require('./schema.js');
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = function (req, res, next) {
    // console.log(req.path,"...." ,req.originalUrl);
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to make changes!");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports.redirectPreviousPage = function (req, res, next) {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    return next();
}

module.exports.isOwner = async function (req, res, next) {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    // The .equals() method in your code is not a native JavaScript method but a Mongoose method. 
    //The .equals() method is used to compare two MongoDB ObjectId values. This is particularly useful because MongoDB ObjectIds are objects, and using the standard equality operators (== or ===) may not work as expected for object comparison.
    if (!listing.owner.equals(req.user._id)) {  // req.user Alternative res.locals.currUser._id
        req.flash("error", "You are not the owner!")
        return res.redirect(`/listings/${id}`);
        // console.log(req.body.listing);
    } else {
        return next();
    }
}
module.exports.isReviewAuthor = async function (req, res, next) {
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author!")
        return res.redirect(`/listings/${id}`);
    } else {
        return next();
    }
}

//Listing Validation Middleware
module.exports.validateListing = function (req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error.details);
        let errMsg = error.details.map(el => el.message).join(","); // In error there is an array of objects and message is a key of the object. In message key the error message are stored.
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Review Validation Middleware
module.exports.validateReview = function (req, res, next) {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        // console.log(error.details);
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}