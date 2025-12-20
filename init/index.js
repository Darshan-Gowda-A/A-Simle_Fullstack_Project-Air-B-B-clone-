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
    Data.data=Data.data.map((obj)=>({...obj,owner:"694580fbfb0e514ffa3e5cb2"}))
    await Listing.insertMany(Data.data)
    console.log("data was intialized");
}

initDB();