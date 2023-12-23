const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req, res) => {
    // console.log("coming... here...");
    let listing = await Listing.findById(req.params.id);
    // console.log(req.body.review, "Now working Alhamdulillah");
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    // console.log(newReview);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
    // console.log("saved successfully...");
    // res.send("saved successfully...");
};

module.exports.destroyReview = async(req, res)=>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};