const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings)
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    return res.render("./listings/new.ejs");
}


module.exports.addNewListing = async (req, res, next) => {
    //Geocoding Code
    const responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send();
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { filename, url };
    //Saving as Geo JSON
    newListing.geometry = responce.body.features[0].geometry;
    const savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created✅");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect('/listings');
    }
    let previewImageUrl = listing.image.url;
    //Customizing the image using url (of Cloudinary) . height,width,blur,reducing quality etc can be done.
    previewImageUrl = previewImageUrl.replace('/upload', '/upload/h_250');
    res.render("./listings/edit.ejs", { listing, previewImageUrl });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();
    req.flash("success", "Listing Updated!");
    return res.redirect(`/listings/${id}`);
}

module.exports.show = async (req, res) => {
    const { id } = req.params;
    // populate() if a field is reffering or using id from another collection,then we use the field name in the populate method and the polulate method will return the entire document of that _id.
    const listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}

module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted❌");
    res.redirect("/listings");
};
module.exports.destination = async (req, res) => {
    const { destination } = req.query;
    // destination = destination.toLowerCase();
    const allListings = await Listing.find({ location: { $regex: new RegExp(destination, 'i') } });
    // Count the number of documents that match the query
    const count = await Listing.countDocuments({ location: { $regex: new RegExp(destination, 'i') } });
    if (allListings.length) {
        // req.flash("success",`${count} Listings found!`)
        return res.render("listings/index.ejs", { allListings });
    } else {
        req.flash("error", "No listing found for this location!");
        return res.redirect('/listings')
    }
};
module.exports.categories = async (req, res) => {
    const { category } = req.query;
    const allListings = await Listing.find({ category: category });
    return res.render("listings/index.ejs", { allListings });
};