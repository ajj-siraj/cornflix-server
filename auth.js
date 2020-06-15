const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fetch = require("node-fetch");

const config = require("./config");
const User = require("./models/userModel");

passport.use(
  new LocalStrategy({ usernameField: "userName", passwordField: "password" }, User.authenticate())
);

// passport.use(
//   new LocalStrategy("verifyPw", { usernameField: "userName", passwordField: "passwordCurrent" }, User.authenticate())
// );

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });

// passport.deserializeUser(function(user, done) {
//   User.findById(user._id)
//     .then((user) => {
//         done(null, user);
//     })
//     .catch(err => next(err))
// });
exports.verifyUser = (req, res, next) => {
  if (req.session.passport.user !== undefined) {
    User.find({ username: req.session.passport.user })
      .then((user) => {
        console.log(user);
        return next();
      })
      .catch((err) => next(err));
  }
  return next();
};
exports.isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, status: 401, message: "You are not logged in." });
    return;
  }
  return next();
};

exports.userLogin = passport.authenticate("local", {
  session: true,
  failureRedirect: "/users/loginfailed",
});
// exports.userLoginAfterPwChange = passport.authenticate("verifyPw", {
//   session: true,
//   failureRedirect: "/users/loginfailed",
// });

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
