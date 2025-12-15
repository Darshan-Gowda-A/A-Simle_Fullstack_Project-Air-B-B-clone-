const mongoose = require("mongoose");
const { listingSchema,reviewSchema } = require("../schema");
const Schema = mongoose.Schema;
const Review=require("./review.js")
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
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }]
});

//post middleware
ListingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
       await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",ListingSchema);
module.exports=Listing;