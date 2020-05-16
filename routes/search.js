const express = require("express");
const searchRouter = express.Router();
const Movies = require("../models/movieModel");

/* GET top 15 movies from the DB. */
searchRouter
  .route("/")
  .options((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.end();
  })
  .get((req, res, next) => {
    let query = req.query.q;
    
      Movies.find({ Title: { $regex: new RegExp(query.toString(), "i") } })
        .then((results) => {
          if (results.length > 0) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({status: 200, message: "Query successful!", data: results});
          } else {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: 404, message: "No results in the database." });
          }
        })
        .catch((err) => next(err));
    

    console.log(req.query);
    // res.statusCode=200;
    // res.setHeader("Content-Type", 'application/json');
    // res.send("OK!");
    // Movies.find({ imdbRating: { $ne: "N/A" } })
    //   .sort({ imdbRating: -1 })
    //   .limit(15)
    //   .then((movie) => {
    //     res.statusCode = 200;
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader("Content-Type", "application/json");
    //     res.json(movie);
    //   })
    //   .catch((err) => next(err));
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

module.exports = searchRouter;
