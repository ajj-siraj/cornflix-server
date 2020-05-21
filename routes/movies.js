const express = require("express");
const moviesRouter = express.Router();
const Movies = require("../models/movieModel");
const auth = require("../auth");

/* GET top 15 movies from the DB. */
moviesRouter
  .route("/top")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    console.log(req.user);
    let pageNum = req.query.p > 0 ? req.query.p : 0;
    Movies.find({ imdbRating: { $ne: "N/A" } })
      .sort({ imdbRating: -1 })
      .skip(pageNum * 15)
      .limit(15)
      .then((movies) => {
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(movies);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("POST not allowed on this route.");
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT not allowed on this route.");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE not allowed on this route.");
  });

moviesRouter
  .route("/top")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    Movies.find({ imdbRating: { $ne: "N/A" } })
      .sort({ imdbRating: -1 })
      .limit(15)
      .then((movie) => {
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(movie);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("POST not allowed on this route.");
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT not allowed on this route.");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE not allowed on this route.");
  });

moviesRouter
  .route("/latest")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    Movies.find({
      Year: { $ne: "N/A" },
      Title: { $ne: "N/A" },
      Poster: { $ne: "N/A" },
      Plot: { $ne: "N/A" },
    })
      .sort({ Year: -1 })
      .limit(15)
      .then((movie) => {
        res.statusCode = 200;
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(movie);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("POST not allowed on this route.");
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT not allowed on this route.");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("DELETE not allowed on this route.");
  });

module.exports = moviesRouter;
