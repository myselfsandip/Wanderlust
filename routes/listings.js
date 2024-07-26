const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const multer = require('multer');

//Multer image upload Validation
const maxSize = 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize /* bytes */ }
});

//Destination
router.get("/destination", wrapAsync(listingController.destination));

//Categories
router.get("/categories", wrapAsync(listingController.categories));


//Index Route
router.route("/")
    .get(wrapAsync(listingController.index))
    //Add new Listing Post Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.addNewListing))

//Create New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Edit Listing Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

router.route("/:id")
    //Listing Update Put Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.update))
    //Show Route
    .get(wrapAsync(listingController.show))
    //Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));



module.exports = router;
























