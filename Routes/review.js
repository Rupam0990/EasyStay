const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/review.js");
const { validateReview, isLoggedIn, isReviewOwner } = require("../middleware.js");

router.route("/")
    .post(isLoggedIn, validateReview, reviewController.createReview);

router.route("/:reviewId")
    .delete(isLoggedIn, isReviewOwner, reviewController.deleteReview);

module.exports = router;