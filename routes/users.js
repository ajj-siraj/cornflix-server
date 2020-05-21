const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const auth = require("../auth");
const User = require("../models/userModel");

//validate user session first
usersRouter.get("/validatesession", passport.authenticate("local"), (req, res, next) => {
  console.log(req.query);
  if (req.session.passport.user) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, status: 200, message: "Session verified." });
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: false,
    status: 404,
    message: "Session not found.",
  });
  return;
});

//login route
usersRouter
  .route("/login")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.end();
  })
  .get((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Operation forbidden for this route.");
  })
  .post(auth.userLogin, (req, res, next) => {
    console.log(req.session);
    //captcha verification code that must be uncommented before build 
    // (don't forget to add auth.verifyCaptcha middleware)
    // if (!res.locals.captcha.success) {
    //   console.log(res.locals.captcha["error-codes"]);
    //   res.statusCode = 400;
    //   res.cookie('session-id', req.sessionID, {expires: new Date(Date.now() + 9999999), httpOnly: false});
    //   res.setHeader("Content-Type", "application/json");
    //   res.json({
    //     success: false,
    //     status: 400,
    //     message: "Captcha verification failed. Please try again.",
    //   });
    //   return;
    // }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, message: "Login successful!" });
  });

usersRouter
  .route("/signup")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Operation forbidden for this route.");
  })

  .post(auth.validateForm, auth.verifyCaptcha, (req, res, next) => {
    // console.log(res.locals);
    if (!res.locals.captcha.success) {
      console.log(res.locals.captcha["error-codes"]);
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 400,
        message: "Captcha verification failed. Please try again.",
      });
      return;
    }
    if (res.locals.errors) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 400, message: res.locals.errors });
      return;
    } else {
      User.register(
        new User({
          username: req.body.userName,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          country: req.body.country,
          age: req.body.age,
        }),
        req.body.password,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          } else {
            user
              .save()
              .then((user) => {
                auth.userLogin(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    success: true,
                    message: "Registration Successful",
                    data: {
                      username: user.username,
                      firstname: user.firstName,
                      lastname: user.lastName,
                    },
                  });
                });
              })
              .catch((err) => next(err));
          }
        }
      );
    }
  });

//logout
usersRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    console.log(req.sessionID);
    req.session.destroy();
    res.clearCookie("session-id");
    console.log(req.sessionID);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, message: "Logged out successfully" });
    return;
  } else {
    res.statusCode = 403;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, message: "You are not logged in." });
    return;
  }
});
//login fail redirect
usersRouter
  .route("/loginfailed")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: false, message: "Incorrect credentials." });
  });

module.exports = usersRouter;
