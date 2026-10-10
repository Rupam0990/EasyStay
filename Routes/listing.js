const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listing.js");
const { isLoggedIn, isListingOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {cloudinary , storage} = require("../cloudConfig.js");
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    }
});


router.route("/new")
    .get(isLoggedIn, listingController.renderNewListingForm);

router.route("/")
    .get(listingController.indexListings)
    .post(
        isLoggedIn,
        (req, res, next) => {
            upload.single("listing[image]")(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                        req.flash("error", "Image size should be less than 5MB.");
                        return res.redirect("/listings/new");
                    }
                    return next(err);
                }
                return listingController.createListing(req, res, next);
            });
        },
        validateListing,
        
    );

router.route("/:id")
    .get(listingController.showListing)
    .put(
        isLoggedIn,
        isListingOwner,
        validateListing,
        (req, res, next) => {
            upload.single("listing[image]")(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                        req.flash("error", "Image size should be less than 5MB.");
                        return res.redirect(`/listings/${req.params.id}/edit`);
                    }
                    return next(err);
                }
                return listingController.updateListing(req, res, next);
            });
        }
    )
    .delete(isLoggedIn, isListingOwner, listingController.deleteListing);

router.route("/:id/edit")
    .get(isLoggedIn, isListingOwner, listingController.editListingForm);

module.exports = router;