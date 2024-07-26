const User = require('../models/user.js');

module.exports.signupForm =  (req, res) => {
    res.render('./listings/signup.ejs');
}

module.exports.signUpDataSubmit =  async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        const registeredUser = await User.register(newUser, password);
        //Automatic Login after Signup
        req.logIn(registeredUser,(err) => {
            if(err){
                return next(err);
            }else{
                req.flash("success","Welcome to WanderLust");
                // console.log(registeredUser);
                return res.redirect('/listings');
            }
        });
        
    } catch (error) {
        req.flash("error",error.message);
        return res.redirect('/signup');
    }
}

module.exports.loginForm = (req,res) => {
    res.render('./listings/login.ejs');
}

module.exports.loginDataSubmit = async (req,res) => {
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    const deleteReiewRedirectProblem = "?_method=DELETE";
    if(redirectUrl.includes(deleteReiewRedirectProblem)){
        redirectUrl = redirectUrl.split('/reviews/')[0];
    }
    return res.redirect(redirectUrl);
}

module.exports.logout = function(req,res,next) {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
}