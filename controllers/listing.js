const Listing=require("../models/listing");


module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing })
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

//show
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","this listing does not exit");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing })
}

//create
module.exports.createListing=async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listing")
}

//edit
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    req.flash("success"," listing edited")
    res.render("listings/edit.ejs", { listing })
}

//update
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success"," listing updated")
    res.redirect(`/listing/${id}`)
}

//delete
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted")
    res.redirect("/listing")
}