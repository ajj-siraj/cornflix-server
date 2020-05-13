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
  if (
    req.body.firstName.length == 0 ||
    req.body.lastName.length == 0 ||
    req.body.userName.length == 0 ||
    req.body.country.length == 0 ||
    req.body.age.length == 0 ||
    req.body.password.length == 0 ||
    req.body.passwordAgain.length == 0 ||
    req.body.recaptcha.length == 0
  ) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({ status: 400, err: "Please fill all required fields." });
  }
  else if (req.body.password !== req.body.passwordAgain) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({ status: 400, err: "Passwords do not match" });
  }

  else if (req.body.terms !== true) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({ status: 400, err: "Passwords do not match" });
  }

  return next();

  // else if (req.body.recaptcha !== true) {
  //   res.statusCode = 400;
  //   res.setHeader("Content-Type", "application/json");
  //   res.json({ status: 400, err: "Passwords do not match" });
  // }
};
