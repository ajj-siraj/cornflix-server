const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fetch = require("node-fetch");

const config = require("./config");
const User = require("./models/userModel");

exports.local = passport.use(
  new LocalStrategy({ usernameField: "userName", passwordField: "password" }, User.authenticate())
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.verifyUser = (req, res, next) => {
  if(req.session.passport.user !== undefined){
    User.find({username: req.session.passport.user})
      .then(user => {
        console.log(user);
        return next();
      })
      .catch(err => next(err))
  }
  return next();
}
exports.userLogin = passport.authenticate("local", {
  session: true,
  failureRedirect: '/users/loginfailed'
});

exports.validateForm = (req, res, next) => {
  if (
    req.body.firstName === undefined ||
    req.body.lastName === undefined ||
    req.body.userName === undefined ||
    req.body.country === undefined ||
    req.body.age === undefined ||
    req.body.password === undefined ||
    req.body.passwordAgain === undefined ||
    req.body.recaptcha === undefined
  ) {
    res.locals.errors = "Some values returned undefined.";
  } else if (
    req.body.firstName.length === 0 ||
    req.body.lastName.length === 0 ||
    req.body.userName.length === 0 ||
    req.body.country.length === 0 ||
    req.body.age.length === 0 ||
    req.body.password.length === 0 ||
    req.body.passwordAgain.length === 0 ||
    req.body.recaptcha.length === 0
  ) {
    res.locals.errors = "Please fill all required fields.";
  } else if (req.body.terms !== true) {
    res.locals.errors = "You have not agreed to the terms.";
  }

  return next();
};

exports.verifyCaptcha = async (req, res, next) => {
  try {
    let captchares = await fetch(process.env.GOOGLE_VERIFY_URL, {
      method: "POST",
      body: `secret=${process.env.GOOGLE_CAPTCHA_SECRET}&response=${req.body.recaptcha}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    });
    let result = await captchares.json();

    res.locals.captcha = result;
    return next();
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
};
