if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore=require("connect-mongo")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");






const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbURL=process.env.MONGO_URL;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})
const sessionOption = {store, secret: process.env.SECRET, resave: false, saveUninitialized: true,
  cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },  
 };




app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); //so the user do not need to login when ever we refersh the page or change the page
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());  //adding user info into the session
passport.deserializeUser(User.deserializeUser());//removing user info after the session is over


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");/// -----control-flash
    res.locals.error=req.flash("error");/// -----control-flash
    res.locals.currUser=req.user;
    next();
})



main().then(() => {
    console.log("connected to mongoDB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
}




app.use("/listing", listingsRouter)
app.use("/listing/:id/review", reviewsRouter)
app.use("/",userRouter);



//ListingsRouter


//Review











//---------handling error---------------

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})


app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Somthing went worng" } = err;
    // res.status(statusCode).send(message)
    res.status(statusCode).render("error", { err })
})


app.listen(8080, () => {
    console.log("listen to the server");
})