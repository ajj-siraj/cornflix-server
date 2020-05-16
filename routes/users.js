const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const auth = require("../auth");
const User = require("../models/userModel");

/* GET users listing. */

usersRouter
  .route("/login")
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
  .post(auth.userLogin, (req, res, next) => {
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

  .post(auth.validateForm, (req, res, next) => {
    if (req.errors) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 400, err: req.errors });
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
    res.render("loginfailed", { title: "Authentication Error" });
  });

module.exports = usersRouter;
