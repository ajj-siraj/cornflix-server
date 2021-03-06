const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const auth = require("../auth");
const User = require("../models/userModel");

//validate user session first
usersRouter.route("/validatesession").get((req, res, next) => {
  if (!req.user) {
    res.clearCookie("connect.sid");
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: false,
      status: 404,
      message: "Session not found.",
    });
    return;
  }

  User.findById(req.user._id)
    .populate("favorites", "-_id")
    .then((user) => {
      let userData = {
        username: user.username,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        profilePic: user.profilePic || "e85acd175298eabbe8b9c90d0e3aa92e.png",
        public: user.public,
        favorites: user.favorites || [],
      };
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: 200, message: "Session verified.", user: userData });
      return;
    });
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
    console.log(req.user);
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

  .post((req, res, next) => {
    // console.log(res.locals);
    //remember to add auth.verifyCaptcha and validateForm middleware
    // if (!res.locals.captcha.success) {
    //   console.log(res.locals.captcha["error-codes"]);
    //   res.statusCode = 400;
    //   res.setHeader("Content-Type", "application/json");
    //   res.json({
    //     success: false,
    //     status: 400,
    //     message: "Captcha verification failed. Please try again.",
    //   });
    //   return;
    // }
    if (res.locals.errors) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 400, message: res.locals.errors });
      return;
    }
    console.log(req.body);
    User.register(
      new User({
        username: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        country: req.body.country,
        age: req.body.age,
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          res.json({
            status: 403,
            success: false,
            message: err.message,
          });
        } else {
          user
            .save()
            .then((user) => {
              auth.userLogin(req, res, () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  status: 200,
                  success: true,
                  message: "Registration Successful",
                  user: {
                    username: user.username,
                    firstname: user.firstName,
                    lastname: user.lastName,
                    email: user.email,
                  },
                });
              });
            })
            .catch((err) => next(err));
        }
      }
    );
  });

//logout
usersRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    req.logOut();
    req.session.destroy();
    res.clearCookie("connect.sid", { path: "/" });

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
    return;
  });

usersRouter
  .route("/account/update")
  .all((req, res, next) => {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .post(auth.userLogin, (req, res, next) => {
    if (!req.user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 401,
        message: "Unauthorized to access this route. Please login.",
      });
      return;
    }

    User.findByIdAndUpdate(
      req.user._id,
      { $set: { firstName: req.body.firstName, lastName: req.body.lastName } },
      { new: true }
    )
      .then((user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message: "Success!",
          data: { NewFirstName: req.body.firstName, NewLastName: req.body.lastName },
        });
        return;
      })
      .catch((err) => next(err));
  });

usersRouter
  .route("/account/update-password")
  .all((req, res, next) => {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .post((req, res, next) => {
    if (!req.user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 401,
        message: "Unauthorized to access this route. Please login.",
      });
      return;
    }

    User.findById(req.user._id)
      .then((user) => {
        user
          .changePassword(req.body.passwordCurrent, req.body.passwordNew)
          .then(() => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: 200,
              message: "Password changed successfully.",
            });
            return;
          })
          .catch((err) => {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: false,
              status: 403,
              message: err,
            });
            return;
          });
      })
      .catch((err) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: 400,
          message: "User not found in the database.",
        });
        return;
      });
  });

usersRouter
  .route("/account/reset-password")
  .all((req, res, next) => {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .post((req, res, next) => {
    if (req.user) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 403,
        message: "User is already logged in.",
      });
      return;
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message:
            "A message has been sent to the specified email with instructions. Please check your email.",
        });
        return;
      })
      .catch((err) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message:
            "A message has been sent to the specified email with instructions. Please check your email.",
        });
        return;
      });
  });

usersRouter
  .route("/profile/update")
  .all((req, res, next) => {
    if (req.method !== "POST") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .post((req, res, next) => {
    if (!req.user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        status: 401,
        message: "Unauthorized to access this route. Please login.",
      });
      return;
    }

    User.findByIdAndUpdate(req.user._id, { $set: { public: req.body.public } }, { new: true })
      .then((user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message: "Success!",
          data: { public: req.body.public },
        });
        return;
      })
      .catch((err) => next(err));
  });
module.exports = usersRouter;
