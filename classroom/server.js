const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "views"))
app.use(flash());

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }))
app.get("/register", (req, res) => {
    let { name = "anonymas" } = req.query;
    req.session.name = name;
    if(name==="anonymas"){
        req.flash("error","user not registered")
    }else{

        req.flash("Success", "user registered succesfully")
    }
    res.redirect("/hello")
})
app.use("/hello", (req, res) => {
res.locals.messagesuc= req.flash("Success")
res.locals.messageerr= req.flash("error")
   res.render("page.ejs", { name: req.session.name })
})

app.listen(3000, () => {
    console.log("server listing ")
})