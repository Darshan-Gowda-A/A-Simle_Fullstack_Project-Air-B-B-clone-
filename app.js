const express=require("express");
const app=express();
const  mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");



const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
app.set("view engine","ejs");
app.set('views',path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


main().then(()=>{
    console.log("connected to mongoDB");
}).catch(err=>{
    console.log(err);
})


async function main() {
   await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("hello lowda");
})


app.get("/listing",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing})
})



app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs")
})

app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})


app.post("/listing", async (req,res)=>{
    let newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing")
})


app.get("/listing/:id/edit",async (req,res)=>{
    let {id}=req.params;
     let listing = await Listing.findById(id);
     res.render("listings/edit.ejs",{listing})
})

app.put("/listing/:id", async (req,res)=>{
    let {id}=req.params;
    console.log(id)
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`)
})

app.delete("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")
})
app.listen(8080,()=>{
    console.log("listen to the server");
})