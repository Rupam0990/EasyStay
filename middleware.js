const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else if (req.path.includes("/reviews")) {
            req.session.redirectUrl = req.params && req.params.id ? `/listings/${req.params.id}` : "/listings";
        }
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login");
    }
    next();
};

module.exports.isListingOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (String(listing.owner) !== String(req.user._id)) {
        req.flash("error", "You are not authorized to modify this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewOwner = async (req, res, next) => {
    const { reviewId, id } = req.params;
    const reviewDoc = await Review.findById(reviewId);

    if (!reviewDoc) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (String(reviewDoc.author) !== String(req.user._id)) {
        req.flash("error", "You are not authorized to modify this review.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.validateReview = (req,res,next)=>{
    let{ error }= reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}


module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
