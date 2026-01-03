const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js")

//signup
router.route("/signup").get(userController.renderSignupForm)
.post( wrapAsync(userController.userSignup))



//login
router.route("/login").get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),userController.userLogin)



//logout
router.get("/logout",userController.logoutUser)

module.exports = router;

