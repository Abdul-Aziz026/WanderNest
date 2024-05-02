const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

// Home Page
router.get("/", wrapAsync(async(req, res)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{ allListings });
}));

// create new listing...
router.post("/", isLoggedIn, wrapAsync(async(req, res, next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.session.user._id;
    const ress = await newListing.save();
    req.flash("success", "Create listing successfully");
    res.redirect("/listings");
}));

// create new listing get route
router.get("/new", isLoggedIn, wrapAsync((req, res)=>{
    res.render("./listings/new.ejs");
}));

// show individual listing details
router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    res.render("./listings/show.ejs", { listing });
}));


// update listings
router.put("/:id", isLoggedIn, wrapAsync(async (req, res, next)=>{
    let {id} = req.params;
    // autherization check...
    const curList = await Listing.findById(id);
    if (req.session.user && curList.owner == req.session.user._id) {
        const result = await Listing.findByIdAndUpdate(id, {...req.body.listing});
        // console.log("update data: ", req.body.listing);
        req.flash("success", "Update listing successfully");
        res.redirect("/listings");
    }else {
        rea.flash("error", "You aren't allowed to update this listing...");
        res.redirect(`/listings/${id}`);
    }
}));

// delete listing route...
router.delete("/:id", wrapAsync(async (req, res)=>{
    const {id} = req.params;
    // first delete all review
    const listing = await Listing.findById(id);
    await Review.deleteMany({ _id: { $in: listing.reviews } });

    // now delete the listing
    await Listing.findByIdAndDelete(id);
    req.flash("error", "Delete listing successfully");
    res.redirect("/listings");
}));

// edit route...
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res)=>{
    const {id} = req.params;
    // autherization check...
    const curList = await Listing.findById(id);
    console.log("hello == ", curList);
    if (req.session.user && curList.owner && curList.owner == req.session.user._id) {
        const listing = await Listing.findById(req.params.id);
        res.render("./listings/edit.ejs", {listing});
    } else {
        rea.flash("error", "You aren't allowed to update this listing...");
        res.redirect(`/listings/${id}`);
    }
}));


module.exports = router;

