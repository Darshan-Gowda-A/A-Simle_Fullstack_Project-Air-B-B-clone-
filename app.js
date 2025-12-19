const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const flash = require("connect-flash");
const session = require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");






const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = { secret: "secret", resave: false, saveUninitialized: true,
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
    next();
})

app.get("/demo",async(req,res)=>{
     let register=new User({
        email:"dar@123",
        username:"darab"
     });
     let r=await User.register(register,"helloworld");
    res.send(r);

     
})


main().then(() => {
    console.log("connected to mongoDB");
}).catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("hello lowda");
})



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