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
        return res.redirect("/listing");
    }
    res.render("listings/show.ejs", { listing })
}

//create
module.exports.createListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;

    let newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","new listing created")
    res.redirect("/listing")
}

//edit
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
 
    let originalUrl=listing.image.url;
   originalUrl=originalUrl.replace("/update","/update/h_300,w_250")
    res.render("listings/edit.ejs", { listing ,originalUrl })
}

//update
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
     
   let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   console.log(req.file);
if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
}
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