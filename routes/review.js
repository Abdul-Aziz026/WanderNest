const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

// review create route
router.post("/", isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.session.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Create review successfully");
    res.redirect(`/listings/${id}`);
});

// review delete
router.delete("/:reviewId", isLoggedIn, async(req, res)=>{
    let {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (review.author == req.session.user._id) {
        // console.log(id, reviewId);
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("error", "Delete review successfully");
        res.redirect(`/listings/${id}`);
    }
    else {
        req.flash("error", "You aren't the owner of this review...");
        res.redirect(`/listings/${id}`);
    }
});

module.exports = router;

