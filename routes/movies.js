var express = require("express");
var moviesRouter = express.Router();

/* GET home page. */
moviesRouter.route("/")
  .get((req, res, next) => {
    res.send("This is the movies route");
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
