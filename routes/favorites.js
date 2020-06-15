const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const favoritesRouter = express.Router();
const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const auth = require("../auth");

favoritesRouter
  .route("/")
  .all((req, res, next) => {
    if (req.method !== "POST" && req.method !== "GET" && req.method !== "DELETE") {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: 403, message: `${req.method} forbidden on this route.` });
      return;
    }
    return next();
  })
  .get(auth.isLoggedIn, (req, res, next) => {
    User.findById(req.user._id)
      .populate("favorites", "-_id")
      .then((user) => {
        if (!user.favorites || user.favorites.length === 0) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: 200, message: "Your favorites is empty." });
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: true,
          status: 200,
          message: "Favorites retrieved successfully.",
          data: user.favorites,
        });
        return;
      })
      .catch((err) => next(err));
  })

  .post(auth.isLoggedIn, (req, res, next) => {
    User.findById(req.user._id)
      .then((user) => {
        Movie.findOne({ imdbID: req.body.movieID })
          .then((movie) => {
            if (user.favorites.indexOf(movie._id) !== -1) {
              res.statusCode = 403;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: false,
                status: 403,
                message: "Movie already exists in your favorites.",
              });
              return;
            }

            user.favorites.push(movie._id);
            user
              .save()
              .then(() => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ success: true, status: 200, message: "Added to favorites." });
                return;
              })
              .catch((err) => next(err));
          })
          .catch(() => {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: false,
              status: 404,
              message: "imdb ID not found in database. Most likely a system error.",
            });
            return;
          });
      })
      .catch((err) => next(err));
  })

  .delete(auth.isLoggedIn, (req, res, next) => {
    // console.log(req.body.imdbID);
    User.findById(req.user._id)
      .populate("favorites")
      .then((user) => {
        // console.log(user);
        // let favToRemove = false;
        let favToRemove = user.favorites.findIndex((fav) => fav.imdbID === req.body.imdbID);
        console.log(favToRemove);
        if (favToRemove === undefined) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, status: 404, message: "Movie is not in your favorites." });
          return;
        }

        user.favorites.splice(favToRemove, 1);
        user.save().then(() => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: 200, message: "Successfully removed from favorites." });
          return;
        });
      })
      .catch((err) => next(err));
  });

module.exports = favoritesRouter;
