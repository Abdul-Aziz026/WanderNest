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
        type: String,
        default: 'https://png.pngtree.com/thumb_back/fw800/background/20240106/pngtree-coloful-nature-beautiful-scenery-image_15576031.jpg',
        set: function(v) {
            return (v=="")?"https://png.pngtree.com/thumb_back/fw800/background/20240106/pngtree-coloful-nature-beautiful-scenery-image_15576031.jpg":v;
        }
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
    // geometry: {
    //     type: {
    //       type: String, // Don't do `{ location: { type: String } }`
    //       enum: ['Point'], // 'location.type' must be 'Point'
    //       required: true
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true
    //     }
    //   }
});

// listingSchema.post("findOneAndDelete", async(listing) => {
//     if (listing) {
//     console.log("calling...");
//         await review.deleteMany({_id: {$in: listing.reviews}});
//     }
// });


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
