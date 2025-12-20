const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");


//---------Schema validation middleware---------



router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
}))



router.get("/new",isLoggedIn, (req, res) => {
   
    res.render("listings/new.ejs")
})

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","this listing does not exit");
        res.redirect("/listing");
        
    }
    res.render("listings/show.ejs", { listing })
}))

//create route
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {

    let newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listing")
}))

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success"," listing edited")
    res.render("listings/edit.ejs", { listing })
}))


//update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," listing updated")
    res.redirect(`/listing/${id}`)
}))

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted")
    res.redirect("/listing")
}))

module.exports=router;