const mongoose = require("mongoose");
const { Schema } = mongoose;
const review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        default: "trending",
    },
    geometry: {
        type: {
            type: String,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            
        },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } }); 
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;