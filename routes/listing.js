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


router.get("/", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
})



router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//show route 
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing })
})

//create route
router.post("/", validateListing, wrapAsync(async (req, res) => {

    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing")
}))

//edit route
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})


//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id)
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
});

module.exports=router;