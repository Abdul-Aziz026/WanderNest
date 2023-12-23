const mongoose = require("mongoose");
const review = require("./review.js");

// c++ define type
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
    console.log("calling...");
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});


// ListingScema is the blueprint of Listing that defines the document structure...
const Listing = mongoose.model("Listing", listingSchema);

// exports the Listing model from this file, making it available for use in other files within the Node.js
module.exports = Listing;
