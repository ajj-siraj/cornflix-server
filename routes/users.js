const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const auth = require("../auth");
const User = require("../models/userModel");

/* GET users listing. */
usersRouter.route("/").get((req, res, next) => {
  res.send("respond with a resource");
});

usersRouter
  .route("/login")
  .get((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Operation forbidden for this route.");
  })
  .post(auth.userLogin, (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ success: true, status: "Login successful!" });
  });

usersRouter
  .route("/signup")
  .get((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Operation forbidden for this route.");
  })

  .post((req, res, next) => {
    User.register(
      new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        country: req.body.country,
        age: req.body.age,
        isAdmin: req.body.isAdmin,
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
                  status: "Registration Successful",
                  data: user,
                });
              });
            })
            .catch((err) => next(err));
        }
      }
    );
  });

usersRouter.route("/loginfailed").get((req, res, next) => {
  res.statusCode = 401;
  res.render("loginfailed", { title: "Authentication Error" });
});
module.exports = usersRouter;
