const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session')
const methodOverride = require("method-override");

// database connection check
require("./mongoDBConnect.js");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
// flash....
app.use(flash());

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// routes require;
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// session middle wares...
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.session.user;
    // console.log("user:-----> ", res.locals.currUser);
    next();
});

app.get("/", (req, res)=>{
    res.send("Hi I am root....");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// wrong url handle
app.all("*", (req, res, next)=>{
    res.send("Page not found...");
});

// other error handle
app.use((err, req, res, next)=>{
    const message = err.message;
    res.render("error.ejs", {message});
    // res.send(err.message);
});

app.listen(8000, ()=>{
    console.log("server is listening on port 8000");
});
