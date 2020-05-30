require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
// const config = require("./config");
const cors = require("cors");




const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//configure cors
let whitelist = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) === -1) {
        var message =
          "Not allowed";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//mongodb connection
const db = mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


db.then(() => console.log("Connected to mongodb server...")).catch((err) => next(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session and passport initialization

const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: "sessions",
});

//session
app.use(
  session({
    secret: process.env.SERVER_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    // cookie: {
    //   path:"/",
    //   httpOnly: true,
    //   expires: 9999999999999999
    // }
  })
);

app.use(passport.initialize());
app.use(passport.session());

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const searchRouter = require("./routes/search");
const fileRouter = require("./routes/file");
const favoritesRouter = require("./routes/favorites");


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/movies", moviesRouter);
app.use("/search", searchRouter);
app.use("/file", fileRouter);
app.use("/favorites", favoritesRouter);


// app.use(express.static(path.join(__dirname, "public")));
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
