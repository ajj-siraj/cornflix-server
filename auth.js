const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;


const config = require('./config');
const User = require('./models/userModel');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.userLogin = passport.authenticate('local', {session: true, failureRedirect: "/users/loginfailed"});


