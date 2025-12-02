const mongoose=require("mongoose");
const Data=require("./database.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";


main().then(()=>{
    console.log("connected to mongoDB");
}).catch(err=>{
    console.log(err);
})


async function main() {
   await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(Data.data)
}

initDB();