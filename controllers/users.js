const User = require("../models/user");

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcomeback to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}