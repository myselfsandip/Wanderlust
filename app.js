if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');  //Mongo Session Store
const flash = require('connect-flash');
const passport = require('passport');
const LocalStategy = require('passport-local');
const User = require('./models/user.js');


const routerListings = require('./routes/listings.js');
const routerReviews = require('./routes/reviews.js');
const routerUser = require('./routes/user.js');
const { error } = require('console');

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const DB_URL = process.env.ATLASDB_URL


main().then(() => {
    console.log("DB Connection Successfull");
}).catch(err => {
    console.log(err);
});
async function main() {
    await mongoose.connect(DB_URL);
}

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname, 'utils', 'root.html'));
    res.redirect('/listings')
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    //console.log("CurrentUser: ",res.locals.currentUser);
    next();
});

app.get('/demouser', async (req, res) => {
    const fakeUser = new User({
        email: "raj@yahoo.com",
        username: "raj07"
    });
    const result = await User.register(fakeUser, "Raj@1206");
    res.send(result);
})

app.use("/listings", routerListings);
app.use("/listings/:id/reviews/", routerReviews);
app.use("/", routerUser);


// app.get("/testListening",async (req,res) => {
//     const sampleListing = Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1500,
//         location:"Goa",
//         country:"INDIA"
//     })
//     await sampleListing.save();
//     console.log("Sample Saved");
//     res.send("Testing Successfull");
// });

app.get("/listings/destination", (req, res) => {
    res.send("done")
})




//If we try to access a route that does not exist
// then this will give an error and pass that to the Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // console.log("Error❌:",err);
    res.status(statusCode).render("./listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});



app.listen(3000, () => {
    console.log("App is listening to port 3000");
});