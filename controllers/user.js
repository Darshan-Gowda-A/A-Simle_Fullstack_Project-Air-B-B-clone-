const User=require("../models/user.js")

//signup
module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs")
}

module.exports.userSignup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registersed = await User.register(newUser, password);
        req.login(registersed, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcone to WanderLust");
            res.redirect("/listing");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}


//Login
module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
}

module.exports.userLogin= async (req, res) => {
    req.flash("success", "welcome back to WonderLust");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);
}

//logout
module.exports.logoutUser= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you succesfully logged out");
        res.redirect("/listing")
    })
}