const review = require("../models/review.js");
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.createReview = wrapAsync(async (req, res) => {
    let foundListing = await listing.findById(req.params.id);
    if (!foundListing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let newReview = new review({
        ...req.body.review,
        author: req.user._id,
    });
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listings/${req.params.id}`);
});

module.exports.deleteReview = wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
});
