const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const {redirectPreviousPage} = require('../middleware.js');
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.signupForm)
.post(userController.signUpDataSubmit);

router.route("/login")
.get(userController.loginForm)
.post(redirectPreviousPage,passport.authenticate("local",{failureRedirect: '/login',failureFlash:true}),userController.loginDataSubmit);


//Logout Route
router.get("/logout",userController.logout);


module.exports = router;