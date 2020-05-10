const express = require("express");
const moviesRouter = express.Router();
const Movies = require("../models/movieModel");

/* GET top 15 movies from the DB. */
moviesRouter.route("/top")
  .get((req, res, next) => {
    Movies.find({imdbRating: {$ne: "N/A"}},{Title: 1, imdbRating: 1})
      .sort({imdbRating: -1})
      .limit(15)
      .then((movie) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST not allowed on this route.')
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT not allowed on this route.')
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('DELETE not allowed on this route.')
  })

module.exports = moviesRouter;
