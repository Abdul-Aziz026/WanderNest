if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
    // console.log(process.env.SECRET);
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

//for use install <npm i ejs-mate>
const ejsMate = require('ejs-mate');
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// for user 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { getMaxListeners } = require("events");


// testing Review Schema working or not...
// let newReview = new Review({comment: "abc", rating: 2});
// console.log(newReview, "abcd........");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// 
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = process.env.ATLASDB_URL;
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connection to DB");
}).catch((err)=>{
    console.log(err);
});


const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24*60*60,
});
store.on("error", () => {
    console.log("ERROR in MONGO store");
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/", (req, res) => {
//     res.send("Assalamu Alikum. Alhamdulillah i am finally begin.");
// });


app.use(session(sessionOptions));
app.use(flash());

// a middleware that initailize passport
app.use(passport.initialize());
//..
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Error message Not getting"} = err;
    // console.log(statusCode, message, " bad request");
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});