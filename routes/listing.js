const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js");


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


router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
}))



router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","this listing does not exit");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing })
}))

//create route
router.post("/", validateListing, wrapAsync(async (req, res) => {

    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listing")
}))

//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success"," listing edited")

    res.render("listings/edit.ejs", { listing })
}))


//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," listing updated")

    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted")
    res.redirect("/listing")
}))

module.exports=router;