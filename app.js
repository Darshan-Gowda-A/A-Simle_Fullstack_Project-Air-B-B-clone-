const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));


main().then(() => {
    console.log("connected to mongoDB");
}).catch(err => {
    console.log(err);
})


async function main() {
    await mongoose.connect(MONGO_URL);
}

//---------Schema validation middleware---------

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}



app.get("/", (req, res) => {
    res.send("hello lowda");
})

//Listings
app.get("/listing", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
})



app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show route 
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })
})

//create route
app.post("/listing", validateListing, wrapAsync(async (req, res) => {

    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing")
}))

//edit route
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})


//update route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))

//delete route
app.delete("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
})

//Review
//post review route

app.post("/listing/:id/review", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`)
}));

//delete review route
app.delete("/listing/:id/review/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(id)
    res.redirect(`/listing/${id}`);
    
}))










//---------handling error---------------

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})


app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Somthing went worng" } = err;
    // res.status(statusCode).send(message)
    res.status(statusCode).render("error", { err })
})


app.listen(8080, () => {
    console.log("listen to the server");
})