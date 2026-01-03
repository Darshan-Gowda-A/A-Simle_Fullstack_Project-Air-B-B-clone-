const express=require("express")
const router=express.Router();
const path =require("path");
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listinController=require("../controllers/listing.js");


router.route("/")
.get(wrapAsync(listinController.index))
//create route
.post(isLoggedIn, validateListing, wrapAsync(listinController.createListing))




router.get("/new",isLoggedIn,listinController.renderNewForm)

router.route("/:id")
//show route 
.get(wrapAsync(listinController.showListing))

//update route
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listinController.updateListing))
//delete route
.delete(isLoggedIn,isOwner, wrapAsync(listinController.deleteListing))



//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listinController.editListing))




module.exports=router;