const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },

    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    },
    // favorites: {
    //   type: Array
    // }
    // lastWatched: {
    //   ref: 'Movie'
    // }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

let Users = mongoose.model("User", userSchema);

module.exports = Users;
