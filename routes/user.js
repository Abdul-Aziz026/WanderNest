const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/signup", (req, res)=>{
    res.render("./users/signup.ejs");
});

// signup post route...
router.post("/signup", async(req, res)=>{
    // return res.send(req.body);
    try {
        const newUser = new User(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        newUser.password = hashedPassword;
        const user = await newUser.save();
        req.flash("success", "Signup Successfully!!!");
        res.redirect("/listings");
    }
    catch (err) {
        req.flash("success", `${err.message}`);
        return res.send(err.message);
        req.flash("error", "faliled of signup");
        res.redirect("/auth/signup");
    }
});


router.get("/login", (req, res)=>{
    res.render("./users/login.ejs");
});

router.post('/login', async (req, res) => {
    // return res.send(req.body);
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const user = await User.findOne({ username: username });
        console.log("user => ", user);
        if (!user) {
            req.flash("error", "username is wrong...!!!");
            return res.redirect("/login");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("pmatch: ", passwordMatch);
        if (!passwordMatch) {
            req.flash("error", "password not matched...!!!");
            return res.redirect("/login");
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        
        req.session.user = user;
        req.flash("success", "LoggedIn Successfully...!!!");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", `${error.message}`);
        res.redirect("/listings");
    }
});


router.get("/logout", (req, res, next)=>{
    req.session.user = false;
    req.flash("success", "You are Logged Out!!!");
    res.redirect("/listings");
});

module.exports = router;
