const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req, res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({username, email});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            if (!res.locals.redirectUrl) res.locals.redirectUrl = "/listings";
            res.redirect(res.locals.redirectUrl);
        });
    }
    catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    // res.send("form");
    res.render("./users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome to Wanderlust You are successfully login.");
    if (!res.locals.redirectUrl) res.locals.redirectUrl = "/listings";
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out Now!");
        res.redirect("/listings");
    });
};
