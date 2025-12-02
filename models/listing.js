const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type:String,
        default:"https://media.istockphoto.com/id/140472118/photo/middle-finger.jpg?s=612x612&w=0&k=20&c=PHWkY3qathm5pjKIIJ5G2fggGxln0puxrdYlD6ly3Nc=",
    },
    price: Number,
    location: String,
    country: String
});

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;