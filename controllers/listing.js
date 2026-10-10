const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/create.ejs");
};

module.exports.indexListings = wrapAsync(async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : "";
    const category = req.query.category ? req.query.category.trim() : "";
    let filter = {};

    if (category) {
        filter.category = category;
    }

    if (query) {
        const searchRegex = new RegExp(query, "i");
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
            { description: searchRegex }
        ];
    }

    const allListings = await listing.find(filter).populate("owner");
    res.render("listings/index.ejs", {
        allListings,
        searchQuery: query,
        activeCategory: category,
    });
});

module.exports.createListing = wrapAsync(async (req, res) => {
    const addressQuery = [req.body.listing.location, req.body.listing.country].filter(Boolean).join(", ");
    let response = await geocodingClient.forwardGeocode({
        query: addressQuery,
        limit: 1
    }).send();

    const feature = response.body.features[0];
    const geometry = feature ? feature.geometry : { type: "Point", coordinates: [77.2089, 28.6139] };

    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new listing({
        ...req.body.listing,
        owner: req.user._id,
        geometry,
    });
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
});

module.exports.editListingForm = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const place = await listing.findById(id);
    if (!place) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { place });
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
});

module.exports.updateListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const updatedListing = { ...req.body.listing };

    if (updatedListing.location || updatedListing.country) {
        const addressQuery = [updatedListing.location, updatedListing.country].filter(Boolean).join(", ");
        const response = await geocodingClient.forwardGeocode({
            query: addressQuery,
            limit: 1
        }).send();
        const feature = response.body.features[0];
        if (feature) {
            updatedListing.geometry = feature.geometry;
        }
    }

    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
});

module.exports.showListing = wrapAsync(async (req, res) => {
    let { id } = req.params;
    const place = await listing
        .findById(id)
        .populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "author",
                select: "username",
            },
        })
        .populate("owner");
    if (!place) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { place });
});
