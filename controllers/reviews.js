const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findOne({ _id: req.params.id });
    const new_review = new Review(req.body.review);
    new_review.author = req.user._id;
    // console.log("New Review:",new_review);
    listing.reviews.push(new_review);
    await new_review.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Review.deleteOne({ _id: reviewID });
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}