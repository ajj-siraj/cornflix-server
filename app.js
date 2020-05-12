const createError = require("http-errors");
const express = require("express");
const path = require("path");
// const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);
const passport = require("passport");
const config = require("./config");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");

const app = express();

//mongodb connection
const db = mongoose.connect(config.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db
  .then(() => console.log("Connected to mongodb server..."))
  .catch((err) => next(err));

//session and passport initialization

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' })
app.use(
  session({
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
