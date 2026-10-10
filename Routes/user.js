const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.js");
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
    .get(userController.showSignupForm)
    .post(saveRedirectUrl, userController.signupUser);

router.route("/login")
    .get(userController.showLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.loginUser
    );

router.get("/logout", userController.logoutUser);

module.exports = router;