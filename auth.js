const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const config = require("./config");
const User = require("./models/userModel");

exports.local = passport.use(new LocalStrategy({usernameField:"userName", passwordField:"password"}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.userLogin = passport.authenticate("local", {
  session: true
});

exports.validateForm = (req, res, next) => {
  if(req.body.firstName == undefined ||
    req.body.lastName == undefined ||
    req.body.userName == undefined ||
    req.body.country == undefined ||
    req.body.age == undefined ||
    req.body.password == undefined ||
    req.body.passwordAgain == undefined){
      req.errors = "Some values returned undefined.";
    }
  else if (
    req.body.firstName.length == 0 ||
    req.body.lastName.length == 0 ||
    req.body.userName.length == 0 ||
    req.body.country.length == 0 ||
    req.body.age.length == 0 ||
    req.body.password.length == 0 ||
    req.body.passwordAgain.length == 0 
  ) {
    req.errors = "Please fill all required fields.";
  }
  else if (req.body.password !== req.body.passwordAgain) {
    req.errors = "Passwords do not match";
  }

  else if (req.body.terms !== true) {
    req.errors = "You have not agreed to the terms.";
    
  }

  return next();

  // else if (req.body.recaptcha !== true) {
  //   res.statusCode = 400;
  //   res.setHeader("Content-Type", "application/json");
  //   res.json({ status: 400, err: "Passwords do not match" });
  // }
};
