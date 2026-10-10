const User = require("../models/user.js");

module.exports.showSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.showLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success", `Welcome back, ${req.user.username}!`);
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listings");
    });
};

module.exports.signupUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            const redirectUrl = res.locals.redirectUrl || "/listings";
            req.flash("success", `Welcome ${registeredUser.username}!`);
            res.redirect(redirectUrl);
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};
